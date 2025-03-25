import { UserIcon } from "lucide-react";
import { User } from "@/types/user";
import { ChatMessages } from "./ChatMessages";
import { MessageInput } from "./MessageInput";

interface ChatViewProps {
  contact: User;
}

export function ChatView({ contact }: ChatViewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center gap-3">
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
          <div>
            <h2 className="font-medium">{contact.username}</h2>
            <p className="text-sm text-base-content/70">
              {contact.firstname} {contact.lastname}
            </p>
          </div>
        </div>
      </div>
      <ChatMessages contactId={contact.id} />
      <MessageInput contactId={contact.id} publicKey={contact.publicKey} />
    </div>
  );
}
