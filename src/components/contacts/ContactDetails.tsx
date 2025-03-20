import { User } from "@/types/user";
import { UserIcon, Mail, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeleteContact } from "@/hooks/useContacts";
import { toast } from "sonner";

interface ContactDetailsProps {
  contact: User;
}

export function ContactDetails({ contact }: ContactDetailsProps) {
  const { mutate: deleteContact } = useDeleteContact();

  return (
    <div className="flex flex-col h-full bg-base-100">
      <div className="border-b border-base-300">
        <div className="p-4 flex items-center gap-3">
          <Link to="/" className="btn btn-ghost btn-sm btn-square">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-medium">Contact Info</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="avatar placeholder mb-4">
              <div className="bg-neutral text-neutral-content rounded-full w-32">
                {contact.profilepic ? (
                  <img
                    src={contact.profilepic}
                    alt={`${contact.username}'s avatar`}
                    className="rounded-full"
                  />
                ) : (
                  <UserIcon className="w-16 h-16" />
                )}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center">
              {contact.username}
            </h2>
            <p className="text-base-content/70 text-lg">
              {contact.firstname} {contact.lastname}
            </p>
          </div>

          <div className="space-y-6">
            <div className="card bg-base-200/50 border border-base-300">
              <div className="card-body space-y-4">
                <h3 className="text-lg font-semibold card-title">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Email</p>
                      <p className="font-medium">{contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">
                        Member since
                      </p>
                      <p className="font-medium">
                        {new Date(contact.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-error/10 border border-error/20">
              <div className="card-body">
                <h3 className="card-title text-error">Danger Zone</h3>
                <p className="text-base-content/70">
                  Remove {contact.username} from your contacts
                </p>
                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => {
                      deleteContact(contact.id, {
                        onSuccess: () => toast.success("Contact removed"),
                        onError: () => toast.error("Failed to remove contact"),
                      });
                    }}
                  >
                    Remove Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
