import { UserPlus, Settings, Smile } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Register Your Society",
    desc: "Sign up as an admin, configure your society's blocks, flats, and common areas in minutes.",
  },
  {
    icon: Settings,
    step: "02",
    title: "Configure & Manage",
    desc: "Set up maintenance billing, assign parking, manage visitor logs, and broadcast notices from one dashboard.",
  },
  {
    icon: Smile,
    step: "03",
    title: "Residents Connect",
    desc: "Residents log in to pay bills, raise complaints, book amenities, and stay updated with society news.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-accent mb-3">Simple Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Get your society up and running in three easy steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-accent/20 via-accent/50 to-accent/20" />

          {steps.map((s) => (
            <div key={s.step} className="relative flex flex-col items-center text-center group">
              <div className="relative z-10 w-32 h-32 rounded-2xl bg-card border-2 border-border shadow-lg flex flex-col items-center justify-center mb-6 group-hover:border-accent group-hover:shadow-xl transition-all duration-300">
                <span className="text-xs font-black uppercase tracking-widest text-accent mb-1">{s.step}</span>
                <s.icon className="h-8 w-8 text-foreground group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
