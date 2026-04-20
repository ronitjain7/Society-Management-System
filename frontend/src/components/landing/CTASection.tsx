import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent py-20 md:py-24">
      {/* Background accents */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-accent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 text-center max-w-3xl mx-auto">
        <ShieldCheck className="h-12 w-12 text-accent mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground leading-tight">
          Ready to Modernize Your Society?
        </h2>
        <p className="mt-4 text-lg text-primary-foreground/70 max-w-xl mx-auto">
          Join hundreds of societies already using SocietyEase to streamline operations, reduce paperwork, and keep residents happy.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 gap-2 px-8 text-base" asChild>
            <Link to="/admin/register">
              Start Free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-xl border-2 border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm gap-2 px-8 text-base" asChild>
            <Link to="/admin/login">
              Admin Login
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
