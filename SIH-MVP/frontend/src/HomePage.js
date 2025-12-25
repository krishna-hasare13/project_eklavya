import React, { useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
    GraduationCap, 
    ShieldCheck, 
    BrainCircuit, 
    BellRing, 
    BarChart3, 
    ChevronDown 
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { AuthContext } from './AuthContext';

// --- Animation Variants ---
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

// --- Sub-Components ---

const BackgroundBlobs = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Overall Gradient Background covering the full page */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-emerald-50 opacity-90" />
        
        {/* Animated Blobs for extra depth */}
        <motion.div 
            animate={{ 
                x: [0, 100, 0], 
                y: [0, -50, 0], 
                scale: [1, 1.2, 1] 
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-200/40 rounded-full blur-[120px]" 
        />
        <motion.div 
            animate={{ 
                x: [0, -100, 0], 
                y: [0, 100, 0], 
                scale: [1, 1.3, 1] 
            }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-20 right-0 w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-[100px]" 
        />
        <motion.div 
            animate={{ 
                x: [0, 50, 0], 
                y: [0, 50, 0], 
                scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-yellow-100/40 rounded-full blur-[120px]" 
        />
    </div>
);

const FeatureCard = ({ icon: Icon, title, desc, colorClass }) => {
    return (
        <motion.div
            variants={fadeInUp}
            className="group relative bg-white/60 backdrop-blur-lg border border-white/50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
            <div className={`absolute top-0 left-0 w-full h-1 ${colorClass} origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
            
            <div className={`w-14 h-14 rounded-2xl ${colorClass.replace('bg-', 'bg-').replace('500', '100')} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-8 h-8 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{desc}</p>
        </motion.div>
    );
};

const RoleCard = ({ role, title, desc, onClick, gradient, icon: Icon, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: role === 'student' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }} 
            transition={{ duration: 0.6, delay: delay }}
            whileHover={{ y: -10 }}
            className={`relative flex-1 flex flex-col justify-between p-8 md:p-10 rounded-[2.5rem] shadow-xl overflow-hidden group cursor-pointer bg-gradient-to-br ${gradient}`}
            onClick={onClick}
        >
            {/* Hover Decor */}
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10">
                <div className="w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                    <Icon className="w-8 h-8 text-sky-700" />
                </div>
                <h3 className="text-3xl font-bold mb-3 text-sky-900">{title}</h3>
                <p className="text-sky-900/80 font-medium text-lg">{desc}</p>
            </div>

            <div className="relative z-10 mt-8">
                <button className="flex items-center justify-between w-full py-4 px-6 rounded-xl bg-white/90 text-sky-900 font-bold shadow-sm group-hover:shadow-md transition-all">
                    <span>Login as {role === 'student' ? 'Student' : 'Admin'}</span>
                    <span className="bg-sky-100 p-2 rounded-full group-hover:translate-x-2 transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </span>
                </button>
            </div>
        </motion.div>
    );
};

// --- Main Component ---

const HomePage = () => {
    const navigate = useNavigate();
    const { isLoggedIn, username, logout } = useContext(AuthContext);
    const location = useLocation();
    
    // Using Ref for Scroll target
    const loginSectionRef = useRef(null);
    
    // Parallax effect for Hero Text
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);

    // --- Scroll Handling ---
    useEffect(() => {
        // 1. Disable browser's automatic scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // 2. Check if we have a specific intent to scroll to login (from Navbar or redirect)
        if (location.state?.scrollToLogin) {
            // Scroll to the login section
            loginSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            
            // 3. Clear the state immediately
            navigate(location.pathname, { replace: true, state: {} });
        } else {
            // 4. Default behavior: Always start at the top
            window.scrollTo(0, 0);
        }
    }, [location.state, navigate, location.pathname]);

    const handleLoginRedirect = (role) => {
        if (role === 'student') navigate('/student-login');
        else navigate(`/login?role=${role}`);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden font-sans text-slate-900 relative">
            <Navbar isLoggedIn={isLoggedIn} username={username} logout={logout} />
            
            {/* Background Blobs (Fixed & Full Screen) */}
            <BackgroundBlobs />

            {/* --- HERO SECTION --- */}
            <header className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden z-10">
                
                <motion.div 
                    style={{ y: y1 }}
                    className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto mt-24"
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8 relative"
                    >
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-6xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-emerald-600 to-sky-500 pb-4"
                    >
                        Eklavya
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl md:text-3xl font-light text-slate-600 mt-2"
                    >
                        Empowering Futures <span className="text-emerald-500 mx-2">•</span> Growing Together
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-12 max-w-2xl text-lg text-slate-500 leading-relaxed"
                    >
                        An AI-powered ecosystem designed to identify academic risks early, provide targeted counseling, and ensure no student falls behind.
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        onClick={() => loginSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="mt-16 animate-bounce cursor-pointer text-sky-600 hover:text-sky-800"
                    >
                        <ChevronDown size={40} />
                    </motion.button>
                </motion.div>
            </header>

            {/* --- LOGIN / ROLE SECTION --- */}
            {/* FIX: Added id="login-portals-section" here so Navbar can find it */}
            <section 
                id="login-portals-section" 
                ref={loginSectionRef} 
                className="relative py-32 px-4 z-10"
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }} 
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Choose Your Path</h2>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-sky-500 to-emerald-500 mx-auto rounded-full" />
                    </motion.div>

                    <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
                        <RoleCard 
                            role="student"
                            title="Student Portal"
                            desc="Track your progress, view risk analysis, and access counseling resources."
                            gradient="from-sky-100 via-sky-50 to-white"
                            icon={GraduationCap}
                            onClick={() => handleLoginRedirect('student')}
                            delay={0.1}
                        />
                        <RoleCard 
                            role="admin"
                            title="Admin Dashboard"
                            desc="Oversee student data, manage interventions, and generate AI reports."
                            gradient="from-emerald-100 via-emerald-50 to-white"
                            icon={ShieldCheck}
                            onClick={() => handleLoginRedirect('Admin')}
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section className="py-32 px-4 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, margin: "-100px" }} 
                        variants={staggerContainer}
                        className="text-center mb-20"
                    >
                        <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                            Intelligent Features
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-xl text-slate-500 max-w-2xl mx-auto">
                            Leveraging modern technology to bridge the gap between identification and intervention.
                        </motion.p>
                    </motion.div>

                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false }} 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <FeatureCard 
                            icon={BrainCircuit}
                            title="ML-Driven Prediction"
                            desc="Our algorithms analyze historical and current academic data to predict potential dropouts with high accuracy."
                            colorClass="bg-sky-500"
                        />
                        <FeatureCard 
                            icon={BellRing}
                            title="Proactive Intervention"
                            desc="Automated alerts notify counselors and guardians immediately when a student's risk profile changes."
                            colorClass="bg-emerald-500"
                        />
                        <FeatureCard 
                            icon={BarChart3}
                            title="Actionable Analytics"
                            desc="Visual dashboards provide deep insights into attendance, grades, and behavioral patterns."
                            colorClass="bg-yellow-500"
                        />
                    </motion.div>
                </div>
            </section>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default HomePage;