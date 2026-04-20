import { Users, Receipt, UserCheck, MessageSquare, Bell, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Users, title: "Resident Management", desc: "Easily manage all residents, flats, and ownership records in one place." },
  { icon: Receipt, title: "Maintenance Billing", desc: "Auto-generate bills, track payments, and send reminders effortlessly." },
  { icon: UserCheck, title: "Visitor Tracking", desc: "Pre-approve visitors and track entry/exit logs for enhanced security." },
  { icon: MessageSquare, title: "Complaint Portal", desc: "Raise, track, and resolve complaints with real-time status updates." },
  { icon: Bell, title: "Notice Board", desc: "Broadcast announcements and notices to all residents instantly." },
  { icon: Calendar, title: "Amenity Booking", desc: "Book clubhouse, gym, and other shared amenities with a few clicks." },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Everything You Need</h2>
          <p className="mt-4 text-muted-foreground text-lg">Powerful features to simplify society operations and delight residents.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="rounded-xl border-border bg-card shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <f.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
