import { useState, useCallback, useRef } from "react";
import { Search, UserIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { asymEncryptMessage } from "@/lib/utils";
import { useSearchUsers } from "@/hooks/useSearchUsers";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/Input";
import { AxiosError } from "axios";
import { useSendContactRequest } from "@/hooks/useContactRequest";
import { SearchUser } from "@/types/contact";

type SelectedUser = {
  id: number;
  username: string;
  publicKey: string;
} | null;

const AddContactPage = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<SelectedUser>(null);
  const [message, setMessage] = useState(
    "Hi! I'd like to add you as a contact."
  );
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSearchUsers(debouncedSearch);

  const users = data?.pages.flatMap((page) => page.records) ?? [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? users.length + 1 : users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  const { mutate, isPending } = useSendContactRequest();

  const handleSendRequest = () => {
    if (!selectedUser) return;

    try {
      console.log(selectedUser);
      const encryptedMessage = asymEncryptMessage(
        message,
        selectedUser.publicKey
      );
      mutate(
        {
          userId: selectedUser.id,
          message: encryptedMessage,
        },
        {
          onSuccess: () => {
            toast.success("Contact request sent successfully");
          },
          onError: (error: unknown) => {
            console.error(
              "Contact request failed - User ID:",
              selectedUser.id,
              "Error:",
              error
            );
            toast.error("Failed to send contact request");
          },
        }
      );
    } catch (error: unknown) {
      console.error(
        "Contact request processing failed - Message:",
        message,
        "Error:",
        error
      );
      toast.error("Failed to send contact request");
    }
  };

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

  const renderUserStatus = (user: SearchUser) => {
    if (user.isContact) {
      return <span className="badge badge-success">Contact</span>;
    }
    if (user.hasPendingRequest) {
      return <span className="badge badge-warning">Request Pending</span>;
    }
    return (
      <button
        className="btn btn-primary btn-sm"
        onClick={() => setSelectedUser(user)}
      >
        Select
      </button>
    );
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 min-h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] p-4 sm:p-8 border-base-300 border-2 rounded-lg mx-auto">
        <div className="w-full space-y-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Add New Contact</h1>
            {selectedUser && (
              <button
                onClick={() => setSelectedUser(null)}
                className="btn btn-ghost btn-sm gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </button>
            )}
          </div>

          {selectedUser ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center p-6 border border-base-300 rounded-lg bg-base-200/30">
                <div className="avatar placeholder mb-4">
                  <div className="bg-neutral text-neutral-content rounded-full w-16">
                    <UserIcon className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-lg font-medium">{selectedUser.username}</h3>
                <button
                  className="btn btn-ghost btn-xs mt-2"
                  onClick={() => setSelectedUser(null)}
                >
                  Change User
                </button>
              </div>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Message</span>
                    <span className="label-text-alt text-base-content/70">
                      {message.length}/100
                    </span>
                  </label>
                  <textarea
                    placeholder="Add a message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={100}
                    rows={3}
                    className="textarea textarea-bordered w-full focus:textarea-primary transition-colors placeholder:text-base-content/40 hover:border-primary/50"
                  />
                </div>

                <button
                  className="btn btn-primary w-full"
                  onClick={handleSendRequest}
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="loading loading-ring loading-md" />
                  ) : (
                    "Send Contact Request"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Search for users by username"
                icon={<Search className="w-4 h-4" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                minLength={3}
                maxLength={50}
              />

              <div
                ref={parentRef}
                className="h-[400px] overflow-auto border border-base-300 rounded-lg"
                onScroll={handleScroll}
              >
                {isLoading ? (
                  <LoadingIndicator />
                ) : users.length > 0 ? (
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const isLoaderRow = virtualRow.index > users.length - 1;

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

                      const user = users[virtualRow.index];

                      return (
                        <div
                          key={user.id}
                          ref={rowVirtualizer.measureElement}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          <div className="flex items-center justify-between p-4 hover:bg-base-200 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-10">
                                  <UserIcon className="w-6 h-6" />
                                </div>
                              </div>
                              <div>
                                <h3 className="font-medium">{user.username}</h3>
                              </div>
                            </div>
                            {renderUserStatus(user)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : searchTerm?.length >= 3 ? (
                  <div className="text-center text-base-content/70 p-4">
                    <p>No users found</p>
                  </div>
                ) : (
                  <div className="text-center text-base-content/70 p-4">
                    <p>Search for users to add them as contacts</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddContactPage;
