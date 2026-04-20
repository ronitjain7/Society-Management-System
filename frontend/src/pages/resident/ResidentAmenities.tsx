import { useState } from "react";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  ArrowRight,
  Dribbble,
  Music,
  Waves,
  Heart,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useAmenities } from "@/hooks/use-visitors"; // Wait, I put both hooks in one file
import { useResidents } from "@/hooks/use-residents";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

const AMENITIES = [
  { id: "AM-01", name: "Clubhouse", icon: Music, color: "bg-purple-500", avail: "09 AM - 10 PM", price: "Free", img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=400" },
  { id: "AM-02", name: "Swimming Pool", icon: Waves, color: "bg-blue-500", avail: "06 AM - 08 PM", price: "Free", img: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=400" },
  { id: "AM-03", name: "Community Hall", icon: Users, color: "bg-orange-500", avail: "10 AM - 11 PM", price: "Paid", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400" },
  { id: "AM-04", name: "Gymnasium", icon: Heart, color: "bg-red-500", avail: "05 AM - 10 PM", price: "Free", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400" },
  { id: "AM-05", name: "Badminton Court", icon: Dribbble, color: "bg-green-500", avail: "06 AM - 09 PM", price: "Free", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=400" },
];

const ResidentAmenities = () => {
  const { user } = useAuth();
  const { residents } = useResidents();
  const { bookings, isLoading, createBooking, cancelBooking } = useAmenities();
  const [selectedAmenity, setSelectedAmenity] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Find current resident
  const currentResident = residents.find(r => r.email === user?.email);
  const residentId = currentResident?.id;

  // Filter bookings for this resident
  const myBookings = bookings.filter(b => b.resident_id === residentId);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!residentId || !selectedAmenity) {
        toast.error("Booking failed. Missing resident profile context.");
        return;
    }

    const formData = new FormData(e.currentTarget);
    const newBooking = {
        resident_id: residentId,
        amenity_name: selectedAmenity.name,
        booking_date: formData.get("date") as string,
        time_slot: formData.get("slot") as string,
        status: "Confirmed" as const,
    };

    await createBooking(newBooking);
    setIsBookingModalOpen(false);
    setSelectedAmenity(null);
  };

  return (
    <ResidentLayout title="Amenity Booking">
      <div className="space-y-10">
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-black tracking-tight">Premium Amenities</h2>
            <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest border-primary/30 text-primary bg-primary/5">Members Only</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AMENITIES.map((item) => (
              <Card key={item.id} className="rounded-3xl border-none shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                <div className="h-48 overflow-hidden relative">
                   <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                      <div className="flex items-center gap-3 text-white">
                        <div className={cn("p-2 rounded-xl text-white", item.color)}>
                            <item.icon className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-black tracking-tight">{item.name}</span>
                      </div>
                   </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <Clock className="h-4 w-4 text-primary" /> {item.avail}
                    </span>
                    <Badge className={cn(
                        "font-black text-[10px] uppercase tracking-widest rounded-full px-3 py-1",
                        item.price === "Free" ? "bg-green-500/10 text-green-600 border-none" : "bg-primary text-primary-foreground"
                    )}>
                      {item.price}
                    </Badge>
                  </div>
                  <Button 
                    className="w-full h-12 gap-3 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20" 
                    onClick={() => { setSelectedAmenity(item); setIsBookingModalOpen(true); }}
                  >
                    Reserve Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight">Active Reservations</h2>
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
             <CardContent className="p-0">
               <Table>
                 <TableHeader className="bg-muted/30">
                   <TableRow>
                     <TableHead className="pl-8 font-black text-[10px] uppercase tracking-widest py-6">Amenity</TableHead>
                     <TableHead className="font-black text-[10px] uppercase tracking-widest">Reserved Date</TableHead>
                     <TableHead className="font-black text-[10px] uppercase tracking-widest">Time Slot</TableHead>
                     <TableHead className="font-black text-[10px] uppercase tracking-widest">Booking Status</TableHead>
                     <TableHead className="text-right pr-8 font-black text-[10px] uppercase tracking-widest">Manage</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {isLoading ? (
                     Array.from({ length: 2 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell className="pl-8"><Skeleton className="h-10 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell className="pr-8"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                        </TableRow>
                     ))
                   ) : myBookings.length > 0 ? myBookings.map((b) => (
                    <TableRow key={b.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="pl-8 py-5">
                          <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {b.amenity_name[0]}
                              </div>
                              <span className="font-black text-sm">{b.amenity_name}</span>
                          </div>
                      </TableCell>
                      <TableCell className="text-sm font-bold text-muted-foreground">
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> {new Date(b.booking_date).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-muted-foreground">
                        <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary/60" /> {b.time_slot}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "font-black text-[10px] uppercase tracking-widest rounded-full px-3 py-1",
                          b.status === "Confirmed" ? "bg-green-500/10 text-green-600 border-green-200" : "bg-muted text-muted-foreground"
                        )} variant="outline">
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        {b.status === "Confirmed" && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 px-4 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 font-bold gap-2 transition-all active:scale-95"
                            onClick={() => cancelBooking(b.id)}
                          >
                            <XCircle className="h-4 w-4" /> Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic opacity-60">You have no active amenity reservations.</TableCell>
                    </TableRow>
                  )}
                 </TableBody>
               </Table>
             </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Book {selectedAmenity?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBooking} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Booking Date</Label>
              <Input id="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slot">Available Slots</Label>
              <Select required>
                <SelectTrigger id="slot">
                  <SelectValue placeholder="Select an available time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slot-1">08:00 AM - 09:00 AM</SelectItem>
                  <SelectItem value="slot-2">09:00 AM - 10:00 AM</SelectItem>
                  <SelectItem value="slot-3">04:00 PM - 05:00 PM</SelectItem>
                  <SelectItem value="slot-4">05:00 PM - 06:00 PM</SelectItem>
                  <SelectItem value="slot-5">06:00 PM - 07:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
               <Label htmlFor="notes">Special Requirements</Label>
               <Input id="notes" placeholder="e.g. Guest names or specific equipment" />
            </div>
            {selectedAmenity?.price === "Paid" && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-amber-700">
                <Clock className="h-5 w-5 shrink-0" />
                <p className="text-xs font-medium">This amenity is paid. You will be billed ₹500 in your next maintenance cycle.</p>
              </div>
            )}
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsBookingModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="gap-2">
                <CheckCircle2 className="h-4 w-4" /> Confirm Booking
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ResidentLayout>
  );
};

export default ResidentAmenities;
