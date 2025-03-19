import {create} from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type ThemeStore = {
    theme: string;
    setTheme: (theme: string) => void;
}

const useThemeStore = create<ThemeStore>()(
    persist((set) => ({
        theme: "light",
        setTheme: (theme: string) => set({ theme }),
    }), {
        name: "theme",
        storage: createJSONStorage(() => localStorage),
    })
)

export default useThemeStore;