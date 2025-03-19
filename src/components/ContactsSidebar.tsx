import { useCallback, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { User } from "@/types/user";
import { Input } from "./Input";
import { Search, UserIcon } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/classNames";
import { LoadingIndicator } from "./LoadingIndicator";
import { useGetContacts } from "@/hooks/useGetContacts";
import useContactsStore from "@/store/useContactsStore";

interface ContactsSidebarProps {
  onContactSelect: (contact: User) => void;
  selectedContactId?: number;
}

export function ContactsSidebar({
  onContactSelect,
  selectedContactId,
}: ContactsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { contacts, totalContacts } = useContactsStore();
  const { hasNextPage, isFetchingNextPage, isLoading, fetchNextPage } =
    useGetContacts({
      searchTerm: debouncedSearch,
    });
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? contacts.length + 1 : contacts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  });

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

  return (
    <div className="h-full flex flex-col border-r border-base-300">
      <div className="p-4 border-b border-base-300">
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      <div
        ref={parentRef}
        className="flex-1 overflow-auto"
        onScroll={handleScroll}
      >
        {isLoading ? (
          <LoadingIndicator size="xl" fullPage />
        ) : totalContacts === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-base-content/70">
            <p>
              {searchTerm ? "No contacts found" : "You have no contacts yet"}
            </p>
            {searchTerm && (
              <p className="text-sm mt-2">Try a different search term</p>
            )}
          </div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index > contacts.length - 1;

              if (isLoaderRow) {
                return isFetchingNextPage ? (
                  <div
                    key="loader"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="h-16 flex items-center justify-center"
                  >
                    <LoadingIndicator size="md" />
                  </div>
                ) : null;
              }

              const contact = contacts[virtualRow.index];
              return (
                <div
                  key={contact.id}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <button
                    className={cn(
                      "w-full p-4 flex items-center gap-3 hover:bg-base-200 transition-colors",
                      selectedContactId === contact.id && "bg-base-200"
                    )}
                    onClick={() => onContactSelect(contact)}
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
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
