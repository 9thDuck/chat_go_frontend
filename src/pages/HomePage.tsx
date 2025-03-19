import { useState } from "react";
import { ContactsSidebar } from "@/components/ContactsSidebar";
import { User } from "@/types/user";
import { MessageCircle, UserIcon } from "lucide-react";
import useContactsStore from "@/store/useContactsStore";

const HomePage = () => {
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const { contacts } = useContactsStore();

  return (
    <div className="container mx-auto h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] p-0">
      <div className="grid grid-cols-[350px_1fr] h-full bg-base-100 rounded-lg overflow-hidden border border-base-300">
        <ContactsSidebar
          onContactSelect={setSelectedContact}
          selectedContactId={selectedContact?.id}
        />

        {selectedContact ? (
          <div className="flex flex-col">
            <div className="p-4 border-b border-base-300">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-10">
                    {selectedContact.profilepic ? (
                      <img
                        src={selectedContact.profilepic}
                        alt={`${selectedContact.username}'s avatar`}
                      />
                    ) : (
                      <UserIcon className="w-6 h-6" />
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="font-medium">{selectedContact.username}</h2>
                  <p className="text-sm text-base-content/70">
                    {selectedContact.firstname} {selectedContact.lastname}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1">{/* Chat component will go here */}</div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-base-content/70">
            <MessageCircle className="w-16 h-16 mb-4" />
            <p className="text-lg">
              {contacts.length > 0
                ? "Select a contact to start chatting"
                : "No contacts found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
