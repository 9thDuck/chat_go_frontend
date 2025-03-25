import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Store {
  authUser: User | null;
  setAuthUser: (user: User) => void;
  removeAuthUser: () => void;
  privateKey: string | null;
  setPrivateKey: (key: string) => void;
  removePrivateKey: () => void;
  getPrivateKey: () => string;
  getEncryptionKey: () => string;
}

export const useAuthStore = create<Store>()(
  persist(
    (set, get) => ({
      authUser: null,
      setAuthUser: (user: User) => set({ authUser: user }),
      removeAuthUser: () => set({ authUser: null }),
      privateKey: null,
      setPrivateKey: (key: string) => set({ privateKey: key }),
      getPrivateKey: () => get().privateKey || "",
      getEncryptionKey: () => get().authUser?.encryptionKey || "",
      removePrivateKey: () => set({ privateKey: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
