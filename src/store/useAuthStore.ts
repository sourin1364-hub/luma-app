import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../db";
import { supabase } from "../lib/supabase";

interface AuthState {
  currentUser: User | null;
  hasRehydrated: boolean;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
  setHasRehydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      hasRehydrated: false,
      setCurrentUser: (user) => set({ currentUser: user }),
      setHasRehydrated: (value) => set({ hasRehydrated: value }),
      logout: () => {
        supabase.auth.signOut();
        set({ currentUser: null });
      },
    }),
    {
      name: "luma-auth-v2",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasRehydrated(true);
        }
      },
      partialize: (state) => ({
        currentUser: state.currentUser
          ? {
              ...state.currentUser,
              passwordHash: undefined,
              passwordSalt: undefined,
            }
          : null,
      }),
    }
  )
);
