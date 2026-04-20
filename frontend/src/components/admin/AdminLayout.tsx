import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ModeToggle } from "@/components/ModeToggle";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-background/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <AdminHeader title={title} />
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
            </div>
          </header>
          <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            <Breadcrumbs />
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
