import { useState } from "react";
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
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!displayName.trim() || !year || !month || !day || !motherName.trim()) {
      setError(isFa ? "لطفاً همه فیلدها را پر کنید" : "Please fill all fields");
      return;
    }

    if (!currentUser || currentUser.id === undefined) {
      setError(isFa ? "خطای شناسایی کاربر" : "User identification error");
      return;
    }

    setLoading(true);
    console.log("Saving profile and birth data...");

    try {
      // فقط اگر کاربر آنلاین (آیدی رشته‌ای/UUID) باشد در Supabase ذخیره می‌کنیم
      if (typeof currentUser.id === 'string') {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: currentUser.id, 
            display_name: displayName.trim(),
            username: currentUser.username
          });

        if (profileError) throw new Error(`Profiles: ${profileError.message}`);
      }

      const newBirthData = {
        year: Number(year),
        month: Number(month),
        day: Number(day),
        motherName: motherName.trim(),
      };

      // این تابع در authService.ts خودش می‌داند برای مهمان در Dexie و برای کاربر ابری در Supabase ذخیره کند
      await updateUserBirthData(currentUser.id, newBirthData);

      useAuthStore.getState().setCurrentUser({
        ...currentUser,
        birthData: newBirthData
      });

      console.log("Successfully updated store. React should now render HomeScreen.");

    } catch (err: any) {
      console.error(err);
      setError(isFa ? `خطا: ${err.message}` : `Error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-slate-800 bg-[#0B0D1A]" dir={isFa ? "rtl" : "ltr"}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-[#17182B] border border-[#8B5CF6]/30 rounded-[2rem] p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center text-[#D6B56D] mb-2">
            {isFa ? "تکمیل پروفایل" : "Complete Profile"}
          </h2>
          <p className="text-center text-slate-400 text-sm mb-6">
            {isFa ? "برای شخصی‌سازی چارت نجومی، لطفاً اطلاعات خود را وارد کنید" : "Enter your details to personalize your birth chart"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300">{isFa ? "نام و نام خانوادگی (نمایشی)" : "Display Name"}</Label>
              <Input 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                placeholder={isFa ? "مثلاً: آریان کاملایی" : "e.g., John Doe"} 
                className="bg-[#0B0D1A] border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <Label className="text-slate-300">{isFa ? "سال" : "Year"}</Label>
                <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="1370" className="bg-[#0B0D1A] border-slate-700 text-white text-center" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">{isFa ? "ماه" : "Month"}</Label>
                <Input type="number" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="1" className="bg-[#0B0D1A] border-slate-700 text-white text-center" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">{isFa ? "روز" : "Day"}</Label>
                <Input type="number" value={day} onChange={(e) => setDay(e.target.value)} placeholder="1" className="bg-[#0B0D1A] border-slate-700 text-white text-center" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">{isFa ? "نام مادر" : "Mother's Name"}</Label>
              <Input 
                value={motherName} 
                onChange={(e) => setMotherName(e.target.value)} 
                placeholder={isFa ? "برای محاسبات عددی و تاروت" : "For numerology and tarot"} 
                className="bg-[#0B0D1A] border-slate-700 text-white"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-medium text-center bg-red-900/20 p-2 rounded-lg leading-relaxed">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white h-12 rounded-xl mt-6">
              {loading ? "در حال ذخیره..." : (isFa ? "ذخیره و ورود به برنامه" : "Save & Enter App")}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}