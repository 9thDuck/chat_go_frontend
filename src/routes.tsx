import { createBrowserRouter } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import App from "./App";
import NotFoundPage from "./pages/NotFoundPage";
import { ProtectRoute } from "./components/ProtectRoute";
import { lazy, Suspense } from "react";
const AuthPage = lazy(() =>
  import("@/pages/AuthPage").then((m) => ({ default: m.AuthPage }))
);
const HomePage = lazy(() => import("@/pages/HomePage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const Signup = lazy(() => import("@/components/Signup"));
const Login = lazy(() => import("@/components/Login"));
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/auth",
        element: (
          <Suspense fallback={<div className="loading-xl loading-ring"></div>}>
            <AuthPage />
          </Suspense>
        ),
        children: [
          {
            path: "login",
            element: (
              <Suspense
                fallback={<div className="loading-xl loading-ring"></div>}
              >
                <Login />
              </Suspense>
            ),
          },
          {
            path: "signup",
            element: (
              <Suspense
                fallback={<div className="loading-xl loading-ring"></div>}
              >
                <Signup />
              </Suspense>
            ),
          },
        ],
      },
      {
        index: true,
        element: (
          <ProtectRoute>
            <Suspense
              fallback={<div className="loading-xl loading-ring"></div>}
            >
              <HomePage />
            </Suspense>
          </ProtectRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectRoute>
            <Suspense
              fallback={<div className="loading-xl loading-ring"></div>}
            >
              <SettingsPage />
            </Suspense>
          </ProtectRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectRoute>
            <Suspense
              fallback={<div className="loading-xl loading-ring"></div>}
            >
              <ProfilePage />
            </Suspense>
          </ProtectRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
