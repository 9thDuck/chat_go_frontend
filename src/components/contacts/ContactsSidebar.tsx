import { useRef, useState } from "react";
import { Input } from "@/components/Input";
import { Search, Plus, Bell, Users } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/classNames";
import { useGetContacts } from "@/hooks/useContacts";
import { Link, useSearchParams } from "react-router-dom";
import { ContactsList } from "@/components/contacts/ContactsList";
import { useGetContactRequests } from "@/hooks/useContactRequest";
import { RequestsList } from "@/components/RequestsList";
import { User } from "@/types/user";
import { InfiniteData } from "@tanstack/react-query";

type ViewMode = "contacts" | "requests";

export function ContactsSidebar() {
  const [searchParams] = useSearchParams();
  const viewParam = searchParams.get("view");
  const [viewMode, setViewMode] = useState<ViewMode>(
    viewParam === "requests" ? "requests" : "contacts"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    data: contactsData,
    isLoading: isLoadingContacts,
    hasNextPage: hasNextPageContacts,
    isFetchingNextPage: isFetchingNextPageContacts,
  } = useGetContacts({
    searchTerm: debouncedSearch.length > 2 ? debouncedSearch : "",
  });

  const {
    data: requestsData,
    isLoading: isLoadingRequests,
    hasNextPage: hasNextPageRequests,
    isFetchingNextPage: isFetchingNextPageRequests,
  } = useGetContactRequests();

  const typedContactsData:
    | InfiniteData<{
        records: User[];
        total_records: number;
      }>
    | undefined = contactsData;

  return (
    <div className="h-full flex flex-col border-r border-base-300">
      <div className="space-y-2 p-4 border-b border-base-300">
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
        <div className="flex gap-2">
          <button
            className={cn(
              "btn btn-sm flex-1 gap-2",
              viewMode === "contacts" ? "btn-primary" : "btn-ghost"
            )}
            onClick={() => setViewMode("contacts")}
          >
            <Users className="w-4 h-4" />
            Contacts
          </button>
          <button
            className={cn(
              "btn btn-sm flex-1 gap-2",
              viewMode === "requests" ? "btn-primary" : "btn-ghost"
            )}
            onClick={() => setViewMode("requests")}
          >
            <Bell className="w-4 h-4" />
            Requests
          </button>
          <Link to="/contacts/add" className="btn btn-ghost btn-sm">
            <Plus className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div ref={parentRef} className="flex-1 overflow-auto">
        {viewMode === "contacts" ? (
          <ContactsList
            isLoading={isLoadingContacts}
            data={typedContactsData}
            isFetchingNextPage={isFetchingNextPageContacts}
            hasNextPage={hasNextPageContacts}
            searchTerm={searchTerm}
            parentRef={parentRef}
          />
        ) : (
          <RequestsList
            isLoading={isLoadingRequests}
            data={requestsData}
            isFetchingNextPage={isFetchingNextPageRequests}
            hasNextPage={hasNextPageRequests}
            parentRef={parentRef}
          />
        )}
      </div>
    </div>
  );
}
