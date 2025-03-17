import { User } from "@/types/user";
import { create } from "zustand";

interface Store {
  authUser: User | null;
  setAuthUser: (user: User) => void;
  removeAuthUser: () => void;
}

export const useAuthStore = create<Store>((set) => ({
  authUser: null,
  setAuthUser: (user: User) => {
    set(() => ({ authUser: user }));
  },
  removeAuthUser: () => {
    set(() => ({ authUser: null }));
  },
}));
