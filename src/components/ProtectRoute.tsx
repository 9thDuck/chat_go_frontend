import { useCheckAuth } from "@/hooks/useCheckAuth";
import { unprotectedRoutes } from "@/lib/auth-utils";
import { SocketProvider } from "@/providers/SocketProvider";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export function ProtectRoute({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isCheckingAuth, authenticated } = useCheckAuth();
  const { pathname } = useLocation();

  if (
    !unprotectedRoutes.includes(pathname) &&
    !isCheckingAuth &&
    !authenticated
  ) {
    return (
      <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
    );
  }

  return <SocketProvider>{children}</SocketProvider>;
}
