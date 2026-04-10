import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Heart, Lock, Mail, ChevronRight, User, Sparkles } from 'lucide-react';

const BrideLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post('/api/auth/login', formData);
      dispatch(loginSuccess({ user: res.data, token: res.data.token }));
      toast.success('Silk Suite Accessed');
      navigate('/bride/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fff5f5] relative overflow-hidden font-sans">
      {/* Premium Background Effects: Ruby & Silk Theme */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-100 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-100 rounded-full blur-[120px] opacity-40" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/silk.png')] opacity-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(225,29,72,0.1)]">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div 
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10 }}
              className="w-20 h-20 bg-gradient-to-tr from-rose-500 to-rose-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-500/30 border border-rose-400"
            >
              <Sparkles className="text-white" size={36} />
            </motion.div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">
              Bride <span className="text-rose-600">Portal.</span>
            </h2>
            <p className="text-slate-500 font-medium tracking-tight italic">
              Step into your digital sanctuary of trust and legacy
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 ml-2">Verified Identity</label>
                <input
                  type="email"
                  className="w-full bg-slate-50 border border-rose-100 text-slate-900 rounded-[1.5rem] py-5 px-6 focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all outline-none font-bold placeholder:text-slate-300"
                  placeholder="bride@safebond.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Security Key</label>
                <a href="#" className="text-[10px] text-slate-400 font-black uppercase tracking-widest hover:text-rose-600 transition-colors">Recover Account</a>
              </div>
                <input
                  type="password"
                  className="w-full bg-slate-50 border border-rose-100 text-slate-900 rounded-[1.5rem] py-5 px-6 focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all outline-none font-bold placeholder:text-slate-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-5 rounded-[1.5rem] transition-all flex justify-center items-center shadow-2xl shadow-rose-600/20 text-sm uppercase tracking-[0.3em] mt-10"
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Enter Sanctuary <ChevronRight size={20} className="ml-2" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-12 pt-8 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 font-bold text-sm">
              New Member?{' '}
              <Link to="/register" className="text-rose-600 hover:underline transition-colors">Join SafeBond</Link>
            </p>
            <Link to="/login" className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors group">
              <User size={14} className="group-hover:scale-110 transition-transform" />
              <span>Standard Sign In</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BrideLogin;
