import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { supabase } from "../../lib/supabase";
import {
  registerUser,
  loginUser,
  loginAsGuest,
  type AuthErrorCode,
} from "./authService";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Logo } from "../../components/ui/Logo";
import { motion } from "framer-motion";

function getErrorMessage(code: AuthErrorCode, isFa: boolean, fallbackMsg?: string): string {
  if (fallbackMsg) return fallbackMsg;
  const messages: Record<AuthErrorCode, { fa: string; en: string }> = {
    EMPTY_FIELDS: { fa: "لطفاً همه فیلدها را پر کنید", en: "Please fill all fields" },
    USERNAME_TOO_SHORT: { fa: "نام کاربری باید حداقل ۲ کاراکتر باشد", en: "Username must be at least 2 characters" },
    PASSWORD_TOO_SHORT: { fa: "رمز عبور باید حداقل ۶ کاراکتر باشد", en: "Password must be at least 6 characters" },
    USER_LIMIT: { fa: "حداکثر ۱۰ کاربر مجاز است", en: "Maximum 10 users allowed" },
    USERNAME_TAKEN: { fa: "این نام کاربری قبلاً گرفته شده است", en: "Username already taken" },
    INVALID_CREDENTIALS: { fa: "نام کاربری یا رمز عبور اشتباه است", en: "Invalid username or password" },
    UNKNOWN_ERROR: { fa: "خطای ناشناخته رخ داد", en: "An unknown error occurred" },
    INVALID_USERNAME_FORMAT: { fa: "نام کاربری فقط می‌تواند شامل حروف فارسی/لاتین، اعداد و زیرخط (_) باشد", en: "Username can only contain Persian/Latin letters, numbers, and underscores" },
    EMAIL_NOT_CONFIRMED: { fa: "ایمیل تأیید نشده است", en: "Email not confirmed" },
    NETWORK_ERROR: { fa: "خطای شبکه", en: "Network error" },
  };
  return messages[code][isFa ? "fa" : "en"];
}

