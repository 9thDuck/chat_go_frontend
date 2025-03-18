import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Store {
  authUser: User | null;
  setAuthUser: (user: User) => void;
  removeAuthUser: () => void;
}

export const useAuthStore = create<Store>()(
  persist(
    (set) => ({
      authUser: null,
      setAuthUser: (user: User) => set({ authUser: user }),
      removeAuthUser: () => set({ authUser: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
