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
  UserPlus, 
  UserCheck, 
  Clock, 
  Search, 
  CheckCircle2, 
  Plus, 
  Calendar,
  Phone,
  Car,
  Trash2,
  Info
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useVisitors } from "@/hooks/use-visitors";
import { useResidents } from "@/hooks/use-residents";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuth } from "@/hooks/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ResidentVisitors = () => {
  const { user } = useAuth();
  const { residents } = useResidents();
  const { visitors, isLoading, createVisitor, checkoutVisitor } = useVisitors();
  const [isPreApproveModalOpen, setIsPreApproveModalOpen] = useState(false);

  // Find current resident's flat
  const currentResident = residents.find(r => r.email === user?.email);
  const myFlatId = currentResident?.flat_id;

  // Filter visitors for this flat
  const myVisitors = visitors.filter(v => v.flat_id === myFlatId);

  const handlePreApprove = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!myFlatId) {
        toast.error("Resident profile not found.");
        return;
    }

    const formData = new FormData(e.currentTarget);
    const newVisitor = {
        name: formData.get("vName") as string,
        phone: formData.get("vPhone") as string,
        purpose: formData.get("vPurpose") as string,
        flat_id: myFlatId,
        check_in_time: new Date().toISOString(), // In real app, this might be a 'scheduled' time
        vehicle_number: formData.get("vVeh") as string || null,
    };

    await createVisitor(newVisitor);
    setIsPreApproveModalOpen(false);
  };

  return (
    <ResidentLayout title="Visitor Pre-Approval">
      <div className="space-y-6">
        {/* Info Card */}
        <Card className="rounded-2xl border-none bg-blue-500/5 shadow-sm">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600">
              <Info className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 leading-tight">Fast-track your guests</h3>
              <p className="text-sm text-blue-700/80 mt-1">Pre-approving visitors helps the security staff verify them quickly at the main gate. Your guest will receive a unique entry code (Mock).</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Header */}
        <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
           <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
               <UserPlus className="h-5 w-5" />
             </div>
             <div>
               <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Manage Entries</p>
               <h2 className="text-lg font-black">Pre-approved Visitors</h2>
             </div>
           </div>
           <Button onClick={() => setIsPreApproveModalOpen(true)} className="gap-2 rounded-xl shadow-lg hover:scale-105 transition-transform">
             <Plus className="h-4 w-4" /> Pre-Approve Guest
           </Button>
        </div>

        {/* Pre-Approved List Table */}
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
          <CardContent className="p-0 text-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6 font-bold text-[10px] uppercase tracking-widest py-4">Visitor Name</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Entry Date</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Purpose</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Vehicle No</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-right pr-6 font-bold text-[10px] uppercase tracking-widest">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6"><Skeleton className="h-10 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell className="pr-6"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : myVisitors.length > 0 ? (
                  myVisitors.map((v) => (
                    <TableRow key={v.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="pl-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold">{v.name}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                            <Phone className="h-2.5 w-2.5" /> {v.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-[10px] py-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 text-accent" />
                            {new Date(v.check_in_time).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                         <Badge variant="secondary" className="font-bold text-[9px] uppercase tracking-widest border-none px-2 py-0.5 rounded-md">{v.purpose}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground py-4">
                        {!v.vehicle_number ? <span className="opacity-30 italic">No Vehicle</span> : <span className="flex items-center gap-1 font-black text-black"><Car className="h-3 w-3" /> {v.vehicle_number}</span>}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={cn(
                          "rounded-full font-bold text-[9px] tracking-widest",
                          v.check_out_time ? "bg-muted text-muted-foreground border-transparent" : "bg-green-500/10 text-green-600 border-green-200"
                        )} variant="outline">
                          {v.check_out_time ? "HISTORY" : "ACTIVE"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                         {!v.check_out_time && (
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full" onClick={() => checkoutVisitor(v.id)}>
                             <Clock className="h-4 w-4" />
                           </Button>
                         )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic opacity-50">No visitor history found for your flat.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Pre-Approval Modal */}
      <Dialog open={isPreApproveModalOpen} onOpenChange={setIsPreApproveModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-accent to-accent/50" />
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-accent" />
                Pre-Approve Guest
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePreApprove} className="space-y-6 p-6 pt-2">
            <div className="space-y-2">
              <Label htmlFor="vName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Visitor Name</Label>
              <Input id="vName" name="vName" placeholder="Guest's full name" required className="h-12 rounded-xl focus-visible:ring-accent font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vPhone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                <Input id="vPhone" name="vPhone" placeholder="+91 XXXXX XXXXX" required className="h-12 rounded-xl focus-visible:ring-accent font-bold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vDate" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Visit Date</Label>
                <Input id="vDate" name="vDate" type="date" required className="h-12 rounded-xl focus-visible:ring-accent font-bold" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vPurpose" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nature of Visit</Label>
                <Select name="vPurpose" defaultValue="Guest" required>
                  <SelectTrigger className="h-12 rounded-xl border-muted bg-muted/20 font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guest">Guest / Friend</SelectItem>
                    <SelectItem value="Delivery">Delivery / Courier</SelectItem>
                    <SelectItem value="Service">Home Service</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vVeh" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vehicle No.</Label>
                <Input id="vVeh" name="vVeh" placeholder="MH12 AB 1234" className="h-12 rounded-xl focus-visible:ring-accent font-mono uppercase" />
              </div>
            </div>
            <DialogFooter className="pt-6 border-t gap-3 mt-4">
              <Button type="button" variant="ghost" onClick={() => setIsPreApproveModalOpen(false)} className="rounded-xl h-12 px-6 font-medium">Cancel</Button>
              <Button type="submit" className="rounded-xl h-12 px-8 font-black shadow-xl shadow-accent/30 transition-all hover:scale-105 active:scale-95 bg-accent text-accent-foreground">
                Grant Pre-Approval
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ResidentLayout>
  );
};

export default ResidentVisitors;
