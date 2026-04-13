import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../components/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Phone, ArrowRight, Shield } from "lucide-react";
import type { User } from "@shared/schema";

// Demo accounts for quick login
const DEMO_ACCOUNTS = [
  { phone: "081234567890", label: "Demo Driver", role: "driver" },
  { phone: "081234567891", label: "Demo Penumpang (Sosial)", role: "passenger" },
  { phone: "081234567892", label: "Demo Driver Premium", role: "driver" },
  { phone: "081234567899", label: "Demo Admin", role: "admin" },
];

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (phoneNum: string) => {
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/login", { phone: phoneNum });
      const data: { user: User } = await res.json();
      setUser(data.user);
      toast({ title: `Selamat datang, ${data.user.name}!` });
      navigate("/dashboard");
    } catch (e: any) {
      toast({ title: "Login Gagal", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center mb-2">
            <svg aria-label="SeArah logo" viewBox="0 0 36 36" width="40" height="40" fill="none">
              <circle cx="18" cy="18" r="17" className="fill-primary" />
              <path d="M10 24 L18 10 L26 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="18" cy="18" r="3" fill="white"/>
              <path d="M13 24 L23 24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
            </svg>
            <span className="text-3xl font-extrabold text-primary font-display">SeArah</span>
          </div>
          <p className="text-sm text-muted-foreground">Platform Carpool Terverifikasi</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Masuk ke SeArah</CardTitle>
            <CardDescription>Masukkan nomor HP terdaftar untuk melanjutkan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor HP</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  className="pl-10"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && phone && handleLogin(phone)}
                  data-testid="input-phone"
                />
              </div>
            </div>
            <Button
              className="w-full font-semibold gap-2"
              onClick={() => handleLogin(phone)}
              disabled={!phone || loading}
              data-testid="button-submit-login"
            >
              {loading ? "Memproses..." : <>Masuk <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </CardContent>
        </Card>

        {/* Demo accounts */}
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" />
              Akun Demo (MVP)
            </CardTitle>
            <CardDescription className="text-xs">Klik untuk login langsung sebagai akun demo</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <Button
                key={acc.phone}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-2 px-3 flex flex-col items-start gap-0.5"
                onClick={() => handleLogin(acc.phone)}
                disabled={loading}
                data-testid={`button-demo-${acc.role}`}
              >
                <span className="font-semibold">{acc.label}</span>
                <span className="text-muted-foreground">{acc.phone}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
