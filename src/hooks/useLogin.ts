import { api } from "@/lib/api";
import { LoginResponse } from "@/types/user";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

export function useLogin(email: string, password: string) {
  return useQuery({
    queryKey: ["login"],
    queryFn: () => api.post<LoginResponse>("/auth/login", { email, password }),
    select: (data) => data.data,
    enabled: false,
    retry(failureCount, error: AxiosError) {
      return error.status === 500 && failureCount < 3;
    },
  });
}
