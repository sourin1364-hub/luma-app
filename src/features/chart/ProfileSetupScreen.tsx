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
    return CITIES.filter(c => c.name.toLowerCase().includes(query) || (c.province && c.province.toLowerCase().includes(query)) || c.country.toLowerCase().includes(query));
  }, [citySearch]);

  useEffect(() => {
    if (currentUser?.birthData) {
      setBirthDate({ 
        year: currentUser.birthData.year || 1370, 
        month: currentUser.birthData.month || 1, 
        day: currentUser.birthData.day || 1 
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
      birthTime: `${String(birthTime.hour).padStart(2, '0')}:${String(birthTime.minute).padStart(2, '0')}`,
      birthPlace: selectedCity.name,
    };

    const isEditing = !!currentUser.birthData;

    useAuthStore.getState().setCurrentUser({ ...currentUser, birthData: newBirthData });
    useAppStore.getState().setCurrentRoute(isEditing ? "profile" : "home");

    try {
      if (typeof currentUser.id === 'string') {
        supabase.from('profiles').upsert({ id: currentUser.id, display_name: displayName.trim(), username: currentUser.username })
          .then(({error}) => { if(error) console.error("Profile sync err:", error); });
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[var(--bg-main)]" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glow-card p-6 shadow-2xl">
          <div className="glow-card-inner">
            <h2 className="text-2xl font-bold text-center text-[rgb(var(--glow-color-rgb))] mb-6">
              {isFa ? "تکمیل پروفایل" : "Complete Profile"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[var(--text-main)] text-xs">نام نمایشی</Label>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="مثلاً: آریان کاملایی" className="lux-input-field" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[var(--text-main)] text-xs">تاریخ تولد (شمسی)</Label>
                <PersianDateInput value={birthDate} onChange={setBirthDate} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[var(--text-main)] text-xs">ساعت تولد</Label>
                <PersianTimeInput value={birthTime} onChange={setBirthTime} />
              </div>

              <div className="relative z-20">
                <Label className="text-[var(--text-main)] text-xs flex items-center gap-1 mb-1"><MapPin className="w-3 h-3" /> شهر تولد</Label>
                <div onClick={() => setShowCityList(!showCityList)} className="w-full bg-[var(--bg-card)] border border-[var(--border-gold)] rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center">
                  <span className="font-bold text-[rgb(var(--glow-color-rgb))]">
                    {selectedCity.name} <span className="text-xs text-slate-500 font-normal">({selectedCity.province ? `${selectedCity.province} - ` : ''}{selectedCity.country})</span>
                  </span>
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
                {showCityList && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-[#17182B] border border-[var(--border-gold)] rounded-xl shadow-2xl z-50 max-h-64 flex flex-col">
                    <div className="p-2 border-b border-[var(--border-gold)]">
                      <input type="text" placeholder="جستجوی شهر..." value={citySearch} onChange={(e) => setCitySearch(e.target.value)} className="w-full bg-[#0B0D1A] border-none rounded-lg px-4 py-2 text-sm text-white focus:outline-none" autoFocus />
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {filteredCities.map((city, idx) => (
                        <div key={idx} onClick={() => { setSelectedCity(city); setShowCityList(false); setCitySearch(""); }} className="px-4 py-3 hover:bg-[rgba(214,181,109,0.1)] cursor-pointer border-b border-slate-700/50 last:border-0 flex justify-between items-center">
                          <span className="font-bold text-sm text-slate-200">{city.name}</span>
                          <span className="text-xs text-slate-500">{city.province ? `${city.province} - ` : ''}{city.country}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[var(--text-main)] text-xs">نام مادر</Label>
                <input value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder="نام مادر" className="lux-input-field" />
              </div>

              {error && <p className="text-red-400 text-xs text-center bg-red-900/20 p-2 rounded-lg">{error}</p>}

              <Button type="submit" disabled={loading} className="btn-gold-wave w-full h-12 rounded-xl mt-4">
                {loading ? "در حال ذخیره..." : "ذخیره و ورود به برنامه"}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}