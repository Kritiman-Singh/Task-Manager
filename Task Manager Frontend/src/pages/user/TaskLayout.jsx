import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuthStore } from "@/utils/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  CheckCircle2,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  CheckSquare2,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { to: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, label: "Dashboard" },
  { to: "/dashboard/tasks", icon: <ListTodo className="h-4 w-4" />, label: "My Tasks" },
  { to: "/dashboard/calendar", icon: <Calendar className="h-4 w-4" />, label: "Calendar" },
  { to: "/dashboard/completed", icon: <CheckCircle2 className="h-4 w-4" />, label: "Completed" },
  { to: "/dashboard/analytics", icon: <BarChart2 className="h-4 w-4" />, label: "Analytics" },
  { to: "/dashboard/settings", icon: <Settings className="h-4 w-4" />, label: "Settings" },
];

function SidebarNav({ onItemClick }) {
  return (
    <nav className="p-3 space-y-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/dashboard"}
          onClick={onItemClick}
          id={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
          className={({ isActive }) =>
            [
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarBrand() {
  return (
    <div className="flex h-14 items-center gap-2 border-b px-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <CheckSquare2 className="h-5 w-5" />
      </div>
      <span className="font-bold tracking-tight">TaskFlow</span>
    </div>
  );
}

function UserInfo({ user, onLogout }) {
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  return (
    <div className="border-t p-3">
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.image} alt={user?.name} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>
      <Button
        id="btn-logout"
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={onLogout}
      >
        <LogOut className="h-3 w-3 mr-1" /> Logout
      </Button>
    </div>
  );
}

export default function TaskLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 shrink-0 flex-col border-r bg-card">
        <SidebarBrand />
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        <UserInfo user={user} onLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarBrand />
          <SidebarNav onItemClick={() => setMobileOpen(false)} />
          <UserInfo user={user} onLogout={handleLogout} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile Top Bar */}
        <header className="flex h-14 items-center gap-2 border-b px-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(true)}
                id="btn-mobile-menu"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CheckSquare2 className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">TaskFlow</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
