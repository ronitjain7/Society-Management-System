import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import StatCard from '../components/StatCard';
import { Building2, Users, AlertCircle, Calendar } from 'lucide-react';
import './DashboardHome.css';

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    flats: 0,
    residents: 0,
    complaints: 0,
    bookings: 0
  });
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user.resident_type === 'Admin') {
          const [fRes, cRes] = await Promise.all([
            client.get('/flats'),
            client.get('/complaints')
          ]);
          setStats({
            flats: fRes.data.length,
            residents: 'N/A', // Would need a resident list API
            complaints: cRes.data.filter(c => c.status === 'Open').length,
            bookings: 0
          });
        }
        
        const nRes = await client.get('/notices');
        setNotices(nRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      }
    };
    fetchDashboardData();
  }, [user]);

  return (
    <div className="dashboard-home">
      <div className="welcome-section">
        <h1>Welcome back, {user.name}</h1>
        <p>Here's what's happening in the society today.</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Flats" value={stats.flats} icon={<Building2 />} color="#4f46e5" />
        <StatCard title="Active Complaints" value={stats.complaints} icon={<AlertCircle />} color="#ef4444" />
        <StatCard title="Upcoming Bookings" value={stats.bookings} icon={<Calendar />} color="#10b981" />
        <StatCard title="Total Residents" value={stats.residents} icon={<Users />} color="#6366f1" />
      </div>

      <div className="dashboard-content">
        <div className="notice-board">
          <h2>Recent Notices</h2>
          <div className="notice-list">
            {notices.length > 0 ? notices.map(notice => (
              <div key={notice.notice_id} className="notice-item">
                <h4>{notice.title}</h4>
                <p>{notice.content}</p>
                <span>{new Date(notice.date).toLocaleDateString()}</span>
              </div>
            )) : <p>No notices available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
