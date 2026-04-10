import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BrideDashboard from './pages/BrideDashboard';
import Onboarding from './pages/Onboarding';
import ExploreProfiles from './pages/ExploreProfiles';
import ProfileDetails from './pages/ProfileDetails';
import GroomLogin from './pages/GroomLogin';
import GroomDashboard from './pages/GroomDashboard';
import GroomExplorer from './pages/GroomExplorer';
import GroomProfileManager from './pages/GroomProfileManager';
import BrideLogin from './pages/BrideLogin';
import BrideExplorer from './pages/BrideExplorer';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return (isAuthenticated && user?.role === 'admin') ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Toaster position="top-right" />
        <Navbar />
        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<ExploreProfiles />} />
            <Route path="/profile/:id" element={<ProfileDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/groom/login" element={<GroomLogin />} />
            <Route path="/bride/login" element={<BrideLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/bride/dashboard" element={<PrivateRoute><BrideDashboard /></PrivateRoute>} />
            <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
            
            {/* Groom Panel Routes */}
            <Route path="/groom/dashboard" element={<PrivateRoute><GroomDashboard /></PrivateRoute>} />
            <Route path="/groom/explore" element={<PrivateRoute><GroomExplorer /></PrivateRoute>} />
            <Route path="/groom/profile" element={<PrivateRoute><GroomProfileManager /></PrivateRoute>} />
            <Route path="/bride/explore" element={<PrivateRoute><BrideExplorer /></PrivateRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