export function AuthScreen({ isUpgrade = false }: { isUpgrade?: boolean }) {
  const { t } = useTranslation();
  const isFa = true;
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const setCurrentRoute = useAppStore((s) => s.setCurrentRoute);

  const [isLogin, setIsLogin] = useState(!isUpgrade);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [recYear, setRecYear] = useState("");
  const [recMonth, setRecMonth] = useState("");
  const [recDay, setRecDay] = useState("");
  const [recMotherName, setRecMotherName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isLogin && password !== confirmPassword) {
      setError("رمز عبور و تأیید آن یکسان نیستند");
      return;
    }

    setLoading(true);
    try {
      const result = isLogin
        ? await loginUser(username, password)
        : await registerUser(username, email, password);

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

  const handleSecurityReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !recYear || !recMonth || !recDay || !recMotherName.trim() || !newPassword) {
      setError("لطفاً همه فیلدها را پر کنید");
      return;
    }

    if (newPassword.length < 8) {
      setError("رمز عبور جدید باید حداقل ۸ کاراکتر باشد");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.rpc('reset_password_with_security_questions', {
      p_username: username.trim(),
      p_year: Number(recYear),
      p_month: Number(recMonth),
      p_day: Number(recDay),
      p_mother_name: recMotherName.trim(),
      p_new_password: newPassword
    });

    if (error) {
      setError("خطا در ارتباط با سرور: " + error.message);
    } else if (data === true) {
      setSuccess("اطلاعات صحیح است. رمز عبور با موفقیت تغییر کرد. حالا می‌توانید وارد شوید.");
      setTimeout(() => {
        setIsForgotPassword(false);
        setPassword("");
        setSuccess("");
      }, 3000);
    } else {
      setError("اطلاعات وارد شده (تاریخ تولد یا نام مادر) با سوابق مطابقت ندارد.");
    }
    setLoading(false);
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
    setSuccess("");
    setConfirmPassword("");
  };

  if (isForgotPassword) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-main)] px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-8 mt-8">
          <Logo size="lg" />
          <h1 className="text-3xl font-bold text-[var(--text-main)] mt-4">LUMA</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <h2 className="text-xl font-bold text-[var(--text-main)] mb-4 text-center">بازیابی رمز عبور</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6 text-center">برای امنیت حساب، اطلاعات اصلی خود را وارد کنید.</p>

          <form onSubmit={handleSecurityReset} className="space-y-4">
            <div>
              <Label>شناسه کاربری</Label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="مثلاً: ali_reza"
                className="w-full h-10 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-3 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>سال تولد</Label>
                <input
                  value={recYear}
                  onChange={(e) => setRecYear(e.target.value)}
                  placeholder="1370"
                  className="w-full h-10 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-3 text-sm text-center text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 transition-all"
                />
              </div>
              <div>
                <Label>ماه</Label>
                <input
                  value={recMonth}
                  onChange={(e) => setRecMonth(e.target.value)}
                  placeholder="1"
                  className="w-full h-10 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-3 text-sm text-center text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 transition-all"
                />
              </div>
              <div>
                <Label>روز</Label>
                <input
                  value={recDay}
                  onChange={(e) => setRecDay(e.target.value)}
                  placeholder="1"
                  className="w-full h-10 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-3 text-sm text-center text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 transition-all"
                />
              </div>
            </div>

            <div>
              <Label>نام مادر</Label>
              <input
                value={recMotherName}
                onChange={(e) => setRecMotherName(e.target.value)}
                placeholder="نام مادر خود را وارد کنید"
                className="w-full h-10 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-3 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 transition-all"
              />
            </div>

            <div>
              <Label>رمز عبور جدید</Label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="حداقل ۸ کاراکتر"
                className="w-full h-10 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-3 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 transition-all"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            {success && <p className="text-green-400 text-sm text-center">{success}</p>}

            <Button type="submit" disabled={loading} className="w-full btn-primary py-3">
              {loading ? "..." : "تغییر رمز عبور"}
            </Button>

            <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-center text-xs text-[#D6B56D] mt-2 hover:underline">
              بازگشت به صفحه ورود
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-main)] px-4">
      {isUpgrade && (
        <button onClick={() => setCurrentRoute("settings")} className="absolute top-6 right-6 text-sm text-[#D6B56D] font-bold hover:underline">انصراف</button>
      )}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-8 mt-8">
        <Logo size="lg" />
        <h1 className="text-3xl font-bold text-[var(--text-main)] mt-4">LUMA</h1>
        <p className="text-[var(--text-muted)] mt-2">به دنیای درون خود خوش آمدید</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <h2 className="text-xl font-bold text-[var(--text-main)] mb-6 text-center">
          {isUpgrade ? "ثبت‌نام و ارتقای حساب" : isLogin ? t("login") : t("register")}
        </h2>

        {isUpgrade && (
          <p className="text-sm text-[var(--text-muted)] mb-4 text-center">
            با ثبت‌نام، تمام اطلاعات مهمان شما به حساب جدید منتقل می‌شود.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>نام کاربری (فارسی یا لاتین)</Label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="مثلاً: آرنا"
              className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-4 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 focus:border-[#D6B56D] transition-all"
            />
          </div>

          {!isLogin && (
            <div>
              <Label>ایمیل</Label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-4 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 focus:border-[#D6B56D] transition-all"
              />
            </div>
          )}

          <div>
            <Label>{t("password")}</Label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور"
              className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-4 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 focus:border-[#D6B56D] transition-all"
            />
          </div>

          {!isLogin && (
            <div>
              <Label>تأیید رمز عبور</Label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="تأیید رمز"
                className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-4 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 focus:border-[#D6B56D] transition-all"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full btn-primary py-3">
            {loading ? "..." : (isUpgrade ? "ثبت‌نام و انتقال داده‌ها" : isLogin ? t("login") : t("register"))}
          </Button>
        </form>

        {isLogin && !isUpgrade && (
          <button onClick={() => setIsForgotPassword(true)} className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors mt-4">
            رمز عبور را فراموش کرده‌اید؟
          </button>
        )}

        {!isUpgrade && (
          <div className="mt-6 pt-4 border-t border-[var(--border-gold)]/20 space-y-3">
            <button onClick={toggleMode} className="w-full py-2 text-sm text-[#D6B56D] hover:underline">
              {isLogin ? t("register") : t("login")}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--border-gold)]/20" />
              <span className="text-xs text-[var(--text-muted)]">یا</span>
              <div className="flex-1 h-px bg-[var(--border-gold)]/20" />
            </div>

            <button onClick={handleGuest} disabled={loading} className="w-full py-3 rounded-xl border border-dashed border-[var(--border-gold)]/40 text-[var(--text-muted)] hover:text-[#D6B56D] hover:border-[#D6B56D]/60 transition-all text-sm">
              {t("guest")}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
