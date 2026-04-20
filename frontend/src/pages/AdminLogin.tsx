import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      toast({ title: "Welcome back, Admin!" });
      navigate("/admin/dashboard");
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
          <p className="text-muted-foreground text-sm">Admin Portal Login</p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="admin@society.com" className="pl-10 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
            <Button type="submit" className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
              {loading ? "Signing in…" : "Login as Admin"}
            </Button>
            <p className="text-xs text-muted-foreground text-center bg-muted p-2 rounded-lg w-full">
              Demo: <span className="font-medium">admin@society.com</span> / <span className="font-medium">admin123</span>
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Setting up a new society? <Link to="/admin/register" className="text-accent hover:underline font-medium">Register here</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
