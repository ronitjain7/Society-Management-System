import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await client.get('/stats/summary');
        setData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  if (!data) return <div className="loader">Loading Analytics...</div>;

  const financeLabels = data.finance.map(f => f.status);
  const financeValues = data.finance.map(f => parseFloat(f.total_amount));

  const financeData = {
    labels: financeLabels,
    datasets: [{
      label: 'Amount ($)',
      data: financeValues,
      backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#6366f1'],
    }]
  };

  const complaintData = {
    labels: data.complaints.map(c => c.status),
    datasets: [{
      data: data.complaints.map(c => c.count),
      backgroundColor: ['#f87171', '#fbbf24', '#34d399', '#94a3b8'],
    }]
  };

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Society Analytics</h1>
        <p>Visualizing society health, finances, and occupancy trends.</p>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Maintenance Collection ($)</h3>
          <Bar data={financeData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        
        <div className="chart-card">
          <h3>Complaint Distribution</h3>
          <Pie data={complaintData} />
        </div>

        <div className="chart-card occupancy-card">
          <h3>Occupancy Rate</h3>
          <div className="huge-stat">
            {((data.occupancy.occupied / data.occupancy.total) * 100).toFixed(1)}%
          </div>
          <p>Total Flats: {data.occupancy.total}</p>
          <p>Occupied Slots: {data.occupancy.occupied}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
