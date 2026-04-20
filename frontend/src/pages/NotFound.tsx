import { Link } from "react-router-dom";
import { MoveLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-6 rounded-3xl bg-amber-500/10 text-amber-500">
            <AlertTriangle className="h-16 w-16" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold">Lost in the society?</h2>
          <p className="text-muted-foreground">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button asChild className="rounded-2xl h-12 px-8 gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
          <Link to="/">
            <MoveLeft className="h-4 w-4" /> Go Back Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
