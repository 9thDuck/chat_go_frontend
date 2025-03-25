import { UserIcon, Check, X, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { VirtualList } from "@/components/VirtualList";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import {
  useAcceptContactRequest,
  useRejectContactRequest,
  useDeleteContactRequest,
} from "@/hooks/useContactRequest";
import { toast } from "sonner";
import { ContactRequest } from "@/types/contact";
import ContactRequestItem from "@/components/contacts/ContactRequestItem";

interface RequestsListProps {
  isLoading: boolean;
  data:
    | {
        pages: Array<{
          records: ContactRequest[];
          total_records: number;
        }>;
      }
    | undefined;
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  parentRef: React.RefObject<HTMLDivElement | null>;
}

interface RequestItemProps {
  request: ContactRequest;
  type: "incoming" | "outgoing";
  onAccept?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
}

export function RequestsList({
  isLoading,
  data,
  isFetchingNextPage,
  hasNextPage,
  parentRef,
}: RequestsListProps) {
  const { authUser } = useAuthStore();
  const { mutate: acceptRequest } = useAcceptContactRequest();
  const { mutate: rejectRequest } = useRejectContactRequest();
  const { mutate: deleteRequest } = useDeleteContactRequest();

  const requests = data?.pages.flatMap((page) => page.records) ?? [];
  const incomingRequests = requests.filter(
    (req) => req.receiverId === authUser?.id
  );
  const outgoingRequests = requests.filter(
    (req) => req.senderId === authUser?.id
  );

  if (isLoading) {
    return (
      <div className="h-full">
        <LoadingIndicator />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center text-base-content/70 p-4">
        <p>No contact requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {incomingRequests.length > 0 && (
        <div>
          <div className="px-4 py-2 text-sm font-medium text-base-content/70 bg-base-200">
            Incoming Requests
          </div>
          <VirtualList
            items={incomingRequests}
            renderItem={(request) => (
              <ContactRequestItem
                request={request}
                type="incoming"
                onAccept={() => {
                  acceptRequest(
                    { userId: request.senderId },
                    {
                      onSuccess: () =>
                        toast.success("Contact request accepted"),
                      onError: () => toast.error("Failed to accept request"),
                    }
                  );
                }}
                onReject={() => {
                  rejectRequest(
                    { userId: request.senderId },
                    {
                      onSuccess: () =>
                        toast.success("Contact request rejected"),
                      onError: () => toast.error("Failed to reject request"),
                    }
                  );
                }}
              />
            )}
            getItemId={(request) => `${request.senderId}-${request.receiverId}`}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            parentRef={parentRef}
          />
        </div>
      )}

      {outgoingRequests.length > 0 && (
        <div>
          <div className="px-4 py-2 text-sm font-medium text-base-content/70 bg-base-200">
            Outgoing Requests
          </div>
          <VirtualList
            items={outgoingRequests}
            renderItem={(request) => (
              <RequestItem
                request={request}
                type="outgoing"
                onDelete={() => {
                  deleteRequest(
                    { userId: request.receiverId },
                    {
                      onSuccess: () => toast.success("Request cancelled"),
                      onError: () => toast.error("Failed to cancel request"),
                    }
                  );
                }}
              />
            )}
            getItemId={(request) => `${request.senderId}-${request.receiverId}`}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            parentRef={parentRef}
          />
        </div>
      )}
    </div>
  );
}

function RequestItem({
  request,
  type,
  onAccept,
  onReject,
  onDelete,
}: RequestItemProps) {
  const username =
    type === "incoming" ? request.senderUsername : request.receiverUsername;

  return (
    <div className="flex items-center justify-between p-4 hover:bg-base-200/50">
      <div className="flex items-center gap-3">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-10">
            <UserIcon className="w-6 h-6" />
          </div>
        </div>
        <div>
          <p className="font-medium">
            {type === "incoming" ? "From" : "To"}: @{username}
          </p>
          <p className="text-sm text-base-content/70">
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {type === "incoming" ? (
        <div className="flex gap-2">
          <button
            className="btn btn-ghost btn-sm text-success"
            onClick={onAccept}
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            className="btn btn-ghost btn-sm text-error"
            onClick={onReject}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button className="btn btn-ghost btn-sm text-error" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
