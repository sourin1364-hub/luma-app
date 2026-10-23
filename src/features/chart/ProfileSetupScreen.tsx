import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { updateUserBirthData } from "../auth/authService";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { motion } from "framer-motion";
import { MapPin, Search, X } from "lucide-react";
import { CITIES, type City } from "../../lib/cities";
import { PersianDateInput, PersianTimeInput } from "../../components/ui/PersianDate";

export function ProfileSetupScreen() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const language = useAppStore((s) => s.language);
  const setCurrentRoute = useAppStore((s) => s.setCurrentRoute);
  const isFa = language === "fa";

  const [displayName, setDisplayName] = useState("");
  const [birthDate, setBirthDate] = useState({ year: 1370, month: 1, day: 1 });
  const [birthTime, setBirthTime] = useState({ hour: 12, minute: 0 });
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [citySearch, setCitySearch] = useState("");
  const [showCityList, setShowCityList] = useState(false);
  const [motherName, setMotherName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!currentUser?.birthData && typeof currentUser.birthData.year === "number" && currentUser.birthData.year > 1200;

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return CITIES;
    const query = citySearch.toLowerCase();
    return CITIES.filter(c =>
      c.name.toLowerCase().includes(query) ||
      (c.province && c.province.toLowerCase().includes(query)) ||
      c.country.toLowerCase().includes(query)
    );
  }, [citySearch]);

  useEffect(() => {
    if (currentUser?.birthData) {
      setBirthDate({
        year: currentUser.birthData.year || 1370,
        month: currentUser.birthData.month || 1,
        day: currentUser.birthData.day || 1,
      });
      setMotherName(currentUser.birthData.motherName || "");

      if (currentUser.birthData.birthTime) {
        const parts = currentUser.birthData.birthTime.split(" ");
        if (parts[0]) {
          const [h, m] = parts[0].split(":");
          setBirthTime({ hour: Number(h) || 12, minute: Number(m) || 0 });
        }
      }

      if (currentUser.birthData.birthPlace) {
        const foundCity = CITIES.find(c => c.name === currentUser.birthData?.birthPlace);
        if (foundCity) setSelectedCity(foundCity);
      }
    }
    if (currentUser?.username) setDisplayName(currentUser.username);
  }, [currentUser]);

  const handleCancel = () => {
    if (isEditing) {
      setCurrentRoute("profile");
    } else {
      setCurrentRoute("home");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!displayName.trim() || !motherName.trim()) {
      setError(isFa ? "لطفاً همه فیلدها را پر کنید" : "Please fill all fields");
      return;
    }

    if (!currentUser || currentUser.id === undefined) {
      setError(isFa ? "خطای شناسایی کاربر" : "User identification error");
      return;
    }

    setLoading(true);

    const newBirthData = {
      year: birthDate.year,
      month: birthDate.month,
      day: birthDate.day,
      motherName: motherName.trim(),
      birthTime: `${String(birthTime.hour).padStart(2, "0")}:${String(birthTime.minute).padStart(2, "0")}`,
      birthPlace: selectedCity.name,
    };

    // 1. Save to Zustand state immediately (triggers persist)
    const updatedUser = { ...currentUser, birthData: newBirthData };
    setCurrentUser(updatedUser);

    // 2. Also save directly to localStorage as extra backup
    try {
      localStorage.setItem("luma_birth_backup", JSON.stringify(newBirthData));
    } catch {}

    // 3. Navigate immediately so user isn't stuck
    setCurrentRoute(isEditing ? "profile" : "home");

    // 4. Sync to server in background
    try {
      await updateUserBirthData(currentUser.id, newBirthData);
    } catch (err: any) {
      console.error("Birth sync error:", err);
      // Don't show error to user - data is saved locally
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B0D1A] text-slate-800 dark:text-white p-6 flex flex-col items-center" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#D6B56D] mb-6 text-center">
          {isEditing ? (isFa ? "ویرایش اطلاعات تولد" : "Edit Birth Info") : (isFa ? "تکمیل پروفایل" : "Complete Profile")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-[#D6B56D] mb-1 block">نام نمایشی</Label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="مثلاً: آریان کاملایی"
              className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-4 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 focus:border-[#D6B56D] transition-all"
            />
          </div>

          <div>
            <Label className="text-[#D6B56D] mb-1 block">تاریخ تولد (شمسی)</Label>
            <PersianDateInput value={birthDate} onChange={setBirthDate} />
          </div>

          <div>
            <Label className="text-[#D6B56D] mb-1 block">ساعت تولد</Label>
            <PersianTimeInput value={birthTime} onChange={setBirthTime} />
          </div>

          <div>
            <Label className="text-[#D6B56D] mb-1 block">شهر تولد</Label>
            <div
              onClick={() => setShowCityList(!showCityList)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-gold)] rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center"
            >
              <span>{selectedCity.name} ({selectedCity.province ? `${selectedCity.province} - ` : ""}{selectedCity.country})</span>
              <MapPin className="w-4 h-4 text-[#D6B56D]" />
            </div>

            {showCityList && (
              <div className="mt-2 bg-[#17182B] border border-[#D6B56D]/30 rounded-xl max-h-60 overflow-y-auto">
                <div className="p-2 sticky top-0 bg-[#17182B] border-b border-[#D6B56D]/20">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#D6B56D]" />
                    <input
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="w-full bg-transparent border-none text-sm text-white focus:outline-none"
                      placeholder="جستجوی شهر..."
                      autoFocus
                    />
                    {citySearch && (
                      <button type="button" onClick={() => setCitySearch("")}>
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                  </div>
                </div>
                {filteredCities.map((city) => (
                  <div
                    key={city.name}
                    onClick={() => { setSelectedCity(city); setShowCityList(false); setCitySearch(""); }}
                    className="px-4 py-3 hover:bg-[rgba(214,181,109,0.1)] cursor-pointer border-b border-slate-700/50 last:border-0 flex justify-between items-center"
                  >
                    <span>{city.name}</span>
                    <span className="text-xs text-slate-400">
                      {city.province ? `${city.province} - ` : ""}{city.country}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label className="text-[#D6B56D] mb-1 block">نام مادر</Label>
            <input
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="نام مادر"
              className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-4 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 focus:border-[#D6B56D] transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full h-14 bg-[#D6B56D] hover:bg-amber-400 text-[#0B0D1A] rounded-full font-bold text-lg shadow-lg shadow-[#D6B56D]/20">
            {loading ? "در حال ذخیره..." : (isEditing ? "ذخیره تغییرات" : "ذخیره و ورود به برنامه")}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="w-full h-12 rounded-full btn-outline"
          >
            انصراف
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
