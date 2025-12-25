import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Shield, ArrowRight, Sparkles } from 'lucide-react';

const SignUpSelection = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.8, staggerChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* --- Background Decor (Preserved) --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl w-full"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/50 backdrop-blur-md shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-slate-600 tracking-wide uppercase">Welcome to the future</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Eklavya</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Empowering education through AI. Choose your pathway to get started.
          </p>
        </motion.div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-8 px-4">
          
          {/* --- Student Card --- */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group cursor-pointer relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
            onClick={() => navigate('/signup/student')}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500" />
            
            <div className="p-10 flex flex-col items-center text-center h-full">
              <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors duration-500 shadow-inner">
                <GraduationCap className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-3xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors">Student</h3>
              <p className="text-slate-500 leading-relaxed mb-10">
                Track your academic journey, view attendance analytics, and receive personalized AI insights.
              </p>
              
              <div className="mt-auto">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-6 py-3 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  Create Student Account <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* --- Admin Card --- */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group cursor-pointer relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
            onClick={() => navigate('/signup/admin')}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
            
            <div className="p-10 flex flex-col items-center text-center h-full">
              <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-colors duration-500 shadow-inner">
                <Shield className="w-10 h-10 text-emerald-600 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-3xl font-bold text-slate-800 mb-4 group-hover:text-emerald-700 transition-colors">Admin</h3>
              <p className="text-slate-500 leading-relaxed mb-10">
                Manage institute data, oversee student performance, and configure system-wide settings.
              </p>
              
              <div className="mt-auto">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-6 py-3 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  Register as Admin <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Footer Link */}
        <motion.div variants={itemVariants} className="mt-16 text-center">
          <p className="text-slate-500 font-medium">
            Already a member?{' '}
            <Link to="/login" className="text-slate-800 font-bold hover:text-blue-600 hover:underline transition-colors">
              Log in to Portal
            </Link>
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default SignUpSelection;