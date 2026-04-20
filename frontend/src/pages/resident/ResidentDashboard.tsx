import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  CreditCard, 
  AlertCircle, 
  Calendar, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Megaphone,
  UserCheck,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useMaintenance } from "@/hooks/use-maintenance";
import { useComplaints } from "@/hooks/use-complaints";
import { useNotices } from "@/hooks/use-notices";
import { Skeleton } from "@/components/ui/skeleton";

const ResidentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch live data
  const { bills, payments, isLoading: isMaintLoading } = useMaintenance();
  const { complaints, isLoading: isComplaintsLoading } = useComplaints();
  const { notices, isLoading: isNoticesLoading } = useNotices();

  // Calculate live stats
  const pendingBills = bills.filter(b => b.status === "Pending");
  const totalPendingDues = pendingBills.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const openComplaintsCount = complaints.filter(c => c.status !== "Resolved").length;
  
  const stats = [
    { 
      label: "Pending Dues", 
      value: `₹${totalPendingDues.toLocaleString()}`, 
      icon: CreditCard, 
      color: "text-red-600", 
      bg: "bg-red-50" 
    },
    { 
      label: "Open Complaints", 
      value: String(openComplaintsCount).padStart(2, "0"), 
      icon: AlertCircle, 
      color: "text-amber-600", 
      bg: "bg-amber-50" 
    },
    { 
      label: "Amenity Bookings", 
      value: "01", // Placeholder
      icon: Calendar, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
  ];

  const recentPayments = payments.slice(0, 3);
  const latestNotices = notices.slice(0, 3);
  
  const isLoading = isMaintLoading || isComplaintsLoading || isNoticesLoading;

  return (
    <ResidentLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome & Alert Section */}
        <div className="flex flex-col gap-4">
          <Card className="rounded-2xl border-none bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="h-32 w-32" />
            </div>
            <CardContent className="p-8 relative z-10">
              <h2 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name || "Resident"}!</h2>
              {isLoading ? (
                <Skeleton className="h-4 w-48 bg-primary-foreground/20 mt-2" />
              ) : (
                <p className="mt-2 text-primary-foreground/90 font-medium opacity-80 italic">
                    Flat Secured • SmartLiving Resident Portal
                </p>
              )}
            </CardContent>
          </Card>

          {totalPendingDues > 0 && (
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 animate-pulse">
                <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-semibold">You have outstanding dues of ₹{totalPendingDues.toLocaleString()}. Please clear them at the earliest.</p>
                </div>
                <Button size="sm" variant="ghost" className="text-red-700 hover:bg-red-100 font-bold" onClick={() => navigate("/resident/maintenance")}>
                Pay Now <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="rounded-2xl border-none shadow-sm"><Skeleton className="h-24 w-full" /></Card>
            ))
          ) : stats.map((stat, i) => (
            <Card key={i} className="rounded-2xl shadow-sm border-none overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tables and Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Payments</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary font-bold" onClick={() => navigate("/resident/maintenance")}>View All</Button>
            </CardHeader>
            <CardContent>
               {isLoading ? (
                 <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                 </div>
               ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {recentPayments.length > 0 ? recentPayments.map((p, i) => (
                        <TableRow key={i}>
                        <TableCell className="font-medium">{p.bills?.month} {p.bills?.year}</TableCell>
                        <TableCell className="font-mono">₹{p.amount_paid?.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{new Date(p.payment_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100 rounded-full text-[10px] font-bold">
                            SUCCESS
                            </Badge>
                        </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground italic">No recent payments.</TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
               )}
            </CardContent>
          </Card>

          {/* Latest Notices */}
          <Card className="rounded-2xl border-none shadow-sm flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Latest Notices</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary font-bold" onClick={() => navigate("/resident/notices")}>View All</Button>
            </CardHeader>
            <CardContent className="flex-1">
              {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                  </div>
              ) : (
                <div className="space-y-4">
                    {latestNotices.length > 0 ? latestNotices.map((n, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group border border-transparent hover:border-muted" onClick={() => navigate("/resident/notices")}>
                        <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Megaphone className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                        <p className="text-sm font-bold truncate">{n.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-normal rounded-full">{n.category}</Badge>
                            <span>{new Date(n.created_at).toLocaleDateString()}</span>
                        </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    )) : (
                        <div className="text-center py-10 text-muted-foreground italic text-sm">No active notices.</div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-32 rounded-2xl border-dashed border-2 flex flex-col gap-3 hover:border-accent hover:bg-accent/5 hover:text-accent group" onClick={() => toast.success("Redirecting to Payment Gateway...")}>
            <div className="p-3 rounded-2xl bg-muted group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <CreditCard className="h-6 w-6" />
            </div>
            <span className="font-bold">Pay Maintenance</span>
          </Button>
          <Button variant="outline" className="h-32 rounded-2xl border-dashed border-2 flex flex-col gap-3 hover:border-accent hover:bg-accent/5 hover:text-accent group" onClick={() => navigate("/resident/complaints")}>
            <div className="p-3 rounded-2xl bg-muted group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <Plus className="h-6 w-6" />
            </div>
            <span className="font-bold">Raise Complaint</span>
          </Button>
          <Button variant="outline" className="h-32 rounded-2xl border-dashed border-2 flex flex-col gap-3 hover:border-accent hover:bg-accent/5 hover:text-accent group" onClick={() => navigate("/resident/amenities")}>
            <div className="p-3 rounded-2xl bg-muted group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="font-bold">Book Amenity</span>
          </Button>
          <Button variant="outline" className="h-32 rounded-2xl border-dashed border-2 flex flex-col gap-3 hover:border-accent hover:bg-accent/5 hover:text-accent group" onClick={() => navigate("/resident/visitors")}>
            <div className="p-3 rounded-2xl bg-muted group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <UserCheck className="h-6 w-6" />
            </div>
            <span className="font-bold">Pre-Approve Visitor</span>
          </Button>
        </div>
      </div>
    </ResidentLayout>
  );
};

export default ResidentDashboard;
