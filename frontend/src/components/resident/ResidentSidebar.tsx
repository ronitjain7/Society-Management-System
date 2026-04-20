import { Building2, Home, CreditCard, AlertCircle, Bell, UserCheck, Car, Calendar, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "My Dashboard", url: "/resident/dashboard", icon: Home },
  { title: "My Maintenance", url: "/resident/maintenance", icon: CreditCard },
  { title: "My Complaints", url: "/resident/complaints", icon: AlertCircle },
  { title: "Notices", url: "/resident/notices", icon: Bell },
  { title: "Visitor Pre-Approval", url: "/resident/visitors", icon: UserCheck },
  { title: "Parking", url: "/resident/parking", icon: Car },
  { title: "Amenity Booking", url: "/resident/amenities", icon: Calendar },
  { title: "My Profile", url: "/resident/profile", icon: User },
];

export function ResidentSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-7 w-7 text-accent shrink-0" />
          {!collapsed && <span className="font-bold text-lg text-foreground truncate">SocietyEase</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        end
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                        activeClassName="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
