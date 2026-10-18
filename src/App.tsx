import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useAppStore } from "./store/useAppStore";
import { AuthScreen } from "./features/auth/AuthScreen";
import { HomeScreen } from "./features/auth/HomeScreen";

function App() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const themeMode = useAppStore((state) => state.themeMode);

  useEffect(() => {
    document.documentElement.setAttribute("lang", "fa");
    document.documentElement.setAttribute("dir", "rtl");
    
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  return currentUser ? <HomeScreen /> : <AuthScreen />;
}

export default App;