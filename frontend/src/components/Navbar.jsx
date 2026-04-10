import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HeartHandshake, LogOut, User as UserIcon, Menu, X, ChevronDown, User, Heart, ChevronRight, ShieldCheck } from 'lucide-react';
import { logout } from '../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'py-4' : 'py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] px-8 py-4 flex justify-between items-center transition-all ${
          scrolled ? 'mx-0' : 'mx-0 md:mx-4'
        }`}>
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-tr from-primary-600 to-accent-500 p-2.5 rounded-2xl text-white transform group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-primary-500/30">
              <HeartHandshake size={24} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">
              Safe<span className="text-primary-600">Bond</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/explore" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">
              Explore
            </Link>
            {!isAuthenticated ? (
              <div className="flex items-center space-x-8">
                {/* Portal Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-slate-600 hover:text-primary-600 font-bold transition-all py-2">
                    <span>Member Portals</span>
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 z-[60]">
                    <div className="bg-white/90 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-4 flex flex-col space-y-2">
                      <Link to="/groom/login" className="flex items-center px-4 py-3 rounded-2xl hover:bg-slate-900 hover:text-white transition-all group/item">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover/item:bg-slate-800 flex items-center justify-center mr-3 text-slate-600 group-hover/item:text-primary-400 transition-colors">
                          <User size={16} />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">Groom Portal</span>
                      </Link>
                      <Link to="/bride/login" className="flex items-center px-4 py-3 rounded-2xl hover:bg-rose-600 hover:text-white transition-all group/item">
                        <div className="w-8 h-8 rounded-xl bg-rose-50 group-hover/item:bg-rose-500 flex items-center justify-center mr-3 text-rose-500 group-hover/item:text-white transition-colors">
                          <Heart size={16} />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">Bride Portal</span>
                      </Link>
                      <div className="h-px bg-slate-100 my-2" />
                      <Link to="/login" className="px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors text-center">
                        Standard Sign In
                      </Link>
                    </div>
                  </div>
                </div>

                <Link to="/register" className="group relative px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10">
                  <div className="absolute inset-0 bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10">Get Started</span>
                </Link>
              </div>
            ) : (
              <>
                {user?.role === 'groom' ? (
                  <>
                    <Link to="/groom/dashboard" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/groom/explore" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">
                      Groom Explorer
                    </Link>
                    <Link to="/groom/profile" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">
                      Profile Manager
                    </Link>
                  </>
                ) : user?.role === 'bride' ? (
                  <>
                    <Link to="/bride/dashboard" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/bride/explore" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">
                      Bride Explorer
                    </Link>
                    <Link to="/onboarding" className="text-slate-600 hover:text-primary-600 font-bold transition-colors">
                      Profile Manager
                    </Link>
                  </>
                ) : user?.role === 'admin' ? (
                  <Link to="/admin/dashboard" className="text-primary-600 hover:text-primary-700 font-black flex items-center transition-colors bg-primary-50 px-4 py-2 rounded-2xl">
                    <ShieldCheck size={18} className="mr-2" /> Admin Panel
                  </Link>
                ) : (
                  <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 font-bold flex items-center transition-colors">
                    <UserIcon size={18} className="mr-2" /> Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-6 border-l-2 pl-6 border-slate-100">
                  <span className="text-sm font-black text-slate-900 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl">
                    {user?.firstName || 'User'}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-4 px-6 md:hidden pointer-events-none"
          >
            <div className="backdrop-blur-2xl bg-white/90 border border-white/40 p-8 rounded-[2.5rem] shadow-2xl space-y-6 pointer-events-auto">
              {!isAuthenticated ? (
                <>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Dedicated Portals</p>
                    <Link to="/groom/login" onClick={() => setMobileMenuOpen(false)} className="block bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-between group">
                      <span>Groom Portal</span>
                      <ChevronRight size={18} className="text-primary-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/bride/login" onClick={() => setMobileMenuOpen(false)} className="block bg-rose-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-between group">
                      <span>Bride Portal</span>
                      <ChevronRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="h-px bg-slate-100 my-4" />
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center text-slate-500 font-bold hover:text-primary-600 transition-colors uppercase text-xs tracking-widest">Standard Sign In</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full py-5 bg-primary-500 text-center text-white font-black rounded-2xl shadow-xl shadow-primary-500/20 uppercase text-xs tracking-widest">Get Started</Link>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Control Center</p>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-black text-slate-900 tracking-tighter">Dashboard</Link>
                    {user?.role === 'groom' ? (
                      <Link to="/groom/explore" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-black text-slate-900 tracking-tighter">Groom Explorer</Link>
                    ) : user?.role === 'bride' ? (
                      <Link to="/bride/explore" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-black text-rose-600 tracking-tighter">Bride Explorer</Link>
                    ) : user?.role === 'admin' ? (
                      <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-black text-primary-600 tracking-tighter">Admin Panel</Link>
                    ) : (
                      <Link to="/explore" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-black text-slate-900 tracking-tighter">Explore Matches</Link>
                    )}
                  </div>
                  <button onClick={handleLogout} className="block w-full py-5 bg-red-50 text-red-500 font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-lg shadow-red-500/5 mt-4">Sign Out</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

