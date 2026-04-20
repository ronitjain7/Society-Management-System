import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export function useNotices() {
  const queryClient = useQueryClient();

  const noticesQuery = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const { data } = await api.get("/notices");
      return data;
    },
  });

  const createNoticeMutation = useMutation({
    mutationFn: async (newNotice: any) => {
      const { data } = await api.post("/notices", newNotice);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast.success("Notice published successfully!");
    },
    onError: (error: any) => {
      toast.error("Failed to publish notice: " + (error.response?.data?.message || error.message));
    },
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast.success("Notice deleted.");
    },
    onError: (error: any) => {
      toast.error("Failed to delete notice: " + (error.response?.data?.message || error.message));
    },
  });

  return {
    notices: noticesQuery.data || [],
    isLoading: noticesQuery.isLoading,
    error: noticesQuery.error,
    createNotice: createNoticeMutation.mutateAsync,
    isCreating: createNoticeMutation.isPending,
    deleteNotice: deleteNoticeMutation.mutateAsync,
  };
}
