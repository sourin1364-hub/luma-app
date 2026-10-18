import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { db } from "../../db";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Logo } from "../../components/ui/Logo";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

// تابع هش کردن رمز عبور با SHA-256
async function hashPassword(password: string) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function AuthScreen() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const setLanguage = useAppStore((s) => s.setLanguage);
  const language = useAppStore((s) => s.language);
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (lang: "fa" | "en") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username.trim() || !password.trim()) {
      setError(isFa ? "لطفاً نام کاربری و رمز عبور را وارد کنید" : "Please enter username and password");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        // منطق ورود
        const user = await db.users.where("username").equals(username.trim()).first();
        if (!user) throw new Error(isFa ? "کاربری با این نام یافت نشد" : "User not found");
        
        const hashed = await hashPassword(password);
        if (user.passwordHash !== hashed) throw new Error(isFa ? "رمز عبور اشتباه است" : "Incorrect password");
        
        setCurrentUser(user);
      } else {
        // منطق ثبت‌نام
        const exists = await db.users.where("username").equals(username.trim()).first();
        if (exists) throw new Error(isFa ? "این نام کاربری قبلاً گرفته شده است" : "Username already taken");
        
        const count = await db.users.count();
        if (count >= 10) throw new Error(isFa ? "حداکثر  کاربر مجاز است" : "Maximum 10 users allowed");

        const hashed = await hashPassword(password);
        const id = await db.users.add({
          username: username.trim(),
          passwordHash: hashed,
          isGuest: false,
          createdAt: Date.now(),
        });

        const newUser = await db.users.get(id);
        if (newUser) setCurrentUser(newUser);
      }
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      const id = await db.users.add({
        username: `Guest_${Math.floor(Math.random() * 10000)}`,
        isGuest: true,
        createdAt: Date.now(),
      });
      const guestUser = await db.users.get(id);
      if (guestUser) setCurrentUser(guestUser);
    } catch (err) {
      setError(isFa ? "خطا در ورود مهمان" : "Guest login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-slate-800" dir={isFa ? "rtl" : "ltr"}>
      
      {/* Language Switcher */}
      <div className="absolute top-6 left-6 right-6 flex justify-end z-50">
        <div className="flex bg-white/60 backdrop-blur-md p-1 rounded-full border border-white/80 shadow-sm">
          <button 
            onClick={() => handleLanguageChange("fa")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all ${language === "fa" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-blue-900"}`}
          >
            <Globe className="w-3.5 h-3.5" /> فارسی
          </button>
          <button 
            onClick={() => handleLanguageChange("en")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all ${language === "en" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-blue-900"}`}
          >
            <Globe className="w-3.5 h-3.5" /> English
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-4 text-blue-900 drop-shadow-md mb-2">
          <Logo size={50} className="animate-[spin_25s_linear_infinite]" />
          <h1 className="text-5xl font-logo font-bold tracking-[0.2em]">LUMA</h1>
        </div>
        <p className="text-blue-700/80 font-medium">{isFa ? "به دنیای درون خود خوش آمدید" : "Welcome to your inner world"}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="glow-card rounded-[2rem] w-full shadow-xl">
          <div className="glow-card-inner rounded-[2rem] p-8">
            <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
              {isLogin ? t("login") : t("register")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">{t("username")}</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={isFa ? "نام کاربری" : "Username"} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">{t("password")}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="" />
              </div>

              {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl mt-2">
                {loading ? "..." : (isLogin ? t("login") : t("register"))}
              </Button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-center text-sm">
              <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-blue-600 hover:text-blue-800 font-medium">
                {isLogin ? t("register") : t("login")}
              </button>
              <div className="flex items-center gap-2 text-slate-400">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span>{isFa ? "یا" : "OR"}</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>
              <Button type="button" variant="outline" onClick={handleGuest} disabled={loading} className="w-full border-blue-200 text-blue-900 hover:bg-blue-50 h-10 rounded-xl">
                {t("guest")}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}