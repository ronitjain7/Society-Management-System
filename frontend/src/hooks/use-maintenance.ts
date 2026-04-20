import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export function useMaintenance(flatId?: string) {
  const queryClient = useQueryClient();

  const billsQuery = useQuery({
    queryKey: ["maintenance-bills", flatId],
    queryFn: async () => {
      const url = flatId ? `/maintenance?flat_id=${flatId}` : "/maintenance";
      const { data } = await api.get(url);
      return data;
    },
  });

  const createBillMutation = useMutation({
    mutationFn: async (newBill: any) => {
      const { data } = await api.post("/maintenance", newBill);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-bills"] });
      toast.success("Maintenance bill created!");
    },
    onError: (error: any) => {
      toast.error("Failed to create bill: " + (error.response?.data?.message || error.message));
    },
  });

  const payBillMutation = useMutation({
    mutationFn: async ({ billId, amount, paymentMode }: { billId: string; amount: number; paymentMode: string }) => {
      const { data } = await api.post(`/maintenance/${billId}/pay`, {
        amount_paid: amount,
        payment_mode: paymentMode,
        payment_date: new Date().toISOString(),
        transaction_id: "TXN-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-bills"] });
      toast.success("Payment processed successfully!");
    },
    onError: (error: any) => {
      toast.error("Payment failed: " + (error.response?.data?.message || error.message));
    },
  });

  // Extract payments embedded in bills data
  const bills = billsQuery.data || [];
  const payments = bills.flatMap((b: any) => (b.Payments || b.payments || []));

  return {
    bills,
    payments,
    isLoading: billsQuery.isLoading,
    createBill: createBillMutation.mutateAsync,
    payBill: payBillMutation.mutateAsync,
  };
}
