import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Receipt, 
  Clock, 
  Plus, 
  Search, 
  Printer, 
  Send, 
  Download, 
  AlertCircle,
  IndianRupee,
  FileText,
  Calendar,
  Eye,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useMaintenance } from "@/hooks/use-maintenance";
import { Skeleton } from "@/components/ui/skeleton";

const MaintenanceManagement = () => {
  const { bills, isLoading } = useMaintenance();
  const [activeTab, setActiveTab] = useState("generate");
  const [extraCharges, setExtraCharges] = useState([{ label: "Clubhouse", amount: "500" }]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  
  // Stats calculation
  const stats = {
    billed: bills.reduce((acc, b) => acc + b.total_amount, 0),
    collected: bills.reduce((acc, b) => b.status === "Paid" ? acc + b.total_amount : acc, 0),
    pending: bills.reduce((acc, b) => b.status !== "Paid" ? acc + b.total_amount : acc, 0),
  };

  const paymentRecords = bills.filter(b => b.status === "Paid" || b.status === "Partial");
  const pendingDues = bills.filter(b => b.status === "Pending");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterBlockPayment, setFilterBlockPayment] = useState("all");
  const [filterStatusPayment, setFilterStatusPayment] = useState("all");
  const [selectedDues, setSelectedDues] = useState<string[]>([]);

  const addChargeRow = () => setExtraCharges([...extraCharges, { label: "", amount: "" }]);

  const handleGenerateBills = () => {
    // TODO: supabase.from('maintenance_bills').insert(billData)
    toast.success("Maintenance bills generated and sent to all residents!");
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <AdminLayout title="Maintenance & Billing">
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-xl shadow-sm border-none bg-blue-500/5">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Billed This Month</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">₹{stats.billed.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm border-none bg-green-500/5">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Collected</p>
                <p className="text-2xl font-bold mt-1 text-green-600">₹{stats.collected.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm border-none bg-red-500/5">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Pending</p>
                <p className="text-2xl font-bold mt-1 text-red-600">₹{stats.pending.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 text-red-600">
                <Clock className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl h-11">
            <TabsTrigger value="generate" className="rounded-lg data-[state=active]:bg-background">Generate Bills</TabsTrigger>
            <TabsTrigger value="records" className="rounded-lg data-[state=active]:bg-background">Payment Records</TabsTrigger>
            <TabsTrigger value="dues" className="rounded-lg data-[state=active]:bg-background">Pending Dues</TabsTrigger>
          </TabsList>

          {/* TAB 1: GENERATE BILLS */}
          <TabsContent value="generate" className="space-y-4">
            <Card className="rounded-xl border shadow-sm max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-lg">Monthly Bill Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Month & Year</Label>
                    <Input type="month" defaultValue="2024-04" />
                  </div>
                  <div className="space-y-2">
                    <Label>Base Maintenance (₹)</Label>
                    <Input type="number" defaultValue="3000" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Water Charges (₹)</Label>
                    <Input type="number" defaultValue="300" />
                  </div>
                  <div className="space-y-2">
                    <Label>Parking Charges (₹)</Label>
                    <Input type="number" defaultValue="200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Late Fine / Day (₹)</Label>
                    <Input type="number" defaultValue="50" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex justify-between">
                    Other Charges
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-accent" onClick={addChargeRow}>
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </Label>
                  {extraCharges.map((charge, i) => (
                    <div key={i} className="flex gap-2">
                      <Input placeholder="Label (e.g. Sinking Fund)" value={charge.label} onChange={(e) => {
                        const newCharges = [...extraCharges];
                        newCharges[i].label = e.target.value;
                        setExtraCharges(newCharges);
                      }} />
                      <Input placeholder="Amount" type="number" className="w-1/3" value={charge.amount} onChange={(e) => {
                        const newCharges = [...extraCharges];
                        newCharges[i].amount = e.target.value;
                        setExtraCharges(newCharges);
                      }} />
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex gap-3">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setIsPreviewOpen(true)}>
                    <Eye className="h-4 w-4" /> Preview Bills
                  </Button>
                  <Button className="flex-1 gap-2" onClick={handleGenerateBills}>
                    <Send className="h-4 w-4" /> Generate & Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: PAYMENT RECORDS */}
          <TabsContent value="records" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex flex-wrap gap-2 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search flat or resident..." className="pl-10 h-10 rounded-xl" />
                </div>
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="w-[130px] rounded-xl">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="March 2024">March 2024</SelectItem>
                    <SelectItem value="February 2024">February 2024</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterBlockPayment} onValueChange={setFilterBlockPayment}>
                  <SelectTrigger className="w-[120px] rounded-xl">
                    <SelectValue placeholder="Block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blocks</SelectItem>
                    <SelectItem value="A">Block A</SelectItem>
                    <SelectItem value="B">Block B</SelectItem>
                    <SelectItem value="C">Block C</SelectItem>
                    <SelectItem value="D">Block D</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatusPayment} onValueChange={setFilterStatusPayment}>
                  <SelectTrigger className="w-[130px] rounded-xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Record Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record New Payment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Search Flat</Label>
                      <Input placeholder="Enter Flat number (e.g. A-101)" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Amount Paid (₹)</Label>
                        <Input type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Mode</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Bank">Bank Transfer</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Transaction ID / Notes</Label>
                      <Input placeholder="Ref ID or cheque number" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={() => { 
                      // TODO: supabase record payment
                      toast.success("Payment recorded successfully");
                    }}>Save Payment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flat No</TableHead>
                    <TableHead>Resident</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Total Amt</TableHead>
                    <TableHead>Paid Amt</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Receipt No</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 10 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : paymentRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="h-32 text-center opacity-40 italic">No payment records found.</TableCell>
                    </TableRow>
                  ) : (
                    paymentRecords.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-bold">A-101</TableCell>
                        <TableCell>Resident Name</TableCell>
                        <TableCell>{p.month} {p.year}</TableCell>
                        <TableCell>₹{p.total_amount}</TableCell>
                        <TableCell>₹{p.total_amount}</TableCell>
                        <TableCell>{p.payments?.[0]?.payment_date ? new Date(p.payments[0].payment_date).toLocaleDateString() : "-"}</TableCell>
                        <TableCell>{p.payments?.[0]?.payment_mode || "-"}</TableCell>
                        <TableCell className="font-mono text-[10px]">{p.payments?.[0]?.transaction_id || "-"}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            p.status === "Paid" ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                            p.status === "Partial" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : 
                            "bg-red-500/10 text-red-500 border-red-500/20"
                          )}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-accent" onClick={() => setSelectedReceipt(p)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* TAB 3: PENDING DUES */}
          <TabsContent value="dues" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Outstanding Dues List
              </h3>
              <div className="flex gap-2">
                {selectedDues.length > 0 && (
                  <Button variant="destructive" className="gap-2" onClick={() => {
                    toast.success(`Bulk reminders sent to ${selectedDues.length} residents!`);
                    setSelectedDues([]);
                  }}>
                    <Send className="h-4 w-4" /> Send Bulk Reminder ({selectedDues.length})
                  </Button>
                )}
                <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10 gap-2">
                  <Download className="h-4 w-4" /> Export Dues
                </Button>
              </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden text-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox 
                        checked={selectedDues.length === MOCK_PENDING.length}
                        onCheckedChange={(checked) => {
                          if (checked) setSelectedDues(MOCK_PENDING.map(p => p.flatNo));
                          else setSelectedDues([]);
                        }}
                      />
                    </TableHead>
                    <TableHead>Flat No</TableHead>
                    <TableHead>Resident Name</TableHead>
                    <TableHead>Months Due</TableHead>
                    <TableHead>Total Pending</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : pendingDues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center opacity-40 italic">No outstanding dues.</TableCell>
                    </TableRow>
                  ) : (
                    pendingDues.map((p) => (
                      <TableRow key={p.id} className={selectedDues.includes(p.id) ? "bg-red-50/50" : ""}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedDues.includes(p.id)}
                            onCheckedChange={(checked) => {
                              if (checked) setSelectedDues([...selectedDues, p.id]);
                              else setSelectedDues(selectedDues.filter(id => id !== p.id));
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-bold">A-101</TableCell>
                        <TableCell>Resident Name</TableCell>
                        <TableCell>
                          <Badge variant="secondary">1 Month</Badge>
                        </TableCell>
                        <TableCell className="text-red-500 font-bold">₹{p.total_amount}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-accent gap-1" onClick={() => toast.success(`Reminder sent!`)}>
                            <Send className="h-3.5 w-3.5" /> Remind
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Modal Skeleton */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bill Preview - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</DialogTitle>
          </DialogHeader>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">Flat No</TableHead>
                  <TableHead>Base</TableHead>
                  <TableHead>Water</TableHead>
                  <TableHead>Extra</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">A-{101+i}</TableCell>
                    <TableCell>₹3,000</TableCell>
                    <TableCell>₹300</TableCell>
                    <TableCell>₹500</TableCell>
                    <TableCell className="text-right font-bold text-accent">₹3,800</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Close</Button>
            <Button onClick={() => { setIsPreviewOpen(false); handleGenerateBills(); }}>Confirm & Generate All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt View Modal */}
      <Dialog open={!!selectedReceipt} onOpenChange={(open) => !open && setSelectedReceipt(null)}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
          {selectedReceipt && (
            <div className="bg-white p-8 space-y-8" id="printable-receipt">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-primary tracking-tighter">SocietyEase</h2>
                  <p className="text-xs text-muted-foreground">Skyline Apartments, New Delhi 110021</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="border-accent text-accent">Official Receipt</Badge>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">{selectedReceipt.receiptNo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 py-6 border-y border-dashed">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold">To Resident</p>
                  <p className="font-bold">{selectedReceipt.resident}</p>
                  <p className="text-sm opacity-70">Flat No: {selectedReceipt.flatNo}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold">Payment Info</p>
                  <p className="font-bold">Date: {selectedReceipt.date}</p>
                  <p className="text-sm opacity-70">Mode: {selectedReceipt.mode}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Maintenance Bill — {selectedReceipt.month}</span>
                  <span className="font-mono">₹{selectedReceipt.amount}.00</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Late Fee / Adjustments</span>
                  <span className="font-mono">₹0.00</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-black">
                  <span className="font-bold">TOTAL PAID</span>
                  <span className="text-2xl font-black font-mono">₹{selectedReceipt.paid}.00</span>
                </div>
              </div>

              <div className="pt-8 flex flex-col items-center gap-4 no-print">
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1 gap-2" onClick={handlePrintReceipt}>
                    <Printer className="h-4 w-4" /> Print Receipt
                  </Button>
                  <Button className="flex-1 gap-2" onClick={() => setSelectedReceipt(null)}>
                    Close
                  </Button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground italic">
                  This is a computer-generated receipt and does not require a signature.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MaintenanceManagement;
