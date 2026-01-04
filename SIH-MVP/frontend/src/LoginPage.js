import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import { User, Lock, ArrowRight, AlertCircle, Loader2, Home } from 'lucide-react'; // Added Home icon
import { AuthContext } from './AuthContext';

// --- Simple Navbar Component (Internal) ---
const SimpleNavbar = () => (
    <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6 flex justify-end items-center pointer-events-none">
        <Link 
            to="/about" 
            className="pointer-events-auto text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm"
        >
            About Us
        </Link>
    </nav>
);

// --- Main Login Page ---
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!username || !password) {
            setError('Please fill out all fields.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                if (data.role === 'admin') {
                    login(data.role, username);
                    navigate('/dashboard');
                } else {
                    setError('Access Restricted: Admin privileges required.');
                }
            } else {
                setError(data.message || 'Invalid credentials.');
            }
        } catch (err) {
            setError('Unable to connect to the server. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
            
            {/* --- Top-Notch Back Button --- */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05, x: 2 }} // Reduced x movement slightly for smaller button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-50 group flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-xl border border-white/60 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer"
            >
                <div className="p-1 bg-slate-100 rounded-full text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
                    <Home className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-xs text-slate-600 group-hover:text-blue-600 tracking-wide pr-1 transition-colors duration-300 ">
                    Home
                </span>
            </motion.button>

            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-sky-200/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[100px] pointer-events-none" />

            <SimpleNavbar />

            <div className="flex-1 flex items-center justify-center p-4 z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden">
                        <div className="p-8 md:p-10">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-emerald-600 mb-4 shadow-sm border border-slate-100">
                                    <User size={24} />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h2>
                                <p className="text-slate-500 mt-2 text-sm">Enter your credentials to access the admin dashboard.</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all outline-none font-medium"
                                            placeholder="admin_user"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all outline-none font-medium"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <AnimatePresence mode='wait'>
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium"
                                        >
                                            <AlertCircle size={18} className="shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Sign In <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                        
                        {/* Footer of Card */}
                        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400">
                                Protected by enterprise-grade security. 
                                <span className="block mt-1">© Project Eklavya Systems</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;