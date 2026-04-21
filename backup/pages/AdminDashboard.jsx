import React from 'react';
import { useStats } from '../../hooks/use-stats';
import { 
  Users, Building, Wrench, Wallet, 
  TrendingUp, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
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
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {trendValue}
        </div>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-slate-500 text-sm font-semibold">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { stats, loading, error } = useStats();

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700">
      Error loading dashboard: {error}
    </div>
  );

  // Financial Chart Data
  const financeData = {
    labels: stats.finance.map(f => f.status),
    datasets: [{
      label: 'Amount (₹)',
      data: stats.finance.map(f => parseFloat(f.total_amount)),
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)', // Paid
        'rgba(244, 63, 94, 0.8)',  // Overdue
        'rgba(245, 158, 11, 0.8)'  // Pending
      ],
      borderRadius: 8
    }]
  };

  // Complaint Chart Data
  const complaintData = {
    labels: stats.complaints.map(c => c.status),
    datasets: [{
      data: stats.complaints.map(c => c.count),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)', // Resolved
        'rgba(245, 158, 11, 0.8)', // In Progress
        'rgba(244, 63, 94, 0.8)'  // Open
      ],
      borderWidth: 0
    }]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Analytics Overview</h2>
          <p className="text-slate-500 font-medium">Real-time management metrics for your society.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all">
          <Activity className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Residents" 
          value="482" 
          icon={Users} 
          trend="up" 
          trendValue="12%" 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Occupancy" 
          value={`${Math.round((stats.occupancy.occupied / stats.occupancy.total) * 100)}%`} 
          icon={Building} 
          trend="up" 
          trendValue="5%" 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Active Complaints" 
          value={stats.complaints.find(c => c.status === 'Open')?.count || 0} 
          icon={Wrench} 
          trend="down" 
          trendValue="8%" 
          color="bg-rose-500" 
        />
        <StatCard 
          title="Revenue Collected" 
          value={`₹${stats.finance.find(f => f.status === 'Paid')?.total_amount?.toLocaleString() || 0}`} 
          icon={Wallet} 
          trend="up" 
          trendValue="24%" 
          color="bg-amber-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-500" />
            Maintenance Revenue Distribution
          </h3>
          <div className="h-64">
            <Bar 
              data={financeData} 
              options={{ 
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } },
                scales: { y: { grid: { display: false } }, x: { grid: { display: false } } }
              }} 
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-500" />
            Complaint Status Breakdown
          </h3>
          <div className="h-64 flex justify-center">
            <Doughnut 
              data={complaintData} 
              options={{ maintainAspectRatio: false }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
