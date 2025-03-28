import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { format } from "date-fns";
import { Message } from "@/types/message";
import { cn } from "@/lib/classNames";
import { User } from "lucide-react";
import { useLoadMessages } from "@/hooks/useLoadMessages";
import { useMessagesStore } from "@/store/useMessagesStore";
import { useSocket } from "@/providers/SocketProvider";
import { asymDecryptMessage } from "@/lib/utils";
import { storeMessage } from "@/lib/offline-storage";

interface ChatMessagesProps {
  contactId: number;
}

interface MessageWithUI extends Message {
  showAvatar: boolean;
  showTime: boolean;
  isCurrentUser: boolean;
}

interface MessageBubbleProps {
  message: MessageWithUI;
}

export function ChatMessages({ contactId }: ChatMessagesProps) {
  const { isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useLoadMessages(contactId);
  const { authUser, getPrivateKey, getEncryptionKey } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { getMessages, addMessage } = useMessagesStore();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    const messageHandler = async (event: MessageEvent) => {
      const parsed = JSON.parse(event.data);
      if (parsed.type !== "MESSAGE") return;
      if (!parsed.message) return;
      const message: Message = parsed.message;
      const decryptedContent = asymDecryptMessage(
        message.content,
        getPrivateKey()
      );
      const messageWithDecryptedContent = {
        ...message,
        content: decryptedContent,
      };
      await storeMessage(messageWithDecryptedContent, getEncryptionKey());
      addMessage(
        messageWithDecryptedContent.senderId,
        messageWithDecryptedContent
      );
    };

    socket.addEventListener("message", messageHandler);
    return () => socket.removeEventListener("message", messageHandler);
  }, [addMessage, getEncryptionKey, getPrivateKey, socket]);

  const messages = getMessages(contactId);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Only scroll if within 100px of bottom
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    if (container.scrollTop <= 100) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const groupedMessages = useMemo(() => {
    // Sort messages in ascending order before grouping
    const sortedMessages = [...messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return sortedMessages.reduce((groups, message, index) => {
      const isCurrentUser = message.senderId === authUser?.id;
      const nextMessage = sortedMessages[index + 1];

      const showAvatar = true;
      const showTime =
        !nextMessage ||
        new Date(nextMessage.createdAt).getTime() -
          new Date(message.createdAt).getTime() >
          5 * 60 * 1000;

      const messageDate = new Date(message.createdAt);
      const dateStr = format(messageDate, "yyyy-MM-dd");

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }

      const messageWithUI: MessageWithUI = {
        ...message,
        showAvatar,
        showTime,
        isCurrentUser,
      };

      groups[dateStr].push(messageWithUI);

      return groups;
    }, {} as Record<string, MessageWithUI[]>);
  }, [messages, authUser?.id]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4">
      {isFetchingNextPage && (
        <div className="flex justify-center py-2">
          <LoadingIndicator size="sm" />
        </div>
      )}
      <div className="space-y-6">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date} className="space-y-4">
            <div className="text-center">
              <span className="bg-base-200 text-base-content/70 text-xs px-2 py-1 rounded">
                {format(new Date(date), "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

function MessageBubble({ message }: MessageBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const messageLength = 280;
  const shouldTruncate = message.content.length > messageLength && !isExpanded;
  const displayContent = shouldTruncate
    ? `${message.content.slice(0, messageLength)}...`
    : message.content;

  return (
    <div
      className={cn(
        "flex gap-2 items-end",
        message.isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!message.isCurrentUser && (
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-8">
            <User className="w-5 h-5" />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-1 max-w-[75%]">
        <div
          className={cn(
            "break-words rounded-lg px-4 py-2 min-w-[120px]",
            message.isCurrentUser
              ? "bg-primary text-primary-content"
              : "bg-base-200"
          )}
        >
          <p className="whitespace-pre-wrap">{displayContent}</p>
          {message.content.length > messageLength && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "text-xs mt-1 hover:underline",
                message.isCurrentUser
                  ? "text-primary-content/80"
                  : "text-base-content/70"
              )}
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
        {message.showTime && (
          <span
            className={cn(
              "text-xs text-base-content/70",
              message.isCurrentUser ? "text-right" : "text-left"
            )}
          >
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
        )}
      </div>
      {message.isCurrentUser && (
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-8">
            <User className="w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
}
