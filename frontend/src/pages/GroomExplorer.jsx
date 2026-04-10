import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ShieldCheck, MapPin, Briefcase, GraduationCap, 
  Heart, User, Filter, Search, ChevronDown, 
  Sparkles, Star, ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const BrideCard = ({ profile, index }) => {
  const navigate = useNavigate();
  if (!profile) return null;
  
  const user = profile.user || {};
  const imgIndex = parseInt(profile._id.toString().slice(-2), 16) % 99;
  const avatarUrl = `https://randomuser.me/api/portraits/women/${imgIndex}.jpg`;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-primary-500/50 transition-all duration-500 shadow-2xl"
    >
      <div className="h-72 relative overflow-hidden bg-slate-950">
        <motion.img 
          src={avatarUrl} 
          alt={user.firstName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Bride&background=E11D48&color=fff'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        
        {/* Verification Status */}
        <div className="absolute top-6 left-6 flex flex-col space-y-2 items-start">
          {profile.verificationStatus === 'Verified' && (
            <div className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <ShieldCheck size={14} className="text-primary-400 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Trust Verified</span>
            </div>
          )}

          {profile.backgroundCheck?.clearedStatus && (
            <div className={`px-3 py-1.5 rounded-full border backdrop-blur-md flex items-center ${
              profile.backgroundCheck.clearedStatus === 'Alert' ? 'bg-red-500/80 border-red-400' :
              profile.backgroundCheck.clearedStatus === 'Minor Flag' ? 'bg-yellow-400/80 border-yellow-300' :
              'bg-green-500/80 border-green-400'
            }`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                {profile.backgroundCheck.clearedStatus === 'Alert' ? '34.8% Trust' :
                 profile.backgroundCheck.clearedStatus === 'Minor Flag' ? '72.1% Trust' :
                 '98.4% Trust'}
              </span>
            </div>
          )}
        </div>

        <div className="absolute bottom-6 left-6">
          <div className="flex items-center space-x-2">
            <span className="bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
              Featured
            </span>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              {user.firstName || 'Secret'} {user.lastName || 'Profile'}
            </h3>
            <p className="text-primary-400 text-xs font-black uppercase tracking-widest mt-1">
              {profile.religion || 'Member'} • {profile.dob ? (new Date().getFullYear() - new Date(profile.dob).getFullYear()) : '24'} Yrs
            </p>
          </div>
          <button className="text-slate-700 hover:text-secondary p-2 transition-colors">
            <Heart size={24} />
          </button>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center text-sm text-slate-400">
            <Briefcase size={16} className="text-slate-600 mr-3" />
            <span className="font-medium">{profile.occupation || 'Professional'}</span>
          </div>
          <div className="flex items-center text-sm text-slate-400">
            <MapPin size={16} className="text-slate-600 mr-3" />
            <span className="font-medium">{profile.city || 'Confidential'}</span>
          </div>
        </div>

        <button 
          onClick={() => navigate(`/profile/${profile._id}`)}
          className="w-full py-4 bg-slate-800 hover:bg-primary-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
        >
          View Full Credentials
        </button>
      </div>
    </motion.div>
  );
};

const GroomExplorer = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data } = await axios.get('/api/profiles/public');
        // Strictly filter for Brides for Grooms
        const brides = data.filter(p => p.user?.role === 'bride');
        setProfiles(brides);
      } catch (error) {
        toast.error("Discovery system unavailable");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const filteredBrides = profiles.filter(p => 
    `${p.user?.firstName} ${p.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.occupation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center"
        >
          <Sparkles className="text-primary-500 mb-6" size={48} />
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">Synching Diamond Matches...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-40 pb-20 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/groom/dashboard')}
          className="mb-8 flex items-center space-x-2 text-slate-400 hover:text-primary-400 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-primary-500/50 transition-colors">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Command Center</span>
        </motion.button>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-12">
          <div className="max-w-2xl">
             <div className="flex items-center space-x-2 text-primary-400 mb-6">
               <Star size={16} fill="currentColor" />
               <span className="text-[10px] font-black uppercase tracking-widest">Premium Discovery</span>
             </div>
             <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 leading-none">
               Exclusive <span className="text-primary-500">Curations.</span>
             </h1>
             <p className="text-xl text-slate-400 font-medium leading-relaxed">
               Secure access to manually verified profiles. Filtered for highest compatibility and background authenticity.
             </p>
          </div>

          <div className="w-full lg:w-[400px] relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-primary-500 transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text"
              placeholder="Search by city, name, or role..."
              className="w-full bg-slate-900 border border-slate-800 rounded-[1.5rem] py-5 pl-16 pr-6 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none font-bold text-white placeholder:text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mb-12 flex flex-wrap gap-4">
           {['Religion', 'Education', 'Occupation', 'Location'].map(filter => (
             <button key={filter} className="flex items-center space-x-3 bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors group">
               <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{filter}</span>
               <ChevronDown size={14} className="text-slate-700 group-hover:text-primary-400" />
             </button>
           ))}
           <button className="flex items-center space-x-3 bg-primary-600/10 text-primary-400 px-6 py-3 rounded-2xl border border-primary-500/20 ml-auto">
             <Filter size={16} />
             <span className="text-xs font-black uppercase tracking-widest">Advanced Audit</span>
           </button>
        </div>

        {/* Grid Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredBrides.map((bride, idx) => (
              <BrideCard key={bride._id} profile={bride} index={idx} />
            ))}
          </AnimatePresence>
        </div>

        {filteredBrides.length === 0 && (
          <div className="text-center py-40 bg-slate-950/30 rounded-[4rem] border border-slate-900">
             <User className="mx-auto text-slate-800 mb-8" size={80} />
             <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">No Profiles Matched</h3>
             <p className="text-slate-500 font-medium">Try adjusting your search filters to find more secure matches.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroomExplorer;
