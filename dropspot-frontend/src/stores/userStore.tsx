import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Drop } from "../types/Drop.type";
import { User } from "../types/User.type";

interface AppState {
    login: (token: string, userData: User) => void;
    logout: () => void;

    drops: Drop[];
    setDrops: (drops: Drop[]) => void;
    user: User | null;
    setUser: (user: User | null) => void;

    userDrops: Drop[];
    setUserDrops: (drops: Drop[]) => void;

}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            user: null,
            drops: [],
            login: (token, userData) => { set({ user: userData }); localStorage.setItem('token', token) },
            logout: () => { set({ user: null }); localStorage.removeItem('token') },
            setUser: (user) => set({ user }),
            setDrops: (drops) => set({ drops }),
            userDrops: [],
            setUserDrops: (drops) => set({ userDrops: drops }),
        }),
        {
            name: "app-storage",
        }
    )
)