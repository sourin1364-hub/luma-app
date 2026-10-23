import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, BirthData } from "../db";
import { supabase } from "../lib/supabase";

interface AuthState {
  currentUser: User | null;
  birthData: BirthData | null;
  hasRehydrated: boolean;
  setCurrentUser: (user: User | null) => void;
  setBirthData: (data: BirthData | null) => void;
  setHasRehydrated: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      birthData: null,
      hasRehydrated: false,
      setCurrentUser: (user) => {
        console.log("[AuthStore] setCurrentUser:", user ? `has birthData=${!!user.birthData}` : "null");
        set({ currentUser: user });
      },
      setBirthData: (data) => {
        console.log("[AuthStore] setBirthData:", data);
        set({ birthData: data });
      },
      setHasRehydrated: (value) => set({ hasRehydrated: value }),
      logout: () => {
        supabase.auth.signOut();
        localStorage.removeItem("luma_birth_backup");
        set({ currentUser: null, birthData: null, hasRehydrated: true });
      },
    }),
    {
      name: "luma-auth-v2",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser
          ? {
              ...state.currentUser,
              passwordHash: undefined,
              passwordSalt: undefined,
            }
          : null,
        birthData: state.birthData,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("[AuthStore] Rehydrated. birthData:", state?.birthData);
        if (state) state.setHasRehydrated(true);
      },
    }
  )
);