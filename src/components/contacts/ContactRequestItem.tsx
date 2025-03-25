import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { ContactRequest } from "@/types/contact";
import { useAuthStore } from "@/store/useAuthStore";
import { asymDecryptMessage } from "@/lib/utils";

interface ContactRequestItemProps {
  request: ContactRequest;
  type: "incoming" | "outgoing";
  onAccept?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
}

const ContactRequestItem = ({
  request,
  type,
  onAccept,
  onReject,
  onDelete,
}: ContactRequestItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);
  const { getPrivateKey } = useAuthStore();

  const handleToggleExpand = () => {
    // Only attempt to decrypt incoming messages when expanding
    if (
      !isExpanded &&
      type === "incoming" &&
      request.messageContent &&
      !decryptedMessage
    ) {
      try {
        // For incoming requests, decrypt the message using our private key
        const privateKey = getPrivateKey();
        const plaintext = asymDecryptMessage(
          request.messageContent,
          privateKey
        );
        setDecryptedMessage(plaintext);
      } catch (error) {
        console.error("Failed to decrypt contact request message:", error);
        setDecryptedMessage("[Encrypted message - unable to decrypt]");
      }
    }

    setIsExpanded(!isExpanded);
  };

  // For outgoing requests, we already have the plain text
  const messageToShow =
    type === "incoming"
      ? decryptedMessage || request.messageContent
      : request.messageContent;

  return (
    <div className="border-b border-base-300">
      {/* First row: username and action buttons */}
      <div className="flex items-center justify-between p-3">
        <div className="font-medium">
          {type === "incoming"
            ? request.senderUsername
            : request.receiverUsername}
        </div>
        <div className="flex items-center gap-2">
          {type === "incoming" ? (
            <>
              <button onClick={onAccept} className="btn btn-success btn-sm">
                Accept
              </button>
              <button onClick={onReject} className="btn btn-error btn-sm">
                Reject
              </button>
            </>
          ) : (
            <button onClick={onDelete} className="btn btn-error btn-sm">
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Second row: Toggle button and message content */}
      {request.messageContent && (
        <>
          <div
            className="flex items-center gap-2 px-4 py-1 cursor-pointer text-sm text-primary hover:bg-base-200/50 transition-colors"
            onClick={handleToggleExpand}
          >
            <button className="btn btn-ghost btn-xs rounded-full">
              {isExpanded ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
            <span>{isExpanded ? "Hide message" : "Show message"}</span>
          </div>

          {isExpanded && messageToShow && (
            <div className="bg-base-200 mx-4 mb-3 p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Message:</p>
              <p className="italic">{messageToShow}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContactRequestItem;
