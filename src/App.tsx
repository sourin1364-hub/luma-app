import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useAppStore } from "./store/useAppStore";
import { AuthScreen } from "./features/auth/AuthScreen";
import { HomeScreen } from "./features/auth/HomeScreen";
import { ProfileSetupScreen } from "./features/chart/ProfileSetupScreen";
import { supabase } from "./lib/supabase";
import { type User, type BirthData } from "./db";
import { SplashScreen } from "./components/SplashScreen";

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

function getValidBirthData(
  localUser: User | null,
  storeBirthData: BirthData | null,
  birthBackup: BirthData | null
): BirthData | undefined {
  if (hasValidBirthData(localUser?.birthData)) return localUser!.birthData;
  if (hasValidBirthData(storeBirthData)) return storeBirthData!;
  if (hasValidBirthData(birthBackup)) return birthBackup!;
  return undefined;
}

function App() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const storeBirthData = useAuthStore((state) => state.birthData);
  const hasRehydrated = useAuthStore((state) => state.hasRehydrated);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setBirthData = useAuthStore((state) => state.setBirthData);
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
  }, []);

  useEffect(() => {
    if (!hasRehydrated) {
      console.log("[App] Waiting for rehydration...");
      return;
    }

    console.log("[App] Rehydrated. currentUser:", currentUser?.id, "storeBirthData:", storeBirthData);

    const checkUser = async (sessionUser: any) => {
      if (!sessionUser) {
        console.log("[App] No session user");
        setLoading(false);
        return;
      }

      const localUser = useAuthStore.getState().currentUser;
      const birthBackup = readBirthBackup();

      console.log("[App] localUser birthData:", localUser?.birthData);
      console.log("[App] storeBirthData:", storeBirthData);
      console.log("[App] birthBackup:", birthBackup);

      const localValidData = getValidBirthData(localUser, storeBirthData, birthBackup);
      console.log("[App] localValidData:", localValidData);

      if (!navigator.onLine && localValidData) {
        console.log("[App] Offline with valid local data");
        const user: User = {
          id: sessionUser.id,
          username: localUser?.username || sessionUser.user_metadata?.username || sessionUser.email?.split("@")[0] || "User",
          isGuest: false,
          createdAt: new Date(sessionUser.created_at).getTime(),
          birthData: localValidData,
        };
        setCurrentUser(user);
        setBirthData(localValidData);
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
        console.log("[App] Server birth data:", birthDataRecord);

        const { data: profileData } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", sessionUser.id)
          .limit(1);

        const displayName = profileData?.[0]?.display_name;

        let birthData: BirthData | undefined;

        if (birthDataRecord) {
          const serverHasValidData = hasValidBirthData({
            year: birthDataRecord.year,
            month: birthDataRecord.month,
            day: birthDataRecord.day,
            motherName: birthDataRecord.mother_name,
            birthTime: birthDataRecord.birth_time,
            birthPlace: birthDataRecord.birth_place,
          });

          if (serverHasValidData) {
            birthData = {
              year: birthDataRecord.year,
              month: birthDataRecord.month,
              day: birthDataRecord.day,
              motherName: birthDataRecord.mother_name || "",
              birthTime: birthDataRecord.birth_time || "",
              birthPlace: birthDataRecord.birth_place || "",
            };
            console.log("[App] Using valid server data");
          } else {
            birthData = localValidData;
            console.log("[App] Server incomplete, using local data:", birthData);
          }
        } else {
          birthData = localValidData;
          console.log("[App] No server record, using local data:", birthData);
        }

        const user: User = {
          id: sessionUser.id,
          username: displayName || localUser?.username || sessionUser.user_metadata?.username || sessionUser.email?.split("@")[0] || "User",
          isGuest: false,
          createdAt: new Date(sessionUser.created_at).getTime(),
          birthData,
        };

        console.log("[App] Setting user with birthData:", birthData);
        setCurrentUser(user);
        if (birthData) setBirthData(birthData);
      } catch (error) {
        console.warn("[App] Network error:", error);
        if (localValidData) {
          const user: User = {
            id: sessionUser.id,
            username: localUser?.username || sessionUser.user_metadata?.username || sessionUser.email?.split("@")[0] || "User",
            isGuest: false,
            createdAt: new Date(sessionUser.created_at).getTime(),
            birthData: localValidData,
          };
          setCurrentUser(user);
        }
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[App] Auth event:", event);
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[App] Initial session:", session?.user?.id);
      if (session?.user) {
        checkUser(session.user);
      } else {
        setLoading(false);
      }
    }).catch((err) => {
      console.warn("[App] getSession error:", err);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [hasRehydrated, setCurrentUser, setBirthData, storeBirthData]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isRecovery) {
    return <AuthScreen />;
  }

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

  if (!currentUser) {
    return <AuthScreen />;
  }

  const userBirthData = currentUser.birthData || storeBirthData || readBirthBackup();
  const hasValidData = hasValidBirthData(userBirthData);

  console.log("[App] Render check - hasValidData:", hasValidData, "birthData:", userBirthData);

  if (!hasValidData) {
    return <ProfileSetupScreen />;
  }

  return <HomeScreen />;
}

export default App;
