import { useEffect, lazy, Suspense } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { getWesternZodiac, getElementFromZodiac } from "../../lib/astrology";

// ایمپورت تنبل (Lazy) برای کاهش حجم باندل اولیه
const ProfileSetupScreen = lazy(() => import("../chart/ProfileSetupScreen").then(m => ({ default: m.ProfileSetupScreen })));
const ChartScreen = lazy(() => import("../chart/ChartScreen").then(m => ({ default: m.ChartScreen })));
const AstrologyScreen = lazy(() => import("../astrology/AstrologyScreen").then(m => ({ default: m.AstrologyScreen })));
const TarotMenuScreen = lazy(() => import("../tarot/TarotMenuScreen").then(m => ({ default: m.TarotMenuScreen })));
const TarotGalleryScreen = lazy(() => import("../tarot/TarotGalleryScreen").then(m => ({ default: m.TarotGalleryScreen })));
const TarotReadingScreen = lazy(() => import("../tarot/TarotReadingScreen").then(m => ({ default: m.TarotReadingScreen })));
const TarotHistoryScreen = lazy(() => import("../tarot/TarotHistoryScreen").then(m => ({ default: m.TarotHistoryScreen })));
const ProfileScreen = lazy(() => import("../gamification/ProfileScreen").then(m => ({ default: m.ProfileScreen })));
const SettingsScreen = lazy(() => import("../settings/SettingsScreen").then(m => ({ default: m.SettingsScreen })));
const DashboardScreen = lazy(() => import("../dashboard/DashboardScreen").then(m => ({ default: m.DashboardScreen })));
const AboutScreen = lazy(() => import("../about/AboutScreen").then(m => ({ default: m.AboutScreen })));
const AuthScreen = lazy(() => import("./AuthScreen").then(m => ({ default: m.AuthScreen })));

export function HomeScreen() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const currentRoute = useAppStore((state) => state.currentRoute);

  useEffect(() => {
    if (currentUser?.birthData) {
      const m = Number(currentUser.birthData.month) || 3;
      const d = Number(currentUser.birthData.day) || 21;
      const zodiac = getWesternZodiac(m, d) || "aries";
      const element = getElementFromZodiac(zodiac) || "fire";
      document.documentElement.setAttribute("data-element", element);
    } else {
      document.documentElement.setAttribute("data-element", "water");
    }
    return () => document.documentElement.removeAttribute("data-element");
  }, [currentUser?.birthData]);

  if (!currentUser) return null;

  const hasValidBirthData =
    currentUser.birthData &&
    typeof currentUser.birthData.year === "number" && 
    currentUser.birthData.year > 1200;

  const loadingFallback = (
    <div className="min-h-screen bg-[#0B0D1A] flex items-center justify-center text-amber-500 font-bold">
      در حال بارگذاری...
    </div>
  );

  if (!hasValidBirthData && currentRoute !== "settings" && currentRoute !== "about") {
    return (
      <Suspense fallback={loadingFallback}>
        <ProfileSetupScreen />
      </Suspense>
    );
  }

  let ComponentToRender;
  switch (currentRoute) {
    case "home": ComponentToRender = <DashboardScreen />; break;
    case "chart": ComponentToRender = <ChartScreen />; break;
    case "astrology": ComponentToRender = <AstrologyScreen />; break;
    case "tarot_menu": ComponentToRender = <TarotMenuScreen />; break;
    case "tarot_library": ComponentToRender = <TarotGalleryScreen />; break;
    case "tarot_history": ComponentToRender = <TarotHistoryScreen />; break;
    case "reading": ComponentToRender = <TarotReadingScreen />; break;
    case "profile": ComponentToRender = <ProfileScreen />; break;
    case "settings": ComponentToRender = <SettingsScreen />; break;
    case "profile_setup": ComponentToRender = <ProfileSetupScreen />; break;
    case "about": ComponentToRender = <AboutScreen />; break;
    case "upgrade": ComponentToRender = <AuthScreen isUpgrade={true} />; break;
    default: ComponentToRender = <DashboardScreen />; break;
  }

  return (
    <Suspense fallback={loadingFallback}>
      {ComponentToRender}
    </Suspense>
  );
}