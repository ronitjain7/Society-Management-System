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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Eye, 
  MessageSquare, 
  User, 
  Download,
  Filter,
  Paperclip,
  Home
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useComplaints } from "@/hooks/use-complaints";
import { Skeleton } from "@/components/ui/skeleton";

const ComplaintsPortal = () => {
  const { complaints, isLoading, updateStatus } = useComplaints();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === "Open").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    toast.info("Exporting complaints data to CSV...");
  };

  const handleUpdateStatus = async (id: string, status: any) => {
    await updateStatus({ id, status });
  };

  return (
    <AdminLayout title="Complaints Portal">
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-xl border-none shadow-sm bg-primary/5">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total</p>
                <p className="text-2xl font-black mt-1 leading-none">{stats.total}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-none shadow-sm bg-red-500/5">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Open</p>
                <p className="text-2xl font-black mt-1 text-red-600 leading-none">{stats.open}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600">
                <AlertCircle className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-none shadow-sm bg-amber-500/5">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">In Progress</p>
                <p className="text-2xl font-black mt-1 text-amber-600 leading-none">{stats.inProgress}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-none shadow-sm bg-green-500/5">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Resolved</p>
                <p className="text-2xl font-black mt-1 text-green-600 leading-none">{stats.resolved}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-green-500/10 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2 flex-1 max-w-3xl">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search complaints..." 
                className="pl-10 h-11 rounded-xl bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px] rounded-xl h-11">
                <Filter className="h-4 w-4 mr-2 opacity-50" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="gap-2 rounded-xl h-11 px-5" onClick={handleExportCSV}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>

        {/* Complaints Table */}
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 h-12">
                <TableHead className="w-[100px]">Flat</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="max-w-[300px]">Subject</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredComplaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                      <MessageSquare className="h-10 w-10" />
                      <p className="font-bold text-lg">No complaints found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredComplaints.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-bold">{c.flat?.block}-{c.flat?.flat_number}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal px-2 py-0.5">{c.category}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate font-medium">{c.subject}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "font-bold text-[10px] tracking-wider uppercase border-none",
                        c.priority === "High" ? "bg-red-500/10 text-red-600" :
                        c.priority === "Medium" ? "bg-amber-500/10 text-amber-600" :
                        "bg-blue-500/10 text-blue-600"
                      )} variant="outline">
                        {c.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "font-bold px-3 py-1 text-[10px] tracking-wider uppercase border-none text-white",
                        c.status === "Open" ? "bg-red-500 shadow-sm shadow-red-200" :
                        c.status === "In Progress" ? "bg-amber-500 shadow-sm shadow-amber-200" :
                        "bg-green-500 shadow-sm shadow-green-200"
                      )}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right h-14">
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-accent hover:bg-accent/10 rounded-full" onClick={() => setSelectedComplaint(c)}>
                        <Eye className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Complaint Modal */}
      <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl border-none shadow-2xl">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start pr-8">
                  <div className="space-y-1">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tight">
                        Complaint Details
                    </DialogTitle>
                    <Badge variant="outline" className="text-[10px] font-mono tracking-tighter opacity-50 border-none px-0">#{selectedComplaint.id.slice(0,8)}</Badge>
                  </div>
                  <Badge className={cn(
                    "font-black text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full border-none text-white",
                    selectedComplaint.status === "Open" ? "bg-red-500 shadow-lg shadow-red-200" :
                    selectedComplaint.status === "In Progress" ? "bg-amber-500 shadow-lg shadow-amber-200" :
                    "bg-green-500 shadow-lg shadow-green-200"
                  )}>
                    {selectedComplaint.status}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 py-6">
                <div className="grid grid-cols-2 gap-6 p-5 bg-muted/20 rounded-2xl border border-muted">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Resident</Label>
                    <div className="flex items-center gap-2.5 font-black text-sm">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary uppercase text-xs">
                        {selectedComplaint.resident?.first_name?.[0]}
                      </div>
                      {selectedComplaint.resident?.first_name} {selectedComplaint.resident?.last_name}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Flat / Date</Label>
                    <div className="flex items-center gap-2.5 font-bold text-sm">
                       <Home className="h-4 w-4 text-accent opacity-60" /> 
                       {selectedComplaint.flat?.block}-{selectedComplaint.flat?.flat_number}
                       <span className="mx-2 text-muted-foreground/30">•</span>
                       <Clock className="h-4 w-4 text-primary opacity-60" /> {new Date(selectedComplaint.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase text-muted-foreground">Subject</Label>
                  <p className="font-bold text-lg">{selectedComplaint.subject}</p>
                </div>

                <div className="space-y-2 p-4 bg-muted/30 rounded-xl border italic text-sm">
                  {selectedComplaint.description}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase text-muted-foreground">Attached Files</Label>
                  <div className="flex gap-2">
                    <div className="h-20 w-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                      <Paperclip className="h-4 w-4 mb-1" />
                      <span className="text-[8px]">Image_1.jpg</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Assignment</Label>
                    <Select defaultValue={selectedComplaint.assignedTo}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vijay (Plumber)">Vijay (Plumber)</SelectItem>
                        <SelectItem value="Karan (Electrician)">Karan (Electrician)</SelectItem>
                        <SelectItem value="Sanitation Dept">Sanitation Dept</SelectItem>
                        <SelectItem value="Otis Service Team">Otis Service Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Update Status</Label>
                    <Select defaultValue={selectedComplaint.status} onValueChange={handleUpdateStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Admin Remarks</Label>
                  <Textarea 
                    placeholder="Add progress updates or notes here..." 
                    defaultValue={selectedComplaint.remarks}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-[10px] uppercase text-muted-foreground mb-3 block">Timeline</Label>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold">Complaint Raised</p>
                        <p className="text-[10px] text-muted-foreground">{selectedComplaint.date} 10:30 AM</p>
                      </div>
                    </div>
                    {selectedComplaint.status !== "Open" && (
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold">Status Updated: {selectedComplaint.status}</p>
                          <p className="text-[10px] text-muted-foreground">March 21, 2024 02:15 PM</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedComplaint(null)}>Close</Button>
                <Button onClick={() => {
                  handleUpdateStatus(selectedComplaint.status);
                  setSelectedComplaint(null);
                }}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ComplaintsPortal;
