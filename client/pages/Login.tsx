import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { apiLogin } from "@/lib/auth-api";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Zap } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!formData.email || !formData.password) { toast({ title: "Error", description: "Please fill in all fields" }); return; }
      try {
        const { user } = await apiLogin(formData.email, formData.password);
        localStorage.setItem("skillmate_auth", "true");
        localStorage.setItem("skillmate_user_profile", JSON.stringify({
          name: user.name,
          email: user.email,
          avatar: user.avatar || user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2),
          rating: user.rating ?? 0,
          completedExchanges: user.completedExchanges ?? 0,
          location: user.location || "",
        }));
        toast({ title: "Welcome back!" });
        window.dispatchEvent(new Event("authUpdated"));
        navigate('/browse');
      } catch (e: any) {
        toast({ title: "Login failed", description: e?.message || "Invalid email or password." });
      }
    } finally { setIsLoading(false); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center"><Zap className="w-6 h-6 text-white" /></div>
            <span className="text-foreground">SkillMate</span>
          </Link>
        </div>
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">Sign in to your SkillMate account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={handleInputChange} required />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</Button>
            </form>
            <div className="text-center">
              <Button variant="link" className="text-sm text-muted-foreground">Forgot your password?</Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Don't have an account? <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link></p>
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              <p className="font-medium mb-2">Demo credentials:</p>
              <p>Email: demo@skillmate.com</p>
              <p>Password: demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
