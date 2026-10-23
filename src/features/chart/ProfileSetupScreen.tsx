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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return CITIES;
    const query = citySearch.toLowerCase();
    return CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        (c.province && c.province.toLowerCase().includes(query)) ||
        c.country.toLowerCase().includes(query)
    );
  }, [citySearch]);

  // Load existing birthData from currentUser if available
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
          setBirthTime({ hour: Number(h) || 12, minute: Number(m) || 0 };
        }
      }

      if (currentUser.birthData.birthPlace) {
        const foundCity = CITIES.find((c) => c.name === currentUser.birthData?.birthPlace);
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

    setSaving(true);

    const newBirthData = {
      year: birthDate.year,
      month: birthDate.month,
      day: birthDate.day,
      motherName: motherName.trim(),
      birthTime: `${String(birthTime.hour).padStart(2, "0")}:${String(birthTime.minute).padStart(2, "0")}`,
      birthPlace: selectedCity.name,
    };

    try {
      // 1. Save to local store IMMEDIATELY so Zustand persist writes to localStorage
      setCurrentUser({ ...currentUser, birthData: newBirthData });

      // 2. Save display name to profiles
      if (typeof currentUser.id === "string") {
        const { error: profileErr } = await supabase
          .from("profiles")
          .upsert({
            id: currentUser.id,
            display_name: displayName.trim(),
            username: currentUser.username,
          });
        if (profileErr) console.error("Profile sync err:", profileErr);

        // 3. Save birth data to Supabase
        await updateUserBirthData(currentUser.id, newBirthData);
      } else {
        // Guest / Dexie user
        await updateUserBirthData(currentUser.id, newBirthData);
      }

      // 4. Navigate after successful save
      const isEditing = !!currentUser.birthData;
      setCurrentRoute(isEditing ? "profile" : "home");
    } catch (err: any) {
      console.error("Save error:", err);
      setError(isFa ? "خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید." : "Error saving data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-main)] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2 text-center">
          {isFa ? "تکمیل پروفایل" : "Complete Profile"}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-6 text-center">
          {isFa
            ? "اطلاعات تولد خود را وارد کنید تا چارت شما محاسبه شود."
            : "Enter your birth details to calculate your chart."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                {selectedCity.name} ({selectedCity.province ? `${selectedCity.province} - ` : ""}
                {selectedCity.country})
              </span>
              <MapPin className="w-4 h-4 text-[#D6B56D]" />
            </button>

            {showCityList && (
              <div className="absolute z-50 w-full mt-2 bg-[#0B0D1A] border border-[var(--border-gold)] rounded-xl max-h-60 overflow-y-auto shadow-xl">
                <div className="sticky top-0 bg-[#0B0D1A] p-2 border-b border-slate-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      placeholder="جستجوی شهر..."
                      className="w-full bg-[#17182B] border-none rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none"
                      autoFocus
                    />
                  </div>
                </div>
                {filteredCities.map((city) => (
                  <div
                    key={city.name + city.country}
                    onClick={() => {
                      setSelectedCity(city);
                      setShowCityList(false);
                      setCitySearch("");
                    }}
                    className="px-4 py-3 hover:bg-[rgba(214,181,109,0.1)] cursor-pointer border-b border-slate-700/50 last:border-0 flex justify-between items-center"
                  >
                    <span className="text-[var(--text-main)]">{city.name}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {city.province ? `${city.province} - ` : ""}
                      {city.country}
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

          <Button type="submit" disabled={saving} className="w-full btn-primary py-3">
            {saving ? "در حال ذخیره..." : "ذخیره و ورود به برنامه"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
