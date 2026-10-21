import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import {
  registerUser,
  loginUser,
  loginAsGuest,
  type AuthErrorCode,
} from "./authService";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Logo } from "../../components/ui/Logo";
import { motion } from "framer-motion";

function getErrorMessage(code: AuthErrorCode, isFa: boolean, fallbackMsg?: string): string {
  if (fallbackMsg) return fallbackMsg;

  const messages: Record<AuthErrorCode, { fa: string; en: string }> = {
    EMPTY_FIELDS: { fa: "لطفاً همه فیلدها را پر کنید", en: "Please fill all fields" },
    USERNAME_TOO_SHORT: { fa: "شناسه کاربری باید حداقل 3 کاراکتر باشد", en: "Username must be at least 3 characters" },
    PASSWORD_TOO_SHORT: { fa: "رمز عبور باید حداقل 8 کاراکتر باشد", en: "Password must be at least 8 characters" },
    USER_LIMIT: { fa: "حداکثر 10 کاربر مجاز است", en: "Maximum 10 users allowed" },
    USERNAME_TAKEN: { fa: "این شناسه کاربری قبلاً گرفته شده است", en: "Username already taken" },
    INVALID_CREDENTIALS: { fa: "نام کاربری یا رمز عبور اشتباه است", en: "Invalid username or password" },
    UNKNOWN_ERROR: { fa: "خطای ناشناخته رخ داد", en: "An unknown error occurred" },
    INVALID_USERNAME_FORMAT: { fa: "شناسه کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و زیرخط (_) باشد", en: "Username can only contain English letters, numbers, and underscores" },
  };
  return messages[code][isFa ? "fa" : "en"];
}

export function AuthScreen({ isUpgrade = false }: { isUpgrade?: boolean }) {
  const { t } = useTranslation();
  const isFa = true; // زبان برای همیشه فارسی قفل شد
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const setCurrentRoute = useAppStore((s) => s.setCurrentRoute);

  const [isLogin, setIsLogin] = useState(!isUpgrade);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("رمز عبور و تأیید آن یکسان نیستند");
      return;
    }

    setLoading(true);
    try {
      const result = isLogin
        ? await loginUser(username, password)
        : await registerUser(username, password);

      if (!result.success) {
        setError(getErrorMessage(result.error!, isFa, result.errorMessage));
        return;
      }
      if (result.user) {
        setCurrentUser(result.user);
        if (isUpgrade) setCurrentRoute("home");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      const result = await loginAsGuest();
      if (result.success && result.user) setCurrentUser(result.user);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-x-hidden text-slate-200 bg-[#0B0D1A]" dir="rtl">
      {isUpgrade && (
         <button onClick={() => setCurrentRoute("settings")} className="absolute top-6 right-6 text-sm text-[#D6B56D] font-bold hover:underline">
           انصراف
         </button>
      )}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-8 mt-8">
        <div className="flex items-center gap-4 text-[#D6B56D] drop-shadow-md mb-2">
          <Logo size={50} className="animate-[spin_25s_linear_infinite]" />
          <h1 className="text-5xl font-logo font-bold tracking-[0.2em]">LUMA</h1>
        </div>
        <p className="text-[#8B5CF6] font-medium">به دنیای درون خود خوش آمدید</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="bg-[#17182B] border border-[#8B5CF6]/30 rounded-[2rem] w-full shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center text-[#D6B56D] mb-6">
            {isUpgrade ? "ثبت‌نام و ارتقای حساب" : isLogin ? t("login") : t("register")}
          </h2>

          {isUpgrade && (
            <p className="text-center text-slate-400 text-xs mb-4 leading-relaxed">
              با ثبت‌نام، تمام اطلاعات مهمان شما (XP، سطح و تاریخچه فال‌ها) به حساب جدید منتقل می‌شود.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-slate-300">شناسه کاربری (فقط انگلیسی)</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="مثلاً: ali_reza" className="bg-[#0B0D1A] border-slate-700 text-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-300">{t("password")}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="" className="bg-[#0B0D1A] border-slate-700 text-white" />
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-slate-300">تأیید رمز عبور</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="" className="bg-[#0B0D1A] border-slate-700 text-white" />
              </div>
            )}

            {error && (
              <p className="text-red-400 text-xs font-medium text-center bg-red-900/20 p-2 rounded-lg leading-relaxed">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white h-12 rounded-xl mt-2 font-bold">
              {loading ? "..." : (isUpgrade ? "ثبت‌نام و انتقال داده‌ها" : isLogin ? t("login") : t("register"))}
            </Button>
          </form>

          {!isUpgrade && (
            <div className="mt-6 flex flex-col gap-3 text-center text-sm">
              <button type="button" onClick={toggleMode} className="text-[#D6B56D] hover:text-amber-400 font-medium">
                {isLogin ? t("register") : t("login")}
              </button>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="h-px bg-slate-700 flex-1"></div>
                <span>یا</span>
                <div className="h-px bg-slate-700 flex-1"></div>
              </div>
              <Button type="button" variant="outline" onClick={handleGuest} disabled={loading} className="w-full border-[#D6B56D]/30 text-[#D6B56D] hover:bg-[#D6B56D]/10 h-10 rounded-xl">
                {t("guest")}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}