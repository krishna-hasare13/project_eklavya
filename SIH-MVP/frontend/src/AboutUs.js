import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { motion } from 'framer-motion';
import { 
    Award, 
    Heart, 
    Lightbulb, 
    ShieldAlert, 
    Users, 
    TrendingUp, 
    Database,
    ArrowLeft // Import ArrowLeft icon
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

// --- Animations ---
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

// --- Sub-Components ---
const BackgroundBlobs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 fixed">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[100px] animate-blob animation-delay-2000" />
    </div>
);

const ValueCard = ({ icon: Icon, title, desc, color }) => (
    <motion.div 
        variants={fadeInUp}
        className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </motion.div>
);

const StatBadge = ({ number, label }) => (
    <div className="flex flex-col items-center p-4 bg-white/50 rounded-2xl border border-white/60">
        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
            {number}
        </span>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{label}</span>
    </div>
);

const AboutUs = () => {
    const navigate = useNavigate(); // Hook for navigation

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900 relative">
            <Navbar />
            <BackgroundBlobs />
            
            {/* --- Modern Compact Back Button --- */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="fixed top-24 left-6 z-50 group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl border border-white/60 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer"
            >
                <div className="p-1 bg-slate-100 rounded-full text-slate-600 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors duration-300">
                    <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-xs text-slate-600 group-hover:text-sky-600 tracking-wide pr-1 transition-colors duration-300 uppercase">
                    Back
                </span>
            </motion.button>

            <main className="relative z-10 pt-28 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    
                    {/* --- HEADER SECTION --- */}
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-center max-w-3xl mx-auto mb-20"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100/50 border border-sky-200 text-sky-700 text-sm font-semibold mb-6">
                            <Award className="w-4 h-4" />
                            <span>Bridging Data & Empathy</span>
                        </motion.div>
                        
                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight mb-6">
                            Redefining Student <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-500">
                                Success & Support
                            </span>
                        </motion.h1>
                        
                        <motion.p variants={fadeInUp} className="text-xl text-slate-600 leading-relaxed">
                            Eklavya bridges the gap between data and empathy. We provide educators with the AI-powered foresight needed to ensure no student is left behind.
                        </motion.p>
                    </motion.div>

                    {/* --- GRID LAYOUT --- */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
                        
                        {/* Left Column: The Origin Story */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="md:col-span-7 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-white"
                        >
                            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                <Lightbulb className="text-yellow-500 w-8 h-8" />
                                Our Mission
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Dropout rates in public institutions are more than just statistics; they represent potential unrealized. 
                                <strong className="text-slate-900"> Eklavya</strong> was created to combat this by empowering mentors with data-driven insights.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                By intelligently fusing data on attendance, academic performance, and demographics, we replace reactive measures with <span className="underline decoration-emerald-400 decoration-2 underline-offset-4">proactive intervention</span>.
                            </p>
                            
                            <div className="flex gap-4 mt-10">
                                <StatBadge number="AI" label="Powered" />
                                <StatBadge number="24/7" label="Monitoring" />
                                <StatBadge number="100%" label="Secure" />
                            </div>
                        </motion.div>

                        {/* Right Column: Visual Philosophy */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="md:col-span-5 flex flex-col gap-6"
                        >
                            <div className="flex-1 bg-gradient-to-br from-sky-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                    <Database size={140} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Data-Driven</h3>
                                <p className="text-sky-100">Turning raw academic numbers into clear, actionable roadmaps for success.</p>
                            </div>

                            <div className="flex-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] p-8 text-white shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                    <Heart size={140} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Human-Centric</h3>
                                <p className="text-emerald-50">Technology doesn't replace the teacher; it gives them the superpowers to care more effectively.</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* --- CORE VALUES ROW --- */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <h2 className="text-center text-3xl font-bold text-slate-800 mb-10">How We Make a Difference</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ValueCard 
                                icon={ShieldAlert} 
                                title="Early Warning System" 
                                desc="Identifying at-risk students months before a potential dropout occurs using predictive modeling."
                                color="bg-red-500" 
                            />
                            <ValueCard 
                                icon={TrendingUp} 
                                title="Holistic Growth" 
                                desc="Tracking not just grades, but attendance and behavioral trends to understand the whole student."
                                color="bg-sky-500" 
                            />
                            <ValueCard 
                                icon={Users} 
                                title="Mentor Empowerment" 
                                desc="Simplifying administrative tasks so counselors can spend more time on 1-on-1 guidance."
                                color="bg-emerald-500" 
                            />
                        </div>
                    </motion.div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AboutUs;