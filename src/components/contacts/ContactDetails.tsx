import { User } from "@/types/user";
import { UserIcon } from "lucide-react";

interface ContactDetailsProps {
  contact: User;
}

export function ContactDetails({ contact }: ContactDetailsProps) {
  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-20">
            {contact.profilepic ? (
              <img
                src={contact.profilepic}
                alt={`${contact.username}'s avatar`}
              />
            ) : (
              <UserIcon className="w-12 h-12" />
            )}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{contact.username}</h1>
          <p className="text-base-content/70">
            {contact.firstname} {contact.lastname}
          </p>
        </div>
      </div>

      <div className="divider" />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Contact Information</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Email:</span> {contact.email}
          </p>
          <p>
            <span className="font-medium">Member since:</span>{" "}
            {new Date(contact.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
