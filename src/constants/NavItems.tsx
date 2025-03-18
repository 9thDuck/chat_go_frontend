import { Settings, User } from "lucide-react";
export const AUTHENTICATED_NAV_ITEMS = [
  {
    path: "/settings",
    icon: <Settings className="w-4 h-4" />,
    name: "Settings",
  },
  {
    path: "/profile",
    icon: <User className="w-4 h-4" />,
    name: "Profile",
  },
];

export const UNAUTHENTICATED_NAV_ITEMS = [
  {
    path: "auth/signup",
    icon: null,
    name: "Signup",
  },
  {
    path: "auth/login",
    icon: null,
    name: "login",
  },
];
