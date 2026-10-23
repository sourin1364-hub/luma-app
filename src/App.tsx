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

    if (!hasRehydrated) return;

    const checkUser = async (sessionUser: any) => {
      if (!sessionUser) {
        setAuthChecked(true);
        return;
      }

      const localUser = useAuthStore.getState().currentUser;

      if (!navigator.onLine && localUser && localUser.id === sessionUser.id && localUser.birthData) {
        setAuthChecked(true);
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

        let birthData = localUser?.birthData;
        if (birthDataRecord && 
            typeof birthDataRecord.year === "number" && 
            typeof birthDataRecord.month === "number" && 
            typeof birthDataRecord.day === "number" &&
            birthDataRecord.year > 1200) {
          birthData = {
            year: birthDataRecord.year,
            month: birthDataRecord.month,
            day: birthDataRecord.day,
            motherName: birthDataRecord.mother_name || localUser?.birthData?.motherName || "",
            birthTime: birthDataRecord.birth_time || localUser?.birthData?.birthTime || "",
            birthPlace: birthDataRecord.birth_place || localUser?.birthData?.birthPlace || "",
          };
        } else if (birthDataRecord) {
          console.warn("[App] birth_profiles record incomplete, merging with local data");
          birthData = {
            year: localUser?.birthData?.year || birthDataRecord.year || 0,
            month: localUser?.birthData?.month || birthDataRecord.month || 0,
            day: localUser?.birthData?.day || birthDataRecord.day || 0,
            motherName: birthDataRecord.mother_name || localUser?.birthData?.motherName || "",
            birthTime: birthDataRecord.birth_time || localUser?.birthData?.birthTime || "",
            birthPlace: birthDataRecord.birth_place || localUser?.birthData?.birthPlace || "",
          };
        }

        const user