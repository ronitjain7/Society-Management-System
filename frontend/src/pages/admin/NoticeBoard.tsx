import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Bell, 
  Calendar, 
  User, 
  Trash2, 
  Edit, 
  AlertTriangle, 
  Megaphone,
  Eye,
  MoreVertical,
  Paperclip
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useNotices } from "@/hooks/use-notices";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

const NoticeBoard = () => {
  const { user } = useAuth();
  const { notices, isLoading, createNotice, deleteNotice } = useNotices();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const priority = formData.get("priority") as "Normal" | "Urgent";
    const content = formData.get("content") as string;

    await createNotice({
      title,
      category,
      priority,
      content,
      created_by: user?.name || "Admin",
    });
    
    setIsAddModalOpen(false);
  };

  return (
    <AdminLayout title="Notice Board">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Society Notices</h2>
            <p className="text-sm text-muted-foreground">Manage and broadcast official updates to residents.</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> Post New Notice
          </Button>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="rounded-2xl border-none shadow-sm overflow-hidden flex flex-col h-64">
                <div className="h-24 bg-muted animate-pulse" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : notices.length === 0 ? (
            // Empty State
            <div className="md:col-span-2 lg:col-span-3 py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-6 rounded-full bg-muted/50">
                <Bell className="h-12 w-12 text-muted-foreground opacity-20" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-xl">No notices yet</p>
                <p className="text-sm text-muted-foreground max-w-xs">Broadcast your first official announcement to the residents.</p>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)} variant="outline" className="rounded-xl">
                Get Started
              </Button>
            </div>
          ) : (
            notices.map((notice) => (
              <Card key={notice.id} className="rounded-2xl border-none shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md hover:-translate-y-1">
                <CardHeader className={cn(
                  "p-4 flex flex-row justify-between items-start",
                  notice.priority === "Urgent" ? "bg-red-500/10" : "bg-primary/5"
                )}>
                  <div className="space-y-1">
                    <Badge variant={notice.priority === "Urgent" ? "destructive" : "outline"} className="text-[10px] uppercase font-bold px-1.5 h-5">
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
                  <div className="grid grid-cols-1 gap-2 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> {new Date(notice.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3" /> {notice.created_by}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-3 border-t bg-muted/20 flex justify-between gap-2">
                  <Button variant="ghost" size="sm" className="h-8 flex-1 gap-1 text-xs hover:bg-background" onClick={() => setSelectedNotice(notice)}>
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 flex-1 gap-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50" >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the notice "{notice.title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => deleteNotice(notice.id)}>
                          Delete Notice
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))
          )}
          
          {/* Simplified Add Card */}
          {!isLoading && notices.length > 0 && (
            <Card 
              className="rounded-2xl border-2 border-dashed border-muted bg-transparent flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors h-full min-h-[200px]"
              onClick={() => setIsAddModalOpen(true)}
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <p className="font-bold text-sm">Post New Notice</p>
            </Card>
          )}
        </div>
      </div>

      {/* Post New Notice Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Post Official Notice</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePostNotice} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Notice Title</Label>
              <Input id="title" placeholder="e.g. Lift Maintenance Schedule" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue="General">
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select defaultValue="Normal">
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Notice Content</Label>
              <Textarea 
                id="content" 
                placeholder="Write your notice here..." 
                className="min-h-[150px] resize-none" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visibility">Visible To</Label>
                <Select defaultValue="All Residents">
                  <SelectTrigger id="visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Residents">All Residents</SelectItem>
                    <SelectItem value="Block A">Block A Only</SelectItem>
                    <SelectItem value="Block B">Block B Only</SelectItem>
                    <SelectItem value="Block C">Block C Only</SelectItem>
                    <SelectItem value="Block D">Block D Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="h-10 border rounded-md flex items-center px-3 text-xs text-muted-foreground cursor-pointer hover:bg-muted/50 truncate">
                  <Paperclip className="h-3.5 w-3.5 mr-2" />
                  Upload PDF or Image (Optional)
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="gap-2">
                <Megaphone className="h-4 w-4" /> Broadcast Notice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default NoticeBoard;
