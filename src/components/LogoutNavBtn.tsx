import { useLogout } from "@/hooks/useLogout";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function LogoutNavBtn() {
  const { removeAuthUser } = useAuthStore();
  const { mutate, isPending } = useLogout();
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-sm gap-2 transition-all hover:bg-base-200 active:bg-base-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
      type="button"
      disabled={isPending}
      aria-label="Logout"
      onClick={() =>
        mutate(undefined, {
          onSuccess: () => {
            removeAuthUser();
            navigate("/auth/login");
            toast.success("You have been successfully logged out");
          },
          onError: (err) => {
            toast.error(err.message);
          },
        })
      }
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
}
