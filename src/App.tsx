import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useAppStore } from "./store/useAppStore";
import { AuthScreen } from "./features/auth/AuthScreen";
import { SplashScreen } from "./components/SplashScreen";

import { HomeScreen } from "./features/auth/HomeScreen";
import { ProfileSetupScreen } from "./features/chart/ProfileSetupScreen";
import { supabase } from "./lib/supabase";
import { type User } from "./db";

function App() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const themeMode = useAppStore((state) => state.themeMode);


  useEffect(() => {
    if (themeMode === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    document.documentElement.setAttribute("lang", "fa");
    document.documentElement.setAttribute("dir", "rtl");
    

    // بررسی اولیه برای حالت بازیابی رمز
    if (window.location.hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    const checkUser = async (sessionUser: any) => {
      if (!sessionUser) return;

      const current = useAuthStore.getState().currentUser;

      if (!navigator.onLine && current && current.id === sessionUser.id) {
        setLoading(false);
        return;
      }

      try {
        const { data: birthDataRecords } = await supabase
          .from('birth_profiles')
          .select('*')
          .eq('user_id', sessionUser.id)
          .limit(1);

        const birthDataRecord = birthDataRecords?.[0];

        const { data: profileData } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', sessionUser.id)
          .limit(1);
        const displayName = profileData?.[0]?.display_name;

        const user: User = {
          id: sessionUser.id,
          username: displayName || sessionUser.user_metadata.username || sessionUser.email?.split('@')[0] || 'User',
          isGuest: false,
          createdAt: new Date(sessionUser.created_at).getTime(),
          birthData: birthDataRecord ? {
            year: birthDataRecord.year,
            month: birthDataRecord.month,
            day: birthDataRecord.day,
            motherName: birthDataRecord.mother_name,
            birthTime: birthDataRecord.birth_time,
            birthPlace: birthDataRecord.birth_place
          } : current?.birthData
        };

        useAuthStore.getState().setCurrentUser(user);
      } catch (error) {
        console.warn("Network error while fetching user data. Using offline data.", error);
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // اگر رویداد بازیابی رمز رخ داد، کاربر را به صفحه تغییر رمز هدایت می‌کنیم
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
      if (session?.user) {
        checkUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        const current = useAuthStore.getState().currentUser;
        if (current && !current.isGuest) {
          useAuthStore.getState().logout();
        }
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkUser(session.user);
      } else {
        setLoading(false);
      }
    }).catch((err) => {
      console.warn("Failed to get session while offline", err);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // نمایش صفحه تغییر رمز عبور (حتی اگر کاربر سشن داشته باشد)


  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isRecovery) {
    return <AuthScreen />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0D1A] text-[#D6B56D] font-bold text-xl">
        در حال بارگذاری...
      </div>
    );
  }

  if (!currentUser) return <AuthScreen />;
  if (!currentUser.birthData) return <ProfileSetupScreen />;
  return <HomeScreen />;
}

export default App;