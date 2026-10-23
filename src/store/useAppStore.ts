import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AppState {
  currentRoute: "home" | "chart" | "astrology" | "tarot_menu" | "tarot_library" | "tarot_history" | "reading" | "profile" | "profile_setup" | "settings" | "about" | "upgrade";
  setCurrentRoute: (route: AppState["currentRoute"]) => void;
  themeMode: "light" | "dark";
  setThemeMode: (mode: "light" | "dark") => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  language: "fa" | "en";
  setLanguage: (lang: "fa" | "en") => void;
  selectedTarotCardId: number | null;
  setSelectedTarotCardId: (id: number | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentRoute: "home",
      setCurrentRoute: (route) => set({ currentRoute: route }),
      themeMode: (localStorage.getItem("luma_theme") as "light" | "dark") || "light",
      setThemeMode: (mode) => {
        localStorage.setItem("luma_theme", mode);
        set({ themeMode: mode });
      },
      soundEnabled: localStorage.getItem("luma_sound") !== "false",
      setSoundEnabled: (val) => {
        localStorage.setItem("luma_sound", val.toString());
        set({ soundEnabled: val });
      },
      language: (localStorage.getItem("luma_lang") as "fa" | "en") || "fa",
      setLanguage: (lang) => {
        localStorage.setItem("luma_lang", lang);
        set({ language: lang });
      },
      selectedTarotCardId: null,
      setSelectedTarotCardId: (id) => set({ selectedTarotCardId: id }),
    }),
    {
      name: "luma-app-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentRoute: state.currentRoute,
        themeMode: state.themeMode,
        soundEnabled: state.soundEnabled,
        language: state.language,
      }),
    }
  )
);
