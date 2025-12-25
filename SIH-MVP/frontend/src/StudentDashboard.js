import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler
} from "chart.js";

ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

function StudentDashboard() {
    const { username, logout } = useContext(AuthContext);
    const [studentData, setStudentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // UI State for Scheduling
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [expandedEventId, setExpandedEventId] = useState(null);
    const [events, setEvents] = useState([
        { id: 1, title: "Mentor Session - Database Systems", date: "25 Sep 2025" },
        { id: 2, title: "Career Guidance Meeting", date: "30 Sep 2025" },
    ]);

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        localStorage.removeItem("studentUsername");
        navigate("/student-login");
    };

    // --- Data Fetching Logic (Targeted by PRN) ---
    useEffect(() => {
        const storedUsername = localStorage.getItem("studentUsername");
        
        if (!storedUsername) {
            navigate("/student-login");
            return;
        }

        const fetchSpecificStudent = async () => {
            setIsLoading(true);
            try {
                // Fetch ONLY the specific student using the stored PRN
                const response = await fetch(`http://127.0.0.1:5000/api/student/${storedUsername}`);
                
                if (!response.ok) {
                    throw new Error("Student record not found in database.");
                }

                const data = await response.json();
                const info = data.info; // The 'info' object from backend

                // Helper to safely parse numbers
                const safeNum = (v, d = 0) => {
                    const n = Number(v);
                    return Number.isFinite(n) ? n : d;
                };

                // Map Backend Fields to UI State
                setStudentData({
                    name: info.name || storedUsername,
                    prn: info.student_id, // This is the PRN
                    
                    // Current Status
                    current_att: safeNum(info.attendance_percentage),
                    current_cgpa: safeNum(info.sem6_cgpa),
                    credits: safeNum(info.credits, 20),
                    wellbeing: safeNum(info.wellbeing, 75),
                    risk_level: info.risk_level || "Low",

                    // Semester Attendance History
                    sem1_att: safeNum(info.sem1_att),
                    sem2_att: safeNum(info.sem2_att),
                    sem3_att: safeNum(info.sem3_att),
                    sem4_att: safeNum(info.sem4_att),
                    sem5_att: safeNum(info.sem5_att),
                    sem6_att: safeNum(info.sem6_att),

                    // Semester CGPA History
                    sem1_cgpa: safeNum(info.sem1_cgpa),
                    sem2_cgpa: safeNum(info.sem2_cgpa),
                    sem3_cgpa: safeNum(info.sem3_cgpa),
                    sem4_cgpa: safeNum(info.sem4_cgpa),
                    sem5_cgpa: safeNum(info.sem5_cgpa),
                    sem6_cgpa: safeNum(info.sem6_cgpa),
                });

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpecificStudent();
    }, [navigate]);

    // --- Chart Data Configuration ---
    const chartLabels = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];
    
    const attendanceData = {
        labels: chartLabels,
        datasets: [
            {
                label: "Attendance %",
                data: studentData ? [
                    studentData.sem1_att, studentData.sem2_att, studentData.sem3_att, 
                    studentData.sem4_att, studentData.sem5_att, studentData.sem6_att
                ] : [],
                backgroundColor: "rgba(14, 165, 233, 0.8)", // Sky Blue
                borderColor: "rgba(14, 165, 233, 1)",
                borderRadius: 6,
                borderWidth: 1,
            },
        ],
    };

    const performanceData = {
        labels: chartLabels,
        datasets: [
            {
                label: "CGPA",
                data: studentData ? [
                    studentData.sem1_cgpa, studentData.sem2_cgpa, studentData.sem3_cgpa, 
                    studentData.sem4_cgpa, studentData.sem5_cgpa, studentData.sem6_cgpa
                ] : [],
                fill: true,
                borderColor: "rgba(16, 185, 129, 1)", // Emerald
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, "rgba(16, 185, 129, 0.4)");
                    gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");
                    return gradient;
                },
                tension: 0.4,
                pointBackgroundColor: "#fff",
                pointBorderColor: "rgba(16, 185, 129, 1)",
                pointRadius: 4,
            },
        ],
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { 
                beginAtZero: true, 
                max: 100,
                grid: { color: "rgba(0, 0, 0, 0.05)" },
                ticks: { font: { family: 'Inter' } }
            },
            x: { 
                grid: { display: false },
                ticks: { font: { family: 'Inter' } }
            },
        },
    };

    const cgpaOptions = {
        ...commonOptions,
        scales: {
            ...commonOptions.scales,
            y: { ...commonOptions.scales.y, max: 10 }
        }
    };

    const handleSchedule = () => {
        if (!scheduleDate || !scheduleTime) return;
        const newEvent = {
            id: events.length + 1,
            title: "Mentor Session with Dr. Rajesh Kumar",
            date: `${scheduleDate} at ${scheduleTime}`,
        };
        setEvents((prev) => [...prev, newEvent]);
        setIsScheduled(true);

        setTimeout(() => {
            setIsPopupOpen(false);
            setIsScheduled(false);
            setScheduleDate("");
            setScheduleTime("");
        }, 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Fetching your records...</p>
            </div>
        );
    }

    if (error || !studentData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Not Found</h2>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                    We couldn't find a record for PRN: <b>{localStorage.getItem("studentUsername")}</b>. 
                    Please ensure you are registered in the Admin database.
                </p>
                <button onClick={handleLogout} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 text-gray-900 p-6 md:p-8 font-sans">
            
            {/* --- Header --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-emerald-600 to-sky-500 tracking-tight">
                        Welcome, {studentData.name.replace("Student ", "")} 🎓
                    </h1>
                    <p className="text-lg text-gray-500 mt-2 font-medium">
                        PRN: <span className="font-mono text-slate-700">{studentData.prn}</span>
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="mt-4 md:mt-0 flex items-center px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:shadow-md hover:border-red-200 hover:text-red-600 transition-all duration-300 font-semibold text-sm"
                >
                    <LogoutIcon />
                    Logout
                </button>
            </header>

            {/* --- Key Metrics Section --- */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-10">
                
                {/* 1. Profile Card */}
                <div className="p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Academic Overview</h2>
                                <p className="text-gray-500 text-sm mt-1">Computer Science • Sem 6</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                studentData.risk_level === 'High' ? 'bg-red-100 text-red-700' :
                                studentData.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-emerald-100 text-emerald-700'
                            }`}>
                                {studentData.risk_level} Risk
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-2xl font-black text-sky-600">{studentData.current_att}%</p>
                                <p className="text-xs text-gray-500 font-bold uppercase mt-1">Attendance</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-2xl font-black text-slate-800">{studentData.credits}</p>
                                <p className="text-xs text-gray-500 font-bold uppercase mt-1">Credits</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-2xl font-black text-emerald-600">{studentData.current_cgpa}</p>
                                <p className="text-xs text-gray-500 font-bold uppercase mt-1">CGPA</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Mental Well-being Card */}
                <div className="p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Mental Well-being</h2>
                        <p className="text-gray-500 text-sm mb-6 max-w-[200px]">AI-analyzed wellness score based on activity.</p>
                        
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
                            studentData.wellbeing >= 75 ? "bg-emerald-100 text-emerald-700" : 
                            studentData.wellbeing >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                        }`}>
                            {studentData.wellbeing >= 75 ? "Excellent State 🌟" : studentData.wellbeing >= 50 ? "Moderate State 😐" : "Needs Attention ⚠️"}
                        </div>
                    </div>

                    {/* Circular Progress */}
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                            <circle cx="64" cy="64" r="56" stroke={studentData.wellbeing >= 75 ? "#10b981" : "#f59e0b"} strokeWidth="12" fill="none" 
                                strokeDasharray={2 * Math.PI * 56} 
                                strokeDashoffset={2 * Math.PI * 56 * (1 - studentData.wellbeing / 100)} 
                                strokeLinecap="round" 
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">
                            {studentData.wellbeing}
                        </span>
                    </div>
                </div>
            </section>

            {/* --- Charts Section --- */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-sky-500 rounded-full"></span> Attendance History
                    </h3>
                    <div className="h-[250px]">
                        <Bar data={attendanceData} options={commonOptions} />
                    </div>
                </div>
                <div className="p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-emerald-500 rounded-full"></span> Academic Performance
                    </h3>
                    <div className="h-[250px]">
                        <Line data={performanceData} options={cgpaOptions} />
                    </div>
                </div>
            </section>

            {/* --- Alert & Events --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Events Column */}
                <div className="lg:col-span-2 p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Upcoming Schedule</h3>
                        <button onClick={() => setIsPopupOpen(true)} className="text-sm font-bold text-sky-600 hover:bg-sky-50 px-3 py-1.5 rounded-lg transition">
                            + Schedule Session
                        </button>
                    </div>
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event.id} className="p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 flex items-center justify-between group">
                                <div>
                                    <h4 className="font-bold text-gray-800">{event.title}</h4>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                        📅 {event.date}
                                    </p>
                                </div>
                                <button onClick={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)} className="text-xs font-bold bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:text-sky-600 hover:border-sky-200 transition">
                                    {expandedEventId === event.id ? "Close" : "View"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Alert Column */}
                <div className={`p-8 rounded-3xl border ${studentData.current_att < 75 ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"}`}>
                    <h3 className={`text-lg font-bold mb-4 ${studentData.current_att < 75 ? "text-amber-800" : "text-emerald-800"}`}>
                        {studentData.current_att < 75 ? "⚠️ Attention Needed" : "✅ You are doing great!"}
                    </h3>
                    <p className={`text-sm leading-relaxed mb-6 ${studentData.current_att < 75 ? "text-amber-700" : "text-emerald-700"}`}>
                        {studentData.current_att < 75 
                            ? "Your attendance has fallen below the 75% threshold. Please prioritize attending upcoming lectures to avoid academic penalties."
                            : "Your attendance and academic scores are on track. Keep up the consistent effort!"}
                    </p>
                    {studentData.current_att < 75 && (
                        <button onClick={() => setIsPopupOpen(true)} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition">
                            Contact Mentor
                        </button>
                    )}
                </div>
            </div>

            {/* --- Scheduling Popup --- */}
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm z-50 p-4">
                    <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl relative animate-fadein">
                        <button onClick={() => setIsPopupOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800">✕</button>
                        
                        {isScheduled ? (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                                <h3 className="text-2xl font-bold text-gray-900">Scheduled!</h3>
                                <p className="text-gray-500 mt-2">Your mentor has been notified.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Book a Session</h2>
                                <p className="text-gray-500 text-sm mb-6">Discuss your progress with Dr. Rajesh Kumar.</p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                                        <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                                        <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition" />
                                    </div>
                                    <button onClick={handleSchedule} className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-xl mt-2">
                                        Confirm Booking
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentDashboard;