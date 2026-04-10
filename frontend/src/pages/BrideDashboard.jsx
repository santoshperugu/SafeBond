import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  ShieldCheck, User, Search, Settings, 
  MessageCircle, Heart, Bell, Sparkles,
  ArrowUpRight, Flower2, Star, MapPin
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const BrideDashboard = () => {
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
          toast.error("Error fetching Bride profile");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff5f5] flex items-center justify-center">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-24 w-24 border-t-2 border-b-2 border-rose-400"
          />
          <Flower2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-rose-400" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffafa] text-slate-800 pt-32 pb-20 px-6 sm:px-12 font-sans selection:bg-rose-100">
      {/* Background Silk Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-100/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-50/20 rounded-full blur-[120px]" />
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
              <span className="bg-rose-500/10 text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-rose-200">
                Silk Suite Discovery
              </span>
              <span className="flex items-center text-rose-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <Sparkles size={12} className="mr-2 animate-pulse" /> Premium Active
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-slate-900 leading-none">
              The <span className="text-rose-600">Silk</span> Dashboard.
            </h1>
            <p className="text-slate-500 text-lg font-medium">Welcome back, {user?.firstName}. Your matrimonial legacy begins here.</p>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/bride/explore')}
              className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-600/20 flex items-center"
            >
              <Search size={16} className="mr-2" /> Explore Grooms
            </button>
            <button 
              onClick={() => navigate('/onboarding')}
              className="px-8 py-4 bg-white border border-rose-100 hover:border-rose-300 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center group shadow-sm text-slate-700"
            >
              <User size={16} className="mr-2 text-rose-400 group-hover:scale-110 transition-transform" /> Silk Profile
            </button>
            <button className="p-4 bg-white border border-rose-100 rounded-2xl hover:bg-rose-50 transition-colors relative shadow-sm">
              <Bell size={20} className="text-rose-300" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { label: 'Trust Score', value: profile?.completeness || '42%', icon: <ShieldCheck className="text-rose-400" />, trend: 'Rising' },
            { label: 'Noble Matches', value: '08', icon: <Heart className="text-rose-500" />, trend: 'Daily' },
            { label: 'Interest Pool', value: '124', icon: <Star className="text-amber-400" />, trend: '+5' },
            { label: 'Required Steps', value: profile?.verificationStatus === 'Verified' ? 'Done' : 'Update', icon: <Flower2 className="text-rose-300" />, trend: 'Action' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-rose-50 hover:border-rose-200 transition-all group shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-rose-50 rounded-2xl group-hover:bg-rose-100 transition-colors">
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black tracking-tighter text-slate-900">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Central Panel */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
               className="bg-white/70 backdrop-blur-xl rounded-[3rem] p-10 border border-rose-50 shadow-sm"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black tracking-tighter flex items-center text-slate-900">
                   Engagement <span className="text-rose-600 ml-2">Legacy</span>
                </h2>
                <Link to="/onboarding" className="text-xs font-black uppercase tracking-widest text-rose-600 hover:text-rose-700">
                  Refine Identity
                </Link>
              </div>

              {profile ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-rose-50/30 rounded-3xl border border-rose-100/50">
                      <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest mb-2">Heritage Score</p>
                      <h4 className="text-xl font-bold mb-4 text-slate-900">{profile.occupation || 'Consultant'}</h4>
                      <div className="flex items-center text-sm text-slate-500 font-bold">
                        <MapPin size={14} className="mr-2 text-rose-300" /> {profile.city || 'Bangalore, IN'}
                      </div>
                    </div>
                    <div className="p-8 bg-rose-50/30 rounded-3xl border border-rose-100/50">
                      <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest mb-2">Visibility Tier</p>
                      <div className="flex items-center space-x-2">
                         <span className="text-2xl font-black text-slate-900">Premium Silk</span>
                         <span className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.5)]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-rose-600/5 p-8 rounded-3xl border border-rose-200/50 flex items-center justify-between group cursor-pointer hover:bg-rose-600/10 transition-colors">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                        <ShieldCheck size={32} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black tracking-tight text-slate-900">Verification Ledger</h4>
                        <p className="text-sm text-slate-500 font-medium">System verification is currently: {profile.verificationStatus}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="text-rose-200 group-hover:text-rose-500 transition-colors" size={32} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-rose-50/20 rounded-[2.5rem] border border-dashed border-rose-200">
                   <Flower2 className="mx-auto text-rose-200 mb-6" size={64} />
                   <h3 className="text-xl font-black mb-4 uppercase tracking-widest text-slate-900">Silk Suite Incomplete</h3>
                   <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">Complete your discovery profile to unlock premium matches and heritage scores.</p>
                   <button 
                    onClick={() => navigate('/onboarding')}
                    className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20"
                   >
                     Begin Onboarding
                   </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
             <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
               className="bg-white/80 backdrop-blur-xl border border-rose-100 rounded-[3rem] p-8 overflow-hidden relative group shadow-sm"
             >
                <div className="absolute top-0 right-0 p-8 text-rose-500/5 group-hover:text-rose-500/10 transition-colors">
                  <MessageCircle size={120} />
                </div>
                <h3 className="text-xl font-black mb-1 tracking-tight relative z-10 text-slate-900">Silk Messages</h3>
                <p className="text-xs text-rose-400 font-black uppercase tracking-widest mb-8 relative z-10">Private Salon</p>
                
                <div className="space-y-4 mb-8 relative z-10">
                  <p className="text-slate-500 text-sm font-medium italic">"No communications yet. Your noble matches are currently being curated."</p>
                </div>
                
                <button className="w-full py-4 bg-white border border-rose-100 hover:border-rose-400 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all text-rose-400 hover:text-rose-600 relative z-10">
                  Open Salon
                </button>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
               className="bg-gradient-to-br from-rose-600 to-rose-800 border border-rose-500/20 rounded-[3rem] p-10 relative overflow-hidden text-white"
             >
               <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
               <h3 className="text-3xl font-black tracking-tighter mb-4 relative z-10 leading-none">Upgrade to <span className="text-rose-300">Pearl.</span></h3>
               <p className="text-rose-100 text-sm font-medium mb-10 relative z-10">Unlock direct document suites and pearl trust badge for elite heritage.</p>
               <button className="w-full bg-white text-rose-600 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl relative z-10">
                 Elite Tiers
               </button>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrideDashboard;
