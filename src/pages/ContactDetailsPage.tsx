import { useParams } from "react-router-dom";
import { ContactDetails } from "@/components/contacts/ContactDetails";
import useContactsStore from "@/store/useContactsStore";
import { LoadingIndicator } from "@/components/LoadingIndicator";

export default function ContactDetailsPage() {
  const { contactId } = useParams<{ contactId: string }>();
  const { contacts } = useContactsStore();

  const contact = contacts.find((c) => c.id === Number(contactId));

  if (!contact) {
    return (
      <div className="h-full">
        <LoadingIndicator />
      </div>
    );
  }

  return <ContactDetails contact={contact} />;
}
