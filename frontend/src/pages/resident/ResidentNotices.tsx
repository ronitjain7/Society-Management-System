import { useState } from "react";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Bell, 
  Calendar, 
  User, 
  Search, 
  Megaphone, 
  Filter, 
  Eye, 
  Clock,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useNotices } from "@/hooks/use-notices";
import { Skeleton } from "@/components/ui/skeleton";

const ResidentNotices = () => {
  const { notices, isLoading } = useNotices();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || n.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ResidentLayout title="Notice Board">
      <div className="space-y-6">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search notices..." 
              className="pl-10 rounded-xl bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-none">
            <Button 
              variant={filterCategory === "all" ? "default" : "outline"} 
              size="sm" 
              className="rounded-full h-8 px-4"
              onClick={() => setFilterCategory("all")}
            >
              All
            </Button>
            {["General", "Maintenance", "Event", "Emergency"].map((cat) => (
              <Button 
                key={cat}
                variant={filterCategory === cat ? "default" : "outline"} 
                size="sm" 
                className="rounded-full h-8 px-4"
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="rounded-2xl border-none shadow-sm overflow-hidden flex flex-col h-64 animate-in fade-in duration-500">
                <div className="h-24 bg-muted animate-pulse" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : filteredNotices.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-20 text-center space-y-4">
               <div className="p-6 rounded-full bg-muted/50">
                 <Bell className="h-12 w-12 text-muted-foreground opacity-20" />
               </div>
               <div className="space-y-1">
                 <h3 className="text-xl font-bold">No notices found</h3>
                 <p className="text-sm text-muted-foreground max-w-xs">
                   {searchTerm || filterCategory !== "all" 
                     ? "Try adjusting your search or filters to find what you're looking for." 
                     : "Your society hasn't posted any notices yet. Check back later for updates."}
                 </p>
               </div>
               {(searchTerm || filterCategory !== "all") && (
                 <Button variant="outline" size="sm" className="rounded-full" onClick={() => { setSearchTerm(""); setFilterCategory("all"); }}>
                   Clear All Filters
                 </Button>
               )}
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <Card key={notice.id} className="rounded-2xl border-none shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md hover:-translate-y-1">
                <CardHeader className={cn(
                  "p-4 flex flex-row justify-between items-start",
                  notice.priority === "Urgent" ? "bg-red-500/10" : "bg-accent/10"
                )}>
                  <div className="space-y-1">
                    <Badge variant={notice.priority === "Urgent" ? "destructive" : "outline"} className="text-[10px] uppercase font-bold border-none h-5">
                      {notice.category}
                    </Badge>
                    <CardTitle className="text-lg leading-tight line-clamp-2">{notice.title}</CardTitle>
                  </div>
                  {notice.priority === "Urgent" && <Megaphone className="h-4 w-4 text-red-500 animate-pulse" />}
                </CardHeader>
                <CardContent className="p-4 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 italic">
                    "{notice.content}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-accent" /> {new Date(notice.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3 text-accent" /> {notice.created_by}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-3 border-t bg-muted/20">
                  <Button variant="ghost" size="sm" className="w-full gap-2 text-xs font-bold hover:bg-background" onClick={() => setSelectedNotice(notice)}>
                    Read Full Notice <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Notice Detail Modal */}
      <Dialog open={!!selectedNotice} onOpenChange={(open) => !open && setSelectedNotice(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedNotice && (
            <>
              <DialogHeader>
                 <div className="flex justify-between items-start pr-8">
                   <div className="space-y-1">
                     <Badge variant={selectedNotice.priority === "Urgent" ? "destructive" : "secondary"} className="h-5">
                       {selectedNotice.category}
                     </Badge>
                     <DialogTitle className="text-2xl font-black">{selectedNotice.title}</DialogTitle>
                   </div>
                 </div>
              </DialogHeader>
              <div className="space-y-6 py-4">
                 <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b pb-4">
                   <div className="flex items-center gap-2">
                     <Calendar className="h-4 w-4 text-accent" /> Posted on: {selectedNotice.date}
                   </div>
                   <div className="flex items-center gap-2">
                     <User className="h-4 w-4 text-accent" /> By: {selectedNotice.postedBy}
                   </div>
                 </div>
                 <div className="space-y-4">
                   <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                     {selectedNotice.content}
                   </p>
                 </div>
                 {selectedNotice.priority === "Urgent" && (
                   <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-700">
                     <Clock className="h-5 w-5 shrink-0" />
                     <p className="text-sm font-bold">This is an urgent notice. Please take necessary actions as mentioned above.</p>
                   </div>
                 )}
              </div>
              <div className="pt-4 border-t flex justify-end">
                <Button variant="outline" className="rounded-xl" onClick={() => setSelectedNotice(null)}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ResidentLayout>
  );
};

export default ResidentNotices;
