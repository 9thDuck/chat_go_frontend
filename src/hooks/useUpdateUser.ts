import { api } from "@/lib/api";
import { UserResponse } from "@/types/user";
import { useMutation } from "@tanstack/react-query";

export type UpdateUserPayload = {
  first_name: string;
  last_name: string;
  profile_pic: string;
};

export function useUpdateUser(userId: number) {
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      api.patch<UserResponse>(`/users/${userId}`, payload),
  });
} 