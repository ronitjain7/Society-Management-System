import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-xs font-medium text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
      <Link
        to="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");

        return (
          <div key={to} className="flex items-center space-x-2">
            <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform" />
            {last ? (
              <span className="text-foreground font-bold tracking-tight">{label}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
