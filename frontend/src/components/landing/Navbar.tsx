import { useState } from "react";
import { Building2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const navLinks = ["Home", "Features", "About", "Contact"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
          <Building2 className="h-7 w-7 text-accent" />
          SocietyEase
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {l}
            </a>
          ))}
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" className="rounded-xl" asChild><Link to="/resident/login">Resident Login</Link></Button>
          <Button className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90" asChild><Link to="/admin/login">Admin Login</Link></Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pb-4 space-y-3">
          {navLinks.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="block text-sm font-medium text-muted-foreground py-2">
              {l}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Button variant="outline" className="rounded-xl w-full" asChild><Link to="/resident/login">Resident Login</Link></Button>
            <Button className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 w-full" asChild><Link to="/admin/login">Admin Login</Link></Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
