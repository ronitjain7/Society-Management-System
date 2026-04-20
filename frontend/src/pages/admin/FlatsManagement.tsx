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
  DialogFooter
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
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  Building, 
  User, 
  Square, 
  ParkingCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useFlats } from "@/hooks/use-flats";
import { Skeleton } from "@/components/ui/skeleton";

const FlatsManagement = () => {
  const { flats, isLoading, updateFlat } = useFlats();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBlock, setFilterBlock] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [selectedFlat, setSelectedFlat] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Stats calculation
  const stats = {
    total: flats.length,
    occupied: flats.filter(f => f.status === "Occupied").length,
    vacant: flats.filter(f => f.status === "Vacant").length,
    maintenance: flats.filter(f => f.status === "Maintenance").length,
  };

  // Filter Logic
  const filteredFlats = flats.filter(flat => {
    const matchesSearch = flat.flat_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = filterBlock === "all" || flat.block === filterBlock;
    const matchesStatus = filterStatus === "all" || flat.status === filterStatus;
    const matchesType = filterType === "all" || flat.type === filterType;
    
    return matchesSearch && matchesBlock && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Occupied": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Vacant": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Maintenance": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Occupied": return <CheckCircle2 className="h-4 w-4" />;
      case "Vacant": return <XCircle className="h-4 w-4" />;
      case "Maintenance": return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleSaveFlat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlat) return;
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updates = {
        id: selectedFlat.id,
        flat_number: formData.get("fNo") as string,
        block: formData.get("fBlock") as string,
        type: formData.get("fType") as string,
        area: parseInt(formData.get("fArea") as string),
        status: formData.get("fStatus") as any,
    };

    await updateFlat(updates);
    setIsAddModalOpen(false);
  };

  const openEditModal = (flat: any) => {
    setSelectedFlat(flat);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  return (
    <AdminLayout title="Flats & Units">
      <div className="space-y-6">
        {/* Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-xl shadow-sm border-none bg-accent/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Flats</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <Building className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm border-none bg-green-500/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Occupied</p>
                <p className="text-2xl font-bold mt-1 text-green-500">{stats.occupied}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm border-none bg-red-500/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Vacant</p>
                <p className="text-2xl font-bold mt-1 text-red-500">{stats.vacant}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <XCircle className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm border-none bg-yellow-500/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Maintenance</p>
                <p className="text-2xl font-bold mt-1 text-yellow-500">{stats.maintenance}</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search flat or resident..." 
                className="pl-10 h-10 w-[240px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex border rounded-lg overflow-hidden bg-card h-10 p-1">
              <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="icon" 
                className="h-8 w-8 rounded-md"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "secondary" : "ghost"} 
                size="icon" 
                className="h-8 w-8 rounded-md"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button onClick={() => { setIsEditMode(false); setSelectedFlat(null); setIsAddModalOpen(true); }} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> Add Flat
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 p-4 bg-muted/20 rounded-xl border">
          <Select value={filterBlock} onValueChange={setFilterBlock}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
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
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Occupied">Occupied</SelectItem>
              <SelectItem value="Vacant">Vacant</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="Flat Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="1BHK">1BHK</SelectItem>
              <SelectItem value="2BHK">2BHK</SelectItem>
              <SelectItem value="3BHK">3BHK</SelectItem>
              <SelectItem value="4BHK">4BHK</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden shadow-sm">
                <Skeleton className="h-2 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFlats.map((flat) => (
              <Card key={flat.id} className="group hover:border-primary/50 transition-all cursor-pointer overflow-hidden shadow-sm border-muted/50 bg-card/50 backdrop-blur-sm" onClick={() => openEditModal(flat)}>
                <CardContent className="p-0">
                  <div className={cn("h-2 w-full transition-colors", 
                    flat.status === "Occupied" ? "bg-green-500" : 
                    flat.status === "Vacant" ? "bg-red-500" : "bg-yellow-500"
                  )} />
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-black tracking-tight">{flat.flat_number}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{flat.type} • {flat.area} SQ FT</p>
                      </div>
                      <Badge variant="secondary" className={cn("gap-1 font-bold rounded-full text-[10px] tracking-widest uppercase py-1", getStatusColor(flat.status))}>
                        {getStatusIcon(flat.status)} {flat.status}
                      </Badge>
                    </div>
                    
                    <div className="pt-2 flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-xl">
                      <div className="p-1.5 rounded-lg bg-background shadow-sm">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="truncate font-medium">{flat.residents?.[0] ? `${flat.residents[0].first_name} ${flat.residents[0].last_name}` : "UNOCCUPIED"}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium px-1">
                      <div className="flex items-center gap-1.5">
                        <Building className="h-3 w-3" /> Block {flat.block}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Square className="h-3 w-3" /> Floor {flat.floor || "1"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-muted/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Flat Number</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Block</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Type</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Area</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Primary Resident</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlats.length > 0 ? filteredFlats.map((flat) => (
                  <TableRow key={flat.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-black text-lg">{flat.flat_number}</TableCell>
                    <TableCell className="font-medium">Block {flat.block}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className="rounded-md font-bold text-[10px]">{flat.type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">{flat.area} sq ft</TableCell>
                    <TableCell className="font-semibold">{flat.residents?.[0] ? `${flat.residents[0].first_name} ${flat.residents[0].last_name}` : "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("gap-1.5 rounded-full font-bold text-[10px] px-3", getStatusColor(flat.status))}>
                        <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", 
                            flat.status === "Occupied" ? "bg-green-500" : 
                            flat.status === "Vacant" ? "bg-red-500" : "bg-yellow-500"
                        )} />
                        {flat.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-primary font-bold text-xs hover:bg-primary/10 rounded-full" onClick={() => openEditModal(flat)}>Manage</Button>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground italic">No flats found matching your search.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add / Edit Flat Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl overflow-hidden p-0">
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary/50" />
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Building className="h-6 w-6 text-primary" />
              {isEditMode ? "Modify Unit Details" : "Register New Unit"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveFlat} className="space-y-6 p-6 pt-2">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fNo" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Unit Number</Label>
                <Input id="fNo" name="fNo" defaultValue={selectedFlat?.flat_number} placeholder="e.g. A-101" required className="h-12 rounded-xl focus-visible:ring-primary font-bold text-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fBlock" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tower / Block</Label>
                <Select name="fBlock" defaultValue={selectedFlat?.block || "A"}>
                  <SelectTrigger id="fBlock" className="h-12 rounded-xl border-muted bg-muted/20 font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Block A (North)</SelectItem>
                    <SelectItem value="B">Block B (East)</SelectItem>
                    <SelectItem value="C">Block C (West)</SelectItem>
                    <SelectItem value="D">Block D (South)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fFloor" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Level / Floor</Label>
                <Input id="fFloor" name="fFloor" type="number" defaultValue={selectedFlat?.floor || "1"} required className="h-12 rounded-xl focus-visible:ring-primary font-semibold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fType" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Configuration</Label>
                <Select name="fType" defaultValue={selectedFlat?.type || "2BHK"}>
                  <SelectTrigger id="fType" className="h-12 rounded-xl border-muted bg-muted/20 font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1BHK">1 BHK Apartment</SelectItem>
                    <SelectItem value="2BHK">2 BHK Apartment</SelectItem>
                    <SelectItem value="3BHK">3 BHK Apartment</SelectItem>
                    <SelectItem value="4BHK">4 BHK Penthouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fArea" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Area (Sq Ft)</Label>
                <Input id="fArea" name="fArea" type="number" defaultValue={selectedFlat?.area} required className="h-12 rounded-xl focus-visible:ring-primary font-semibold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fStatus" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Availability Status</Label>
                <Select name="fStatus" defaultValue={selectedFlat?.status || "Vacant"}>
                  <SelectTrigger id="fStatus" className="h-12 rounded-xl border-muted bg-muted/20 font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Occupied" className="text-green-600 font-bold">Occupied</SelectItem>
                    <SelectItem value="Vacant" className="text-red-600 font-bold">Vacant</SelectItem>
                    <SelectItem value="Maintenance" className="text-yellow-600 font-bold">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-6 border-t gap-3 mt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="rounded-xl h-12 px-6 font-medium text-muted-foreground hover:bg-muted/50">
                Discard Changes
              </Button>
              <Button type="submit" className="rounded-xl h-12 px-8 font-black shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-primary to-primary/80">
                {isEditMode ? "Confirm Update" : "Create Unit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default FlatsManagement;
