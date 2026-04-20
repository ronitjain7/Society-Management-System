import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Society Secretary, Green Meadows",
    text: "SocietyEase cut our complaint resolution time by 60%. The dashboard gives me everything at a glance — maintenance dues, pending complaints, visitor logs. Essential for any society admin.",
    stars: 5,
    avatar: "PS",
  },
  {
    name: "Rajesh Mehta",
    role: "Resident, Block A-203",
    text: "Paying maintenance bills used to mean queuing up at the office. Now I just open the app, tap Pay, and I'm done. The amenity booking feature is a bonus!",
    stars: 5,
    avatar: "RM",
  },
  {
    name: "Anita Desai",
    role: "Treasurer, Sunset Heights",
    text: "The billing automation alone saved us hours every month. Add in the notice board and visitor tracking, and you've got a complete society management solution.",
    stars: 4,
    avatar: "AD",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-bold uppercase tracking-widest text-accent mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Loved by Communities</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            See what society admins and residents are saying about us.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="rounded-2xl border-border bg-card shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6 flex flex-col h-full">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < t.stars ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                  "{t.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                  <div className="h-10 w-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
