import { api } from "@/lib/api";
import { SignupPayload } from "@/types/auth";
import { UserResponse } from "@/types/user";
import { useMutation } from "@tanstack/react-query";

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupPayload) =>
      api.post<UserResponse>("/auth/signup", payload),
  });
}
  