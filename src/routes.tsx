import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/layouts/Layout";
import { ChatLayout } from "@/layouts/ChatLayout";
import { ProtectRoute } from "./components/ProtectRoute";
import NotFoundPage from "./pages/NotFoundPage";
import { LoadingIndicator } from "@/components/LoadingIndicator";

const AuthPage = lazy(() =>
  import("@/pages/AuthPage").then((m) => ({ default: m.AuthPage }))
);
const HomePage = lazy(() => import("@/pages/HomePage"));
const ChatPage = lazy(() => import("@/pages/ChatPage"));
const ContactDetailsPage = lazy(() => import("@/pages/ContactDetailsPage"));
const AddContactPage = lazy(() => import("@/pages/AddContactPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const Signup = lazy(() => import("@/components/Signup"));
const Login = lazy(() => import("@/components/Login"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectRoute>
            <ChatLayout />
          </ProtectRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingIndicator />}>
                <HomePage />
              </Suspense>
            ),
          },
          {
            path: "chat/:contactId",
            element: (
              <Suspense fallback={<LoadingIndicator />}>
                <ChatPage />
              </Suspense>
            ),
          },
          {
            path: "contacts/add",
            element: (
              <Suspense fallback={<LoadingIndicator />}>
                <AddContactPage />
              </Suspense>
            ),
          },
          {
            path: "contacts/:contactId",
            element: (
              <Suspense fallback={<LoadingIndicator />}>
                <ContactDetailsPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/auth",
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <AuthPage />
          </Suspense>
        ),
        children: [
          {
            path: "login",
            element: (
              <Suspense fallback={<LoadingIndicator />}>
                <Login />
              </Suspense>
            ),
          },
          {
            path: "signup",
            element: (
              <Suspense fallback={<LoadingIndicator />}>
                <Signup />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/settings",
        element: (
          <ProtectRoute>
            <Suspense fallback={<LoadingIndicator />}>
              <SettingsPage />
            </Suspense>
          </ProtectRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectRoute>
            <Suspense fallback={<LoadingIndicator />}>
              <ProfilePage />
            </Suspense>
          </ProtectRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
