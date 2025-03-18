import { api } from "@/lib/api";
import { SignupCredentials } from "@/types/auth";
import { UserResponse } from "@/types/user";
import { useMutation } from "@tanstack/react-query";

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupCredentials) =>
      api.post<UserResponse>("/auth/signup", payload),
  });
}
