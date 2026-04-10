import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ShieldCheck, MapPin, Briefcase, GraduationCap, Heart, User, Filter, ChevronLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfileCard = ({ profile, index }) => {
  const navigate = useNavigate();
  if (!profile) return null;
  
  const user = profile.user || {};
  const role = user.role || 'user';
  const isBride = role === 'bride';
  
  const imgIndex = parseInt(profile._id.toString().slice(-2), 16) % 99;
  const avatarUrl = isBride 
    ? `https://randomuser.me/api/portraits/women/${imgIndex}.jpg` 
    : `https://randomuser.me/api/portraits/men/${imgIndex}.jpg`;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -12 }}
      className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col group transition-all duration-500"
    >
      {/* Image Section with Advanced Reveal */}
      <div className="h-64 relative overflow-hidden bg-slate-100">
        <motion.img 
          src={avatarUrl} 
          alt={user.firstName || 'User'}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=User&background=random'; }}
        />
        
        {/* Shine/Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Floating Badges */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="absolute top-5 right-5 flex flex-col space-y-2 items-end"
        >
          {profile.verificationStatus === 'Verified' && (
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2 shadow-xl border border-green-100/50">
              <ShieldCheck size={16} className="text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600">Verified</span>
            </div>
          )}

          {profile.backgroundCheck?.clearedStatus && (
            <div className={`px-4 py-2 rounded-full flex items-center space-x-2 shadow-xl border backdrop-blur-md ${
              profile.backgroundCheck.clearedStatus === 'Alert' ? 'bg-red-500/90 text-white border-red-400' :
              profile.backgroundCheck.clearedStatus === 'Minor Flag' ? 'bg-yellow-400/90 text-slate-900 border-yellow-300' :
              'bg-green-500/90 text-white border-green-400'
            }`}>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {profile.backgroundCheck.clearedStatus === 'Alert' ? '34.8% Trust' :
                 profile.backgroundCheck.clearedStatus === 'Minor Flag' ? '72.1% Trust' :
                 '98.4% Trust'}
              </span>
            </div>
          )}
        </motion.div>

        <div className="absolute bottom-5 left-5">
           <div className="bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 shadow-2xl">
            {role}
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-8 flex-grow flex flex-col relative">
        <div className="flex justify-between items-start mb-3">
          <div>
            <motion.h3 
              layout
              className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors"
            >
              {user.firstName || 'Demo'} {user.lastName || 'Profile'}
            </motion.h3>
            <p className="text-primary-500 text-xs font-black uppercase tracking-[0.2em] mt-1 bg-primary-50 inline-block px-3 py-1 rounded-lg">
              {profile.religion || 'Member'} • {profile.dob ? (new Date().getFullYear() - new Date(profile.dob).getFullYear()) : '25'} Yrs
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className="text-slate-200 hover:text-secondary transition-colors p-2"
          >
            <Heart size={28} />
          </motion.button>
        </div>

        <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">
          "{profile.address || 'Looking for a perfect bond based on trust and shared values.'}" 
        </p>

        <div className="space-y-4 mb-8">
          {[
            { icon: <Briefcase size={16} />, text: profile.occupation },
            { icon: <GraduationCap size={16} />, text: profile.education },
            { icon: <MapPin size={16} />, text: profile.city }
          ].map((item, i) => (
            <div key={i} className="flex items-center text-sm text-slate-700 font-bold">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 group-hover:bg-primary-50 flex items-center justify-center mr-4 text-primary-500 transition-colors duration-500">
                {item.icon}
              </div>
              <span className="truncate">{item.text}</span>
            </div>
          ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/profile/${profile._id}`)}
          className="w-full py-4 bg-slate-900 group-hover:bg-primary-600 text-white font-black rounded-2xl transition-all duration-500 shadow-xl shadow-slate-200 group-hover:shadow-primary-500/40 text-xs uppercase tracking-[0.2em]"
        >
          Begin Verification
        </motion.button>
      </div>
    </motion.div>
  );
};

const ExploreProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'groom') setFilter('bride');
      else if (user.role === 'bride') setFilter('groom');
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        console.log("Fetching exploration profiles...");
        const { data } = await axios.get('/api/profiles/public');
        setProfiles(data);
      } catch (error) {
        console.error("Axios Error:", error);
        toast.error(`Failed to fetch profiles: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const filteredProfiles = (Array.isArray(profiles) ? profiles : [])
    .filter(p => p && p._id)
    .filter(p => {
      // If user is logged in and no explicit filter is applied, show only opposite role
      if (filter === 'all' && isAuthenticated && user) {
        return user.role === 'groom' ? p.user?.role === 'bride' : p.user?.role === 'groom';
      }
      return filter === 'all' ? true : p.user?.role === filter;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-primary-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="text-primary-500 animate-pulse" size={32} />
            </div>
          </div>
          <p className="text-slate-900 font-black mt-8 text-xl tracking-[0.3em] uppercase">Securing Bondmates...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-40 pb-20 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="mb-8 flex items-center space-x-2 text-slate-500 hover:text-primary-600 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-primary-50 transition-colors">
            <ChevronLeft size={20} />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em]">Back to Dashboard</span>
        </motion.button>

        {/* Header Section with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-12"
        >
          <div className="max-w-2xl">
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "circOut" }}
              className="h-2 w-32 bg-primary-500 mb-8 rounded-full origin-left"
            />
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
              Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Matches.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Experience the future of matrimonial trust. Every profile is meticulously verified for security and authenticity.
            </p>
          </div>
          
          <div className="flex items-center bg-white p-2 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 backdrop-blur-xl">
            {['all', 'bride', 'groom'].map((type) => (
              <motion.button 
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(type)}
                className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  filter === type 
                  ? 'bg-primary-600 text-white shadow-2xl shadow-primary-500/40' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Profiles Grid with AnimatePresence */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProfiles.map((p, idx) => (
              <ProfileCard key={p._id} profile={p} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProfiles.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-white rounded-[4rem] border border-slate-100 shadow-2xl"
          >
            <div className="p-10 bg-slate-50 inline-block rounded-full text-slate-200 mb-8">
              <User size={100} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Silence in the Vault</h3>
            <p className="text-xl text-slate-400 font-medium tracking-tight">Expand your search horizons to find the perfect bond.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExploreProfiles;
