import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ResidentHeaderProps {
  title: string;
}

export function ResidentHeader({ title }: ResidentHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium leading-none">{user?.name || "Resident"}</p>
          <p className="text-xs text-muted-foreground mt-1">Flat A-203</p>
        </div>
        <Avatar className="h-9 w-9 border border-border">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.email}`} />
          <AvatarFallback>{user?.name?.[0] || "R"}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
