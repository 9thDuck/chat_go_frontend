import { api } from "@/lib/api";
import { LoginCredentials, UserResponse } from "@/types/user";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginCredentials) =>
      api.post<UserResponse>("/auth/login", payload),
  });
}
