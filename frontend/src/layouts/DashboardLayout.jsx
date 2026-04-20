import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  MessageSquare, 
  Calendar, 
  Car, 
  CreditCard, 
  LogOut,
  Bell
} from 'lucide-react';

import DashboardHome from '../pages/DashboardHome';
import Complaints from '../pages/Complaints';
import Flats from '../pages/Flats';
import Maintenance from '../pages/Maintenance';

import './DashboardLayout.css';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard', roles: ['Admin', 'Owner', 'Tenant'] },
    { path: '/flats', icon: <Building2 size={20} />, label: 'Flats', roles: ['Admin'] },
    { path: '/complaints', icon: <MessageSquare size={20} />, label: 'Complaints', roles: ['Admin', 'Owner', 'Tenant'] },
    { path: '/maintenance', icon: <CreditCard size={20} />, label: 'Maintenance', roles: ['Admin', 'Owner', 'Tenant'] },
    { path: '/bookings', icon: <Calendar size={20} />, label: 'Bookings', roles: ['Owner', 'Tenant'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.resident_type));

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Smart Society</h2>
        </div>
        
        <nav className="sidebar-nav">
          {filteredMenu.map((item) => (
            <Link key={item.path} to={item.path} className="nav-item">
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <div className="header-user">
            <span>Welcome, <strong>{user?.name}</strong></span>
            <span className="role-badge">{user?.resident_type}</span>
          </div>
        </header>
        
        <section className="content-area">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/flats" element={<Flats />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/bookings" element={<div>Bookings coming in Step 9</div>} />
            <Route path="/notices" element={<div>Notice details coming soon</div>} />
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
