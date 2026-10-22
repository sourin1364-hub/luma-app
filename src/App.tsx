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
  const themeMode = useAppStore((state) => state.themeMode);

  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", "fa");
    document.documentElement.setAttribute("dir", "rtl");

    if (window.location.hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    const checkUser = async (sessionUser: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at: string }) => {
      if (!sessionUser) return;
      const current = useAuthStore.getState().currentUser;

      if (!navigator.onLine && current && current.id === sessionUser.id) {
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

        const user: User = {
          id: sessionUser.id,
          username:
            (displayName as string) ||
            (sessionUser.user_metadata?.username as string) ||
            sessionUser.email?.split("@")[0] ||
            "User",
          isGuest: false,
          createdAt: new Date(sessionUser.created_at).getTime(),
          birthData: birthDataRecord
            ? {
                year: birthDataRecord.year,
                month: birthDataRecord.month,
                day: birthDataRecord.day,
                motherName: birthDataRecord.mother_name,
                birthTime: birthDataRecord.birth_time,
                birthPlace: birthDataRecord.birth_place,
              }
            : current?.birthData,
        };

        useAuthStore.getState().setCurrentUser(user);
      } catch (error) {
        console.warn("Network error while fetching user data. Using offline data.", error);
      } finally {
        setLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
      if (session?.user) {
        checkUser(session.user as { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at: string });
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
          checkUser(session.user as { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at: string });
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to get session while offline", err);
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isRecovery) {
    return <AuthScreen recoveryMode />;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-main)]">
        <div className="text-[var(--text-muted)]">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!currentUser) return <AuthScreen />;
  if (!currentUser.birthData) return <ProfileSetupScreen />;
  return <HomeScreen />;
}

export default App;
