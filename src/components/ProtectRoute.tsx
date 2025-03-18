import { unprotectedRoutes } from "@/lib/auth-utils";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function ProtectedRoute({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { authUser } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!unprotectedRoutes.includes(pathname) && !authUser) {
      navigate("/signup");
    }
  }, [authUser, navigate, pathname]);

  if (!unprotectedRoutes.includes(pathname) && !authUser) {
    return null;
  }

  return <>{children}</>;
}
