import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Shield, Lock, Mail, ChevronRight, User } from 'lucide-react';

const GroomLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      dispatch(loginSuccess({ user: res.data, token: res.data.token }));
      toast.success('Welcome to the Groom Portal');
      navigate('/groom/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f172a] relative overflow-hidden font-sans">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="bg-slate-900/50 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-20 h-20 bg-gradient-to-tr from-slate-800 to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-slate-700"
            >
              <Shield className="text-primary-400" size={36} />
            </motion.div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">
              Groom <span className="text-primary-400">Portal.</span>
            </h2>
            <p className="text-slate-400 font-medium tracking-tight">
              Access your secure matrimonial command center
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Official Email</label>
                <input
                  type="email"
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-[1.5rem] py-5 px-6 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none font-bold placeholder:text-slate-700"
                  placeholder="groom@safebond.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Security Key</label>
                <a href="#" className="text-[10px] text-primary-400 font-black uppercase tracking-widest hover:text-primary-300 transition-colors">Recover Access</a>
              </div>
                <input
                  type="password"
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-[1.5rem] py-5 px-6 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none font-bold placeholder:text-slate-700"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-5 rounded-[1.5rem] transition-all flex justify-center items-center shadow-2xl shadow-primary-500/20 text-sm uppercase tracking-[0.2em] mt-10"
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Establish Connection <ChevronRight size={20} className="ml-2" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-slate-500 font-bold text-sm">
              New Candidate?{' '}
              <Link to="/register" className="text-white hover:text-primary-400 transition-colors">Register Profile</Link>
            </p>
            <Link to="/login" className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors group">
              <User size={14} className="group-hover:text-primary-400 transition-colors" />
              <span>Standard Login</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GroomLogin;
