import { useParams } from "react-router-dom";
import { ChatView } from "@/components/chat/ChatView";
import useContactsStore from "@/store/useContactsStore";
import { LoadingIndicator } from "@/components/LoadingIndicator";

export default function ChatPage() {
  const { contactId } = useParams<{ contactId: string }>();
  const { contacts } = useContactsStore();

  const contact = contacts.find((c) => c.id === Number(contactId));

  if (!contact) {
    return <LoadingIndicator />;
  }

  return <ChatView contact={contact} />;
}
