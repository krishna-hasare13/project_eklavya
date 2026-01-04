import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  GraduationCap,
  Home,
  Info // Added Info icon for About Us
} from 'lucide-react';
import { AuthContext } from './AuthContext';

const StudentLoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok && data.role === 'student') {
        localStorage.setItem('studentUsername', formData.username);
        login('student', formData.username);
        
        setTimeout(() => navigate('/student-dashboard'), 500);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.5, delay: 0.2, type: "spring", stiffness: 100 } 
    }
  };

  const shakeVariants = {
    shake: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } },
    normal: { x: 0 }
  };

  return (
    // Updated to flex-col for footer positioning
    <div className="relative min-h-screen flex flex-col items-center p-6 overflow-hidden bg-slate-50 font-sans">

      {/* --- Top-Notch Back Button (Smaller Version) --- */}
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
      
      {/* --- Cool Modern About Us Button (Top Right) --- */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/about')}
        className="absolute top-6 right-6 z-50 group flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md border border-white/50 rounded-full shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300 text-slate-500 hover:text-emerald-600"
      >
        <span className="font-semibold text-sm tracking-wide">About Us</span>
        <div className="p-1 bg-slate-100 rounded-full group-hover:bg-emerald-50 transition-colors">
            <Info className="w-3.5 h-3.5" strokeWidth={2.5} />
        </div>
      </motion.button>

      {/* 1. Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-emerald-50 opacity-80" />
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Main Content Spacer to push footer down */}
      <div className="flex-1 flex flex-col justify-center w-full max-w-md z-10">
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
        >
            {/* 2. Brand Header */}
            <div className="flex flex-col items-center mb-8">
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl mb-4"
            >
                <GraduationCap className="text-white w-8 h-8" />
            </motion.div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Student Portal</h1>
            <p className="text-slate-500 mt-2">Welcome back, scholar!</p>
            </div>

            {/* 3. Glassmorphism Login Card */}
            <motion.div 
            variants={cardVariants}
            className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10"
            >
            <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Username Input */}
                <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Student ID</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                    placeholder="e.g. 2023025050"
                    />
                </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-semibold text-slate-700">Password</label>
                </div>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                    placeholder="••••••••"
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer focus:outline-none"
                    >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                    <Link 
                        to="/forgot-password" 
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                    >
                        Forgot Password?
                    </Link>
                </div>

                {/* Error Message */}
                <AnimatePresence mode='wait'>
                {error && (
                    <motion.div
                    variants={shakeVariants}
                    initial="hidden"
                    animate="shake"
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100"
                    >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                    </motion.div>
                )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                {isLoading ? (
                    <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                    </>
                ) : (
                    <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
                </motion.button>
            </form>
            
            {/* Admin Login Link */}
            <div className="mt-8 text-center">
                <p className="text-slate-500 text-sm">
                Not a student?{' '}
                <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all">
                    Login as Admin
                </Link>
                </p>
            </div>
            </motion.div>
        </motion.div>
      </div>

      {/* --- Footer Section --- */}
      <motion.footer 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative z-10 w-full max-w-5xl mt-8 pt-8 border-t border-slate-200/60"
      >
        <div className="flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Eklavya AI. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0 font-medium">
                <Link to="#" className="hover:text-blue-500 transition-colors">Privacy Policy</Link>
                <Link to="#" className="hover:text-blue-500 transition-colors">Terms of Service</Link>
                <Link to="#" className="hover:text-blue-500 transition-colors">Help Center</Link>
            </div>
        </div>
      </motion.footer>

    </div>
  );
};

export default StudentLoginPage;