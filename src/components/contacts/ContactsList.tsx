import { UserIcon } from "lucide-react";
import { VirtualList } from "@/components/VirtualList";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/classNames";
import { ServerUser } from "@/types/user";
import { transformToClientUser } from "@/lib/auth-utils";

interface ContactsListProps {
  isLoading: boolean;
  data:
    | {
        pages: Array<{
          records: ServerUser[];
          total_records: number;
        }>;
      }
    | undefined;
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  searchTerm: string;
  parentRef: React.RefObject<HTMLDivElement | null>;
}

export function ContactsList({
  isLoading,
  data,
  isFetchingNextPage,
  hasNextPage,
  searchTerm,
  parentRef,
}: ContactsListProps) {
  const { contactId } = useParams();
  const contacts =
    data?.pages.flatMap((page) => page.records.map(transformToClientUser)) ??
    [];

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (contacts.length === 0) {
    if (searchTerm.length >= 3) {
      return (
        <div className="text-center text-base-content/70 p-4">
          <p>No contacts found</p>
        </div>
      );
    }
    return (
      <div className="text-center text-base-content/70 p-4">
        <p>No contacts yet</p>
      </div>
    );
  }

  return (
    <VirtualList
      items={contacts}
      renderItem={(contact) => (
        <Link
          to={`/chat/${contact.id}`}
          className={cn(
            "w-full p-4 flex items-center gap-3 hover:bg-base-200 transition-colors",
            Number(contactId) === contact.id && "bg-base-200"
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
      )}
      getItemId={(contact) => contact.id.toString()}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      parentRef={parentRef}
    />
  );
}
