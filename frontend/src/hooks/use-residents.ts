import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export function useResidents() {
  const queryClient = useQueryClient();

  const residentsQuery = useQuery({
    queryKey: ["residents"],
    queryFn: async () => {
      const { data } = await api.get("/residents");
      return data;
    },
  });

  const createResidentMutation = useMutation({
    mutationFn: async (newResident: any) => {
      const { data } = await api.post("/auth/register", newResident);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      toast.success("Resident added successfully!");
    },
    onError: (error: any) => {
      toast.error("Failed to add resident: " + (error.response?.data?.message || error.message));
    },
  });

  const updateResidentMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data } = await api.put(`/residents/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      toast.success("Resident updated successfully!");
    },
    onError: (error: any) => {
      toast.error("Failed to update: " + (error.response?.data?.message || error.message));
    },
  });

  const deleteResidentMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/residents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      toast.success("Resident removed.");
    },
    onError: (error: any) => {
      toast.error("Failed to delete: " + (error.response?.data?.message || error.message));
    },
  });

  return {
    residents: residentsQuery.data || [],
    isLoading: residentsQuery.isLoading,
    createResident: createResidentMutation.mutateAsync,
    updateResident: updateResidentMutation.mutateAsync,
    deleteResident: deleteResidentMutation.mutateAsync,
  };
}
