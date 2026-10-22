import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { updateUserBirthData } from "../auth/authService";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { motion } from "framer-motion";
import { MapPin, Search } from "lucide-react";
import { CITIES, type City } from "../../lib/cities";
import { PersianDateInput, PersianTimeInput } from "../../components/ui/PersianDate";

const BIRTHDATA_STORAGE_KEY = "luma_birthData_backup";

function saveBirthDataToStorage(birthData: object) {
  try {
    localStorage.setItem(BIRTHDATA_STORAGE_KEY, JSON.stringify(birthData));
  } catch { /* ignore */ }
}

function loadBirthDataFromStorage() {
  try {
    const raw = localStorage.getItem(BIRTHDATA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function ProfileSetupScreen() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const language = useAppStore((s) => s.language);
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
    let birthData = currentUser?.birthData;

    // اگر در store نبود، از localStorage backup بخوان
    if (!birthData) {
      const backup = loadBirthDataFromStorage();
      if (backup) birthData = backup;
    }

    if (birthData) {
      setBirthDate({
        year: birthData.year || 1370,
        month: birthData.month || 1,
        day: birthData.day || 1,
      });
      setMotherName(birthData.motherName || "");

      if (birthData.birthTime) {
        const parts = birthData.birthTime.split(" ");
        if (parts[0]) {
          const [h, m] = parts[0].split(":");
          setBirthTime({ hour: Number(h) || 12, minute: Number(m) || 0 });
        }
      }

      if (birthData.birthPlace) {
        const foundCity = CITIES.find(c => c.name === birthData.birthPlace);
        if (foundCity) setSelectedCity(foundCity);
      }
    }
    if (currentUser?.username) setDisplayName(currentUser.username);
  }, [currentUser]);

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

    const isEditing = !!currentUser.birthData;

    // 1. فوراً در store و backup ذخیره کن (برای پاسخگویی سریع UI)
    useAuthStore.getState().setCurrentUser({ ...currentUser, birthData: newBirthData });
    saveBirthDataToStorage(newBirthData);
    useAppStore.getState().setCurrentRoute(isEditing ? "profile" : "home");

    try {
      if (typeof currentUser.id === "string") {
        // Save profile display name to Supabase
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({ id: currentUser.id, display_name: displayName.trim(), username: currentUser.username });
        if (profileError) {
          console.error("Profile sync err:", profileError);
        }

        // Save birth data to Supabase
        await updateUserBirthData(currentUser.id, newBirthData);
      } else {
        // Guest user: save to Dexie only
        await updateUserBirthData(currentUser.id, newBirthData);
      }
    } catch (err: any) {
      console.error("Sync error:", err);
      setError(isFa ? "خطا د ذخیره اطلاعات. لطفاً دوباره تلاش کنید." : "Error saving data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-main)] px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[var(--text-main)] mb-6">
          {isFa ? "تکمیل پروفایل" : "Complete Profile"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>نام نمایشی</Label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="مثلاً: آریان کاملایی"
              className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-4 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 focus:border-[#D6B56D] transition-all"
            />
          </div>

          <div>
            <Label>تاریخ تولد (شمسی)</Label>
            <PersianDateInput value={birthDate} onChange={setBirthDate} />
          </div>

          <div>
            <Label>ساعت تولد</Label>
            <PersianTimeInput value={birthTime} onChange={setBirthTime} />
          </div>

          <div className="relative">
            <Label>شهر تولد</Label>
            <button
              type="button"
              onClick={() => setShowCityList(!showCityList)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-gold)] rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center"
            >
              <span className="text-[var(--text-main)]">
                {selectedCity.name} ({selectedCity.province ? `${selectedCity.province} - ` : ""}{selectedCity.country})
              </span>
              <MapPin size={18} className="text-[var(--text-muted)]" />
            </button>

            {showCityList && (
              <div className="absolute z-20 w-full mt-2 bg-[#0F1120] border border-[var(--border-gold)] rounded-xl shadow-xl max-h-60 overflow-y-auto">
                <div className="sticky top-0 bg-[#0F1120] p-2 border-b border-slate-700">
                  <div className="flex items-center bg-[#0B0D1A] rounded-lg px-3">
                    <Search size={16} className="text-slate-400" />
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      placeholder="جستجوی شهر..."
                      className="w-full bg-transparent border-none px-2 py-2 text-sm text-white focus:outline-none"
                      autoFocus
                    />
                  </div>
                </div>
                {filteredCities.map((city) => (
                  <div
                    key={`${city.name}-${city.country}`}
                    onClick={() => { setSelectedCity(city); setShowCityList(false); setCitySearch(""); }}
                    className="px-4 py-3 hover:bg-[rgba(214,181,109,0.1)] cursor-pointer border-b border-slate-700/50 last:border-0 flex justify-between items-center"
                  >
                    <span className="text-white">{city.name}</span>
                    <span className="text-xs text-slate-400">
                      {city.province ? `${city.province} - ` : ""}{city.country}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>نام مادر</Label>
            <input
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="نام مادر"
              className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#17182B]/80 border border-slate-300 dark:border-[#D6B56D]/40 px-4 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/50 focus:border-[#D6B56D] transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full btn-primary py-3">
            {loading ? "در حال ذخیره..." : "ذخیره و ورود به برنامه"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
