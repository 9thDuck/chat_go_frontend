import { createBrowserRouter } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import App from "./App";
import NotFoundPage from "./pages/NotFoundPage";
import { ProtectedRoute } from "./components/ProtectRoute";
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
          <ProtectedRoute>
            <Suspense
              fallback={<div className="loading-xl loading-ring"></div>}
            >
              <HomePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <Suspense
              fallback={<div className="loading-xl loading-ring"></div>}
            >
              <SettingsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Suspense
              fallback={<div className="loading-xl loading-ring"></div>}
            >
              <ProfilePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
