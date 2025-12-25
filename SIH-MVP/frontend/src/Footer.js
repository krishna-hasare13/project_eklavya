import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Github, 
    Linkedin, 
    Mail, 
    Twitter, 
    Heart, 
    ArrowRight 
} from 'lucide-react';

const FooterLink = ({ to, children }) => (
    <li>
        <Link 
            to={to} 
            // CHANGED: Added behavior: 'smooth'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center text-slate-400 hover:text-emerald-400 transition-colors duration-300"
        >
            {children}
        </Link>
    </li>
);

const SocialIcon = ({ icon: Icon, href }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
    >
        <Icon size={18} />
    </a>
);

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-slate-950 text-slate-300 overflow-hidden">
            {/* Gradient Top Border */}
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-emerald-500 to-yellow-500" />

            {/* Background Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-sky-900/20 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    {/* Column 1: Brand Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                             {/* You can put your small logo img here if you want */}
                            <h3 className="text-2xl font-bold text-white tracking-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Eklavya</span>
                            </h3>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Empowering educators and students with AI-driven insights. 
                            We believe that with the right support at the right time, every student can succeed.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={Github} href="https://github.com/krishna-hasare13" />
                            <SocialIcon icon={Linkedin} href="https://www.linkedin.com/in/krishnahasare444/" />
                            {/* <SocialIcon icon={Twitter} href="#" /> */}
                        </div>
                    </div>

                    {/* Column 2: Quick Links (Navigation) */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Explore</h4>
                        <ul className="space-y-4 text-sm">
                            <FooterLink to="/">Home</FooterLink>
                            <FooterLink to="/about">About Us</FooterLink>
                        </ul>
                    </div>

                    {/* Column 3: Portals */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Portals</h4>
                        <ul className="space-y-4 text-sm">
                            <FooterLink to="/student-login">Student Login</FooterLink>
                            <FooterLink to="/login?role=admin">Admin Dashboard</FooterLink>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter / Contact */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Stay Connected</h4>
                        <p className="text-slate-400 text-sm mb-4">
                            Have questions? Reach out to our support team.
                        </p>
                        <a 
                            href="mailto:krishna.dypsem444@gmail.com" 
                            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            <Mail size={16} />
                            krishna.dypsem444@gmail.com
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© {currentYear} Eklavya. All Rights Reserved.</p>
                    <div className="flex items-center gap-1">
                        <span>Made with</span>
                        <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
                        <span>for Education</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;