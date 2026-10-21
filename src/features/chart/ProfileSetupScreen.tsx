import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { updateUserBirthData } from "../auth/authService";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { motion } from "framer-motion";
import { ChevronDown, MapPin, Clock } from "lucide-react";

const faToEn = (str: string) => str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
const enToFa = (str: string) => str.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

const PROVINCES = ["تهران", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی", "آذربایجان غربی", "خوزستان", "گیلان", "مازندران", "کرمان", "کرمانشاه", "هرمزگان", "یزد", "البرز", "قم", "قزوین", "مرکزی", "همدان", "لرستان", "گلستان", "کردستان", "سیستان و بلوچستان", "بوشهر", "اردبیل", "زنجان", "سمنان", "چهارمحال و بختیاری", "خراسان جنوبی", "خراسان شمالی", "ایلام", "کهگیلویه و بویراحمد"];

export function ProfileSetupScreen() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const language = useAppStore((s) => s.language);
  const isFa = language === "fa";

  const [displayName, setDisplayName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [motherName, setMotherName] = useState("");
  
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");
  
  const [birthProvince, setBirthProvince] = useState("تهران");
  const [birthCity, setBirthCity] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser?.birthData) {
      setYear(enToFa(String(currentUser.birthData.year || "")));
      setMonth(enToFa(String(currentUser.birthData.month || "")));
      setDay(enToFa(String(currentUser.birthData.day || "")));
      setMotherName(currentUser.birthData.motherName || "");
      
      if (currentUser.birthData.birthTime) {
        const parts = currentUser.birthData.birthTime.split(" ");
        if (parts[0]) {
          const [h, m] = parts[0].split(":");
          setHour(h);
          setMinute(m);
        }
        if (parts[1]) setAmpm(parts[1]);
      }
      
      if (currentUser.birthData.birthPlace) {
        // اگر قبلاً با کاما ذخیره شده بود، جدا می‌کنیم
        const placeParts = currentUser.birthData.birthPlace.split("، ");
        if (placeParts.length > 1) {
          setBirthProvince(placeParts[0]);
          setBirthCity(placeParts[1]);
        } else {
          setBirthProvince("تهران");
          setBirthCity(currentUser.birthData.birthPlace);
        }
      }
    }
    if (currentUser?.username) {
      setDisplayName(currentUser.username);
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!displayName.trim() || !year || !month || !day || !motherName.trim() || !birthCity.trim()) {
      setError(isFa ? "لطفاً همه فیلدها را پر کنید" : "Please fill all fields");
      return;
    }

    const enYear = Number(faToEn(year));
    const enMonth = Number(faToEn(month));
    const enDay = Number(faToEn(day));
    
    if (enMonth < 1 || enMonth > 12 || enDay < 1 || enDay > 31) {
      setError("تاریخ تولد وارد شده معتبر نیست.");
      return;
    }

    if (!currentUser || currentUser.id === undefined) {
      setError(isFa ? "خطای شناسایی کاربر" : "User identification error");
      return;
    }

    setLoading(true);

    const fullBirthPlace = `${birthProvince}، ${birthCity}`;

    const newBirthData = {
      year: enYear,
      month: enMonth,
      day: enDay,
      motherName: motherName.trim(),
      birthTime: `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${ampm}`,
      birthPlace: fullBirthPlace,
    };

    const isEditing = !!currentUser.birthData;

    useAuthStore.getState().setCurrentUser({
      ...currentUser,
      birthData: newBirthData
    });

    useAppStore.getState().setCurrentRoute(isEditing ? "profile" : "home");

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-transparent" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glow-card p-6 sm:p-8 shadow-2xl">
          <div className="glow-card-inner">
            <h2 className="text-2xl font-bold text-center text-[rgb(var(--glow-color-rgb))] mb-2">
              {isFa ? "تکمیل پروفایل" : "Complete Profile"}
            </h2>
            <p className="text-center text-[var(--text-muted)] text-xs mb-6">
              {isFa ? "برای شخصی‌سازی چارت نجومی، لطفاً اطلاعات خود را وارد کنید" : "Enter your details to personalize your birth chart"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[var(--text-main)] text-xs">نام نمایشی</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="مثلاً: آریان کاملایی" className="lux-input" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-[var(--text-main)] text-xs">سال</Label>
                  <Input value={year} onChange={(e) => setYear(enToFa(e.target.value))} placeholder="۱۳۷۰" className="lux-input text-center" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[var(--text-main)] text-xs">ماه</Label>
                  <Input value={month} onChange={(e) => setMonth(enToFa(e.target.value))} placeholder="۱" className="lux-input text-center" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[var(--text-main)] text-xs">روز</Label>
                  <Input value={day} onChange={(e) => setDay(enToFa(e.target.value))} placeholder="۱" className="lux-input text-center" />
                </div>
              </div>

              {/* ساعت تولد */}
              <div className="space-y-1.5">
                <Label className="text-[var(--text-main)] text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> ساعت تولد</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="relative">
                    <select value={hour} onChange={(e) => setHour(e.target.value)} className="lux-select" dir="ltr">
                      {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => <option key={h} value={h}>{enToFa(h)}</option>)}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D6B56D] pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select value={minute} onChange={(e) => setMinute(e.target.value)} className="lux-select" dir="ltr">
                      {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => <option key={m} value={m}>{enToFa(m)}</option>)}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D6B56D] pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select value={ampm} onChange={(e) => setAmpm(e.target.value)} className="lux-select" dir="ltr">
                      <option value="AM">AM (ق.ظ)</option>
                      <option value="PM">PM (ب.ظ)</option>
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D6B56D] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* محل تولد */}
              <div className="space-y-1.5">
                <Label className="text-[var(--text-main)] text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> محل تولد</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <select value={birthProvince} onChange={(e) => setBirthProvince(e.target.value)} className="lux-select">
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D6B56D] pointer-events-none" />
                  </div>
                  <Input value={birthCity} onChange={(e) => setBirthCity(e.target.value)} placeholder="نام شهر..." className="lux-input" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[var(--text-main)] text-xs">نام مادر</Label>
                <Input value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder="برای محاسبات عددی" className="lux-input" />
              </div>

              {error && <p className="text-red-400 text-xs text-center bg-red-900/20 p-2 rounded-lg">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full glow-btn-primary h-12 rounded-xl mt-4 font-bold text-[#0B0D1A]">
                {loading ? "در حال ذخیره..." : "ذخیره و ورود به برنامه"}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}