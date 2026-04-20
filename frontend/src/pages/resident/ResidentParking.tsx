import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, MapPin, Plus, AlertCircle } from "lucide-react";

const ResidentParking = () => {
  return (
    <ResidentLayout title="Parking Management">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-none shadow-sm h-fit">
            <CardHeader className="bg-accent/10">
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-accent" /> Assigned Slots
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-dashed">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center font-black text-xl">
                    P1
                  </div>
                  <div>
                    <p className="font-bold">Slot #102</p>
                    <p className="text-xs text-muted-foreground">Level B1 - Near Lift C</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-sm font-bold">MH-12-AB-1234</p>
                   <p className="text-[10px] text-muted-foreground uppercase font-black">Honda City</p>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-xl gap-2 h-11 border-dashed">
                <Plus className="h-4 w-4" /> Add Another Vehicle
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm h-fit">
            <CardHeader className="bg-amber-500/10">
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <AlertCircle className="h-5 w-5" /> Visitor Parking
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Expecting a guest with a vehicle? You can request a temporary visitor parking slot valid for up to 6 hours.
              </p>
              <Button className="w-full rounded-xl gap-2 h-11 bg-amber-600 hover:bg-amber-700">
                Request Visitor Slot
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-none shadow-sm">
           <CardHeader>
             <CardTitle className="text-lg">Recent Parking Activity</CardTitle>
           </CardHeader>
           <CardContent className="p-12 text-center opacity-30">
              <MapPin className="h-12 w-12 mx-auto mb-4" />
              <p className="font-bold">No recent parking events</p>
              <p className="text-xs">Your vehicle entries and exits will appear here.</p>
           </CardContent>
        </Card>
      </div>
    </ResidentLayout>
  );
};

export default ResidentParking;
