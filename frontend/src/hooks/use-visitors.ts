import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export const useVisitors = () => {
  const queryClient = useQueryClient();

  const { data: visitors = [], isLoading } = useQuery({
    queryKey: ["visitors"],
    queryFn: async () => {
      const { data } = await api.get("/visitors");
      return data;
    },
  });

  const createVisitor = useMutation({
    mutationFn: async (newVisitor: any) => {
      const { data } = await api.post("/visitors", newVisitor);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
      toast.success("Visitor recorded successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to record visitor: " + (error.response?.data?.message || error.message));
    },
  });

  const checkoutVisitor = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.put(`/visitors/${id}/checkout`, {
        check_out_time: new Date().toISOString(),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
      toast.success("Visitor checked out");
    },
    onError: (error: any) => {
      toast.error("Failed to check out: " + (error.response?.data?.message || error.message));
    },
  });

  return {
    visitors,
    isLoading,
    createVisitor: createVisitor.mutateAsync,
    checkoutVisitor: checkoutVisitor.mutateAsync,
  };
};

export const useAmenities = () => {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["amenity_bookings"],
    queryFn: async () => {
      const { data } = await api.get("/bookings");
      return data;
    },
  });

  const createBooking = useMutation({
    mutationFn: async (newBooking: any) => {
      const { data } = await api.post("/bookings", newBooking);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amenity_bookings"] });
      toast.success("Amenity booked successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to book amenity: " + (error.response?.data?.message || error.message));
    },
  });

  const cancelBooking = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.put(`/bookings/${id}/cancel`, { status: "Cancelled" });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amenity_bookings"] });
      toast.success("Booking cancelled");
    },
    onError: (error: any) => {
      toast.error("Failed to cancel: " + (error.response?.data?.message || error.message));
    },
  });

  return {
    bookings,
    isLoading,
    createBooking: createBooking.mutateAsync,
    cancelBooking: cancelBooking.mutateAsync,
  };
};
