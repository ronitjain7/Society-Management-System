import { Building2, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-12">
      <div className="container grid md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <a href="/" className="flex items-center gap-2 font-bold text-xl">
            <Building2 className="h-6 w-6 text-accent" />
            SocietyEase
          </a>
          <p className="mt-3 text-sm text-primary-foreground/60 max-w-xs">
            Modern society management for modern communities. Simplify operations, empower residents.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/60">
            {["Home", "Features", "About", "Contact", "Privacy Policy"].map((l) => (
              <li key={l}><a href="#" className="hover:text-accent transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/60">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> support@societyease.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +91 98765 43210</li>
          </ul>
        </div>
      </div>

      <div className="container mt-10 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/40">
        © {new Date().getFullYear()} SocietyEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
