import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export function useComplaints(residentId?: string) {
  const queryClient = useQueryClient();

  const complaintsQuery = useQuery({
    queryKey: ["complaints", residentId],
    queryFn: async () => {
      const url = residentId ? `/complaints?resident_id=${residentId}` : "/complaints";
      const { data } = await api.get(url);
      return data;
    },
  });

  const createComplaintMutation = useMutation({
    mutationFn: async (newComplaint: any) => {
      const { data } = await api.post("/complaints", newComplaint);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Complaint registered successfully!");
    },
    onError: (error: any) => {
      toast.error("Failed to register complaint: " + (error.response?.data?.message || error.message));
    },
  });

  const updateComplaintStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put(`/complaints/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Complaint status updated.");
    },
    onError: (error: any) => {
      toast.error("Failed to update status: " + (error.response?.data?.message || error.message));
    },
  });

  return {
    complaints: complaintsQuery.data || [],
    isLoading: complaintsQuery.isLoading,
    registerComplaint: createComplaintMutation.mutateAsync,
    updateStatus: updateComplaintStatusMutation.mutateAsync,
  };
}
