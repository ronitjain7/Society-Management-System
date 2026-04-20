import { useState } from "react";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { 
  AlertCircle, 
  Plus, 
  Eye, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  Paperclip,
  ArrowRight
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useComplaints } from "@/hooks/use-complaints";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const ResidentComplaints = () => {
  const { user } = useAuth();
  const { complaints, isLoading, registerComplaint } = useComplaints(user?.id);
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  const handleRaiseComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const category = formData.get("category") as string;
    const priority = formData.get("priority") as "Low" | "Medium" | "High";
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;

    await registerComplaint({
      resident_id: user?.id || "",
      flat_id: "", // TODO: Get flat_id from user metadata if possible
      category,
      priority,
      subject,
      description,
    });
    
    setIsRaiseModalOpen(false);
  };

  return (
    <ResidentLayout title="My Complaints">
      <div className="space-y-6">
        {/* Top Header/Action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Support Requests</h2>
            <p className="text-sm text-muted-foreground">Track and manage your maintenance requests and issues.</p>
          </div>
          <Button onClick={() => setIsRaiseModalOpen(true)} className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Plus className="h-5 w-5" /> Raise New Complaint
          </Button>
        </div>

        {/* Complaints Table */}
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-lg">Complaint History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="h-12">
                    <TableHead className="pl-6 w-[120px]">Category</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Raised Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <TableCell key={j} className={j === 0 ? "pl-6" : j === 4 ? "pr-6" : ""}><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : complaints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                          <MessageSquare className="h-12 w-12" />
                          <div className="space-y-1">
                            <p className="font-bold text-lg">No complaints yet</p>
                            <p className="text-sm">Need help? Raise your first support request above.</p>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setIsRaiseModalOpen(true)}>
                            Raise Complaint
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    complaints.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="pl-6">
                          <Badge variant="outline" className="font-normal border-none bg-accent/5 text-accent">{c.category}</Badge>
                        </TableCell>
                        <TableCell className="font-bold">{c.subject}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(c.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "font-bold text-[10px] tracking-wider uppercase border-none text-white",
                            c.status === "Resolved" ? "bg-green-500 shadow-sm shadow-green-200" : 
                            c.status === "In Progress" ? "bg-amber-500 shadow-sm shadow-amber-200" : 
                            "bg-red-500 shadow-sm shadow-red-200"
                          )} variant="default">
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6 h-14">
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
          </CardContent>
        </Card>
      </div>

      {/* Raise New Complaint Modal */}
      <Dialog open={isRaiseModalOpen} onOpenChange={setIsRaiseModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Raise Support Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRaiseComplaint} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select defaultValue="Medium">
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Short Subject</Label>
              <Input id="subject" placeholder="e.g. Water leak in kitchen" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea id="description" placeholder="Please provide as much detail as possible..." className="min-h-[120px] resize-none" required />
            </div>
            <div className="space-y-2">
              <Label>Attach Photo (Optional)</Label>
              <div className="border-2 border-dashed rounded-xl p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer group">
                 <Paperclip className="h-6 w-6 mx-auto text-muted-foreground group-hover:text-accent mb-2" />
                 <p className="text-xs text-muted-foreground">Click to upload or drag image here</p>
              </div>
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsRaiseModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="gap-2">
                <CheckCircle2 className="h-4 w-4" /> Submit Complaint
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Complaint Modal */}
      <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start pr-8">
                   <DialogTitle className="flex items-center gap-2">
                     {selectedComplaint.subject}
                     <Badge variant="outline" className="text-[10px] font-normal">{selectedComplaint.id}</Badge>
                   </DialogTitle>
                   <Badge className={cn(
                        "font-medium",
                        selectedComplaint.status === "Resolved" ? "bg-green-500 text-white" : 
                        selectedComplaint.status === "In Progress" ? "bg-amber-500 text-white" : 
                        "bg-red-500 text-white"
                      )}>
                        {selectedComplaint.status}
                      </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-medium">
                    <AlertCircle className="h-3.5 w-3.5" /> Priority: <span className={cn(selectedComplaint.priority === "High" ? "text-red-600" : "text-muted-foreground")}>{selectedComplaint.priority}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-accent">
                    <MessageSquare className="h-3.5 w-3.5" /> Category: {selectedComplaint.category}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5" /> Raised on: {selectedComplaint.date}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Description</Label>
                  <p className="text-sm border rounded-xl p-4 bg-muted/20 italic">
                    "{selectedComplaint.description}"
                  </p>
                </div>

                {selectedComplaint.adminResponse && (
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-accent border-b border-accent/20 pb-1 mb-2 block">Admin Response</Label>
                    <p className="text-sm font-semibold p-4 bg-accent/5 rounded-xl border border-accent/10">
                      {selectedComplaint.adminResponse}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Timeline</Label>
                  <div className="space-y-6">
                    {selectedComplaint.timeline.map((item: any, i: number) => (
                      <div key={i} className="flex gap-4 relative">
                        {i !== selectedComplaint.timeline.length - 1 && (
                          <div className="absolute left-2.5 top-6 bottom-[-16px] w-[1px] bg-muted-foreground/30 border-dashed border-l" />
                        )}
                        <div className={cn(
                          "h-5 w-5 rounded-full flex items-center justify-center shrink-0 z-10",
                          item.status === "Resolved" ? "bg-green-500 text-white shadow-green-200 shadow-lg" : 
                          item.status === "In Progress" ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {item.status === "Resolved" ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-1.5 w-1.5 rounded-full bg-current" />}
                        </div>
                        <div className="flex-1 -mt-1">
                           <p className="text-xs font-bold">{item.status}</p>
                           <p className="text-[10px] text-muted-foreground mb-1">{item.date}</p>
                           <p className="text-[11px] p-2 bg-muted/40 rounded-lg">{item.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 border-t">
                <Button variant="outline" className="w-full h-11 rounded-xl" onClick={() => setSelectedComplaint(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ResidentLayout>
  );
};

export default ResidentComplaints;
