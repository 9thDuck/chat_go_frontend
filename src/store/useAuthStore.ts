import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Store {
  authUser: User | null;
  setAuthUser: (user: User) => void;
  removeAuthUser: () => void;
  privateKeys: {
    secret: Buffer<ArrayBufferLike>;
    username: string;
  }[];
  setPrivateKey: (key: {
    secret: Buffer<ArrayBufferLike>;
    username: string;
  }) => void;
  removePrivateKey: (username: string) => void;
}

export const useAuthStore = create<Store>()(
  persist(
    (set) => ({
      authUser: null,
      setAuthUser: (user: User) => set({ authUser: user }),
      removeAuthUser: () => set({ authUser: null }),
      privateKeys: [],
      setPrivateKey: (key: {
        secret: Buffer<ArrayBufferLike>;
        username: string;
      }) => set((state) => ({ privateKeys: [...state.privateKeys, key] })),
      removePrivateKey: (username: string) =>
        set((state) => ({
          privateKeys: state.privateKeys.filter(
            (key) => key.username !== username
          ),
        })),
    }),
    {
      name: "auth-storage",
    }
  )
);
