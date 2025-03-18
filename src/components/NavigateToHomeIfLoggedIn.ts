import { needToAccessAuthRoutes } from "@/lib/auth-utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useNavgiateToHomeIfLoggedIn() {
  const { authUser } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!needToAccessAuthRoutes(pathname, !!authUser)) return;
    navigate("/");
  }, [authUser, navigate, pathname]);
}
