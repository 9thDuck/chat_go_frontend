import { unprotectedRoutes } from "@/lib/auth-utils";
import { useAuthStore } from "@/store/useAuthStore";
import React from "react";
import { useLocation } from "react-router-dom";

export function ProtectedRoute({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { authUser } = useAuthStore();
  const { pathname } = useLocation();

  if (!unprotectedRoutes.includes(pathname) && !authUser) {
    return null;
  }

  return <>{children}</>;
}
