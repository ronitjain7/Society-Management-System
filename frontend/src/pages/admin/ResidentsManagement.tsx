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
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Users as UsersIcon, 
  Car, 
  AlertCircle
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { useResidents } from "@/hooks/use-residents";
import { useFlats } from "@/hooks/use-flats";
import { Skeleton } from "@/components/ui/skeleton";

const ResidentsManagement = () => {
  const { residents, isLoading, createResident, updateResident, deleteResident } = useResidents();
  const { flats } = useFlats();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBlock, setFilterBlock] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Filter Logic
  const filteredResidents = residents.filter(res => {
    const fullName = `${res.first_name || ""} ${res.last_name || ""}`.toLowerCase();
    const flatStr = res.flats ? `${res.flats.block}-${res.flats.flat_number}`.toLowerCase() : "";
    
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      flatStr.includes(searchTerm.toLowerCase());
    
    const matchesBlock = filterBlock === "all" || (res.flats?.block === filterBlock);
    const matchesStatus = filterStatus === "all" || res.status === filterStatus;
    
    return matchesSearch && matchesBlock && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
  const currentResidents = filteredResidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddResident = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        ownership_type: formData.get("ownership") as "Owner" | "Tenant",
        status: "Active" as const,
        move_in_date: formData.get("moveInDate") as string,
        flat_id: formData.get("flatId") as string,
    };

    if (!data.flat_id) {
        toast.error("Please select a flat.");
        return;
    }

    await createResident(data);
    setIsAddModalOpen(false);
  };

  const handleEditResident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updates = {
        id: selectedResident.id,
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        ownership_type: formData.get("ownership") as "Owner" | "Tenant",
        move_in_date: formData.get("moveInDate") as string,
        flat_id: formData.get("flatId") as string,
    };

    await updateResident(updates);
    setIsAddModalOpen(false);
  };

  const handleDeleteResident = async (id: string) => {
    if (confirm("Are you sure you want to remove this resident?")) {
        await deleteResident(id);
    }
  };

  const openViewModal = (resident: any) => {
    setSelectedResident(resident);
    setIsViewModalOpen(true);
  };

  const openEditModal = (resident: any) => {
    setSelectedResident(resident);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  return (
    <AdminLayout title="Residents Management">
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Residents</h2>
          <Button onClick={() => { setIsEditMode(false); setSelectedResident(null); setIsAddModalOpen(true); }} className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> Add Resident
          </Button>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-card rounded-xl border shadow-sm">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or flat number..." 
              className="pl-10 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterBlock} onValueChange={setFilterBlock}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Filter by Block" />
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
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Residents Table */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Flat No.</TableHead>
                <TableHead>Block</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Move-in Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-9 w-9 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : currentResidents.length > 0 ? (
                currentResidents.map((resident) => (
                  <TableRow key={resident.id}>
                    <TableCell>
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${resident.email}`} alt={`${resident.first_name} ${resident.last_name}`} />
                        <AvatarFallback>{resident.first_name?.[0]}{resident.last_name?.[0]}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {resident.first_name} {resident.last_name}
                    </TableCell>
                    <TableCell>{resident.flats?.flat_number || "-"}</TableCell>
                    <TableCell>{resident.flats?.block || "-"}</TableCell>
                    <TableCell>{resident.phone}</TableCell>
                    <TableCell>{resident.move_in_date ? new Date(resident.move_in_date).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <Badge variant={resident.status === "Active" ? "default" : "secondary"} className={resident.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>
                        {resident.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openViewModal(resident)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent" onClick={() => openEditModal(resident)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteResident(resident.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground italic opacity-50">
                    No residents found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredResidents.length)} of {filteredResidents.length} residents
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Resident Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl border-none shadow-2xl">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <UsersIcon className="h-6 w-6 text-primary" />
              {isEditMode ? "Edit Resident Profile" : "Register New Resident"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={isEditMode ? handleEditResident : handleAddResident} className="space-y-6 py-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">First Name</Label>
                <div className="relative">
                  <Input id="firstName" name="firstName" defaultValue={selectedResident?.first_name} required className="h-12 rounded-xl focus-visible:ring-primary pl-10" />
                  <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Last Name</Label>
                <Input id="lastName" name="lastName" defaultValue={selectedResident?.last_name} required className="h-12 rounded-xl focus-visible:ring-primary" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Input id="email" name="email" type="email" defaultValue={selectedResident?.email} required className="h-12 rounded-xl focus-visible:ring-primary pl-10" />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                <div className="relative">
                  <Input id="phone" name="phone" defaultValue={selectedResident?.phone} required className="h-12 rounded-xl focus-visible:ring-primary pl-10" />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="flatId" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Assigned Flat</Label>
                <Select name="flatId" defaultValue={selectedResident?.flat_id}>
                  <SelectTrigger id="flatId" className="h-12 rounded-xl border-muted bg-muted/20">
                    <SelectValue placeholder="Select a unit..." />
                  </SelectTrigger>
                  <SelectContent>
                    {flats.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-bold">Unit {f.flat_number}</span>
                          <span className="text-[10px] opacity-70">Block {f.block} • {f.type}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownership" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resident Type</Label>
                <Select name="ownership" defaultValue={selectedResident?.ownership_type || "Owner"}>
                  <SelectTrigger id="ownership" className="h-12 rounded-xl border-muted bg-muted/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner" className="font-medium">Owner (Primary)</SelectItem>
                    <SelectItem value="Tenant" className="font-medium">Tenant (Rental)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <Label htmlFor="moveInDate" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Official Move-in Date</Label>
                <Input id="moveInDate" name="moveInDate" type="date" defaultValue={selectedResident?.move_in_date} required className="h-12 rounded-xl focus-visible:ring-primary" />
              </div>
            </div>
            
            <DialogFooter className="pt-6 border-t gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="rounded-xl h-12 px-6 font-medium text-muted-foreground hover:bg-muted/50">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl h-12 px-8 font-black shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-primary to-primary/80">
                {isEditMode ? "Complete Update" : "Finalize Registration"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Resident Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resident Details</DialogTitle>
          </DialogHeader>
          {selectedResident && (
            <div className="space-y-6 py-4">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary/10">
                  <AvatarImage src={selectedResident.avatar} />
                  <AvatarFallback className="text-xl">{selectedResident.firstName[0]}{selectedResident.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedResident.firstName} {selectedResident.lastName}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline">{selectedResident.flatNo}</Badge>
                    <Badge variant="outline">{selectedResident.ownershipType}</Badge>
                    <Badge className={selectedResident.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>{selectedResident.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" /> {selectedResident.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" /> {selectedResident.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Family Members */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold flex items-center gap-2">
                      <UsersIcon className="h-4 w-4 text-accent" /> Family Members
                    </h4>
                    <Button variant="outline" size="sm" className="h-7 text-xs">Add</Button>
                  </div>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow className="h-8">
                          <TableHead className="text-[10px] h-8">Name</TableHead>
                          <TableHead className="text-[10px] h-8">Relation</TableHead>
                          <TableHead className="text-[10px] h-8">Age</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedResident.familyMembers.map((member: any, i: number) => (
                          <TableRow key={i} className="h-10">
                            <TableCell className="text-xs py-2">{member.name}</TableCell>
                            <TableCell className="text-xs py-2">{member.relation}</TableCell>
                            <TableCell className="text-xs py-2">{member.age}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Vehicles */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Car className="h-4 w-4 text-accent" /> Linked Vehicles
                  </h4>
                  <div className="grid gap-2">
                    {selectedResident.vehicles.map((v: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border text-sm font-mono">
                        <Badge variant="secondary" className="bg-foreground text-background">IND</Badge>
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Other Info */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-accent/5 border border-accent/10">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Emergency Contact</p>
                  <p className="text-sm font-semibold">{selectedResident.emergencyContactName}</p>
                  <p className="text-xs text-muted-foreground">{selectedResident.emergencyContactPhone}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Move-in Date</p>
                  <p className="text-sm font-semibold">{selectedResident.moveInDate}</p>
                  <p className="text-xs text-muted-foreground hover:underline cursor-pointer flex items-center justify-end gap-1">
                    <AlertCircle className="h-3 w-3" /> View history
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ResidentsManagement;
