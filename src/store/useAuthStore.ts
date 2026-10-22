import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type User } from "../db";
import { supabase } from "../lib/supabase";

interface AuthState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => Promise<void>;
  createGuestUser: () => User;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      logout: async () => {
        const user = get().currentUser;
        if (user && !user.isGuest) {
          await supabase.auth.signOut();
        }
        set({ currentUser: null });
      },
      createGuestUser: () => {
        const guestUser: User = {
          id: `guest-${Date.now()}`,
          username: "مهمان",
          isGuest: true,
          createdAt: Date.now(),
        };
        set({ currentUser: guestUser });
        return guestUser;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
);
