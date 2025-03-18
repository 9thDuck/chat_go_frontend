import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  return useMutation({
    mutationFn: () => api.delete("/auth/logout"),
  });
}
