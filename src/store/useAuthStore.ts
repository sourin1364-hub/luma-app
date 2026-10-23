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
  logout: () => void;
  setHasRehydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      birthData: null,
      hasRehydrated: false,
      setCurrentUser: (user) => {
        console.log("[AuthStore] setCurrentUser:", user?.birthData ? "has birthData" : "no birthData");
        set({ currentUser: user });
      },
      setBirthData: (data) => {
        console.log("[AuthStore] setBirthData:", data);
        set({ birthData: data });
      },
      setHasRehydrated: (value) => set({ hasRehydrated: value }),
      logout: () => {
        supabase.auth.signOut();
        set({ currentUser: null, birthData: null });
      },
    }),
    {
      name: "luma-auth-v2",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        console.log("[AuthStore] Rehydrated. birthData:", state?.birthData);
        if (state) {
          state.setHasRehydrated(true);
        }
      },
      partialize: (state) => ({
        currentUser: state.currentUser
          ? {
              id: state.currentUser.id,
              username: state.currentUser.username,
              isGuest: state.currentUser.isGuest,
              createdAt: state.currentUser.createdAt,
              birthData: state.currentUser.birthData,
            }
          : null,
        birthData: state.birthData,
      }),
    }
  )
);
