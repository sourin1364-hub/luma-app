import { useState, useEffect, useRef } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { tarotCards, type TarotCard } from "../../lib/tarotData";
import { getCardMeaning } from "../../lib/tarotMeanings";
import { db } from "../../db";
import { useGamification } from "../gamification/useGamification";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Heart, Split, Layers, HelpCircle } from "lucide-react";

const images = import.meta.glob('../../assets/cards/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;

type SpreadType = "single" | "past_present_future" | "love" | "choice";

const SPREADS = [
  { id: "single", title: "تک کارتی", desc: "پاسخ سریع به یک سوال", icon: HelpCircle, count: 1, positions: ["پیام اصلی"] },
  { id: "past_present_future", title: "گذشته، حال، آینده", desc: "روند کلی زندگی", icon: Layers, count: 3, positions: ["گذشته", "حال", "آینده"] },
  { id: "love", title: "فال عشق", desc: "تحلیل روابط عاطفی", icon: Heart, count: 3, positions: ["تو", "شریک", "رابطه"] },
  { id: "choice", title: "فال انتخاب", desc: "تصمیم‌گیری سخت", icon: Split, count: 5, positions: ["وضعیت فعلی", "مسیر اول", "نتیجه اول", "مسیر دوم", "نتیجه دوم"] },
];

const useSound = (src: string, volume: number = 0.5) => {
  const play = () => {
    if (!useAppStore.getState().soundEnabled) return;
    try {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch (e) {}
  };
  return play;
};

const MagicSparkles = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{ opacity: 0, scale: 1.5, x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,1)]"
        />
      ))}
    </div>
  );
};

