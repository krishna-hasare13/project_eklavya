import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Lock, ArrowLeft, Loader2, AlertCircle, GraduationCap, Check, Eye, EyeOff 
} from 'lucide-react';

const StudentSignUp = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    
    const navigate = useNavigate();

    // Calculate password strength visually
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

        if (formData.password.length < 8) {
            setError("Password is too short (min 8 chars).");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role: 'student' }),
            });
            
            const data = await response.json();
            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed.');
            }
        } catch (err) {
            setError('Server connection failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            
            {/* --- Animated Background --- */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-white" />
                <motion.div 
                    animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[120px]"
                />
                <motion.div 
                    animate={{ x: [0, -80, 0], y: [0, 120, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[100px]"
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-[480px]"
            >
                <button 
                    onClick={() => navigate('/signup')} 
                    className="group flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors font-medium"
                >
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-3 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span>Back to Selection</span>
                </button>

                <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-white p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Student Portal</h1>
                        <p className="text-slate-500 mt-2 text-sm">Create your account to track progress</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Student PRN</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                {/* UPDATED PLACEHOLDER */}
                                <input 
                                    type="text" 
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-medium"
                                    placeholder="e.g. 2023025050" 
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-medium"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            <div className="flex gap-1 h-1 mt-2 px-1">
                                {[1, 2, 3, 4].map((level) => (
                                    <div 
                                        key={level}
                                        className={`h-full flex-1 rounded-full transition-all duration-300 ${
                                            passwordStrength >= level 
                                            ? (passwordStrength < 2 ? 'bg-red-400' : passwordStrength < 4 ? 'bg-amber-400' : 'bg-emerald-400') 
                                            : 'bg-slate-200'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium flex items-center gap-3 border border-red-100"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            disabled={isLoading} 
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-900/10 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account <Check className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-sm">
                            Already registered?{' '}
                            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StudentSignUp;