import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  CreditCard, 
  Receipt, 
  IndianRupee, 
  ArrowUpRight, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react";
import { toast } from "sonner";

import { useMaintenance } from "@/hooks/use-maintenance";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const ResidentMaintenance = () => {
  const { user } = useAuth();
  // TODO: In a real app, we'd get the flat_id from the resident record
  // For now, we'll fetch all bills or use a placeholder if the relationship isn't fully established
  const { bills, isLoading, payBill } = useMaintenance();

  const currentBill = bills.find(b => b.status === "Pending");
  const paidBills = bills.filter(b => b.status === "Paid");
  
  const stats = {
    pending: bills.filter(b => b.status === "Pending").reduce((acc, b) => acc + b.total_amount, 0),
    current: currentBill?.total_amount || 0,
    ytdPaid: paidBills.reduce((acc, b) => acc + b.total_amount, 0),
  };

  const handlePay = async () => {
    if (!currentBill) return;
    toast.info("Processing payment simulation...");
    await payBill({
      billId: currentBill.id,
      amount: currentBill.total_amount,
      paymentMode: "UPI"
    });
  };

  return (
    <ResidentLayout title="My Maintenance & Billing">
      <div className="space-y-6">
        {/* Dues Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-none shadow-sm bg-red-500/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Total Pending</p>
                <div className="flex items-baseline gap-1 mt-1">
                   {isLoading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-black text-red-600">₹{stats.pending.toLocaleString()}</p>}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-red-500/10 text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border-none shadow-sm bg-blue-500/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Current Bill</p>
                {isLoading ? <Skeleton className="h-8 w-24 mt-1" /> : <p className="text-2xl font-black mt-1 text-blue-600">₹{stats.current.toLocaleString()}</p>}
              </div>
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm bg-green-500/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Total Paid (YTD)</p>
                {isLoading ? <Skeleton className="h-8 w-24 mt-1" /> : <p className="text-2xl font-black mt-1 text-green-600">₹{stats.ytdPaid.toLocaleString()}</p>}
              </div>
              <div className="p-3 rounded-2xl bg-green-500/10 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bill Breakdown */}
          <Card className="rounded-2xl border-none shadow-sm lg:col-span-1 bg-card">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5 text-accent" /> Bill Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
                </div>
              ) : currentBill ? (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                      <span className="text-sm text-muted-foreground font-medium">Base Maintenance</span>
                      <span className="font-mono text-sm font-bold">₹{currentBill.base_amount}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                      <span className="text-sm text-muted-foreground font-medium">Water Charges</span>
                      <span className="font-mono text-sm font-bold">₹{currentBill.water_charges}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dashed line-clamp-1">
                      <span className="text-sm text-muted-foreground font-medium">Other Charges</span>
                      <span className="font-mono text-sm font-bold">₹{currentBill.other_charges}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t-2 border-accent/20 flex justify-between items-center">
                    <span className="font-bold text-lg">Total Payable</span>
                    <span className="font-black text-2xl text-accent">₹{currentBill.total_amount}</span>
                  </div>
                  <Button className="w-full h-12 rounded-xl text-lg font-bold gap-2 mt-4 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all" onClick={handlePay}>
                    <CreditCard className="h-5 w-5" /> Pay Now
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 opacity-40">
                  <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-green-500" />
                  <p className="font-bold">No pending bills!</p>
                  <p className="text-xs">You are all caught up.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="rounded-2xl border-none shadow-sm lg:col-span-2 overflow-hidden bg-card">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" /> Payment History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 h-12">
                      <TableHead className="pl-6">Month</TableHead>
                      <TableHead>Bill Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-6">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell className="pl-6"><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell className="pr-6"><Skeleton className="h-4 w-full" /></TableCell>
                        </TableRow>
                      ))
                    ) : paidBills.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center opacity-40 italic">No payment history found.</TableCell>
                      </TableRow>
                    ) : (
                      paidBills.map((p) => (
                        <TableRow key={p.id} className="h-16 group hover:bg-muted/10 transition-colors">
                          <TableCell className="pl-6 font-bold">{p.month} {p.year}</TableCell>
                          <TableCell className="font-mono">₹{p.total_amount}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/10 text-green-600 border-none px-2 flex items-center gap-1 w-fit font-bold text-[10px] tracking-wider uppercase">
                              <CheckCircle2 className="h-3 w-3" /> Paid
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-accent hover:bg-accent/10 rounded-full" onClick={() => toast.success("Receipt downloaded")}>
                              <Download className="h-5 w-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResidentLayout>
  );
};

export default ResidentMaintenance;
