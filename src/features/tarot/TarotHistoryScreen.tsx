import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { getReadingsOfflineFirst } from "../../lib/sync";
import { tarotCards } from "../../lib/tarotData";
import { motion, AnimatePresence } from "framer-motion";
import { History, Calendar, X, Sparkles } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import * as jalaali from "jalaali-js";

const images = import.meta.glob('../../assets/cards/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;

const SPREAD_TITLES: Record<string, string> = {
  "single": "تک کارتی",
  "past_present_future": "گذشته، حال، آینده",
  "love": "فال عشق",
  "choice": "فال انتخاب",
};

const POSITIONS_MAP: Record<string, string[]> = {
  "single": ["پیام اصلی"],
  "past_present_future": ["گذشته", "حال", "آینده"],
  "love": ["تو", "شریک", "رابطه"],
  "choice": ["وضعیت فعلی", "مسیر اول", "نتیجه اول", "مسیر دوم", "نتیجه دوم"],
};

export function TarotHistoryScreen() {
  const setCurrentRoute = useAppStore((state) => state.setCurrentRoute);
  const currentUser = useAuthStore((state) => state.currentUser);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReading, setSelectedReading] = useState<any | null>(null);

  useEffect(() => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const mapped = await getReadingsOfflineFirst(currentUser.id!.toString());
        setHistory(mapped);
      } catch (e) {
        console.error("Error loading history:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser?.id]);

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      const j = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
      const h = date.getHours().toString().padStart(2, "0");
      const m = date.getMinutes().toString().padStart(2, "0");
      return `${j.jy}/${j.jm}/${j.jd} - ${h}:${m}`;
    } catch (e) {
      return "تاریخ نامشخص";
    }
  };

  const getCardData = (id: number) => tarotCards.find((c) => c.id === id);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 relative overflow-x-hidden text-slate-200 bg-[#0B0D1A]" dir="rtl">
      <PageHeader title="تاریخچه فال‌ها" icon={<History className="w-5 h-5 text-amber-500" />} onBack={() => setCurrentRoute("tarot_menu")} />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-[rgb(var(--glow-color-rgb))] animate-pulse">در حال بارگذاری...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
          <History className="w-16 h-16 opacity-30" />
          <p className="text-lg">هنوز هیچ فالی نگرفته‌اید.</p>
          <button onClick={() => setCurrentRoute("reading")} className="mt-4 px-6 py-2 rounded-full bg-[rgb(var(--glow-color-rgb))] text-[#0B0D1A] font-bold">شروع اولین فال</button>
        </div>
      ) : (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10 pb-20">
          {history.map((reading) => (
            <div
              key={reading.id}
              onClick={() => setSelectedReading(reading)}
              className="bg-[#17182B] border border-white/10 rounded-3xl p-4 sm:p-6 cursor-pointer hover:border-[rgba(var(--glow-color-rgb),0.5)] transition-all shadow-lg flex flex-col gap-4 hover:-translate-y-1"
            >
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <span className="font-bold text-[rgb(var(--glow-color-rgb))] text-lg">
                  {SPREAD_TITLES[reading.type] || reading.type}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(reading.createdAt)}
                </span>
              </div>

              <div className="flex gap-2 justify-center mt-2">
                {reading.cards.map((cardId: number, idx: number) => {
                  const card = getCardData(cardId);
                  if (!card) return null;
                  return (
                    <div key={idx} className="w-12 h-20 sm:w-16 sm:h-24 rounded-lg overflow-hidden border border-[rgba(var(--glow-color-rgb),0.3)] shadow-sm">
                      <img src={images[`../../assets/cards/${card.fileName}`]} alt={card.name} className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-xs text-[rgb(var(--glow-color-rgb))] mt-2">برای مشاهده جزئیات و تفسیر کلیک کنید</p>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedReading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedReading(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#17182B] rounded-3xl w-full max-w-[95vw] sm:max-w-2xl shadow-2xl border border-[rgba(var(--glow-color-rgb),0.3)] relative p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedReading(null)}
                className="absolute top-4 left-4 z-10 bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl sm:text-2xl font-bold text-[rgb(var(--glow-color-rgb))] text-center mb-2">
                {SPREAD_TITLES[selectedReading.type] || selectedReading.type}
              </h2>
              <p className="text-center text-xs sm:text-sm text-slate-400 mb-6">{formatDate(selectedReading.createdAt)}</p>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
                {selectedReading.cards.map((cardId: number, idx: number) => {
                  const card = getCardData(cardId);
                  if (!card) return null;
                  const positions = POSITIONS_MAP[selectedReading.type] || [];
                  return (
                    <div key={idx} className="flex flex-col items-center w-20 sm:w-28 md:w-32">
                      <span className="text-[10px] sm:text-xs font-bold text-[rgb(var(--glow-color-rgb))] mb-1 sm:mb-2">{positions[idx] || `کارت ${idx + 1}`}</span>
                      <div className="w-full aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden border-2 shadow-lg" style={{ borderColor: "rgba(var(--glow-color-rgb), 0.5)" }}>
                        <img src={images[`../../assets/cards/${card.fileName}`]} alt={card.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-center mt-1 sm:mt-2 text-slate-200">{card.nameFa}</span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[rgba(var(--glow-color-rgb),0.05)] rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-[rgba(var(--glow-color-rgb),0.2)]">
                <h3 className="text-sm sm:text-lg font-bold text-[rgb(var(--glow-color-rgb))] mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  تفسیر و توصیه لوما:
                </h3>
                <div className="text-xs sm:text-sm md:text-base leading-relaxed text-slate-300 font-medium text-justify whitespace-pre-wrap">
                  {selectedReading.interpretation && selectedReading.interpretation.trim() !== ""
                    ? selectedReading.interpretation
                    : "تفسیر این فال در نسخه‌های قبلی برنامه ثبت نشده است. (فال‌های جدید دارای تفسیر کامل هستند)"}
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}