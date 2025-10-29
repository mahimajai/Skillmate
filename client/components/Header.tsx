import { Bell, Plus, User, Zap, Menu, Settings, LogOut, BarChart3 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getUnreadNotificationsCount } from "@/lib/notifications-storage";
import { isLoggedIn, getUserProfile, logoutUser } from "@/lib/auth-storage";
import { apiLogout, apiSignout } from "@/lib/auth-api";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Browse Skills", href: "/browse" },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const updateNotificationCount = () => setUnreadCount(getUnreadNotificationsCount());
    const updateAuthState = () => {
      const loggedIn = isLoggedIn();
      setUserLoggedIn(loggedIn);
      setUserProfile(loggedIn ? getUserProfile() : null);
    };
    updateNotificationCount();
    updateAuthState();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "skillmate_notifications") updateNotificationCount();
      if (e.key === "skillmate_auth" || e.key === "skillmate_user_profile") updateAuthState();
    };
    window.addEventListener("storage", handleStorageChange);

    const handleNotificationChange = () => updateNotificationCount();
    const handleAuthChange = () => updateAuthState();
    window.addEventListener("notificationUpdated", handleNotificationChange);
    window.addEventListener("authUpdated", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("notificationUpdated", handleNotificationChange);
      window.removeEventListener("authUpdated", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try { await apiLogout(); } catch {}
    logoutUser();
    setShowUserMenu(false);
    window.dispatchEvent(new Event("authUpdated"));
    navigate('/');
  };

  const handleAccountDelete = async () => {
    if (!userProfile) return;
    const confirmDel = window.confirm("Delete your account permanently? This cannot be undone.");
    if (!confirmDel) return;
    const password = window.prompt("Please enter your password to confirm account deletion") || "";
    try {
      await apiSignout(userProfile.email, password);
      logoutUser();
      window.dispatchEvent(new Event("authUpdated"));
      navigate('/');
    } catch (e: any) {
      alert(e?.message || 'Failed to delete account');
    } finally {
      setShowUserMenu(false);
    }
  };

  return (
    <header className="border-b border-border/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">SkillMate</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-4",
                  location.pathname === item.href
                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            {userLoggedIn && (
              <Button className="hidden md:flex items-center space-x-2 bg-primary hover:bg-primary/90" onClick={() => navigate('/new-post')}>
                <Plus className="w-4 h-4" />
                <span className="hidden lg:inline">New Post</span>
              </Button>
            )}

            {userLoggedIn && (
              <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/notifications')}>
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </Button>
            )}

            {userLoggedIn && userProfile ? (
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative" onClick={() => setShowUserMenu(!showUserMenu)}>
                  <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center font-semibold text-primary text-sm">
                    {userProfile.avatar}
                  </div>
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 bg-green-500 text-white text-xs flex items-center justify-center">•</Badge>
                </Button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border/20 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-border/20">
                      <p className="font-semibold text-foreground">{userProfile.name}</p>
                      <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                    </div>
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/50 flex items-center space-x-2" onClick={() => { navigate('/profile'); setShowUserMenu(false); }}>
                        <User className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/50 flex items-center space-x-2" onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }}>
                        <BarChart3 className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                      <div className="border-t border-border/20 mt-1 pt-1">
                        <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/50 flex items-center space-x-2" onClick={handleLogout}>
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted/50 flex items-center space-x-2" onClick={handleAccountDelete}>
                          <LogOut className="w-4 h-4" />
                          <span>Delete Account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
                <Button size="sm" onClick={() => navigate('/signup')}>Sign Up</Button>
              </div>
            )}

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden border-t border-border/20 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} className={cn(
                  "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )} onClick={() => setShowMobileMenu(false)}>
                  {item.name}
                </Link>
              ))}
            </nav>
            {userLoggedIn ? (
              <Button className="w-full mt-3" onClick={() => { navigate('/new-post'); setShowMobileMenu(false); }}>
                <Plus className="w-4 h-4 mr-2" />Create New Post
              </Button>
            ) : (
              <div className="flex gap-2 mt-3">
                <Button variant="outline" className="flex-1" onClick={() => { navigate('/login'); setShowMobileMenu(false); }}>Login</Button>
                <Button className="flex-1" onClick={() => { navigate('/signup'); setShowMobileMenu(false); }}>Sign Up</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
