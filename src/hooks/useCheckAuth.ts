import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { UserResponse } from "@/types/user";

export function useCheckAuth() {
  const { authUser, setAuthUser } = useAuthStore();
  const {
    data: fetchedUser,
    isFetching,
    isLoading,
    isError,
    isPending,
    isFetchedAfterMount,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => api.get<UserResponse>("/users"),
    select: (data) => data.data.data,
    enabled: !authUser,
    staleTime: Infinity,
    retry(failureCount, err: AxiosError) {
      return err.status === 500 && failureCount < 3;
    },
  });

  useEffect(() => {
    if (authUser || isFetching || isError || !fetchedUser) return;

    setAuthUser(fetchedUser);
  }, [authUser, fetchedUser, isError, isFetching, setAuthUser]);

  return {
    isCheckingAuth:
      !isFetchedAfterMount || isLoading || isPending || isFetching,
    authenticated: !!authUser,
    fetchedOnce: isFetchedAfterMount,
  };
}
