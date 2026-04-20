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
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const common = [
      { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { path: '/notices', icon: <Bell size={20} />, label: 'Notices' },
    ];

    if (user?.resident_type === 'Admin') {
      return [
        ...common,
        { path: '/flats', icon: <Building2 size={20} />, label: 'Flats' },
        { path: '/residents', icon: <Users size={20} />, label: 'Residents' },
        { path: '/maintenance', icon: <CreditCard size={20} />, label: 'Billing' },
      ];
    }

    if (user?.resident_type === 'Owner' || user?.resident_type === 'Tenant') {
      return [
        ...common,
        { path: '/bookings', icon: <Calendar size={20} />, label: 'My Bookings' },
        { path: '/complaints', icon: <MessageSquare size={20} />, label: 'My Complaints' },
        { path: '/vehicles', icon: <Car size={20} />, label: 'My Vehicles' },
      ];
    }

    return common;
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Smart Society</h2>
        </div>
        
        <nav className="sidebar-nav">
          {getMenuItems().map((item) => (
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
            <Route path="/" element={<div>Dashboard Home (Phase 6 Implementation)</div>} />
            <Route path="/notices" element={<div>Notices coming soon</div>} />
            <Route path="/flats" element={<div>Flat Management</div>} />
            {/* Other routes will be filled in Step 8 */}
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
