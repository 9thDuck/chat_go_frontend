import { Outlet } from "react-router-dom";
import { ContactsSidebar } from "@/components/contacts/ContactsSidebar";

export function ChatLayout() {
  return (
    <div className="container mx-auto h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] p-0">
      <div className="grid grid-cols-[400px_1fr] h-full bg-base-100 rounded-lg overflow-hidden border border-base-300">
        <div className="h-full overflow-hidden">
          <ContactsSidebar />
        </div>
        <div className="h-full overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
