import React, { useContext, useState, useEffect, useLayoutEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, ChevronRight, UserPlus } from 'lucide-react';
import { AuthContext } from './AuthContext';

const Navbar = () => {
    const { isLoggedIn, username, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // 1. Detect scroll to add shadow/background
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 2. HELPER: Instant Jump Function (Direct Redirect)
    const scrollToLoginSection = () => {
        const targetId = 'login-portals-section';
        let attempts = 0;
        const maxAttempts = 15;

        const checkAndScroll = () => {
            const element = document.getElementById(targetId);
            
            if (element) {
                // Calculation to handle Fixed Navbar obscuring the view
                const headerOffset = 100; 
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "instant" 
                });
            } else if (attempts < maxAttempts) {
                // Retry very quickly (every 20ms) to catch the element as soon as it mounts
                attempts++;
                setTimeout(checkAndScroll, 20);
            }
        };

        checkAndScroll();
    };

    // 3. LAYOUT EFFECT: Runs synchronously before visual paint
    useLayoutEffect(() => {
        if (location.pathname === '/' && location.state?.scrollToLogin) {
            scrollToLoginSection();
            window.history.replaceState({}, document.title);
        }
    }, [location.pathname, location.state]);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const handleLoginClick = () => {
        setMobileMenuOpen(false);
        if (location.pathname === '/') {
            scrollToLoginSection();
        } else {
            navigate('/', { state: { scrollToLogin: true } });
        }
    };

    const isHomePage = location.pathname === '/';
    const showBrand = !isHomePage || scrolled;

    const navVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <>
            <motion.nav 
                initial="hidden"
                animate="visible"
                variants={navVariants}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 md:px-6 py-4 pointer-events-none`}
            >
                <div 
                    className={`
                        max-w-7xl mx-auto rounded-2xl flex items-center justify-between px-6 py-3 transition-all duration-500 pointer-events-auto
                        ${scrolled || mobileMenuOpen || !isHomePage ? 'bg-white/90 backdrop-blur-md shadow-lg border border-white/20' : 'bg-transparent'}
                    `}
                >
                    {/* Logo Section */}
                    <Link 
                        to="/" 
                        className={`flex items-center gap-2 group transition-all duration-500 ease-in-out ${showBrand ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-emerald-600 to-sky-500">
                            Eklavya
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link 
                            to="/about" 
                            className="text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors relative group"
                        >
                            About Us
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
                        </Link>

                        <div className="h-6 w-px bg-gray-200"></div>

                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
                                        {username.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{username}</span>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                {/* SIGN UP BUTTON - NEW */}
                                <Link 
                                    to="/signup"
                                    className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-600 font-semibold text-sm hover:text-emerald-600 transition-all"
                                >
                                    <UserPlus size={16} />
                                    Sign Up
                                </Link>

                                <button 
                                    onClick={handleLoginClick}
                                    className="group flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-bold shadow-md hover:bg-slate-800 hover:shadow-lg transition-all"
                                >
                                    Login
                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-6 text-center">
                            <Link 
                                to="/" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xl font-bold text-gray-800 py-2 border-b border-gray-100"
                            >
                                Home
                            </Link>
                            <Link 
                                to="/about" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xl font-bold text-gray-800 py-2 border-b border-gray-100"
                            >
                                About Us
                            </Link>
                            
                            {isLoggedIn ? (
                                <div className="space-y-4 pt-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                            {username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">Hello, {username}</span>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 pt-4">
                                    <Link 
                                        to="/signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-lg shadow-sm"
                                    >
                                        <UserPlus size={20} />
                                        Create Account
                                    </Link>
                                    <button 
                                        onClick={handleLoginClick}
                                        className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-xl"
                                    >
                                        Login Portal
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;