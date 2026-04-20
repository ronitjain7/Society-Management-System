import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, AlertCircle, CreditCard, TrendingUp, TrendingDown, UserPlus, Bell, Receipt, UserCheck, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

import { useResidents } from "@/hooks/use-residents";
import { useFlats } from "@/hooks/use-flats";
import { useComplaints } from "@/hooks/use-complaints";
import { useMaintenance } from "@/hooks/use-maintenance";
import { useNotices } from "@/hooks/use-notices";
import { useVisitors } from "@/hooks/use-visitors";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { residents, isLoading: isResLoading } = useResidents();
  const { flats, isLoading: isFlatLoading } = useFlats();
  const { complaints, isLoading: isCompLoading } = useComplaints();
  const { bills, isLoading: isMaintLoading } = useMaintenance();
  const { notices, isLoading: isNoticeLoading } = useNotices();
  const { visitors, isLoading: isVisitLoading } = useVisitors();

  const isLoading = isResLoading || isFlatLoading || isCompLoading || isMaintLoading || isNoticeLoading || isVisitLoading;

  // Calculate live stats
  const totalResidents = residents.length;
  const totalFlats = flats.length;
  const pendingComplaints = complaints.filter(c => c.status !== "Resolved").length;
  const dueMaintenance = bills
    .filter(b => b.status === "Pending")
    .reduce((sum, b) => sum + (b.total_amount || 0), 0);

  const statsData = [
    { label: "Total Residents", value: totalResidents, trend: "+12", up: true, icon: Users, color: "text-accent" },
    { label: "Total Flats", value: totalFlats, trend: "+4", up: true, icon: Building, color: "text-primary" },
    { label: "Pending Complaints", value: pendingComplaints, trend: "+3", up: false, icon: AlertCircle, color: "text-destructive" },
    { label: "Due Maintenance", value: `₹${(dueMaintenance / 100000).toFixed(1)}L`, trend: "Current", up: false, icon: CreditCard, color: "text-accent" },
  ];

  // Aggregate recent activity
  const activities = [
    ...residents.slice(0, 2).map(r => ({ icon: UserPlus, text: `New resident ${r.first_name} ${r.last_name} added`, time: new Date(r.move_in_date).toLocaleDateString(), color: "bg-accent/10 text-accent", timestamp: new Date(r.move_in_date).getTime() })),
    ...complaints.slice(0, 2).map(c => ({ icon: AlertCircle, text: `Complaint raised: ${c.subject}`, time: new Date(c.created_at).toLocaleDateString(), color: "bg-destructive/10 text-destructive", timestamp: new Date(c.created_at).getTime() })),
    ...visitors.slice(0, 2).map(v => ({ icon: UserCheck, text: `Visitor ${v.name} checked in`, time: new Date(v.check_in_time).toLocaleDateString(), color: "bg-accent/10 text-accent", timestamp: new Date(v.check_in_time).getTime() })),
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  // Prepare chart data
  const complaintStats = [
    { name: "Open", value: complaints.filter(c => c.status === "Open").length, color: "hsl(0, 84%, 60%)" },
    { name: "In Progress", value: complaints.filter(c => c.status === "In Progress").length, color: "hsl(199, 89%, 48%)" },
    { name: "Resolved", value: complaints.filter(c => c.status === "Resolved").length, color: "hsl(142, 71%, 45%)" },
  ];

  const quickActions = [
    { label: "Add Resident", icon: UserPlus, path: "/residents" },
    { label: "Add Notice", icon: Bell, path: "/notices" },
    { label: "Generate Bill", icon: Receipt, path: "/maintenance" },
    { label: "Record Visitor", icon: UserCheck, path: "/visitors" },
  ];
  // Derive maintenance chart data from live bills
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString('default', { month: 'short' });
  });

  const maintenanceChartData = last6Months.map(month => {
    const monthBills = bills.filter(b => b.month === month);
    const collected = monthBills.filter(b => b.status === "Paid").reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const pending = monthBills.filter(b => b.status === "Pending").reduce((sum, b) => sum + (b.total_amount || 0), 0);
    return { month, collected, pending };
  });

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-xl shadow-sm border-none">
              <Skeleton className="h-24 w-full rounded-xl" />
            </Card>
          ))
        ) : statsData.map((stat) => (
          <Card key={stat.label} className="rounded-xl shadow-sm border-none bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-2xl font-black text-foreground mt-1">{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {stat.up ? <TrendingUp className="h-3 w-3 text-accent" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{stat.trend}</span>
                </div>
              </div>
              <div className={`p-3 rounded-2xl bg-muted/50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid lg:grid-cols-5 gap-6 mb-6">
        <Card className="lg:col-span-3 rounded-2xl border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="flex-row items-center justify-between pb-3 border-b bg-muted/10">
            <CardTitle className="text-base font-black uppercase tracking-tight text-foreground/80">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-accent gap-1 text-xs font-bold hover:bg-accent/10" onClick={() => navigate("/residents")}>
              Full Log <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : activities.length > 0 ? (
              <div className="divide-y">
                {activities.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 hover:bg-muted/30 transition-colors">
                    <div className={`p-2.5 rounded-xl shrink-0 ${item.color} shadow-sm`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground leading-tight">{item.text}</p>
                      <p className="text-[10px] font-black text-muted-foreground/60 uppercase mt-1 tracking-widest">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground italic font-medium opacity-50">
                No recent activity to display.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-2xl border-none shadow-sm bg-card">
          <CardHeader className="pb-3 border-b bg-muted/10">
            <CardTitle className="text-base font-black uppercase tracking-tight text-foreground/80">Launch Shortcuts</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 p-6">
            {quickActions.map((action) => (
              <Button 
                key={action.label} 
                variant="outline" 
                className="h-auto flex-col gap-3 py-6 rounded-2xl border-2 border-dashed hover:border-accent hover:bg-accent/5 hover:text-accent transition-all group"
                onClick={() => navigate(`/admin${action.path}`)}
              >
                <div className="p-3 rounded-2xl bg-muted group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <action.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">{action.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-none shadow-sm bg-card">
          <CardHeader className="pb-2 border-b bg-muted/10">
            <CardTitle className="text-base font-black uppercase tracking-tight text-foreground/80 tracking-widest">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={maintenanceChartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: '900' }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontWeight: '700' }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${v / 1000}k`} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(v: number) => [`₹${v.toLocaleString()}`, "Amount"]} 
                />
                <Bar dataKey="collected" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Collected" />
                <Bar dataKey="pending" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-card">
          <CardHeader className="pb-2 border-b bg-muted/10">
            <CardTitle className="text-base font-black uppercase tracking-tight text-foreground/80 tracking-widest">Complaints Mix</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie 
                  data={complaintStats} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={65} 
                  outerRadius={90} 
                  paddingAngle={8} 
                  dataKey="value" 
                  stroke="none"
                >
                  {complaintStats.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
