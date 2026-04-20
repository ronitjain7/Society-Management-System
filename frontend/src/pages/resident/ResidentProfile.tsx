import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Home, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

const ResidentProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <ResidentLayout title="My Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-accent/10 p-8 flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-3xl font-black shadow-lg mb-4">
              {user?.name?.[0] || "R"}
            </div>
            <CardTitle className="text-2xl">{user?.name || "Resident Name"}</CardTitle>
            <p className="text-muted-foreground font-medium">Flat A-203 • Resident since 2022</p>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-bold text-lg border-b pb-2">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Email Address</p>
                    <p className="font-medium">{user?.email || "resident@example.com"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Phone Number</p>
                    <p className="font-medium">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-lg border-b pb-2">Account Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Primary Residence</p>
                    <p className="font-medium">Block A, Flat 203</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Verification Status</p>
                    <p className="font-medium text-green-600 flex items-center gap-1 leading-none italic">Verified Resident</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-8 flex gap-4">
                <Button className="rounded-xl px-8">Edit Profile</Button>
                <Button variant="outline" className="rounded-xl px-8 gap-2 text-destructive hover:text-destructive hover:bg-destructive/5" onClick={() => { logout(); navigate("/"); }}>
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResidentLayout>
  );
};

export default ResidentProfile;
