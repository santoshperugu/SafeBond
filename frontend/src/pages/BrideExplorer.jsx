import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ShieldCheck, MapPin, Briefcase, GraduationCap, 
  Heart, User, Filter, Search, ChevronDown, 
  Sparkles, Star, HeartPulse, ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const GroomCard = ({ profile, index }) => {
  const navigate = useNavigate();
  if (!profile) return null;
  
  const user = profile.user || {};
  const imgIndex = parseInt(profile._id.toString().slice(-2), 16) % 99;
  const avatarUrl = `https://randomuser.me/api/portraits/men/${imgIndex}.jpg`;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className="bg-white border border-rose-100 rounded-[2.5rem] overflow-hidden group hover:border-rose-400/50 transition-all duration-500 shadow-[0_20px_50px_rgba(225,29,72,0.05)]"
    >
      <div className="h-72 relative overflow-hidden bg-rose-50/30">
        <motion.img 
          src={avatarUrl} 
          alt={user.firstName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mx-auto"
          onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Groom&background=0F172A&color=fff'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
        
        {/* Verification Status */}
        <div className="absolute top-6 left-6 flex flex-col space-y-2 items-start">
          {profile.verificationStatus === 'Verified' && (
            <div className="flex items-center bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-100">
              <ShieldCheck size={14} className="text-rose-500 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Verified Groom</span>
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
            <span className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
              Match Alpha
            </span>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {user.firstName || 'Secret'} {user.lastName || 'Profile'}
            </h3>
            <p className="text-rose-500 text-xs font-black uppercase tracking-widest mt-1">
              {profile.religion || 'Member'} • {profile.dob ? (new Date().getFullYear() - new Date(profile.dob).getFullYear()) : '28'} Yrs
            </p>
          </div>
          <button className="text-rose-100 hover:text-rose-500 p-2 transition-colors">
            <HeartPulse size={24} />
          </button>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center text-sm text-slate-500">
            <Briefcase size={16} className="text-rose-200 mr-3" />
            <span className="font-medium">{profile.occupation || 'Professional'}</span>
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <MapPin size={16} className="text-rose-200 mr-3" />
            <span className="font-medium">{profile.city || 'Confidential'}</span>
          </div>
        </div>

        <button 
          onClick={() => navigate(`/profile/${profile._id}`)}
          className="w-full py-4 bg-slate-900 hover:bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200"
        >
          Explore Profile
        </button>
      </div>
    </motion.div>
  );
};

const BrideExplorer = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/profiles/public');
        // Specifically filter for Grooms in the Bride Explorer
        const grooms = data.filter(p => p.user?.role === 'groom');
        setProfiles(grooms);
      } catch (error) {
        toast.error("Matchmaking system offline");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const filteredGrooms = profiles.filter(p => 
    `${p.user?.firstName} ${p.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.occupation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff5f5] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center"
        >
          <Sparkles className="text-rose-500 mb-6" size={48} />
          <p className="text-rose-400 text-xs font-black uppercase tracking-[0.3em]">Curation in progress...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff5f5] text-slate-900 pt-40 pb-20 px-6 sm:px-12 font-sans selection:bg-rose-200">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="mb-8 flex items-center space-x-2 text-rose-300 hover:text-rose-600 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-rose-50 flex items-center justify-center group-hover:border-rose-200 transition-colors shadow-sm">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Dashboard</span>
        </motion.button>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-12">
          <div className="max-w-2xl text-left">
             <div className="flex items-center space-x-2 text-rose-500 mb-6">
               <Star size={16} fill="currentColor" />
               <span className="text-[10px] font-black uppercase tracking-widest">Silk Suite Discovery</span>
             </div>
             <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 leading-none text-slate-900">
               Divine <span className="text-rose-600">Proposals.</span>
             </h1>
             <p className="text-xl text-slate-500 font-medium leading-relaxed">
               Exclusively selected Groom profiles with high trust scores. Every match is a step towards a secure legacy.
             </p>
          </div>

          <div className="w-full lg:w-[400px] relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-rose-300 group-focus-within:text-rose-500 transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text"
              placeholder="Search by city, name, or occupation..."
              className="w-full bg-white border border-rose-100 rounded-[1.5rem] py-5 pl-16 pr-6 focus:ring-4 focus:ring-rose-500/5 focus:border-rose-400 transition-all outline-none font-bold text-slate-900 placeholder:text-rose-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mb-12 flex flex-wrap gap-4">
           {['Religion', 'Legacy', 'Profession', 'Region'].map(filter => (
             <button key={filter} className="flex items-center space-x-3 bg-white px-6 py-3 rounded-2xl border border-rose-100 hover:border-rose-300 transition-colors group">
               <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-600 transition-colors">{filter}</span>
               <ChevronDown size={14} className="text-rose-200 group-hover:text-rose-500" />
             </button>
           ))}
           <button className="flex items-center space-x-3 bg-rose-600 text-white px-6 py-3 rounded-2xl border border-rose-500 ml-auto shadow-xl shadow-rose-600/20">
             <Filter size={16} />
             <span className="text-xs font-black uppercase tracking-widest">Premium Search</span>
           </button>
        </div>

        {/* Grid Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredGrooms.map((groom, idx) => (
              <GroomCard key={groom._id} profile={groom} index={idx} />
            ))}
          </AnimatePresence>
        </div>

        {filteredGrooms.length === 0 && (
          <div className="text-center py-40 bg-white/50 rounded-[4rem] border border-rose-100">
             <User className="mx-auto text-rose-100 mb-8" size={80} />
             <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Matches Incoming</h3>
             <p className="text-slate-500 font-medium italic">Our curators are currently verifying a new batch of noble profiles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrideExplorer;
