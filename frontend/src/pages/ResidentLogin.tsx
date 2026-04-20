import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, Mail, Lock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const ResidentLogin = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      toast({ title: "Welcome back!" });
      navigate("/resident/dashboard");
    } else {
      toast({ title: "Login failed", description: result.error, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md rounded-xl shadow-lg border-border">
        <CardHeader className="text-center space-y-3 pb-2">
          <Link to="/" className="inline-flex items-center justify-center gap-2 text-primary font-bold text-2xl">
            <Building2 className="h-8 w-8 text-accent" />
            SocietyEase
          </Link>
          <p className="text-accent text-sm font-medium">Resident Portal Login</p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email or Flat Number</Label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" placeholder="email@example.com or A-101" className="pl-10 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-accent hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10 rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
              {loading ? "Signing in…" : "Login as Resident"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Don't have access? Contact your society admin.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResidentLogin;
