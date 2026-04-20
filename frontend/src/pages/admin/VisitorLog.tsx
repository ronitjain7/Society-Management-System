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
import { 
  UserCheck, 
  Users, 
  Calendar, 
  Search, 
  Plus, 
  LogOut, 
  Car, 
  Phone, 
  MapPin, 
  Download,
  Camera
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useVisitors } from "@/hooks/use-visitors";
import { useFlats } from "@/hooks/use-flats";
import { Skeleton } from "@/components/ui/skeleton";

const VisitorLog = () => {
  const { visitors, isLoading, checkoutVisitor, createVisitor } = useVisitors();
  const { flats } = useFlats();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  const handleCheckOut = async (id: string) => {
    await checkoutVisitor(id);
  };

  const handleSaveVisitor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newVisitor = {
        name: formData.get("vName") as string,
        phone: formData.get("vPhone") as string,
        purpose: formData.get("vPurpose") as string,
        flat_id: formData.get("vFlat") as string,
        check_in_time: new Date().toISOString(),
        vehicle_number: formData.get("vVeh") as string || null,
    };

    if (!newVisitor.flat_id) {
        toast.error("Please select a flat to visit.");
        return;
    }

    await createVisitor(newVisitor);
    setIsEntryModalOpen(false);
  };

  const todayVisitorsCount = visitors.filter(v => 
    new Date(v.check_in_time).toDateString() === new Date().toDateString()
  ).length;

  const currentInsideCount = visitors.filter(v => !v.check_out_time).length;

  const handleExportCSV = () => {
    // TODO: csv export
    toast.info("Exporting visitor log to CSV... (Mock)");
  };

  return (
    <AdminLayout title="Visitor Log">
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-xl border-none shadow-sm bg-primary/5">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Today's Visitors</p>
                <p className="text-3xl font-black mt-1 text-primary">{todayVisitorsCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <UserCheck className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-none shadow-sm bg-green-500/5">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Currently Inside</p>
                <p className="text-3xl font-black mt-1 text-green-600">{currentInsideCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-green-500/10 text-green-600">
                <Users className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-none shadow-sm bg-accent/5">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Recent Checkouts</p>
                <p className="text-3xl font-black mt-1 text-accent">08</p>
              </div>
              <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                <LogOut className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2 flex-1 max-w-xl">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, flat, or phone..." 
                className="pl-10 h-10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={() => setIsEntryModalOpen(true)} className="gap-2 rounded-xl h-10 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Plus className="h-4 w-4" /> Record Visitor Entry
          </Button>
        </div>

        {/* Visitor Table */}
        <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden text-sm">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Visitor Details</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Purpose</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest font-bold">Visiting Flat</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Check-in</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Check-out</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Vehicle No</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : visitors.length > 0 ? (
                visitors.map((v) => (
                    <TableRow key={v.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-bold">{v.name}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Phone className="h-2.5 w-2.5" /> {v.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold text-[10px] uppercase tracking-widest rounded-md px-2 py-0.5">{v.purpose}</Badge>
                      </TableCell>
                      <TableCell className="font-black text-accent flex items-center gap-1.5 py-4">
                        <MapPin className="h-3.5 w-3.5" /> {v.flats?.block}-{v.flats?.flat_number}
                      </TableCell>
                      <TableCell className="text-[10px] font-mono font-bold text-muted-foreground">
                        {new Date(v.check_in_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </TableCell>
                      <TableCell className="text-[10px] font-mono font-bold text-muted-foreground italic">
                        {v.check_out_time ? new Date(v.check_out_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "STILL INSIDE"}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] font-black italic bg-muted/30 px-2 rounded-md py-1 translate-y-1 inline-block">
                        {v.vehicle_number || "NO VEHICLE"}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "rounded-full font-bold text-[10px] tracking-widest",
                          !v.check_out_time ? "bg-green-500/10 text-green-600 border-green-200" : "bg-muted text-muted-foreground border-muted-foreground/20"
                        )} variant="outline">
                          {!v.check_out_time ? "INSIDE" : "GONE"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {!v.check_out_time && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2 text-red-500 hover:text-red-100 hover:bg-red-500 rounded-full px-4 border border-red-200 transition-all hover:scale-105"
                            onClick={() => handleCheckOut(v.id)}
                          >
                            <LogOut className="h-3 w-3" /> Check Out
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                   <TableCell colSpan={8} className="text-center py-12 text-muted-foreground italic opacity-50">
                    No visitor records found.
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Record Visitor Entry Modal */}
      <Dialog open={isEntryModalOpen} onOpenChange={setIsEntryModalOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-primary to-primary/50" />
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-primary" />
                Security Checkpost
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-6 p-6 pt-2" onSubmit={handleSaveVisitor}>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Visitor Name</Label>
                <Input id="vName" name="vName" placeholder="Full identity name" required className="h-12 rounded-xl focus-visible:ring-primary font-bold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vPhone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                <Input id="vPhone" name="vPhone" placeholder="+91 XXXXX XXXXX" required className="h-12 rounded-xl focus-visible:ring-primary font-bold" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Purpose of Visit</Label>
                <Select name="vPurpose" defaultValue="Guest">
                  <SelectTrigger className="h-12 rounded-xl border-muted bg-muted/20 font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guest">Guest / Friend</SelectItem>
                    <SelectItem value="Delivery">Delivery Service</SelectItem>
                    <SelectItem value="Service">Maintenance / Service</SelectItem>
                    <SelectItem value="Cab">Cab / Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vFlat" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Destination Flat</Label>
                <Select name="vFlat" required>
                    <SelectTrigger className="h-12 rounded-xl border-muted bg-muted/20 font-semibold">
                        <SelectValue placeholder="Select Unit..." />
                    </SelectTrigger>
                    <SelectContent>
                        {flats.map(f => (
                            <SelectItem key={f.id} value={f.id} className="font-bold">Unit {f.flat_number} ({f.block})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vVeh" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vehicle Number</Label>
                <Input id="vVeh" name="vVeh" placeholder="MH-12-XX-0000" className="h-12 rounded-xl focus-visible:ring-primary font-mono uppercase" />
              </div>
              <div className="space-y-2 opacity-50 cursor-not-allowed">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Security Capture</Label>
                <Button type="button" variant="outline" className="w-full h-12 gap-3 text-xs font-bold rounded-xl border-dashed" disabled>
                  <Camera className="h-4 w-4" /> Webcam Offline
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t gap-3 mt-4">
              <Button type="button" variant="ghost" onClick={() => setIsEntryModalOpen(false)} className="rounded-xl h-12 px-6 font-medium">Discard</Button>
              <Button type="submit" className="rounded-xl h-12 px-8 font-black shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 bg-primary">
                Grant Access
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default VisitorLog;
