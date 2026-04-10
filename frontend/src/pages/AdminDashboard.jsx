import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle,
  FileText,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Setup Socket for Real-time Updates
    const socket = io('http://localhost:5000');
    
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
      await axios.put(`http://localhost:5000/api/admin/verify/${profileId}`, 
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
    const matchesFilter = filterStatus === 'All' || 
      (filterStatus === 'NoProfile' ? !u.profile : u.profile?.verificationStatus === filterStatus);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Control Panel</h1>
          <p className="text-slate-500 mt-1">Manage users, monitor trust scores, and verify profiles.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
          {[
            { label: 'Total Users', value: stats?.totalUsers, icon: <Users />, color: 'bg-blue-500', filter: 'All' },
            { label: 'Pending Profiles', value: stats?.pendingProfiles, icon: <Clock />, color: 'bg-amber-500', filter: 'Pending' },
            { label: 'Verified Members', value: stats?.verifiedProfiles, icon: <ShieldCheck />, color: 'bg-emerald-500', filter: 'Verified' },
            { label: 'Rejected/Flags', value: stats?.rejectedProfiles, icon: <ShieldAlert />, color: 'bg-rose-500', filter: 'Rejected' },
            { label: 'Incomplete Profiles', value: (stats?.totalUsers || 0) - (stats?.totalProfiles || 0), icon: <FileText />, color: 'bg-slate-500', filter: 'NoProfile' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              onClick={() => setFilterStatus(item.filter)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-3xl shadow-sm border transition-all cursor-pointer hover:shadow-md active:scale-95 flex items-center space-x-4 ${
                filterStatus === item.filter ? 'bg-slate-100 border-primary-500 ring-1 ring-primary-500' : 'bg-white border-slate-100'
              }`}
            >
              <div className={`${item.color} p-3 rounded-2xl text-white`}>
                {React.cloneElement(item.icon, { size: 24 })}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                <p className="text-2xl font-bold text-slate-900">{item.value || 0}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">User Directory</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 w-full md:w-64"
                />
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-3 py-1">
                <Filter size={16} className="text-slate-400" />
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                  <option value="NoProfile">Incomplete / No Profile</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest">
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
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
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
                          <span className="flex items-center text-emerald-600 text-xs font-bold">
                            <CheckCircle size={14} className="mr-1" /> Verified
                          </span>
                        ) : u.profile?.verificationStatus === 'Pending' ? (
                          <span className="flex items-center text-amber-600 text-xs font-bold">
                            <Clock size={14} className="mr-1" /> Pending
                          </span>
                        ) : u.profile?.verificationStatus === 'Rejected' ? (
                          <span className="flex items-center text-rose-600 text-xs font-bold">
                            <XCircle size={14} className="mr-1" /> Rejected
                          </span>
                        ) : u.profile?.verificationStatus === 'Re-submission Requested' ? (
                          <span className="flex items-center text-amber-600 text-xs font-bold">
                            <Clock size={14} className="mr-1" /> Needs Re-submission
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs font-bold italic">No Profile Created</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {u.profile && (
                          <>
                            {u.profile.verificationStatus !== 'Verified' && (
                              <button 
                                onClick={() => handleVerify(u.profile._id, 'Verified')}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Approve Verification"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                            {u.profile.verificationStatus !== 'Rejected' && (
                              <button 
                                onClick={() => handleVerify(u.profile._id, 'Rejected')}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Reject Profile"
                              >
                                <XCircle size={18} />
                              </button>
                            )}
                          </>
                        )}
                        <button 
                          className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="py-20 text-center text-slate-500">
                <Users size={48} className="mx-auto mb-4 opacity-10" />
                <p>No users found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
