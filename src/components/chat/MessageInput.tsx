import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { asymEncryptMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useSendMessage } from "@/hooks/useSendMessage";
import {
  storeMessage,
  swapLocalMessageWithServerMessageId,
  deleteMessage,
} from "@/lib/offline-storage";
import { useMessagesStore } from "@/store/useMessagesStore";
import { Message } from "@/types/message";

interface MessageInputProps {
  contactId: number;
  publicKey: string;
}

const DRAFT_MESSAGE: Omit<Message, "id" | "content" | "localId"> = {
  senderId: 0, // Temp value, will be overwritten
  receiverId: 0, // Temp value, will be overwritten
  isRead: false,
  isDelivered: false,
  version: 1,
  edited: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  attachments: [],
};

export function MessageInput({ contactId, publicKey }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const { mutate: sendMessage, isPending } = useSendMessage();
  const { addMessage } = useMessagesStore();
  const { authUser, getEncryptionKey } = useAuthStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !authUser) return;

    try {
      const encryptedContent = asymEncryptMessage(message, publicKey);
      const localId = `local-${Date.now()}`; // Generate temporary ID

      sendMessage(
        {
          receiverId: contactId,
          content: encryptedContent,
        },
        {
          onSuccess: async (data) => {
            await swapLocalMessageWithServerMessageId(
              localId,
              data.response.data.data.id
            );
            await storeMessage(
              { ...data.response.data.data, content: message },
              getEncryptionKey()
            );
            addMessage(contactId, {
              ...data.response.data.data,
              content: message,
            });
            setMessage("");
          },
          onError: (error) => {
            deleteMessage(localId);
            console.error(
              "Message send failed - Local ID:",
              localId,
              "Error:",
              error
            );
            toast.error("Message failed to send");
          },
        }
      );

      await storeMessage(
        {
          ...DRAFT_MESSAGE,
          senderId: authUser.id,
          receiverId: contactId,
          content: message,
          localId,
          id: localId,
        },
        getEncryptionKey()
      );
    } catch (error) {
      console.error(
        "Message processing failed - Content:",
        message,
        "Error:",
        error
      );
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-base-300">
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="textarea textarea-bordered flex-1 min-h-[48px] max-h-[120px] resize-y"
          disabled={isPending}
        />
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="btn btn-square btn-ghost"
            disabled={isPending}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="btn btn-square btn-primary"
            disabled={!message.trim() || isPending}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
}
