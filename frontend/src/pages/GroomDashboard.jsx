import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  ShieldCheck, User, Search, Settings, 
  MessageSquare, Heart, Bell, Activity,
  ArrowUpRight, Target, Zap, MapPin
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const GroomDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(data);
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error("Error fetching Groom profile");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-primary-500"></div>
          <ShieldCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-500" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-32 pb-20 px-6 sm:px-12 font-sans selection:bg-primary-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-900/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-primary-500/10 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-primary-500/20">
                Groom Console v1.0
              </span>
              <span className="flex items-center text-green-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" /> Live System
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
              Dashboard <span className="text-slate-500">Overview.</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium">Welcome back, {user?.firstName}. Your matrimonial mission is active.</p>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/groom/explore')}
              className="px-8 py-4 bg-primary-600 hover:bg-primary-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary-500/20 flex items-center"
            >
              <Search size={16} className="mr-2" /> Start Browsing
            </button>
            <button 
              onClick={() => navigate('/groom/profile')}
              className="px-8 py-4 bg-slate-900 border border-slate-800 hover:border-primary-500/50 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center group"
            >
              <User size={16} className="mr-2 text-primary-400 group-hover:scale-110 transition-transform" /> Manage Profile
            </button>
            <button className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-colors relative">
              <Bell size={20} className="text-slate-400" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-primary-500 rounded-full border-2 border-slate-900" />
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { label: 'Trust Score', value: profile?.completeness || '33%', icon: <ShieldCheck className="text-primary-400" />, trend: '+2.4%' },
            { label: 'Active Matches', value: '12', icon: <Heart className="text-secondary" />, trend: 'New' },
            { label: 'System Reach', value: '458', icon: <Zap className="text-yellow-400" />, trend: '+12%' },
            { label: 'Pending Docs', value: profile?.verificationStatus === 'Verified' ? '0' : '2', icon: <Activity className="text-accent-400" />, trend: 'Required' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-slate-800 rounded-2xl group-hover:bg-slate-700 transition-colors">
                  {stat.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-primary-400'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Central Panel */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
               className="bg-slate-900/50 backdrop-blur-xl rounded-[3rem] p-10 border border-slate-800"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black tracking-tighter flex items-center">
                  <Target className="text-primary-500 mr-4" /> Profile Strategy
                </h2>
                <Link to="/groom/profile" className="text-xs font-black uppercase tracking-widest text-primary-400 hover:text-primary-300">
                  Update Profile
                </Link>
              </div>

              {profile ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-slate-950/50 rounded-3xl border border-slate-800/50">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Primary Listing</p>
                      <h4 className="text-xl font-bold mb-4">{profile.occupation || 'Executive'}</h4>
                      <div className="flex items-center text-sm text-slate-400 font-bold">
                        <MapPin size={14} className="mr-2" /> {profile.city || 'Mumbai, IN'}
                      </div>
                    </div>
                    <div className="p-8 bg-slate-950/50 rounded-3xl border border-slate-800/50">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Discovery Status</p>
                      <div className="flex items-center space-x-2">
                         <span className="text-2xl font-black">Visible</span>
                         <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary-600/10 p-8 rounded-3xl border border-primary-500/20 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400">
                        <ShieldCheck size={32} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black tracking-tight">System Integrity</h4>
                        <p className="text-sm text-slate-400 font-medium">Your account is under protective monitoring.</p>
                      </div>
                    </div>
                    <ArrowUpRight className="text-slate-700" size={32} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-950/30 rounded-[2.5rem] border border-dashed border-slate-800">
                   <User className="mx-auto text-slate-700 mb-6" size={64} />
                   <h3 className="text-xl font-black mb-4 uppercase tracking-widest">Initialization Required</h3>
                   <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">Your groom profile has not been fully initialized for the discovery system.</p>
                   <button 
                    onClick={() => navigate('/groom/profile')}
                    className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-xl"
                   >
                     Setup Profile
                   </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
             <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
               className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 overflow-hidden relative group"
             >
                <div className="absolute top-0 right-0 p-8 text-primary-900/10 group-hover:text-primary-500/10 transition-colors">
                  <MessageSquare size={120} />
                </div>
                <h3 className="text-xl font-black mb-1 tracking-tight relative z-10">Secure Messages</h3>
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-8 relative z-10">Encrypted Channel</p>
                
                <div className="space-y-4 mb-8 relative z-10">
                  <p className="text-slate-500 text-sm font-medium">No active communications. Enhance your profile to attract more matches.</p>
                </div>
                
                <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all text-slate-400 hover:text-white relative z-10">
                  Open Vault
                </button>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
               className="bg-gradient-to-br from-primary-900/40 to-slate-900 border border-primary-500/20 rounded-[3rem] p-10 relative overflow-hidden"
             >
               <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]" />
               <h3 className="text-3xl font-black tracking-tighter mb-4 relative z-10 leading-none">Upgrade to <span className="text-primary-400">Titan.</span></h3>
               <p className="text-slate-400 text-sm font-medium mb-10 relative z-10">Unlock direct document verification and titanium trust badge.</p>
               <button className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl relative z-10">
                 Explore Tiers
               </button>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroomDashboard;
