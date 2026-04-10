import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Phone } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    role: 'bride'
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      dispatch(loginSuccess({ user: res.data, token: res.data.token }));
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Registration failed'));
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden py-12">
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200/50 rounded-full mix-blend-multiply filter blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create an Account</h2>
            <p className="text-slate-500">Join SafeBond to safely explore verified matches</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="+91 98765 43210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  required
                />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Registering As</label>
              <select
                className="input-field"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="bride">Bride</option>
                <option value="groom">Groom</option>
                <option value="family">Family Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full mt-8 flex justify-center items-center h-12 text-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-semibold hover:underline">
              Sign In
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;
