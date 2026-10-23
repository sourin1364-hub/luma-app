import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useAppStore } from "./store/useAppStore";
import { AuthScreen } from "./features/auth/AuthScreen";
import { HomeScreen } from "./features/auth/HomeScreen";
import { ProfileSetupScreen } from "./features/chart/ProfileSetupScreen";
import { supabase } from "./lib/supabase";
import { type User } from "./db";
import { SplashScreen } from "./components/SplashScreen";

function App() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const hasRehydrated = useAuthStore((state) => state.hasRehydrated);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const themeMode = useAppStore((state) => state.themeMode);

  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Dark mode
  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  // Auth check - ONLY after Zustand rehydration
  useEffect(() => {
    document.documentElement.setAttribute("lang", "fa");
    document.documentElement.setAttribute("dir", "rtl");

    if (window.location.hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    // Wait for Zustand persist to finish before checking Supabase
    if (!hasRehydrated) return;

    const checkUser = async (sessionUser: any) => {
      if (!sessionUser) {
        setLoading(false);
        return;
      }

      const current = useAuthStore.getState().currentUser;

      // If offline and we already have this user's data, skip Supabase fetch
      if (!navigator.onLine && current && current.id === sessionUser.id && current.birthData) {
        setLoading(false);
        return;
      }

      try {
        const { data: birthDataRecords } = await supabase
          .from("birth_profiles")
          .select("*")
          .eq("user_id", sessionUser.id)
          .limit(1);

        const birthDataRecord = birthDataRecords?.[0];

        const { data: profileData } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", sessionUser.id)
          .limit(1);

        const displayName = profileData?.[0]?.display_name;

        // Preserve existing birthData from localStorage if Supabase returns nothing
        const existingBirthData = current?.birthData;
        const birthData = birthDataRecord
          ? {
              year: birthDataRecord.year,
              month: birthDataRecord.month,
              day: birthDataRecord.day,
              motherName: birthDataRecord.mother_name,
              birthTime: birthDataRecord.birth_time,
              birthPlace: birthDataRecord.birth_place,
            }
          : existingBirthData;

        const user: User = {
          id: sessionUser.id,
          username:
            displayName ||
            sessionUser.user_metadata?.username ||
            sessionUser.email?.split("@")[0] ||
            "User",
          isGuest: false,
          createdAt: new Date(sessionUser.created_at).getTime(),
          birthData,
        };

        setCurrentUser(user);
      } catch (error) {
        console.warn("Network error while fetching user data. Using offline data.", error);
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
      if (session?.user) {
        checkUser(session.user);
      } else if (event === "SIGNED_OUT") {
        const current = useAuthStore.getState().currentUser;
        if (current && !current.isGuest) {
          useAuthStore.getState().logout();
        }
        setLoading(false);
      }
    });

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          checkUser(session.user);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to get session while offline", err);
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, [hasRehydrated, setCurrentUser]);

  // Splash screen
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Recovery mode
  if (isRecovery) {
    return <AuthScreen isUpgrade={false} />;
  }

  // Loading while rehydrating OR fetching auth
  if (!hasRehydrated || loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-main)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#D6B56D] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-muted)]">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    return <AuthScreen isUpgrade={false} />;
  }

  // Logged in but no birth data -> show profile setup
  if (!currentUser.birthData) {
    return <ProfileSetupScreen />;
  }

  // Everything ready -> home
  return <HomeScreen />;
}

export default App;
