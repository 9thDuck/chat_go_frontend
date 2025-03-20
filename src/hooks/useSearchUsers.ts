import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getSearchParams } from "@/lib/utils";
import { SearchUsersResponse } from "@/types/contact";



const USERS_PER_PAGE = 10;

export function useSearchUsers(searchTerm: string) {
  return useInfiniteQuery({
    queryKey: ["users", "search", searchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const searchParamsArr = [
        `q=${searchTerm}`,
        `page=${pageParam}`,
        `limit=${USERS_PER_PAGE}`,
        `sort=username`,
        `sort_direction=ASC`
      ];

      const response = await api.get<SearchUsersResponse>(
        `/users/search?${getSearchParams(searchParamsArr)}`
      );
      
      return response.data.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage?.records?.length) return undefined;
      const totalPages = Math.ceil(lastPage.total_records / USERS_PER_PAGE);
      const nextPage = pages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    enabled: searchTerm.length >= 3,
    initialPageParam: 1,
  });
} 