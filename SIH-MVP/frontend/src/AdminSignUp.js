import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, 
    Lock, 
    ArrowLeft, 
    Loader2, 
    AlertCircle, 
    Shield, 
    KeyRound,
    Eye, 
    EyeOff,
    Smartphone
} from 'lucide-react';

const AdminSignUp = () => {
    const [formData, setFormData] = useState({ username: '', password: '', mobile_number: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();

    // Calculate password strength
    useEffect(() => {
        let strength = 0;
        if (formData.password.length >= 8) strength += 1;
        if (/[A-Z]/.test(formData.password)) strength += 1;
        if (/[0-9]/.test(formData.password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
        setPasswordStrength(strength);
    }, [formData.password]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // 1. Validation: Password Length
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters.");
            setIsLoading(false);
            return;
        }

        // 2. Validation: Admin ID must start with 'A'
        if (!formData.username.startsWith('A')) {
            setError("Admin ID must start with the letter 'A' (e.g., A123).");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role: 'admin' }),
            });
            
            const data = await response.json();
            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed.');
            }
        } catch (err) {
            setError('Connection failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center p-6 relative overflow-hidden font-sans">
            
            {/* --- Dark Animated Background --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-950" />
                <motion.div 
                    animate={{ x: [0, 60, 0], y: [0, -60, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px]"
                />
                <motion.div 
                    animate={{ x: [0, -40, 0], y: [0, 80, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[100px]"
                />
            </div>

            {/* --- Main Content Wrapper --- */}
            <div className="flex-1 flex flex-col justify-center w-full max-w-[480px] z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                    <button 
                        onClick={() => navigate('/signup')} 
                        className="group flex items-center text-slate-400 hover:text-emerald-400 mb-8 transition-colors font-medium text-sm"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-3 group-hover:border-emerald-500/50 group-hover:bg-emerald-900/20 transition-all">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span>Cancel Registration</span>
                    </button>

                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                <Shield className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">Admin Access</h1>
                                <p className="text-slate-400 text-sm">Secure Institute Management</p>
                            </div>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-6">
                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Admin ID</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input 
                                        type="text" 
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-mono"
                                        placeholder="A235689 "
                                        value={formData.username}
                                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mobile Number</label>
                                <div className="relative group">
                                    <Smartphone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input 
                                        type="tel" 
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-mono"
                                        placeholder="+919876543210" 
                                        value={formData.mobile_number} 
                                        onChange={(e) => setFormData({...formData, mobile_number: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Secure Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        className="w-full pl-11 pr-12 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-mono"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <div className="flex gap-1.5 h-1 mt-3 px-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div key={level} className={`h-full flex-1 rounded-full transition-all duration-300 ${passwordStrength >= level ? (passwordStrength < 2 ? 'bg-red-500' : passwordStrength < 4 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-800'}`} />
                                    ))}
                                </div>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm font-medium flex items-start gap-3 border border-red-500/20"
                                    >
                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button 
                                disabled={isLoading} 
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : <><KeyRound className="w-5 h-5" /> Grant Access</>}
                            </button>
                        </form>
                    </div>
                    
                    <p className="text-center text-slate-500 text-xs mt-8">
                        Restricted Area. Unauthorized access is prohibited.
                    </p>
                </motion.div>
            </div>

            <motion.footer 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.8, duration: 0.8 }}
                className="relative z-10 w-full max-w-5xl mt-8 pt-8 border-t border-slate-800/60"
            >
                <div className="flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Eklavya AI. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0 font-medium">
                        <Link to="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
                        <Link to="#" className="hover:text-emerald-400 transition-colors">Help Center</Link>
                    </div>
                </div>
            </motion.footer>

        </div>
    );
};

export default AdminSignUp;