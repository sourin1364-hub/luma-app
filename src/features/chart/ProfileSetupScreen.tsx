import { useState } from "react";
import * as jalaali from "jalaali-js";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { db } from "../../db";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { motion } from "framer-motion";

export function ProfileSetupScreen() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const setCurrentRoute = useAppStore((s) => s.setCurrentRoute);

  const [year, setYear] = useState(currentUser?.birthData?.year?.toString() || "");
  const [month, setMonth] = useState(currentUser?.birthData?.month?.toString() || "");
  const [day, setDay] = useState(currentUser?.birthData?.day?.toString() || "");
  const [motherName, setMotherName] = useState(currentUser?.birthData?.motherName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let y = parseInt(year, 10);
    let m = parseInt(month, 10);
    let d = parseInt(day, 10);

    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      setError("لطفاً تاریخ را کامل و با اعداد وارد کنید");
      return;
    }

    if (m < 1 || m > 12 || d < 1 || d > 31) {
      setError("ماه یا روز نامعتبر است");
      return;
    }

    try {
      let finalY = y, finalM = m, finalD = d;

      // تبدیل تاریخ شمسی به میلادی برای ذخیره در دیتابیس
      if (y > 1200 && y < 1500) {
        const g = jalaali.toGregorian(y, m, d);
        finalY = g.gy;
        finalM = g.gm;
        finalD = g.gd;
      } else if (y < 1900 || y > 2100) {
        setError("لطفاً یک سال شمسی معتبر وارد کنید (مثلاً )");
        return;
      }

      if (!currentUser?.id) {
        setError("کاربر یافت نشد");
        return;
      }

      setLoading(true);
      const newBirthData = { year: finalY, month: finalM, day: finalD, motherName };

      await db.users.update(currentUser.id, { birthData: newBirthData });
      const updatedUser = await db.users.get(currentUser.id);
      if (updatedUser) setCurrentUser(updatedUser);
      setCurrentRoute("home");
      
    } catch (err) {
      console.error(err);
      setError("خطا در ذخیره اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-slate-800" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glow-card rounded-[2rem] w-full shadow-xl">
          <div className="glow-card-inner rounded-[2rem] p-8">
            <h1 className="text-2xl font-bold text-center text-blue-900 mb-6 font-display">
              اطلاعات تولد شما
            </h1>
            <p className="text-center text-sm text-slate-500 mb-6">
              برای محاسبه دقیق چارت، لطفاً تاریخ تولد خود را وارد کنید.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="year">سال</Label>
                  <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="month">ماه</Label>
                  <Input id="month" type="number" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="day">روز</Label>
                  <Input id="day" type="number" value={day} onChange={(e) => setDay(e.target.value)} placeholder="" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="motherName">نام مادر (برای ابجد)</Label>
                <Input id="motherName" value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder="نام مادر" />
              </div>

              {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl mt-4">
                {loading ? "..." : "ذخیره و ادامه"}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}