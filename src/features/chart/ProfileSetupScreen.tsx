import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { updateUserBirthData } from "../auth/authService";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { motion } from "framer-motion";

export function ProfileSetupScreen() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const language = useAppStore((s) => s.language);
  const isFa = language === "fa";

  const [displayName, setDisplayName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [motherName, setMotherName] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser?.birthData) {
      setYear(String(currentUser.birthData.year || ""));
      setMonth(String(currentUser.birthData.month || ""));
      setDay(String(currentUser.birthData.day || ""));
      setMotherName(currentUser.birthData.motherName || "");
      setBirthTime(currentUser.birthData.birthTime || "");
      setBirthPlace(currentUser.birthData.birthPlace || "");
    }
    if (currentUser?.username) {
      setDisplayName(currentUser.username);
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!displayName.trim() || !year || !month || !day || !motherName.trim() || !birthTime.trim() || !birthPlace.trim()) {
      setError(isFa ? "لطفاً همه فیلدها را پر کنید" : "Please fill all fields");
      return;
    }

    if (!currentUser || currentUser.id === undefined) {
      setError(isFa ? "خطای شناسایی کاربر" : "User identification error");
      return;
    }

    setLoading(true);

    const newBirthData = {
      year: Number(year),
      month: Number(month),
      day: Number(day),
      motherName: motherName.trim(),
      birthTime: birthTime.trim(),
      birthPlace: birthPlace.trim(),
    };

    const isEditing = !!currentUser.birthData;

    // 1. آپدیت فوری استور محلی (تا صفحه فریز نشود)
    useAuthStore.getState().setCurrentUser({
      ...currentUser,
      birthData: newBirthData
    });

    // 2. تغییر فوری مسیر
    useAppStore.getState().setCurrentRoute(isEditing ? "profile" : "home");

    // 3. سینک با دیتابیس در پس‌زمینه
    try {
      if (typeof currentUser.id === 'string') {
        supabase.from('profiles').upsert({
          id: currentUser.id,
          display_name: displayName.trim(),
          username: currentUser.username
        }).then(({error}) => { if(error) console.error("Profile sync err:", error); });
        
        updateUserBirthData(currentUser.id, newBirthData).catch(e => console.error("Birth sync err:", e));
      } else {
        await updateUserBirthData(currentUser.id, newBirthData);
      }
    } catch (err: any) {
      console.error("Sync error in background:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-[var(--text-main)] dark:text-[var(--text-main)] bg-transparent" dir={isFa ? "rtl" : "ltr"}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glow-card rounded-[2rem] p-8 shadow-2xl">
          <div className="glow-card-inner">
            <h2 className="text-2xl font-bold text-center text-[rgb(var(--glow-color-rgb))] mb-2">
              {isFa ? "تکمیل پروفایل" : "Complete Profile"}
            </h2>
            <p className="text-center text-[var(--text-muted)] text-sm mb-6">
              {isFa ? "برای شخصی‌سازی چارت نجومی، لطفاً اطلاعات خود را وارد کنید" : "Enter your details to personalize your birth chart"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[var(--text-muted)]">{isFa ? "نام و نام خانوادگی (نمایشی)" : "Display Name"}</Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={isFa ? "مثلاً: آریان کاملایی" : "e.g., John Doe"}
                  className="bg-transparent border-[rgba(var(--glow-color-rgb),0.3)] focus:border-[rgba(var(--glow-color-rgb),0.8)] text-[var(--text-main)] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-[var(--text-muted)]">{isFa ? "سال" : "Year"}</Label>
                  <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="1370" className="bg-transparent border-[rgba(var(--glow-color-rgb),0.3)] text-center text-[var(--text-main)] dark:text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[var(--text-muted)]">{isFa ? "ماه" : "Month"}</Label>
                  <Input type="number" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="1" className="bg-transparent border-[rgba(var(--glow-color-rgb),0.3)] text-center text-[var(--text-main)] dark:text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[var(--text-muted)]">{isFa ? "روز" : "Day"}</Label>
                  <Input type="number" value={day} onChange={(e) => setDay(e.target.value)} placeholder="1" className="bg-transparent border-[rgba(var(--glow-color-rgb),0.3)] text-center text-[var(--text-main)] dark:text-white" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[var(--text-muted)]">{isFa ? "ساعت تولد" : "Time of Birth"}</Label>
                <Input
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  placeholder={isFa ? "مثلاً: 14:30" : "e.g., 14:30"}
                  className="bg-transparent border-[rgba(var(--glow-color-rgb),0.3)] text-[var(--text-main)] dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[var(--text-muted)]">{isFa ? "محل تولد" : "Place of Birth"}</Label>
                <Input
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder={isFa ? "مثلاً: تهران" : "e.g., Tehran"}
                  className="bg-transparent border-[rgba(var(--glow-color-rgb),0.3)] text-[var(--text-main)] dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[var(--text-muted)]">{isFa ? "نام مادر" : "Mother's Name"}</Label>
                <Input
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder={isFa ? "برای محاسبات عددی و تاروت" : "For numerology and tarot"}
                  className="bg-transparent border-[rgba(var(--glow-color-rgb),0.3)] text-[var(--text-main)] dark:text-white"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs font-medium text-center bg-red-900/20 p-2 rounded-lg leading-relaxed">{error}</p>
              )}

              <Button type="submit" disabled={loading} className="w-full animated-glow-border text-white h-12 rounded-xl mt-6">
                {loading ? "در حال ذخیره..." : (isFa ? "ذخیره و ورود به برنامه" : "Save & Enter App")}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}