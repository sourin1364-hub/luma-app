import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../db";
import { supabase } from "../lib/supabase";

interface AuthState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      logout: async () => {
        await supabase.auth.signOut();
        set({ currentUser: null });
      },
    }),
    {
      name: "luma-auth-v2",
      version: 1,
      storage: createJSONStorage(() => localStorage),
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
      }),
    }
  )
);
