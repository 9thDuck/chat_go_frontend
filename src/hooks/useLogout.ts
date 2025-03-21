import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useLogout() {
  const { removeAuthUser } = useAuthStore();
  return useMutation({
    mutationFn: () => api.delete("/auth/logout"),
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        removeAuthUser();
      }
    },
  });
}
