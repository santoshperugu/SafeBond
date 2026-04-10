import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ShieldCheck, UserCheck, AlertTriangle, FileText, Activity, Users, Clock, ShieldAlert, Search, Eye, CheckCircle, XCircle, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const Dashboard = () => {
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
        if(error.response?.status !== 404) {
          toast.error("Error fetching profile data");
        }
      } finally {
        setLoading(false);
      }
    };
    if(user?.role !== 'admin') {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Verified': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.firstName}</h1>
            <p className="text-slate-500 mt-1 capitalize text-lg">Role: {user?.role}</p>
          </div>
          {user?.role !== 'admin' && (
            <div className={`px-6 py-3 rounded-full font-semibold flex items-center space-x-2 ${getStatusColor(profile?.verificationStatus)}`}>
              {profile?.verificationStatus === 'Verified' ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
              <span>{profile?.verificationStatus || 'Profile Incomplete'}</span>
            </div>
          )}
        </motion.div>

        {/* Content Section based on role */}
        {user?.role === 'admin' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
             <AdminDashboard token={token} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center"><UserCheck className="mr-3 text-primary-500" /> My Profile</h2>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => navigate('/groom/profile')} // Note: Standard dashboard might need /onboarding or a different profile link, but user asked for "Profile button"
                      className="flex items-center space-x-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg"
                    >
                      <UserCheck size={14} />
                      <span>Manage Profile</span>
                    </button>
                  </div>
                </div>
                
                {profile ? (
                  <div className="space-y-8">
                    {/* Trust Score Gauge */}
                    <div className="p-6 bg-slate-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary-500/30 transition-all"></div>
                       <div className="z-10 text-center md:text-left">
                         <h3 className="text-sm font-black uppercase tracking-tighter text-primary-400 mb-1">Your Trust Score</h3>
                         <p className="text-4xl font-black">{profile.trustScore || 0}%</p>
                         <p className="text-xs text-slate-400 mt-2 max-w-xs">Complete all verification steps to reach 100% and get your SafeBond™ Verification Badge.</p>
                       </div>
                       <div className="z-10 w-full md:w-64 h-3 bg-slate-800 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-primary-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all duration-1000" 
                           style={{ width: `${profile.trustScore || 0}%` }}
                         ></div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-sm text-slate-500 mb-1">Gender</p>
                        <p className="font-semibold">{profile.gender || 'Not specified'}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-sm text-slate-500 mb-1">Education</p>
                        <p className="font-semibold">{profile.education || 'Not specified'}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl md:col-span-2">
                        <p className="text-sm text-slate-500 mb-1">Occupation</p>
                        <p className="font-semibold">{profile.occupation || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="inline-block p-4 bg-primary-50 rounded-full mb-4 mx-auto text-primary-500">
                      <FileText size={32} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
                    <p className="text-slate-500 mb-6">You need to set up your profile and upload documents for verification.</p>
                    <button onClick={() => navigate('/onboarding')} className="btn-primary">Start Onboarding</button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar column */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Activity className="mr-3 text-secondary" /> Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 bg-primary-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Account created</p>
                      <span className="text-xs text-slate-500">Just now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};


// Sub-component for Admin to keep file neat
const AdminDashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Setup Socket for Real-time Updates
    const socket = io('');
    
    socket.on('stats_update', (data) => {
      console.log('Real-time statistics update received:', data);
      fetchData(); // Refresh both stats and user list
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const handleVerify = async (profileId, status) => {
    try {
      await axios.put(`/api/admin/verify/${profileId}`, 
        { status, remarks: `Verified by Admin on ${new Date().toLocaleDateString()}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Profile status updated to ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.firstName + ' ' + u.lastName + ' ' + u.email).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || (u.profile?.verificationStatus === filterStatus);
    return matchesSearch && matchesFilter;
  });

  if (loading) return <p className="p-8">Loading data...</p>;

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: stats?.totalUsers, icon: <Users />, color: 'bg-blue-500', filter: 'All' },
          { label: 'Pending Profiles', value: stats?.pendingProfiles, icon: <Clock />, color: 'bg-amber-500', filter: 'Pending' },
          { label: 'Verified Members', value: stats?.verifiedProfiles, icon: <ShieldCheck />, color: 'bg-emerald-500', filter: 'Verified' },
          { label: 'Rejected/Flags', value: stats?.rejectedProfiles, icon: <ShieldAlert />, color: 'bg-rose-500', filter: 'Rejected' }
        ].map((item, i) => (
          <div 
            key={i} 
            onClick={() => setFilterStatus(item.filter)}
            className={`p-6 rounded-2xl shadow-sm border transition-all cursor-pointer hover:shadow-md active:scale-95 ${
              filterStatus === item.filter ? 'bg-slate-100 border-primary-500 ring-1 ring-primary-500' : 'bg-white border-slate-100'
            } flex items-center space-x-4`}
          >
            <div className={`${item.color} p-3 rounded-2xl text-white`}>
              {React.cloneElement(item.icon, { size: 24 })}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{item.label}</p>
              <p className="text-2xl font-bold text-slate-900">{item.value || 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* User Directory */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">User Directory</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-full md:w-64"
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border-none text-sm font-medium rounded-xl px-4 py-2"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Verification</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase">
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'bride' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {u.profile?.verificationStatus === 'Verified' ? (
                        <span className="flex items-center text-emerald-600 text-xs font-bold italic">
                          <CheckCircle size={14} className="mr-1" /> Verified
                        </span>
                      ) : u.profile?.verificationStatus === 'Pending' ? (
                        <span className="flex items-center text-amber-600 text-xs font-bold italic">
                          <Clock size={14} className="mr-1" /> Pending
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">No Profile</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      {u.profile && u.profile.verificationStatus !== 'Verified' && (
                        <button 
                          onClick={() => handleVerify(u.profile._id, 'Verified')}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
