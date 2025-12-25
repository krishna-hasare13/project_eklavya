import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext, AuthProvider } from './AuthContext';
import { motion, AnimatePresence } from "framer-motion";
import { 
    LayoutDashboard, 
    Users, 
    LogOut, 
    UploadCloud, 
    Search, 
    Menu, 
    X, 
    FileText, 
    Calendar,
    ChevronRight,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    BarChart3
} from 'lucide-react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

// --- Local Components ---
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import StudentDashboard from "./StudentDashboard";
import StudentLoginPage from "./StudentLoginPage";
import SubjectScoresChart from "./SubjectScoresChart";
import UserManagement from "./UserManagement";
import AboutUs from "./AboutUs";

// --- Register Chart.js ---
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler);

// --- UI Components ---

const Badge = ({ level }) => {
    const styles = {
        High: "bg-red-50 text-red-700 ring-red-600/20",
        Medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
        Low: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        Paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        Overdue: "bg-red-50 text-red-700 ring-red-600/20",
        Unknown: "bg-gray-50 text-gray-700 ring-gray-600/20"
    };
    const activeStyle = styles[level] || styles.Unknown;
    return (
        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${activeStyle}`}>
            {level}
        </span>
    );
};

const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
    <div className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md h-full flex flex-col justify-between">
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                    <Icon size={22} strokeWidth={2} />
                </div>
                {trend && (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        <TrendingUp className="mr-1 h-3 w-3" /> {trend}
                    </span>
                )}
            </div>
            <div>
                <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{value}</dd>
            </div>
        </div>
        {subtext && (
            <div className="bg-gray-50/50 px-6 py-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">{subtext}</div>
            </div>
        )}
    </div>
);

// --- Dashboard Logic & View ---

function DashboardPage() {
    const [students, setStudents] = useState([]);
    const [selected, setSelected] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [riskFilter, setRiskFilter] = useState("all");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editableStudent, setEditableStudent] = useState(null);
    const [view, setView] = useState('dashboard');
    const { isLoggedIn, userRole, logout, username } = useContext(AuthContext);

    // --- Data Fetching ---
    useEffect(() => {
        if (isLoggedIn && view === 'dashboard') {
            let url = `http://127.0.0.1:5000/api/students?search=${searchQuery}&filter=${riskFilter}`;
            fetch(url).then(res => res.json()).then(data => setStudents(data)).catch(console.error);
        }
    }, [refresh, searchQuery, riskFilter, isLoggedIn, view]);

    // --- Handlers ---
    const fetchDetails = (id) => {
        fetch(`http://127.0.0.1:5000/api/student/${id}`)
            .then(res => res.json())
            .then(data => {
                setSelected(data);
                setEditableStudent(data.info);
                setEditMode(false);
            }).catch(console.error);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditableStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/student/update", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    student_id: editableStudent.student_id, 
                    updates: {
                        attendance_percentage: editableStudent.attendance_percentage,
                        fee_status: editableStudent.fee_status
                    }
                })
            });
            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                setRefresh(prev => !prev);
                setEditMode(false);
                setSelected(null);
            }
        } catch (error) {
            alert("An error occurred while updating.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/student/delete/${selected.info.student_id}`, { method: 'DELETE' });
                const data = await response.json();
                alert(data.message);
                if (response.ok) {
                    setRefresh(prev => !prev);
                    setSelected(null);
                }
            } catch (error) {
                alert("An error occurred while deleting.");
            }
        }
    };

    const handleExport = () => {
        const data = selected.info;
        const csvContent = 
            "Key,Value\n" +
            `Student ID,${data.student_id}\n` +
            `Attendance,${data.attendance_percentage}\n` +
            `Avg Score,${data.avg_test_score}\n` +
            `Fee Status,${data.fee_status}\n` +
            `Risk Level,${data.risk_level}\n`;
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `student_${data.student_id}.csv`);
        link.click();
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById("file-upload");
        if (!fileInput.files.length) {
            alert("Please select a file first!");
            return;
        }
        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        try {
            const res = await fetch("http://127.0.0.1:5000/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) {
                alert("✅ File uploaded and processed successfully!");
                setRefresh(prev => !prev);
            } else {
                alert("❌ " + data.message);
            }
        } catch (error) {
            console.error(error);
            alert("❌ Error uploading file.");
        }
    };

    const handleSchedule = () => {
        alert("Appointment Scheduled");
    };

    // --- Stats & Charts ---
    const highRiskCount = students.filter((s) => s.risk_level === "High").length;
    const mediumRiskCount = students.filter((s) => s.risk_level === "Medium").length;
    const lowRiskCount = students.filter((s) => s.risk_level === "Low").length;
    const totalStudents = students.length;

    const cgpa = selected?.info ? [
        Number(selected.info.sem1_cgpa) || 0,
        Number(selected.info.sem2_cgpa) || 0,
        Number(selected.info.sem3_cgpa) || 0,
        Number(selected.info.sem4_cgpa) || 0,
        Number(selected.info.sem5_cgpa) || 0,
        Number(selected.info.sem6_cgpa) || 0,
    ] : [];

    const performanceData = {
        labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"],
        datasets: [{
            label: "CGPA",
            data: cgpa,
            fill: true,
            borderColor: "#0f172a", 
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, "rgba(15, 23, 42, 0.2)");
                gradient.addColorStop(1, "rgba(15, 23, 42, 0)");
                return gradient;
            },
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: "#fff",
            pointBorderColor: "#0f172a",
            pointBorderWidth: 2,
        }],
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', padding: 12 } },
        scales: {
            y: { max: 10, grid: { borderDash: [4, 4], color: '#e2e8f0' }, ticks: { font: { family: 'Inter' } } },
            x: { grid: { display: false }, ticks: { font: { family: 'Inter' } } },
        },
    };

    // --- Render Content ---
    
    const renderContent = () => {
        if (view === 'userManagement' && userRole === 'admin') {
            return <div className="p-10 max-w-[1920px] mx-auto"><UserManagement /></div>;
        }

        return (
            <div className="p-6 md:p-12 max-w-[1920px] mx-auto space-y-12">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Overview</h2>
                        <p className="mt-2 text-base text-gray-500">Real-time insights into student academic performance and risk assessment.</p>
                    </div>
                    <div className="w-full md:w-96 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-xl border-0 py-3 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6 shadow-sm"
                            placeholder="Search students by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Students" value={totalStudents} icon={Users} trend="12%" subtext="Active enrollment" />
                    <StatCard title="High Risk" value={highRiskCount} icon={AlertCircle} subtext="Requires immediate attention" />
                    <StatCard title="Medium Risk" value={mediumRiskCount} icon={FileText} subtext="Monitor closely" />
                    <StatCard title="Low Risk" value={lowRiskCount} icon={CheckCircle2} subtext="On track" />
                </div>

                {/* Main Grid: Chart + List */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-gray-500" />
                                <h3 className="text-base font-semibold leading-6 text-gray-900">Academic Performance Distribution</h3>
                            </div>
                            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View Full Report</button>
                        </div>
                        <div className="p-6 flex-1 min-h-[400px]">
                            {/* Assuming SubjectScoresChart is responsive */}
                            <SubjectScoresChart />
                        </div>
                    </div>

                    {/* Right: Risk Filter */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-6">Risk Filter</h3>
                        <div className="space-y-3">
                            {['All', 'High', 'Medium', 'Low'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setRiskFilter(filter.toLowerCase())}
                                    className={`w-full flex items-center justify-between px-5 py-4 text-sm font-medium rounded-lg transition-all duration-200 border ${
                                        riskFilter === filter.toLowerCase() 
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                                        : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{filter} Risk</span>
                                    {filter !== 'All' && <Badge level={filter} />}
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                             <p className="text-xs text-gray-500 leading-relaxed">
                                Use these filters to isolate students based on their AI-predicted dropout risk score. High risk students should be prioritized for counseling.
                             </p>
                        </div>
                    </div>
                </div>

                {/* Student Grid */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Student Roster</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {students.map((student) => (
                            <div 
                                key={student.student_id}
                                onClick={() => fetchDetails(student.student_id)}
                                className="group relative flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 cursor-pointer overflow-hidden"
                            >
                                <div className={`absolute top-0 left-0 w-full h-1.5 ${student.risk_level === 'High' ? 'bg-red-500' : student.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-5">
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">ID: {student.student_id}</p>
                                            <h4 className="text-lg font-bold text-gray-900 mt-1">Engineering</h4>
                                        </div>
                                        <Badge level={student.risk_level} />
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
                                                <span>Attendance</span>
                                                <span className="text-gray-900">{student.attendance_percentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div className="bg-slate-800 h-2 rounded-full" style={{ width: `${student.attendance_percentage}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                            <span className="text-xs text-gray-500 font-medium">Avg Score</span>
                                            <span className="text-base font-bold text-gray-900">{student.avg_test_score}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center group-hover:bg-slate-50 transition-colors border-t border-gray-100">
                                    <span className="text-xs font-semibold text-gray-600">View Profile</span>
                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-slate-600 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50/50 font-sans text-gray-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-gray-900/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

            {/* Sidebar - Reverted to CSS Transitions for Desktop Stability */}
            <aside 
                className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col 
                    transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:relative md:translate-x-0
                `}
            >
                <div className="flex h-20 shrink-0 items-center px-8 border-b border-gray-100">
                    <span className="ml-3 text-xl font-extrabold tracking-tight text-slate-900">Eklavya</span>
                </div>
                
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                    <button 
                        onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }}
                        className={`group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${view === 'dashboard' ? 'bg-slate-100 text-slate-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <LayoutDashboard className={`mr-3 h-5 w-5 flex-shrink-0 ${view === 'dashboard' ? 'text-slate-900' : 'text-gray-400 group-hover:text-gray-500'}`} />
                        Overview
                    </button>
                    {userRole === 'admin' && (
                        <button 
                            onClick={() => { setView('userManagement'); setIsSidebarOpen(false); }}
                            className={`group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${view === 'userManagement' ? 'bg-slate-100 text-slate-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <Users className={`mr-3 h-5 w-5 flex-shrink-0 ${view === 'userManagement' ? 'text-slate-900' : 'text-gray-400 group-hover:text-gray-500'}`} />
                            User Management
                        </button>
                    )}
                </nav>

                <div className="border-t border-gray-200 p-6 space-y-4">
                    <div className="flex items-center px-2">
                        <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-bold text-gray-900">{username}</p>
                            <p className="text-xs font-medium text-gray-500 capitalize">{userRole}</p>
                        </div>
                    </div>
                     {userRole === 'admin' && (
                        <form onSubmit={handleFileUpload} className="relative">
                            <input type="file" id="file-upload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <button className="w-full flex justify-center items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors">
                                <UploadCloud className="h-4 w-4 text-gray-500" />
                                Upload Data
                            </button>
                        </form>
                    )}
                    <button onClick={logout} className="w-full flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="h-4 w-4" />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <div className="md:hidden flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
                    <div className="flex items-center gap-2">
                         <img className="h-8 w-auto" src="/logoeklavyafinal.png" alt="Logo" />
                         <span className="font-bold text-lg">Eklavya</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                <main className="flex-1 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selected && (
                    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelected(null)}></div>
                        <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-5xl"
                                >
                                    <div className="bg-white px-8 pb-8 pt-8">
                                        <div className="flex items-start justify-between border-b border-gray-100 pb-6 mb-8">
                                            <div>
                                                <h3 className="text-2xl font-bold leading-6 text-gray-900" id="modal-title">Student Profile</h3>
                                                <p className="text-sm text-gray-500 mt-2">Comprehensive academic analysis and risk report for <span className="font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded ml-1">{selected.info.student_id}</span></p>
                                            </div>
                                            <button onClick={() => setSelected(null)} className="rounded-full p-2 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none">
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                            {/* Left Column: Key Stats & Actions */}
                                            <div className="lg:col-span-5 space-y-8">
                                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Current Metrics</h4>
                                                    <div className="space-y-6">
                                                        <div>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-sm font-medium text-gray-700">Attendance</span>
                                                                {editMode ? (
                                                                    <input type="number" name="attendance_percentage" value={editableStudent.attendance_percentage} onChange={handleEditChange} className="block w-24 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6" />
                                                                ) : (
                                                                    <span className="text-xl font-bold text-gray-900">{selected.info.attendance_percentage}%</span>
                                                                )}
                                                            </div>
                                                            {!editMode && (
                                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                                    <div className={`h-2 rounded-full ${selected.info.attendance_percentage > 75 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${selected.info.attendance_percentage}%` }}></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                            <span className="text-sm font-medium text-gray-700">Fee Status</span>
                                                            {editMode ? (
                                                                <select name="fee_status" value={editableStudent.fee_status} onChange={handleEditChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                                                    <option>Paid</option><option>Overdue</option><option>Unknown</option>
                                                                </select>
                                                            ) : (
                                                                <Badge level={selected.info.fee_status} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex gap-3">
                                                        {userRole === 'admin' && (
                                                            editMode ? (
                                                                <>
                                                                    <button onClick={handleUpdate} className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition-colors">Save Changes</button>
                                                                    <button onClick={() => setEditMode(false)} className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button onClick={() => setEditMode(true)} className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors">Edit Details</button>
                                                                    <button onClick={handleDelete} className="px-4 py-3 rounded-xl bg-white text-sm font-bold text-red-600 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-red-50 transition-colors">Delete</button>
                                                                </>
                                                            )
                                                        )}
                                                    </div>
                                                    <button onClick={handleExport} className="w-full flex justify-center items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors">
                                                        <FileText className="h-4 w-4" /> Export Student Record
                                                    </button>
                                                    {(selected.info.risk_level === "Medium" || selected.info.risk_level === "High") && (
                                                        <button onClick={handleSchedule} className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:from-violet-700 hover:to-indigo-700 transition-all">
                                                            <Calendar className="h-4 w-4" /> Schedule Counseling Session
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Column 2: Analysis */}
                                            <div className="lg:col-span-7 space-y-8">
                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Performance Trajectory</h4>
                                                    <div className="h-64 w-full border border-gray-100 rounded-2xl p-4 shadow-sm">
                                                        <Line data={performanceData} options={commonOptions} />
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">AI Risk Assessment</h4>
                                                    <div className={`rounded-2xl p-6 border ${selected.info.reasons?.length > 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 mt-0.5">
                                                                {selected.info.reasons?.length > 0 ? <AlertCircle className="h-6 w-6 text-red-500" /> : <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
                                                            </div>
                                                            <div className="ml-4">
                                                                <h3 className={`text-base font-bold ${selected.info.reasons?.length > 0 ? 'text-red-900' : 'text-emerald-900'}`}>
                                                                    {selected.info.reasons?.length > 0 ? 'Risk Factors Detected' : 'No Significant Risks'}
                                                                </h3>
                                                                {selected.info.reasons?.length > 0 ? (
                                                                    <div className="mt-3 text-sm text-red-800">
                                                                        <ul className="space-y-2">
                                                                            {selected.info.reasons.map((r, i) => (
                                                                                <li key={i} className="flex items-start gap-2">
                                                                                    <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-red-400 flex-shrink-0" />
                                                                                    {r}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                ) : (
                                                                    <p className="mt-1 text-sm text-emerald-700">
                                                                        This student is performing well within expected parameters. Continue monitoring routine metrics.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- App Router (No changes needed here) ---
function AppRoutes() {
    const { isLoggedIn, userRole } = useContext(AuthContext);
    const location = useLocation();
    
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/student-login" element={<StudentLoginPage />} />
            <Route path="/dashboard" element={
                isLoggedIn && (userRole === 'mentor' || userRole === 'admin') 
                ? <DashboardPage /> 
                : <Navigate to="/login" state={{ from: location }} replace />
            } />
            <Route path="/student-dashboard" element={
                isLoggedIn && userRole === 'student' 
                ? <StudentDashboard /> 
                : <Navigate to="/student-login" state={{ from: location }} replace />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;