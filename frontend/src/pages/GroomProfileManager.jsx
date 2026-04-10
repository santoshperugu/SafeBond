import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ShieldCheck, User, Save, Upload, Eye, 
  MapPin, Briefcase, GraduationCap, Calendar,
  CheckCircle2, AlertCircle, Trash2, Edit3, ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const GroomProfileManager = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    gender: 'male',
    dob: '',
    occupation: '',
    education: '',
    city: '',
    state: '',
    religion: '',
    pincode: '',
    address: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(data);
        setFormData({
          gender: data.gender || 'male',
          dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
          occupation: data.occupation || '',
          education: data.education || '',
          city: data.city || '',
          state: data.state || '',
          religion: data.religion || '',
          pincode: data.pincode || '',
          address: data.address || ''
        });
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error("Error fetching profile details");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.post('/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(data);
      toast.success("Profile Authenticated & Saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-32 pb-20 px-6 sm:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-4">
              Manage <span className="text-primary-500">Identity.</span>
            </h1>
            <p className="text-slate-500 font-medium">Refine your presentation to attract verified security-conscious matches.</p>
          </div>
          <button 
            onClick={() => navigate('/groom/dashboard')}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-all uppercase font-black text-[10px] tracking-widest bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800 hover:border-slate-700"
          >
            <ChevronLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Editor Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7"
          >
            <form onSubmit={handleUpdate} className="bg-slate-900 shadow-2xl rounded-[3rem] p-10 border border-slate-800 space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black uppercase tracking-widest text-slate-400">Profile Credentials</h2>
                <div className="flex items-center space-x-2 text-green-500 bg-green-500/10 px-4 py-1 rounded-full border border-green-500/20">
                  <CheckCircle2 size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Auto-Encrypting</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField label="Occupation" value={formData.occupation} icon={<Briefcase />} 
                  onChange={(e) => setFormData({...formData, occupation: e.target.value})} placeholder="Software Architect" />
                
                <InputField label="Education" value={formData.education} icon={<GraduationCap />} 
                  onChange={(e) => setFormData({...formData, education: e.target.value})} placeholder="Master of Engineering" />
                
                <InputField label="City" value={formData.city} icon={<MapPin />} 
                  onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="Mumbai" />
                
                <InputField label="Religion" value={formData.religion} icon={<User />} 
                  onChange={(e) => setFormData({...formData, religion: e.target.value})} placeholder="Any / Specific" />

                <InputField label="Birth Date" value={formData.dob} icon={<Calendar />} type="date"
                  onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                
                <InputField label="Pincode" value={formData.pincode} icon={<Edit3 />} 
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})} placeholder="400001" />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Bio / Narrative</label>
                <textarea 
                   className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 text-white text-sm font-medium focus:border-primary-500 outline-none h-40 resize-none transition-colors"
                   placeholder="Describe your values and expectations from a life bond..."
                   value={formData.address}
                   onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <button type="button" className="flex items-center space-x-2 text-slate-600 hover:text-red-400 transition-colors uppercase font-black text-[10px] tracking-widest">
                  <Trash2 size={16} />
                  <span>Reset Changes</span>
                </button>
                <button 
                  disabled={saving}
                  type="submit" 
                  className="bg-primary-600 hover:bg-primary-500 text-white font-black px-12 py-5 rounded-2xl flex items-center transition-all shadow-2xl shadow-primary-500/20 uppercase text-xs tracking-[0.2em]"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={18} className="mr-3" /> Commit Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Right Column: Preview Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8">
                 <Eye className="text-slate-800 group-hover:text-primary-500/20 transition-colors" size={64} />
               </div>

               <h2 className="text-xl font-black mb-8 tracking-tight relative z-10 flex items-center">
                 <Sparkles className="text-primary-400 mr-3" size={20} /> Identity Preview
               </h2>

               <div className="relative z-10">
                 <div className="w-full h-80 bg-slate-800 rounded-[2.5rem] mb-8 overflow-hidden relative border border-slate-700">
                    <img 
                      src={`https://i.pravatar.cc/800?u=${user?.email}`} 
                      className="w-full h-full object-cover opacity-80"
                      alt="Preview"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <h3 className="text-3xl font-black text-white">{user?.firstName} {user?.lastName}</h3>
                      <p className="text-primary-400 text-[10px] font-black uppercase tracking-widest mt-1">Verified Member • {formData.city || 'Location'}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <PreviewRow label="Current Role" value="Groom Portfolio" />
                    <PreviewRow label="Profession" value={formData.occupation || 'Executive'} />
                    <PreviewRow label="Verified Status" value={profile?.verificationStatus || 'Pending'} isStatus />
                 </div>

                 <div className="mt-12 p-8 bg-slate-950/50 rounded-3xl border border-dashed border-slate-800 flex flex-col items-center text-center">
                   <Upload className="text-slate-700 mb-4" size={32} />
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-loose">
                     Manage Official Documents <br /> 
                     <span className="text-primary-500 hover:underline cursor-pointer">In the Vault Portal</span>
                   </p>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, icon, placeholder, type = "text" }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 group-focus-within:text-primary-400 transition-colors">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-primary-500 transition-colors">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <input 
        type={type}
        className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-5 pl-14 pr-6 text-white text-sm font-bold focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all placeholder:text-slate-700"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

const PreviewRow = ({ label, value, isStatus }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
    <span className={`text-sm font-bold ${isStatus ? 'text-primary-400' : 'text-slate-200'}`}>{value}</span>
  </div>
);

const Sparkles = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"></path>
    <path d="m19 10.5-2 2"></path>
    <path d="m20 8-3 3"></path>
    <path d="m15 8.5 2 2"></path>
  </svg>
);

export default GroomProfileManager;
