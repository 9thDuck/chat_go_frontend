import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMessagesStore } from "@/store/useMessagesStore";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function useLogout() {
  const { removeAuthUser, removePrivateKey } = useAuthStore();
  const clearMessages = useMessagesStore((state) => state.clear);
  const queryClient = useQueryClient();

  const performCleanup = useCallback(() => {
    removeAuthUser();
    removePrivateKey();
    clearMessages();
    queryClient.clear();
    localStorage.removeItem("auth-state");
  }, [removeAuthUser, removePrivateKey, clearMessages, queryClient]);

  return useMutation({
    mutationFn: () => api.delete("/auth/logout"),
    onSuccess: performCleanup,
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        performCleanup();
      }
    },
  });
}
