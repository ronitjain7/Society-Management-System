import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export function useFlats() {
  const queryClient = useQueryClient();

  const flatsQuery = useQuery({
    queryKey: ["flats"],
    queryFn: async () => {
      const { data } = await api.get("/flats");
      return data;
    },
  });

  const createFlatMutation = useMutation({
    mutationFn: async (newFlat: any) => {
      const { data } = await api.post("/flats", newFlat);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flats"] });
      toast.success("Flat created successfully!");
    },
    onError: (error: any) => {
      toast.error("Failed to create flat: " + (error.response?.data?.message || error.message));
    },
  });

  const updateFlatMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data } = await api.put(`/flats/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flats"] });
      toast.success("Flat updated.");
    },
    onError: (error: any) => {
      toast.error("Failed to update flat: " + (error.response?.data?.message || error.message));
    },
  });

  // Public flats for registration (no auth needed)
  const getPublicFlats = async () => {
    const { data } = await api.get("/flats/public");
    return data;
  };

  return {
    flats: flatsQuery.data || [],
    isLoading: flatsQuery.isLoading,
    createFlat: createFlatMutation.mutateAsync,
    updateFlat: updateFlatMutation.mutateAsync,
    getPublicFlats,
  };
}
