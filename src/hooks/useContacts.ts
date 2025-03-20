import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ContactsResponse } from "@/types/contact";
import useContactsStore from "@/store/useContactsStore";
import { transformToClientUser } from "@/lib/auth-utils";
import { getSearchParams } from "@/lib/utils";
const CONTACTS_PER_PAGE = 20;

interface UseContactsQueryParams {
  searchTerm?: string;
}

export function useGetContacts({
  searchTerm = "",
}: UseContactsQueryParams = {}) {
  const { setContacts, appendContacts, setTotalContacts } = useContactsStore();

  const fetchContacts = async ({ pageParam = 1 }) => {
    const searchParamsArr = [
      searchTerm ? `q=${searchTerm}` : "",
      `page=${pageParam}`,
      `limit=${CONTACTS_PER_PAGE}`,
      `sort=username`,
      `sort_direction=ASC`
    ]
      const endpoint = searchTerm.length > 0 ? `/contacts/search` : "/contacts"
      const response = await api.get<ContactsResponse>(
        `${endpoint}?${getSearchParams(searchParamsArr)}`
      );
      
      const formattedContacts = response.data.data.records.map(transformToClientUser);
      if (pageParam === 1) {
        setContacts(formattedContacts);
      } else {
        appendContacts(formattedContacts);
      }
      setTotalContacts(response.data.data.total_records);
      
      return response.data.data;
  };

  return useInfiniteQuery({
    queryKey: ["contacts", searchTerm],
    queryFn: fetchContacts,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage?.records?.length) return undefined;
      const totalPages = Math.ceil(lastPage.total_records / CONTACTS_PER_PAGE);
      const nextPage = pages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    retry: false,
    initialPageParam: 1,
  });
} 