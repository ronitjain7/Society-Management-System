import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import ResidentLogin from "./pages/ResidentLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";
import ResidentsManagement from "./pages/admin/ResidentsManagement";
import FlatsManagement from "./pages/admin/FlatsManagement";
import MaintenanceManagement from "./pages/admin/MaintenanceManagement";
import ComplaintsPortal from "./pages/admin/ComplaintsPortal";
import NoticeBoard from "./pages/admin/NoticeBoard";
import VisitorLog from "./pages/admin/VisitorLog";
import ResidentDashboard from "./pages/resident/ResidentDashboard";
import ResidentMaintenance from "./pages/resident/ResidentMaintenance";
import ResidentComplaints from "./pages/resident/ResidentComplaints";
import ResidentNotices from "./pages/resident/ResidentNotices";
import ResidentVisitors from "./pages/resident/ResidentVisitors";
import ResidentAmenities from "./pages/resident/ResidentAmenities";
import ResidentProfile from "./pages/resident/ResidentProfile";
import ResidentParking from "./pages/resident/ResidentParking";
import NotFound from "./pages/NotFound";

import { useAuth } from "@/hooks/use-auth";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Route Protection Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: "admin" | "resident" }) => {
  const { isAuthenticated, isLoading, role, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const loginPath = location.pathname.startsWith("/admin") ? "/admin/login" : "/resident/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    const homePath = role === "admin" ? "/admin/dashboard" : "/resident/dashboard";
    return <Navigate to={homePath} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="society-ease-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PageTransition><Index /></PageTransition>} />
                <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
                <Route path="/admin/register" element={<PageTransition><AdminRegister /></PageTransition>} />
                <Route path="/resident/login" element={<PageTransition><ResidentLogin /></PageTransition>} />

                {/* Admin Protected Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>} />
                <Route path="/admin/residents" element={<ProtectedRoute requiredRole="admin"><PageTransition><ResidentsManagement /></PageTransition></ProtectedRoute>} />
                <Route path="/admin/flats" element={<ProtectedRoute requiredRole="admin"><PageTransition><FlatsManagement /></PageTransition></ProtectedRoute>} />
                <Route path="/admin/maintenance" element={<ProtectedRoute requiredRole="admin"><PageTransition><MaintenanceManagement /></PageTransition></ProtectedRoute>} />
                <Route path="/admin/complaints" element={<ProtectedRoute requiredRole="admin"><PageTransition><ComplaintsPortal /></PageTransition></ProtectedRoute>} />
                <Route path="/admin/notices" element={<ProtectedRoute requiredRole="admin"><PageTransition><NoticeBoard /></PageTransition></ProtectedRoute>} />
                <Route path="/admin/visitors" element={<ProtectedRoute requiredRole="admin"><PageTransition><VisitorLog /></PageTransition></ProtectedRoute>} />

                {/* Resident Protected Routes */}
                <Route path="/resident/dashboard" element={<ProtectedRoute requiredRole="resident"><PageTransition><ResidentDashboard /></PageTransition></ProtectedRoute>} />
                <Route path="/resident/maintenance" element={<ProtectedRoute requiredRole="resident"><PageTransition><ResidentMaintenance /></PageTransition></ProtectedRoute>} />
                <Route path="/resident/complaints" element={<ProtectedRoute requiredRole="resident"><PageTransition><ResidentComplaints /></PageTransition></ProtectedRoute>} />
                <Route path="/resident/notices" element={<ProtectedRoute requiredRole="resident"><PageTransition><ResidentNotices /></PageTransition></ProtectedRoute>} />
                <Route path="/resident/visitors" element={<ProtectedRoute requiredRole="resident"><PageTransition><ResidentVisitors /></PageTransition></ProtectedRoute>} />
                <Route path="/resident/amenities" element={<ProtectedRoute requiredRole="resident"><PageTransition><ResidentAmenities /></PageTransition></ProtectedRoute>} />
                <Route path="/resident/profile" element={<ProtectedRoute requiredRole="resident"><PageTransition><ResidentProfile /></PageTransition></ProtectedRoute>} />
                <Route path="/resident/parking" element={<ProtectedRoute requiredRole="resident"><PageTransition><ResidentParking /></PageTransition></ProtectedRoute>} />

                {/* Error Routes */}
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
