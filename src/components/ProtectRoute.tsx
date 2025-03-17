import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function ProtectedRoute({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { authUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname !== "/login" &&
      location.pathname !== "/signup" &&
      !authUser
    ) {
      navigate("/login");
    }
  }, [authUser, location.pathname, navigate]);

  if (
    location.pathname !== "/login" &&
    location.pathname !== "/signup" &&
    !authUser
  ) {
    return null;
  }

  return <>{children}</>;
}
