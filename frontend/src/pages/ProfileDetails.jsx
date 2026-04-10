import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ShieldCheck, MapPin, Briefcase, GraduationCap, 
  Heart, Calendar, User, ArrowLeft, Send, 
  CheckCircle2, AlertCircle, Clock, ShieldAlert,
  FileWarning, AlertTriangle, Lock, ChevronDown,
  ChevronUp, FileSearch, Gavel, ScrollText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [bgReport, setBgReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/api/profile/${id}`);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile details:", error);
        toast.error("Failed to load profile details");
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, navigate]);

  const handleViewReport = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to view the background report');
      return;
    }
    if (bgReport) {
      setReportOpen(!reportOpen);
      return;
    }
    setLoadingReport(true);
    try {
      const { data } = await axios.get(`/api/background/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBgReport(data);
      setReportOpen(true);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Could not load background report';
      toast.error(errMsg);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please re-login.');
      }
    } finally {
      setLoadingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mb-4"></div>
          <p className="text-slate-500 font-bold">Safeguarding Profile Data...</p>
        </div>
      </div>
    );
  }

  if (!profile || !profile.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900">Profile Not Found</h3>
          <button onClick={() => navigate('/explore')} className="mt-4 text-primary-500 font-bold underline">Return to Explore</button>
        </div>
      </div>
    );
  }

  const user = profile.user || {};
  const isBride = user.role === 'bride';
  const imgIndex = parseInt(profile._id.toString().slice(-2), 16) % 99;
  const avatarUrl = isBride 
    ? `https://randomuser.me/api/portraits/women/${imgIndex}.jpg` 
    : `https://randomuser.me/api/portraits/men/${imgIndex}.jpg`;
  const bg = bgReport?.backgroundCheck || profile?.backgroundCheck;
  const statusColors = {
    'Clear':       'bg-green-100 text-green-700 border-green-200',
    'Minor Flag':  'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Alert':       'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/explore')}
          className="flex items-center space-x-2 text-slate-500 hover:text-primary-600 transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={18} />
          <span>Back to Explore</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100"
            >
              <img src={avatarUrl} alt={user.firstName} className="w-full h-[600px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              
              {profile.verificationStatus === 'Verified' && (
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2 shadow-xl border border-green-100">
                  <ShieldCheck size={20} className="text-green-500" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-green-600">Securely Verified</span>
                </div>
              )}

              <div className="absolute bottom-8 left-8">
                <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="flex items-center space-x-3">
                  <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-xl text-white text-xs font-black uppercase tracking-widest border border-white/30">
                    {user.role}
                  </span>
                  <span className="bg-primary-500/80 backdrop-blur-md px-4 py-1.5 rounded-xl text-white text-xs font-black uppercase tracking-widest">
                    {new Date().getFullYear() - new Date(profile.dob).getFullYear()} Years
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100"
            >
              <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-widest">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-primary-50 rounded-3xl transition-all group border border-transparent hover:border-primary-100">
                  <Send className="text-slate-400 group-hover:text-primary-500 mb-2 transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-primary-600">Message</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-secondary-50 rounded-3xl transition-all group border border-transparent hover:border-secondary-100">
                  <Heart className="text-slate-400 group-hover:text-secondary mb-2 transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-secondary-600">Shortlist</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* About Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100"
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
                  <User size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">About {user.firstName}</h2>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed font-medium italic mb-10">
                "{profile.address || 'An individual who values integrity, growth, and meaningful connections in the journey of life.'}"
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DetailItem icon={<Briefcase />} label="Occupation" value={profile.occupation} />
                <DetailItem icon={<GraduationCap />} label="Education" value={profile.education} />
                <DetailItem icon={<MapPin />} label="Location" value={`${profile.city}, ${profile.state}`} />
                <DetailItem icon={<Calendar />} label="Religion" value={profile.religion} />
              </div>
            </motion.section>

            {/* Bond Verification Ledger */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              
              <div className="flex items-center space-x-3 mb-10 relative">
                <div className="w-12 h-12 bg-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Bond Verification Ledger</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Proof of Authenticity</p>
                </div>
              </div>

              <div className="space-y-6 relative">
                <VerificationStep label="Identity Verified" status="completed" date="March 12, 2024" />
                <VerificationStep label="Education Authenticated" status="completed" date="March 14, 2024" />
                <VerificationStep 
                  label="Background Check Status" 
                  status={!bg || bg.clearedStatus === 'Clear' ? 'completed' : 'pending'} 
                  date={!bg || bg.clearedStatus === 'Clear' ? 'March 15, 2024' : 'Action Required'} 
                />
                <VerificationStep label="Digital Signature Authenticated" status="pending" date="Processing..." />
              </div>

              <div className="mt-12 pt-10 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Trust Score</p>
                  <p className={`text-3xl font-black ${
                    !bg ? 'text-primary-400' :
                    bg.clearedStatus === 'Clear' ? 'text-green-400' :
                    bg.clearedStatus === 'Minor Flag' ? 'text-yellow-400' :
                    'text-red-500'
                  }`}>
                    {!bg ? '98.4%' : 
                     bg.clearedStatus === 'Clear' ? '98.4%' :
                     bg.clearedStatus === 'Minor Flag' ? '72.1%' : 
                     '34.8%'}
                  </p>
                </div>
                <button
                  onClick={handleViewReport}
                  disabled={loadingReport}
                  className="flex items-center space-x-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all disabled:opacity-60"
                >
                  {loadingReport ? (
                    <><div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /><span>Loading...</span></>
                  ) : !isAuthenticated ? (
                    <><Lock size={14} /><span>Login to View Report</span></>
                  ) : (
                    <><FileSearch size={14} /><span>View Background Report</span>{reportOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</>
                  )}
                </button>
              </div>
            </motion.section>

            {/* Background Report Panel */}
            <AnimatePresence>
              {reportOpen && bgReport && (
                <motion.section
                  key="bg-report"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-[3rem] border overflow-hidden shadow-2xl"
                >
                  {/* Report Header */}
                  <div className={`px-10 py-6 flex items-center justify-between border-b ${
                    bg?.clearedStatus === 'Clear' ? 'bg-green-50 border-green-200' :
                    bg?.clearedStatus === 'Minor Flag' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center space-x-4">
                      {bg?.clearedStatus === 'Clear' ? <ShieldCheck size={28} className="text-green-600" /> :
                       bg?.clearedStatus === 'Minor Flag' ? <AlertTriangle size={28} className="text-yellow-600" /> :
                       <ShieldAlert size={28} className="text-red-600" />}
                      <div>
                        <h3 className="text-xl font-black text-slate-900">Background Check Report</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                          Conducted: {bg?.checkConductedOn ? new Date(bg.checkConductedOn).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) : 'On file'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${statusColors[bg?.clearedStatus] || statusColors['Clear']}`}>
                      {bg?.clearedStatus || 'Clear'}
                    </span>
                  </div>

                  <div className="bg-white p-10 space-y-10">

                    {/* Police Cases */}
                    <ReportSection
                      icon={<Gavel size={20} />}
                      title="Police Cases"
                      color="blue"
                      empty={!bg?.policeCases?.length}
                      emptyText="No police cases on record"
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                              <th className="pb-3 text-left">Case No.</th>
                              <th className="pb-3 text-left">Date</th>
                              <th className="pb-3 text-left">Description</th>
                              <th className="pb-3 text-left">Court</th>
                              <th className="pb-3 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {bg?.policeCases?.map((c, i) => (
                              <tr key={i} className="text-slate-700">
                                <td className="py-3 font-bold text-slate-900">{c.caseNo}</td>
                                <td className="py-3 text-slate-500">{c.date}</td>
                                <td className="py-3">{c.description}</td>
                                <td className="py-3 text-slate-500">{c.court}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${c.status === 'Closed' || c.status === 'Acquitted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {c.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ReportSection>

                    {/* FIR Records */}
                    <ReportSection
                      icon={<FileWarning size={20} />}
                      title="FIR Records"
                      color="orange"
                      empty={!bg?.firs?.length}
                      emptyText="No FIR records on file"
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                              <th className="pb-3 text-left">FIR No.</th>
                              <th className="pb-3 text-left">Station</th>
                              <th className="pb-3 text-left">Date</th>
                              <th className="pb-3 text-left">Charge</th>
                              <th className="pb-3 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {bg?.firs?.map((f, i) => (
                              <tr key={i} className="text-slate-700">
                                <td className="py-3 font-bold text-slate-900">{f.firNo}</td>
                                <td className="py-3 text-slate-500">{f.station}</td>
                                <td className="py-3 text-slate-500">{f.date}</td>
                                <td className="py-3">{f.charge}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${f.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {f.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ReportSection>

                    {/* Complaints */}
                    <ReportSection
                      icon={<ScrollText size={20} />}
                      title="Registered Complaints"
                      color="purple"
                      empty={!bg?.complaints?.length}
                      emptyText="No registered complaints on record"
                    >
                      <div className="space-y-3">
                        {bg?.complaints?.map((c, i) => (
                          <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-900 text-sm">{c.complaintNo}</span>
                              <span className="text-xs text-slate-400">{c.date}</span>
                            </div>
                            <p className="text-sm text-slate-600">{c.description}</p>
                            <p className="text-xs text-slate-400 mt-1">Filed by: {c.filedBy}</p>
                          </div>
                        ))}
                      </div>
                    </ReportSection>

                    {/* Admin Remarks */}
                    {bg?.remarks && (
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Admin Remarks</p>
                        <p className="text-slate-700 font-medium leading-relaxed">{bg.remarks}</p>
                      </div>
                    )}

                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      ⚠ This report is for informational purposes only. Data sourced from public records & admin verification.
                    </p>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
};

const ReportSection = ({ icon, title, color, empty, emptyText, children }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div>
      <div className="flex items-center space-x-3 mb-5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        <h4 className="font-black text-slate-900 text-lg">{title}</h4>
        {empty && (
          <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-black rounded-full uppercase tracking-widest">Clear</span>
        )}
      </div>
      {empty ? (
        <div className="flex items-center space-x-2 text-slate-400 text-sm py-4 px-4 bg-green-50 rounded-2xl border border-green-100">
          <CheckCircle2 size={16} className="text-green-500" />
          <span>{emptyText}</span>
        </div>
      ) : children}
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-4">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-0.5">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-slate-900 font-bold text-lg">{value}</p>
    </div>
  </div>
);

const VerificationStep = ({ label, status, date }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center space-x-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
        {status === 'completed' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
      </div>
      <div>
        <p className="text-sm font-bold tracking-tight">{label}</p>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{date}</p>
      </div>
    </div>
    {status === 'completed' && (
      <span className="text-[10px] font-black uppercase tracking-widest text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">Authenticated</span>
    )}
  </div>
);

export default ProfileDetails;
