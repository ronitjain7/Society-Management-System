import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const steps = ["Society Details", "Admin Account", "Review & Submit"];

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// TODO: Replace with Supabase insert calls
async function createSociety(_data: Record<string, string>) {
  console.log("Mock create society:", _data);
  return true;
}

const AdminRegister = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const [form, setForm] = useState({
    societyName: "", address: "", city: "", pincode: "", totalFlats: "", societyType: "Apartment",
    fullName: "", email: "", phone: "", password: "", confirmPassword: "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const canNext = () => {
    if (step === 0) return form.societyName && form.address && form.city && form.pincode && form.totalFlats;
    if (step === 1) return form.fullName && form.email && form.phone && form.password && form.password === form.confirmPassword;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await register({
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      resident_type: "Admin" as any,
      flat_id: 1, // Defaulting to 1 for Admin
    });
    setLoading(false);
    
    if (res.success) {
      toast({ title: "Society and Admin created successfully!" });
      navigate("/admin/dashboard");
    } else {
      toast({ description: res.error || "Failed to register", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg rounded-xl shadow-lg border-border">
        <CardHeader className="text-center space-y-4 pb-2">
          <Link to="/" className="inline-flex items-center justify-center gap-2 text-primary font-bold text-2xl">
            <Building2 className="h-8 w-8 text-accent" />
            SocietyEase
          </Link>
          {/* Progress bar */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < step ? "bg-accent text-accent-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={`w-10 h-0.5 ${i < step ? "bg-accent" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-foreground">{steps[step]}</p>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {step === 0 && (
            <>
              <Field label="Society Name" value={form.societyName} onChange={set("societyName")} placeholder="Green Valley Apartments" />
              <Field label="Address" value={form.address} onChange={set("address")} placeholder="123, MG Road" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="City" value={form.city} onChange={set("city")} placeholder="Mumbai" />
                <Field label="Pincode" value={form.pincode} onChange={set("pincode")} placeholder="400001" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Total Flats" value={form.totalFlats} onChange={set("totalFlats")} placeholder="120" type="number" />
                <div className="space-y-2">
                  <Label>Society Type</Label>
                  <Select value={form.societyType} onValueChange={(v) => setForm((p) => ({ ...p, societyType: v }))}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Township">Township</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Full Name" value={form.fullName} onChange={set("fullName")} placeholder="Rahul Sharma" />
              <Field label="Email" value={form.email} onChange={set("email")} placeholder="admin@society.com" type="email" />
              <Field label="Phone" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
              <Field label="Password" value={form.password} onChange={set("password")} type="password" />
              <Field label="Confirm Password" value={form.confirmPassword} onChange={set("confirmPassword")} type="password" />
              {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <SummaryGroup title="Society Details" items={[
                ["Society Name", form.societyName], ["Address", form.address],
                ["City", form.city], ["Pincode", form.pincode],
                ["Total Flats", form.totalFlats], ["Type", form.societyType],
              ]} />
              <SummaryGroup title="Admin Account" items={[
                ["Name", form.fullName], ["Email", form.email], ["Phone", form.phone],
              ]} />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between gap-3">
          {step > 0 ? (
            <Button variant="outline" className="rounded-xl gap-1" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          ) : <div />}
          {step < 2 ? (
            <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-1" disabled={!canNext()} onClick={() => setStep(step + 1)}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading} onClick={handleSubmit}>
              {loading ? "Creating…" : "Submit & Create Society"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

const Field = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input className="rounded-xl" {...props} />
  </div>
);

const SummaryGroup = ({ title, items }: { title: string; items: [string, string][] }) => (
  <div className="bg-muted rounded-xl p-4">
    <h4 className="font-semibold text-sm text-foreground mb-2">{title}</h4>
    <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm">
      {items.map(([k, v]) => (
        <div key={k}><span className="text-muted-foreground">{k}:</span> <span className="font-medium text-foreground">{v}</span></div>
      ))}
    </div>
  </div>
);

export default AdminRegister;
