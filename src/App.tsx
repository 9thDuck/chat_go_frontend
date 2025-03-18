import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import { useMemo, useEffect } from "react";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./constants/routes";
import { useCheckAuth } from "./hooks/useCheckAuth";

function App() {
  const { isCheckingAuth, authenticated } = useCheckAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isCurrentRouteProtected = useMemo(
    () => PROTECTED_ROUTES.includes(pathname),
    [pathname]
  );

  const inAuthRoute = useMemo(() => AUTH_ROUTES.includes(pathname), [pathname]);
  useEffect(() => {
    if (!isCheckingAuth && !authenticated && isCurrentRouteProtected) {
      navigate("/auth/signup");
      return;
    } else if (authenticated && inAuthRoute) {
      navigate("/");
      return;
    }
  }, [
    authenticated,
    inAuthRoute,
    isCheckingAuth,
    isCurrentRouteProtected,
    navigate,
    pathname,
  ]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-md loading-ring"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="h-16 p-8"> </div>
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;
