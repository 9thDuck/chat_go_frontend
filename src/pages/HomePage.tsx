import { MessageCircle } from "lucide-react";
import useContactsStore from "@/store/useContactsStore";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const { contacts } = useContactsStore();
  const location = useLocation();

  // If we're at the root path, show the empty state
  if (location.pathname === "/") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-base-content/70">
        <MessageCircle className="w-16 h-16 mb-4" />
        <p className="text-lg">
          {contacts.length > 0
            ? "Select a contact to start chatting"
            : "No contacts found"}
        </p>
      </div>
    );
  }

  // If we're at any other path under the chat layout, the Outlet in ChatLayout
  // will handle rendering the appropriate component
  return null;
};

export default HomePage;