const ShuffleAnimation = () => {
  const cards = [...Array(8)].map((_, i) => i);
  return (
    <div className="relative w-56 h-96 flex items-center justify-center">
      {cards.map((i) => (
        <motion.div
          key={i}
          className="absolute w-48 h-80 rounded-xl overflow-hidden border-[2px] shadow-2xl"
          style={{ borderColor: "rgba(var(--glow-color-rgb), 0.8)" }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
          animate={{
            x: [0, (Math.random() - 0.5) * 180, (Math.random() - 0.5) * 180, 0],
            y: [0, (Math.random() - 0.5) * 180, (Math.random() - 0.5) * 180, 0],
            rotate: [0, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 120, 0],
            opacity: 1
          }}
          transition={{ 
            duration: 0.8, 
            repeat: Infinity, 
            repeatType: "reverse", 
            ease: "easeInOut", 
            delay: i * 0.1 
          }}
        >
          <img src={images['../../assets/cards/back.jpg']} alt="Back" className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </div>
  );
};

interface DrawnCardState {
  card: TarotCard;
  isReversed: boolean;
}

function generateLumaAdvice(drawnCards: DrawnCardState[], spreadType: SpreadType): string {
  if (drawnCards.length === 0) return "";
  const majorCount = drawnCards.filter(d => d.card.isMajor).length;
  const reversedCount = drawnCards.filter(d => d.isReversed).length;
  let adviceParts: string[] = [];

  if (spreadType === "single") adviceParts.push("لوما می‌گوید: این کارت پاسخ کائنات به سوال شماست. ");
  else if (spreadType === "past_present_future") adviceParts.push("لوما با بررسی مسیر زمان، این پیام را برایتان دارد: ");
  else if (spreadType === "love") adviceParts.push("لوما با تمرکز بر انرژی‌های عاطفی شما می‌گوید: ");
  else if (spreadType === "choice") adviceParts.push("لوما با تحلیل دو مسیر پیش روی شما می‌گوید: ");

  if (majorCount >= 2) adviceParts.push("حضور پررنگ کارت‌های کبیر نشان می‌دهد که این فال تحت تأثیر نیروهای کارمیک و سرنوشت‌ساز است. ");
  if (reversedCount > 0) adviceParts.push(`وجود ${reversedCount} کارت معکوس نشان می‌دهد که برخی انرژی‌ها در درون شما مسدود شده‌اند. `);
  else adviceParts.push("همه کارت‌ها در حالت راست قرار دارند. انرژی‌ها در جریان هستند. ");

  if (spreadType === "love") {
    const partnerCard = drawnCards[1];
    if (partnerCard.isReversed) adviceParts.push("کارت شریک عاطفی معکوس است؛ نشان می‌دهد که او ممکن است در بیان احساسات خود تردید داشته باشد. ");
    else adviceParts.push("کارت شریک عاطفی در حالت راست است؛ نشان‌دهنده پذیرش و هماهنگی نسبی است. ");
  }

  if (spreadType === "choice" && drawnCards.length === 5) {
    const path1 = drawnCards[1].card.isMajor || drawnCards[2].card.isMajor;
    const path2 = drawnCards[3].card.isMajor || drawnCards[4].card.isMajor;
    if (path1 && !path2) adviceParts.push("به نظر می‌رسد مسیر اول انرژی قوی‌تری دارد و مورد تایید کائنات است. ");
    else if (path2 && !path1) adviceParts.push("مسیر دوم انرژی قوی‌تری دارد و آینده بهتری را نوید می‌دهد. ");
    else adviceParts.push("هر دو مسیر انرژی‌های خاص خود را دارند. به ندای قلب خود گوش دهید. ");
  }

  adviceParts.push("توصیه نهایی لوما: به شهود خود اعتماد کنید و با آگاهی قدم بعدی را بردارید.");
  return adviceParts.join(" ");
}

export function TarotReadingScreen() {
  const setCurrentRoute = useAppStore((state) => state.setCurrentRoute);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { addXp } = useGamification();

  const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
  const [drawnCards, setDrawnCards] = useState<DrawnCardState[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [magicCardIndex, setMagicCardIndex] = useState<number | null>(null);

  const playShuffle = useSound('/sounds/shuffle.mp3', 0.6);
  const playFlip = useSound('/sounds/flip.mp3', 0.8);
  const playMagic = useSound('/sounds/magic.mp3', 0.5);
  const playXp = useSound('/sounds/xp.mp3', 0.6);

  const readingKeyRef = useRef<number | null>(null);
  const awardedKeyRef = useRef<number | null>(null);

  const activeSpreadConfig = SPREADS.find(s => s.id === selectedSpread);

  const startReading = () => {
    if (!activeSpreadConfig) return;
    setIsShuffling(true);
    setIsAnalyzing(false);
    playShuffle();

    setRevealed(new Array(activeSpreadConfig.count).fill(false));
    setDrawnCards([]); 
    readingKeyRef.current = Date.now();

    setTimeout(() => {
      const shuffled = tarotCards
        .map(c => ({ card: c, isReversed: Math.random() < 0.3 }))
        .sort(() => 0.5 - Math.random())
        .slice(0, activeSpreadConfig.count);
      
      setDrawnCards(shuffled);
      setIsShuffling(false);
    }, 4000);
  };

  const revealCard = (index: number) => {
    if (revealed[index]) return;
    playFlip();
    setMagicCardIndex(index);
    setTimeout(() => setMagicCardIndex(null), 800);

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
  };

  const allRevealed = revealed.length > 0 && revealed.every((r) => r);

  useEffect(() => {
    const currentKey = readingKeyRef.current;
    if (!allRevealed || !currentUser?.id || !currentKey) return;
    if (awardedKeyRef.current === currentKey) return;
    awardedKeyRef.current = currentKey;

    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2500);

    void (async () => {
      try {
        // تولید و ذخیره تفسیر در دیتابیس
        const adviceText = generateLumaAdvice(drawnCards, selectedSpread!);
        
        await db.readings.add({ 
          userId: currentUser.id!, 
          type: selectedSpread || "unknown", 
          cards: drawnCards.map((d) => d.card.id), 
          interpretation: adviceText, // <-- تفسیر اینجا ذخیره می‌شود
          createdAt: Date.now() 
        });
        
        playMagic();
        setShowXp(true);
        playXp();
        setTimeout(() => setShowXp(false), 3000);
        await addXp(10);
      } catch (e) {
        console.error("Error saving reading:", e);
      }
    })();
  }, [allRevealed, currentUser?.id, drawnCards, addXp, selectedSpread, playMagic, playXp]);

  const cardBorderStyle = {
    borderColor: "rgba(var(--glow-color-rgb), 1)",
    boxShadow: "0 0 20px rgba(var(--glow-color-rgb), 0.5)"
  };

  if (!selectedSpread) {
    return (
      <div className="min-h-screen flex flex-col items-center p-6 relative overflow-hidden text-slate-800 dark:text-slate-200" dir="rtl">
        <div className="w-full max-w-4xl flex justify-between items-center mb-12 relative z-10">
          <button onClick={() => setCurrentRoute("tarot_menu")} className="text-sm font-bold text-[rgb(var(--glow-color-rgb))] hover:bg-[rgba(var(--glow-color-rgb),0.1)] px-4 py-2 rounded-full transition-colors flex items-center gap-2">
            <ArrowRight className="w-4 h-4" /> بازگشت
          </button>
          <h1 className="text-3xl font-display font-bold text-[rgb(var(--glow-color-rgb))] drop-shadow-md flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-500" />
            انتخاب نوع فال
          </h1>
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl relative z-10">
          {SPREADS.map((spread) => (
            <motion.button
              key={spread.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSpread(spread.id as SpreadType)}
              className="glass-card rounded-3xl p-6 flex items-center gap-4 border border-white/40 dark:border-slate-700 hover:border-[rgba(var(--glow-color-rgb),0.5)] transition-colors text-right shadow-lg"
            >
              <div className="w-16 h-16 rounded-2xl bg-[rgba(var(--glow-color-rgb),0.1)] flex items-center justify-center shrink-0">
                <spread.icon className="w-8 h-8 text-[rgb(var(--glow-color-rgb))]" />
              </div>
              <div>
                <h3 className="font-bold text-[rgb(var(--glow-color-rgb))] text-xl mb-1">{spread.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{spread.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 relative overflow-hidden text-slate-800 dark:text-slate-200" dir="rtl">
      
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 relative z-10">
        <button onClick={() => { setSelectedSpread(null); setDrawnCards([]); setRevealed([]); }} className="text-sm font-bold text-[rgb(var(--glow-color-rgb))] hover:bg-[rgba(var(--glow-color-rgb),0.1)] px-4 py-2 rounded-full transition-colors flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> تغییر نوع فال
        </button>
        <h1 className="text-2xl font-display font-bold text-[rgb(var(--glow-color-rgb))] drop-shadow-md flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-500" />
          {activeSpreadConfig?.title}
        </h1>
        <div className="w-24"></div>
      </div>

      {drawnCards.length === 0 && !isShuffling ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 relative z-10 mt-10">
          <motion.div 
            animate={{ rotateY: [0, 180, 360], y: [0, -10, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
            className="w-56 h-96 rounded-xl overflow-hidden border-[3px] transition-all duration-300"
            style={cardBorderStyle}
          >
            <img src={images['../../assets/cards/back.jpg']} alt="Back" className="w-full h-full object-cover" />
          </motion.div>
          
          <button onClick={startReading} className="glow-btn w-full max-w-xs h-16 transition-transform hover:scale-[1.02] active:scale-95 group shadow-lg">
            <div className="glow-btn-inner w-full h-full flex items-center justify-center gap-2 text-lg font-bold tracking-widest text-white group-hover:text-yellow-300 transition-colors">
              <Sparkles className="w-5 h-5" />
              شروع فال
            </div>
          </button>
        </div>
      ) : isShuffling ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 relative z-10 mt-10">
          <ShuffleAnimation />
          <p className="text-lg font-bold text-[rgb(var(--glow-color-rgb))] animate-pulse">در حال بُر زدن کارت‌ها...</p>
        </div>
      ) : (
        <div className="w-full max-w-6xl space-y-12 relative z-10">
          <div className="flex flex-wrap justify-center items-end gap-4 md:gap-8 min-h-[300px]">
            {drawnCards.map((drawn, index) => (
              <div key={index} className="flex flex-col items-center space-y-4">
                <h3 className="text-sm md:text-lg font-bold text-[rgb(var(--glow-color-rgb))] text-center w-24 md:w-32">
                  {activeSpreadConfig?.positions[index]}
                </h3>
                
                <div 
                  className="relative w-32 h-52 md:w-40 md:h-64 lg:w-44 lg:h-72 cursor-pointer group"
                  style={{ perspective: "1000px" }}
                  onClick={() => revealCard(index)}
                >
                  <motion.div
                    className="w-full h-full relative"
                    style={{ transformStyle: "preserve-3d" }}
                    initial={false}
                    animate={{ rotateY: revealed[index] ? 180 : 0 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
                  >
                    <div 
                      className="absolute inset-0 rounded-xl overflow-hidden border-[3px] transition-all duration-300"
                      style={{ ...cardBorderStyle, backfaceVisibility: "hidden", zIndex: 2 }}
                    >
                      <img src={images['../../assets/cards/back.jpg']} alt="Back" className="w-full h-full object-cover" />
                    </div>

                    <div 
                      className="absolute inset-0 rounded-xl overflow-hidden border-[3px] transition-all duration-300"
                      style={{ ...cardBorderStyle, backfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: 1 }}
                    >
                      <img 
                        src={images[`../../assets/cards/${drawn.card.fileName}`]} 
                        alt={drawn.card.name} 
                        className={`w-full h-full object-cover transition-transform duration-500 ${drawn.isReversed ? 'rotate-180' : ''}`} 
                      />
                    </div>
                  </motion.div>

                  <MagicSparkles show={magicCardIndex === index} />
                </div>
              </div>
            ))}
          </div>

          {showXp && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.5 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="fixed top-1/3 left-1/2 -translate-x-1/2 text-5xl font-extrabold text-amber-500 drop-shadow-[0_4px_15px_rgba(212,175,55,0.8)] z-50">
              + XP
            </motion.div>
          )}

          <AnimatePresence>
            {allRevealed && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="space-y-10">
                
                <div className="luma-advice-card relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-500/30 shadow-[0_8px_30px_rgba(212,175,55,0.2)] p-8 text-center mt-8">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300"></div>
                  <h3 className="luma-advice-title text-2xl font-bold text-amber-700 dark:text-amber-400 mb-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-7 h-7 text-amber-500" />
                    تحلیل و توصیه کامل لوما
                  </h3>
                  <div className="min-h-[120px] flex items-center justify-center">
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center gap-3 text-amber-600 dark:text-amber-400 luma-advice-text">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><Sparkles className="w-8 h-8" /></motion.div>
                        <span className="font-medium animate-pulse">لوما در حال تحلیل عناصر و انرژی کارت‌هاست...</span>
                      </div>
                    ) : (
                      <p className="luma-advice-text text-lg text-slate-700 dark:text-slate-300 leading-loose font-medium text-justify md:text-center" dir="rtl">
                        {generateLumaAdvice(drawnCards, selectedSpread)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {drawnCards.map((drawn, index) => (
                    <Card key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-white/80 dark:border-slate-700 shadow-sm rounded-2xl flex flex-col">
                      <CardHeader>
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">{activeSpreadConfig?.positions[index]}</p>
                        <CardTitle className="text-center text-lg text-[rgb(var(--glow-color-rgb))]">
                          {drawn.card.nameFa} {drawn.isReversed && <span className="text-xs text-red-500">(معکوس)</span>}
                        </CardTitle>
                        <p className="text-center text-xs text-slate-500 dark:text-slate-400 tracking-widest">{drawn.card.name}</p>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm leading-relaxed text-justify text-slate-600 dark:text-slate-300 font-medium">
                          {getCardMeaning(drawn.card.id, drawn.isReversed)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center pt-8 pb-10">
                  <button onClick={() => { setDrawnCards([]); setRevealed([]); }} className="glow-btn w-48 h-12 transition-transform hover:scale-[1.02] active:scale-95 group shadow-md">
                    <div className="glow-btn-inner w-full h-full flex items-center justify-center text-sm font-bold text-white group-hover:text-yellow-300 transition-colors">
                      فال مجدد
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}