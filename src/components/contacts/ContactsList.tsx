import { UserIcon, MoreVertical } from "lucide-react";
import { VirtualList } from "@/components/VirtualList";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { Link } from "react-router-dom";
import { ServerUser } from "@/types/user";
import { transformToClientUser } from "@/lib/auth-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useDeleteContact } from "@/hooks/useContacts";
import { toast } from "sonner";

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
  const contacts =
    data?.pages.flatMap((page) => page.records.map(transformToClientUser)) ??
    [];
  const { mutate: deleteContact } = useDeleteContact();

  if (isLoading) {
    return (
      <div className="h-full">
        <LoadingIndicator />
      </div>
    );
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
        <div className="w-full p-4 flex items-center gap-3 hover:bg-base-200 transition-colors group">
          <Link
            to={`/chat/${contact.id}`}
            className="flex items-center gap-3 flex-1"
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="btn btn-ghost btn-sm btn-square opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/contacts/${contact.id}`} className="w-full">
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-error"
                onClick={() => {
                  deleteContact(contact.id, {
                    onSuccess: () => toast.success("Contact removed"),
                    onError: () => toast.error("Failed to remove contact"),
                  });
                }}
              >
                Remove Contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      getItemId={(contact) => contact.id.toString()}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      parentRef={parentRef}
    />
  );
}
