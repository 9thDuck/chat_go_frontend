import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface SendContactRequestParams {
  userId: number;
  message: string;
}

export function useSendContactRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, message }: SendContactRequestParams) => {
      const response = await api.post(`/contacts/requests/${userId}`, {
        message,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
} 