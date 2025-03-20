import { getSearchParams } from "@/lib/utils";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  QueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  ContactRequest,
  ContactRequestsResponse,
  ServerContactRequest,
} from "@/types/contact";
import { transformToClientContactRequest } from "@/lib/contact-utils";
import { InfiniteData } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";

export function useAcceptContactRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: number }) =>
      api.patch(`/contacts/requests/${userId}?operation=accept`, null),
    onMutate: async ({ userId }) => {
      await queryClient.cancelQueries({ queryKey: ["contact-requests"] });

      const previousData = queryClient.getQueryData<
        InfiniteData<{
          records: ContactRequest[];
          total_records: number;
        }>
      >(["contact-requests"]);

      if (previousData) {
        queryClient.setQueryData<typeof previousData>(
          ["contact-requests"],
          (old) => ({
            ...old!,
            pages: old!.pages.map((page) => ({
              ...page,
              records: page.records.filter(
                (request) =>
                  !(
                    request.senderId === userId || request.receiverId === userId
                  )
              ),
              total_records: page.total_records - 1,
            })),
          })
        );
      }

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["contact-requests"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
    },
  });
}

interface SendContactRequestParams {
  userId: number;
  message: string;
}

export function useSendContactRequest() {
  const queryClient = useQueryClient();
  const { authUser } = useAuthStore();

  return useMutation({
    mutationFn: async ({ userId, message }: SendContactRequestParams) => {
      try {
        const response = await api.post<{
          data: ServerContactRequest;
        }>(`/contacts/requests/${userId}`, {
          message,
        });

        // In this case backend will send 204 res, so we construct the request object from the input data
        if (response.status === 204) {
          return {
            senderId: authUser!.id,
            receiverId: userId,
            createdAt: new Date().toISOString(),
            senderUsername: authUser!.username,
            receiverUsername: getUsernameFromSearchCache(queryClient, userId),
          };
        }

        // If we have data, transform it, in case we change the backend in the future so that it sends the response object
        return transformToClientContactRequest(response.data.data);
      } catch (error) {
        console.error("Error sending contact request:", error);
        throw error;
      }
    },
    onMutate: async ({ userId }) => {
      await queryClient.cancelQueries({ queryKey: ["contact-requests"] });
      const receiverUsername = getUsernameFromSearchCache(queryClient, userId);

      const previousData = queryClient.getQueryData<
        InfiniteData<{
          records: ContactRequest[];
          total_records: number;
        }>
      >(["contact-requests"]);

      if (previousData && authUser) {
        const newRequest: ContactRequest = {
          senderId: authUser.id,
          receiverId: userId,
          createdAt: new Date().toISOString(),
          senderUsername: authUser.username,
          receiverUsername,
        };

        queryClient.setQueryData<typeof previousData>(
          ["contact-requests"],
          (old) => ({
            ...old!,
            pages: [
              {
                ...old!.pages[0],
                records: [newRequest, ...old!.pages[0].records],
                total_records: old!.pages[0].total_records + 1,
              },
              ...old!.pages.slice(1),
            ],
          })
        );
      }

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["contact-requests"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
    },
  });
}

export function useRejectContactRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: number }) =>
      api.patch(`/contacts/requests/${userId}?operation=reject`, null),
    onMutate: async ({ userId }) => {
      await queryClient.cancelQueries({ queryKey: ["contact-requests"] });

      const previousData = queryClient.getQueryData<
        InfiniteData<{
          records: ContactRequest[];
          total_records: number;
        }>
      >(["contact-requests"]);

      if (previousData) {
        queryClient.setQueryData<typeof previousData>(
          ["contact-requests"],
          (old) => ({
            ...old!,
            pages: old!.pages.map((page) => ({
              ...page,
              records: page.records.filter(
                (request) =>
                  !(
                    request.senderId === userId || request.receiverId === userId
                  )
              ),
              total_records: page.total_records - 1,
            })),
          })
        );
      }

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["contact-requests"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
    },
  });
}

export function useDeleteContactRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: number }) =>
      api.delete(`/contacts/requests/${userId}`),
    onMutate: async ({ userId }) => {
      await queryClient.cancelQueries({ queryKey: ["contact-requests"] });

      const previousData = queryClient.getQueryData<
        InfiniteData<{
          records: ContactRequest[];
          total_records: number;
        }>
      >(["contact-requests"]);

      if (previousData) {
        queryClient.setQueryData<typeof previousData>(
          ["contact-requests"],
          (old) => ({
            ...old!,
            pages: old!.pages.map((page) => ({
              ...page,
              records: page.records.filter(
                (request) =>
                  !(
                    request.senderId === userId || request.receiverId === userId
                  )
              ),
              total_records: page.total_records - 1,
            })),
          })
        );
      }

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["contact-requests"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
    },
  });
}

const REQUESTS_PER_PAGE = 20;

export function useGetContactRequests() {
  return useInfiniteQuery({
    queryKey: ["contact-requests"],
    queryFn: async ({ pageParam = 1 }) => {
      const searchParamsArr = [
        `page=${pageParam}`,
        `limit=${REQUESTS_PER_PAGE}`,
        `sort=created_at`,
        `sort_direction=DESC`,
      ];

      const response = await api.get<ContactRequestsResponse>(
        `/contacts/requests?${getSearchParams(searchParamsArr)}`
      );

      return response.data.data;
    },
    select: (data) => ({
      pages: data.pages.map((page) => ({
        records: page.records.map(transformToClientContactRequest),
        total_records: page.total_records,
      })),
      pageParams: data.pageParams,
    }),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage?.records?.length) return undefined;
      const totalPages = Math.ceil(lastPage.total_records / REQUESTS_PER_PAGE);
      const nextPage = pages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}

function getUsernameFromSearchCache(
  queryClient: QueryClient,
  userId: number
): string {
  const searchCache = queryClient.getQueriesData<
    InfiniteData<{
      records: { id: number; username: string; public_key: string }[];
    }>
  >({ queryKey: ["search-users"] });

  console.log("Search cache:", searchCache);

  for (const [, data] of searchCache) {
    if (!data?.pages) continue;

    console.log("Cache pages:", data.pages);

    const user = data.pages
      .flatMap((p) => p.records)
      .find((u) => u?.id === userId);

    if (user) {
      console.log("Found user:", user);
      return user.username;
    }
  }

  console.log("User not found in cache for ID:", userId);
  return "Unknown";
}
