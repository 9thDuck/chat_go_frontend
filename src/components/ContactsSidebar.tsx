import { useCallback, useRef, useState } from "react";
import { Input } from "./Input";
import { Search, UserIcon, Plus } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/classNames";
import { LoadingIndicator } from "./LoadingIndicator";
import { useGetContacts } from "@/hooks/useGetContacts";
import useContactsStore from "@/store/useContactsStore";
import { Link, useLocation } from "react-router-dom";
import { User } from "@/types/user";
import { VirtualList } from "./VirtualList";

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function SearchHeader({ searchTerm, onSearchChange }: SearchHeaderProps) {
  return (
    <div className="p-4 border-b border-base-300 flex justify-between items-center">
      <Input
        placeholder="search term should be between 3 and 50 characters long"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />
      <Link
        to="/contacts/add"
        className="btn btn-primary btn-sm ml-2"
        title="Add Contact"
      >
        <Plus className="w-4 h-4" />
      </Link>
    </div>
  );
}

interface EmptyStateProps {
  searchTerm: string;
}

function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center text-base-content/70">
      <p>{searchTerm ? "No contacts found" : "You have no contacts yet"}</p>
      {searchTerm && (
        <p className="text-sm mt-2">Try a different search term</p>
      )}
    </div>
  );
}

interface ContactListItemProps {
  contact: User;
  isSelected: boolean;
}

function ContactListItem({ contact, isSelected }: ContactListItemProps) {
  return (
    <Link
      to={`/chat/${contact.id}`}
      className={cn(
        "w-full p-4 flex items-center gap-3 hover:bg-base-200 transition-colors",
        isSelected && "bg-base-200"
      )}
    >
      <div className="avatar placeholder">
        <div className="bg-neutral text-neutral-content rounded-full w-10">
          {contact.profilepic ? (
            <img
              src={contact.profilepic}
              alt={`${contact.username}'s avatar`}
            />
          ) : (
            <UserIcon className="w-6 h-6" />
          )}
        </div>
      </div>
      <div className="flex flex-col items-start">
        <span className="font-medium">{contact.username}</span>
        <span className="text-sm text-base-content/70">
          {contact.firstname} {contact.lastname}
        </span>
      </div>
    </Link>
  );
}

export function ContactsSidebar() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { contacts } = useContactsStore();
  const location = useLocation();

  const {
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    isError,
    error,
  } = useGetContacts({
    searchTerm: debouncedSearch.length > 2 ? debouncedSearch : "",
  });

  const parentRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      if (
        target.scrollHeight - target.scrollTop - target.clientHeight < 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-error">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-r border-base-300">
      <SearchHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <div
        ref={parentRef}
        className="flex-1 overflow-auto"
        onScroll={handleScroll}
      >
        {isLoading ? (
          <LoadingIndicator size="xl" fullPage />
        ) : contacts.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <VirtualList
            items={contacts}
            renderItem={(contact, isSelected) => (
              <ContactListItem contact={contact} isSelected={isSelected} />
            )}
            getItemId={(contact) => contact.id}
            isItemSelected={(contact) =>
              location.pathname === `/chat/${contact.id}`
            }
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            parentRef={parentRef}
          />
        )}
      </div>
    </div>
  );
}
