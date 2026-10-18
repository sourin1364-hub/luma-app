import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/useAuthStore";
import { getOrCreateDailyCard } from "../../lib/dailyCard";
import { getDailyInterpretation } from "../../lib/tarotMeanings";
import { useGamification } from "../gamification/useGamification";
import { Sparkles } from "lucide-react";

const images = import.meta.glob('../../assets/cards/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;

export function DailyCard() {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const currentUser = useAuthStore((s) => s.currentUser);
  const { addXp } = useGamification();

  const [card, setCard] = useState<any>(null); 
  const [isFlipped, setIsFlipped] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  
  const xpAwardedRef = useRef(false);

  useEffect(() => {
    if (!currentUser?.id) {
      setError("کاربر شناسایی نشد");
      return;
    }
    let alive = true;
    (async () => {
      try {
        const result = await getOrCreateDailyCard(currentUser.id!);
        if (alive) {
          setCard(result.card);
          setIsNew(result.isNew);
          // اگر امروز قبلاً کارت رو دیده باشه، مستقیم رو شده نشون بده
          if (!result.isNew) {
            setIsFlipped(true);
            xpAwardedRef.current = true;
          }
        }
      } catch (e: any) {
        if (alive) setError(e.message || "خطای نامشخص");
      }
    })();
    return () => { alive = false; };
  }, [currentUser?.id]);

  const handleReveal = () => {
    if (isFlipped || !card) return;
    setIsFlipped(true);

    if (isNew && !xpAwardedRef.current) {
      xpAwardedRef.current = true;
      setShowXp(true);
      void addXp(5);
      setTimeout(() => setShowXp(false), 3000);
    }
  };

  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;
  if (!card) return (
    <div className="flex flex-col items-center justify-center py-10 text-[rgb(var(--glow-color-rgb))]">
      <Sparkles className="w-8 h-8 animate-pulse mb-2" />
      <p className="text-sm font-bold animate-pulse">در حال آماده‌سازی کارت...</p>
    </div>
  );

  const backImage = images['../../assets/cards/back.jpg'];
  const frontImage = images[`../../assets/cards/${card.fileName}`];

  if (!frontImage) return <div className="text-center text-red-500 py-4">تصویر کارت پیدا نشد.</div>;

  const cardBorderStyle = {
    borderColor: "rgba(var(--glow-color-rgb), 1)",
    boxShadow: "0 0 20px rgba(var(--glow-color-rgb), 0.5)"
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center" dir={isFa ? "rtl" : "ltr"}>
      <div className="flex items-center gap-2 mb-4 text-[rgb(var(--glow-color-rgb))] font-bold font-display">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <span>{isFa ? "کارت روزانه شما" : "Your Daily Card"}</span>
        {isNew && !isFlipped && (
          <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
            {isFa ? "+ XP" : "+5 XP"}
          </span>
        )}
      </div>

      <div 
        className="relative w-52 h-[340px] cursor-pointer group transition-transform duration-500" 
        style={{ perspective: "1000px" }}
        onClick={handleReveal}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d" }}
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
        >
          <div 
            className="absolute inset-0 rounded-xl border-[3px] transition-all duration-300 overflow-hidden"
            style={{ ...cardBorderStyle, backfaceVisibility: "hidden", zIndex: 2 }}
          >
            {backImage && <img src={backImage} alt="Back" className="w-full h-full object-cover" />}
            {!isFlipped && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-white/90 text-[rgb(var(--glow-color-rgb))] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {isFa ? "برای رو شدن کلیک کنید" : "Tap to reveal"}
                </span>
              </div>
            )}
          </div>

          <div 
            className="absolute inset-0 rounded-xl border-[3px] transition-all duration-300 overflow-hidden"
            style={{ ...cardBorderStyle, backfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: 1 }}
          >
            <img src={frontImage} alt={card.name} className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {showXp && (
          <motion.div initial={{ opacity: 0, y: 0, scale: 0.5 }} animate={{ opacity: 1, y: -60, scale: 1.2 }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-extrabold text-amber-500 drop-shadow-[0_2px_10px_rgba(212,175,55,0.8)] pointer-events-none z-50 whitespace-nowrap">
            {isFa ? "+ XP" : "+5 XP"}
          </motion.div>
        )}
      </div>

      {isFlipped && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 w-full text-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-5 border border-white/80 dark:border-slate-700 shadow-lg">
          <p className="font-bold text-[rgb(var(--glow-color-rgb))] text-xl mb-1">{isFa ? card.nameFa : card.name}</p>
          {isFa && <p className="text-xs text-[rgba(var(--glow-color-rgb),0.8)] font-medium tracking-wide mb-3">{card.name}</p>}
          
          <div className="bg-[rgba(var(--glow-color-rgb),0.05)] rounded-xl p-4 border border-[rgba(var(--glow-color-rgb),0.2)] text-right">
            <p className="text-xs font-bold text-[rgb(var(--glow-color-rgb))] mb-2 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              پیام و تفسیر امروز لوما:
            </p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium text-justify">
              {getDailyInterpretation(card)}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}