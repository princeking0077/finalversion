
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Mail, Facebook, Instagram, Youtube, Send, ShieldCheck, ChevronRight } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import { db, User } from '../utils/storage';
import { Logo } from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Check login status on mount and on storage events
  useEffect(() => {
    const checkUser = () => {
      setUser(db.getCurrentUser());
    };
    
    const handleScroll = () => {
        setScrolled(window.scrollY > 20);
    };
    
    checkUser();
    window.addEventListener('storage', checkUser);
    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('storage', checkUser);
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    db.logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass-header py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="cursor-pointer group scale-90 md:scale-100 transition-transform origin-left" onClick={() => navigate('/')}>
             <Logo />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1 items-center bg-slate-900/50 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path 
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 animate-fade-in pl-4 border-l border-white/10">
                 {user.role === 'admin' ? (
                   <Link to="/admin/dashboard" className="flex items-center text-sm font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 transition-all hover:bg-indigo-500/20">
                     <ShieldCheck className="w-4 h-4 mr-2" /> Admin
                   </Link>
                 ) : (
                    <Link to="/dashboard" className="flex items-center text-sm font-bold text-teal-400 hover:text-teal-300 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 transition-all hover:bg-teal-500/20">
                      Dashboard
                    </Link>
                 )}
              </div>
            ) : (
               <div className="flex items-center gap-3">
                 <Link
                  to="/login"
                  className="text-slate-300 hover:text-white font-medium text-sm transition-colors px-3"
                 >
                   Login
                 </Link>
                 <Link
                  to="/register"
                  className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:bg-teal-50 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  Sign Up
                </Link>
               </div>
            )}
           </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-400 hover:text-white focus:outline-none transition-colors p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/5 py-4 animate-slide-up absolute w-full left-0">
          <div className="px-2 space-y-1 sm:px-3">
             {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    location.pathname === link.path
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-white/10 my-2 pt-4 px-4 space-y-3">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                          navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
                          setIsMenuOpen(false);
                      }}
                      className="w-full text-center py-3 rounded-xl bg-teal-500 text-white font-bold shadow-lg"
                    >
                      Go to Dashboard
                    </button>
                    <button onClick={handleLogout} className="w-full text-center py-3 text-base text-red-400 font-medium">Logout</button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full py-3 text-center rounded-xl bg-white/5 text-white border border-white/10">Login</Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full py-3 text-center rounded-xl bg-teal-500 text-white font-bold">Sign Up</Link>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10 text-slate-400 relative overflow-hidden">
        {/* Ambient background glow for footer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Logo />
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Empowering the next generation of pharmacists with cutting-edge education and expert guidance for national competitive exams.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 hover:-translate-y-1"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 hover:-translate-y-1"><Youtube className="h-4 w-4" /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300 hover:-translate-y-1"><Send className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 font-heading">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {['Home', 'Courses', 'About Us', 'Contact Us'].map((item) => (
                <li key={item}>
                    <Link to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`} className="hover:text-teal-400 transition-colors flex items-center gap-2 group">
                        <ChevronRight className="h-3 w-3 text-teal-500 opacity-0 group-hover:opacity-100 transition-all -ml-5 group-hover:ml-0" />
                        {item}
                    </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 font-heading">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/legal/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal/terms" className="hover:text-teal-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/legal/refund" className="hover:text-teal-400 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 font-heading">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start group">
                <MapPin className="h-5 w-5 text-teal-500 mr-3 shrink-0 group-hover:text-teal-400 transition-colors mt-0.5" />
                <span className="group-hover:text-slate-300 transition-colors">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center group">
                <Phone className="h-5 w-5 text-teal-500 mr-3 shrink-0 group-hover:text-teal-400 transition-colors" />
                <span className="group-hover:text-slate-300 transition-colors">{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center group">
                <Mail className="h-5 w-5 text-teal-500 mr-3 shrink-0 group-hover:text-teal-400 transition-colors" />
                <span className="group-hover:text-slate-300 transition-colors">{CONTACT_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} Enlighten Pharma Academy. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed for Excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
