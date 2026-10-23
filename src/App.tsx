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

  const [authChecked, setAuthChecked] = useState(false);
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

  // Auth check - ONLY after Zustand has rehydrated from localStorage
  useEffect(() => {
    document.documentElement.setAttribute("lang", "fa");
    document.documentElement.setAttribute("dir", "rtl");

    if (window.location.hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    // Do not run auth check until Zustand persist has finished reading localStorage
    if (!hasRehydrated) return;

    const checkUser = async (sessionUser: any) => {
      if (!sessionUser) {
        setAuthChecked(true);
        return;
      }

      // Get locally persisted user data (including birthData if saved)
      const localUser = useAuthStore.getState().currentUser;

      // If offline and we already have this user\'s data with birthData, keep it
      if (!navigator.onLine && localUser && localUser.id === sessionUser.id && localUser.birthData) {
        setAuthChecked(true);
        return;
      }

      try {
        // Fetch birth data from Supabase
        const { data: birthDataRecords } = await supabase
          .from("birth_profiles")
          .select("*")
          .eq("user_id", sessionUser.id)
          .limit(1);

        const birthDataRecord = birthDataRecords?.[0];

        // Fetch display name from profiles
        const { data: profileData } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", sessionUser.id)
          .limit(1);

        const displayName = profileData?.[0]?.display_name;

        // Build birthData: prefer Supabase data, fallback to locally persisted data
        let birthData = localUser?.birthData;
        if (birthDataRecord) {
          birthData = {
            year: birthDataRecord.year,
            month: birthDataRecord.month,
            day: birthDataRecord.day,
            motherName: birthDataRecord.mother_name,
            birthTime: birthDataRecord.birth_time,
            birthPlace: birthDataRecord.birth_place,
          };
        }

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
        setAuthChecked(true);
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
        setAuthChecked(true);
      }
    });

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          checkUser(session.user);
        } else {
          setAuthChecked(true);
        }
      })
      .catch((err) => {
        console.warn("Failed to get session while offline", err);
        setAuthChecked(true);
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
  if (!hasRehydrated || !authChecked) {
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
