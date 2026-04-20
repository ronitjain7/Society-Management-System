import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent py-24 md:py-32">
      {/* Abstract shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary-foreground/30 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 border border-primary-foreground/20 rounded-xl rotate-45" />
      </div>

      <div className="container relative z-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Now serving 500+ residents
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight tracking-tight">
          Smart Society Management at Your Fingertips
        </h1>
        <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
          Streamline maintenance, complaints, visitors, and communication for your residential society.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 gap-2 px-8 text-base" asChild>
            <Link to="/admin/register">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-xl border-2 border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm gap-2 px-8 text-base" asChild>
            <a href="#features">
              <Play className="h-4 w-4" /> View Demo
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
