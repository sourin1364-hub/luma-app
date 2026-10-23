import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useAppStore } from "./store/useAppStore";
import { AuthScreen } from "./features/auth/AuthScreen";
import { HomeScreen } from "./features/auth/HomeScreen";
import { ProfileSetupScreen } from "./features/chart/ProfileSetupScreen";
import { supabase } from "./lib/supabase";
import { type User, type BirthData } from "./db";

function readBirthBackup(): BirthData | null {
  try {
    const raw = localStorage.getItem("luma_birth_backup");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.year === "number" && parsed.year > 1200) {
        return parsed as BirthData;
      }
    }
  } catch (e) {
    console.error("[App] Failed to read birth backup:", e);
  }
  return null;
}

function hasValidBirthData(bd: BirthData | null | undefined): boolean {
  if (!bd) return false;
  return (
    typeof bd.year === "number" && bd.year > 1200 &&
    typeof bd.month === "number" && bd.month > 0 &&
    typeof bd.day === "number" && bd.day > 0 &&
    !!bd.motherName?.trim()
  );
}

function App() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const storeBirthData = useAuthStore((state) => state.birthData);
  const hasRehydrated = useAuthStore((state) => state.hasRehydrated);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setBirthData = useAuthStore((state) => state.setBirthData);
  const logout = useAuthStore((state) => state.logout);
  const themeMode = useAppStore((state) => state.themeMode);

  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [sessionUser, setSessionUser] = useState<any>(null);

  // Theme
  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  // RTL + recovery hash
  useEffect(() => {
    document.documentElement.setAttribute("lang", "fa");
    document.documentElement.setAttribute("dir", "rtl");
    if (window.location.hash.includes("type=recovery")) {
      setIsRecovery(true);
    }
  }, []);

  // Splash auto-dismiss
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auth state: Supabase is the source of truth
  useEffect(() => {
    if (!hasRehydrated) return;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("[App] Session:", session?.user?.id || "null");

        if (!session?.user) {
          // No session: clear any stale local user and show auth
          if (currentUser && !currentUser.isGuest) {
            console.log("[App] No session but stale user exists -> logout");
            logout();
          }
          setLoading(false);
          return;
        }

        // Session exists: build user
        setSessionUser(session.user);
        await loadUserData(session.user);
      } catch (err) {
        console.error("[App] Auth init error:", err);
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[App] Auth event:", event);
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
      if (event === "SIGNED_OUT") {
        logout();
        setSessionUser(null);
        setLoading(false);
      } else if (session?.user) {
        setSessionUser(session.user);
        loadUserData(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [hasRehydrated]);

  const loadUserData = async (user: any) => {
    const localUser = useAuthStore.getState().currentUser;
    const birthBackup = readBirthBackup();

    // Priority: localUser.birthData > storeBirthData > birthBackup
    let birthData: BirthData | undefined;
    if (hasValidBirthData(localUser?.birthData)) {
      birthData = localUser!.birthData;
    } else if (hasValidBirthData(storeBirthData)) {
      birthData = storeBirthData!;
    } else if (hasValidBirthData(birthBackup)) {
      birthData = birthBackup!;
    }

    if (!navigator.onLine && birthData) {
      const newUser: User = {
        id: user.id,
        username: localUser?.username || user.user_metadata?.username || user.email?.split("@")[0] || "User",
        isGuest: false,
        createdAt: new Date(user.created_at).getTime(),
        birthData,
      };
      setCurrentUser(newUser);
      setBirthData(birthData);
      setLoading(false);
      return;
    }

    try {
      // Fetch birth profile
      const { data: birthRecords } = await supabase
        .from("birth_profiles")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);

      const record = birthRecords?.[0];

      // Fetch display name
      const { data: profileData } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .limit(1);

      const displayName = profileData?.[0]?.display_name;

      if (record) {
        const serverData: BirthData = {
          year: record.year,
          month: record.month,
          day: record.day,
          motherName: record.mother_name || "",
          birthTime: record.birth_time || "",
          birthPlace: record.birth_place || "",
        };
        if (hasValidBirthData(serverData)) {
          birthData = serverData;
          console.log("[App] Using server birth data");
        }
      }

      const newUser: User = {
        id: user.id,
        username: displayName || localUser?.username || user.user_metadata?.username || user.email?.split("@")[0] || "User",
        isGuest: false,
        createdAt: new Date(user.created_at).getTime(),
        birthData,
      };

      setCurrentUser(newUser);
      if (birthData) setBirthData(birthData);
    } catch (err) {
      console.warn("[App] Load error:", err);
      // Use local data as fallback
      if (birthData) {
        const newUser: User = {
          id: user.id,
          username: localUser?.username || user.user_metadata?.username || user.email?.split("@")[0] || "User",
          isGuest: false,
          createdAt: new Date(user.created_at).getTime(),
          birthData,
        };
        setCurrentUser(newUser);
      }
    } finally {
      setLoading(false);
    }
  };

  // Splash screen
  if (showSplash) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0D1A] text-white">
        <div className="text-center">
          <div className="text-6xl font-bold text-[#D6B56D] mb-4 tracking-widest">LUMA</div>
          <div className="text-[#D6B56D]/80 text-lg">سفری به دنیای درون</div>
          <div className="mt-8 animate-spin rounded-full h-8 w-8 border-b-2 border-[#D6B56D] mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isRecovery) return <AuthScreen />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0B0D1A] text-slate-800 dark:text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D6B56D] mx-auto mb-4"></div>
          <p className="text-[#D6B56D]">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // KEY FIX: Show AuthScreen if no Supabase session
  if (!sessionUser) {
    return <AuthScreen />;
  }

  // User is logged in: check birth data
  const userBirthData = currentUser?.birthData || storeBirthData || readBirthBackup();
  if (!hasValidBirthData(userBirthData)) {
    return <ProfileSetupScreen />;
  }

  return <HomeScreen />;
}

export default App;
