import { Building2, Home, Users, Building, CreditCard, AlertCircle, Bell, UserCheck, Car, Calendar, Briefcase, Settings, LogOut } from "lucide-react";
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
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Residents", url: "/admin/residents", icon: Users },
  { title: "Flats & Units", url: "/admin/flats", icon: Building },
  { title: "Maintenance & Billing", url: "/admin/maintenance", icon: CreditCard },
  { title: "Complaints", url: "/admin/complaints", icon: AlertCircle },
  { title: "Notices", url: "/admin/notices", icon: Bell },
  { title: "Visitor Log", url: "/admin/visitors", icon: UserCheck },
  { title: "Parking", url: "/admin/parking", icon: Car },
  { title: "Amenity Booking", url: "/admin/amenities", icon: Calendar },
  { title: "Staff Management", url: "/admin/staff", icon: Briefcase },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
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
                        activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
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
