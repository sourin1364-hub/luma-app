import { useState, useEffect, useRef } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { tarotCards, type TarotCard } from "../../lib/tarotData";
import { getCardMeaning } from "../../lib/tarotMeanings";
import { generateTarotSynthesis } from "../../lib/tarotAnalysis";
import { saveReadingOfflineFirst } from "../../lib/sync";
import { useGamification } from "../gamification/useGamification";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Split, Layers, HelpCircle, X } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";

const images = import.meta.glob('../../assets/cards/*.webp', { eager: true, import: 'default' }) as Record<string, string>;

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

export function TarotReadingScreen() {
  const setCurrentRoute = useAppStore((state) => state.setCurrentRoute);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { addXp } = useGamification();

  const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
  const [drawnCards, setDrawnCards] = useState<{ card: TarotCard; isReversed: boolean }[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCardModal, setSelectedCardModal] = useState<TarotCard | null>(null);

  const playShuffle = useSound(`${import.meta.env.BASE_URL}sounds/shuffle.mp3`, 0.6);
  const playFlip = useSound(`${import.meta.env.BASE_URL}sounds/flip.mp3`, 0.8);
  const playMagic = useSound(`${import.meta.env.BASE_URL}sounds/magic.mp3`, 0.5);
  const playXp = useSound(`${import.meta.env.BASE_URL}sounds/xp.mp3`, 0.6);

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
        const adviceText = generateTarotSynthesis(drawnCards, selectedSpread!);
        await saveReadingOfflineFirst(
          currentUser.id!,
          selectedSpread || "unknown",
          drawnCards.map((d) => d.card.id),
          adviceText
        );
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

  if (!selectedSpread) {
    return (
      <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 relative overflow-x-hidden text-[var(--text-main)]" dir="rtl">
        <PageHeader title="انتخاب نوع فال" icon={<Sparkles className="w-5 h-5 text-amber-500" />} onBack={() => setCurrentRoute("tarot_menu")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl relative z-10 mt-6">
          {SPREADS.map((spread) => (
            <motion.button
              key={spread.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSpread(spread.id as SpreadType)}
              className="glow-card rounded-3xl p-4 sm:p-6 flex items-center gap-4 text-right shadow-lg"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[rgba(var(--glow-color-rgb),0.1)] flex items-center justify-center shrink-0">
                <spread.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[rgb(var(--glow-color-rgb))]" />
              </div>
              <div>
                <h3 className="font-bold text-[rgb(var(--glow-color-rgb))] text-lg sm:text-xl mb-1">{spread.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)]">{spread.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 relative overflow-x-hidden text-[var(--text-main)]" dir="rtl">
      <PageHeader title={activeSpreadConfig?.title || ""} icon={<Sparkles className="w-5 h-5 text-amber-500" />} onBack={() => { setSelectedSpread(null); setDrawnCards([]); setRevealed([]); }} />

      {drawnCards.length === 0 && !isShuffling ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 relative z-10 mt-10 w-full">
          <motion.div
            animate={{ rotateY: [0, 180, 360], y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-72 sm:w-56 sm:h-96 rounded-xl overflow-hidden border-2 border-[#D6B56D] shadow-[0_0_25px_rgba(214,181,109,0.3)] bg-transparent"
          >
            <img src={images['../../assets/cards/back.webp']} alt="Back" className="w-full h-full object-cover" />
          </motion.div>

          <button onClick={startReading} className="btn-gold-wave w-full max-w-xs h-16 flex items-center justify-center gap-2 text-lg">
            <Sparkles className="w-5 h-5" />
            شروع فال
          </button>
        </div>
      ) : isShuffling ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 relative z-10 mt-10 w-full px-2">
          <div className="flex gap-4 md:gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-24 h-36 md:w-32 md:h-48 rounded-xl border border-[#D6B56D]/30 bg-transparent relative shadow-inner">
                 <img src={images['../../assets/cards/back.webp']} alt="Back" className="w-full h-full object-cover rounded-xl opacity-50" />
              </div>
            ))}
          </div>
          <p className="text-lg font-bold text-[rgb(var(--glow-color-rgb))] animate-pulse">در حال بر زدن کارت‌ها...</p>
        </div>
      ) : (
        <div className="w-full max-w-6xl space-y-12 relative z-10">
          <div className="flex flex-wrap justify-center items-end gap-2 md:gap-8 min-h-[300px]">
            {drawnCards.map((drawn, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 sm:space-y-4">
                <h3 className="text-xs sm:text-lg font-bold text-[rgb(var(--glow-color-rgb))] text-center w-20 md:w-32">
                  {activeSpreadConfig?.positions[index]}
                </h3>

                <div
                  className="relative w-28 h-44 sm:w-32 sm:h-48 md:w-44 md:h-64 lg:w-52 lg:h-80 xl:w-56 cursor-pointer group"
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
                    <div className="absolute inset-0 rounded-xl overflow-hidden border-2 border-[#D6B56D]/50 shadow-[0_0_15px_rgba(214,181,109,0.2)] bg-transparent" style={{ backfaceVisibility: "hidden", zIndex: 2 }}>
                      <img src={images['../../assets/cards/back.webp']} alt="Back" className="w-full h-full object-cover" />
                    </div>

                    <div className="absolute inset-0 rounded-xl overflow-hidden border-2 border-[#D6B56D]/50 shadow-[0_0_15px_rgba(214,181,109,0.2)] bg-transparent" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: 1 }}>
                      <img src={images[`../../assets/cards/${drawn.card.fileName}`]} alt={drawn.card.name} className={`w-full h-full object-cover ${drawn.isReversed ? 'rotate-180' : ''}`} />
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>

          {showXp && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.5 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="fixed top-1/3 left-1/2 -translate-x-1/2 text-5xl font-extrabold text-[#D6B56D] drop-shadow-[0_4px_15px_rgba(214,181,109,0.8)] z-50">
              + XP
            </motion.div>
          )}

          <AnimatePresence>
            {allRevealed && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="space-y-10">
                <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-gold)] shadow-2xl p-4 sm:p-8 text-center mt-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#D6B56D] mb-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-7 h-7 text-[#D6B56D]" />
                    تحلیل و توصیه کامل لوما
                  </h3>
                  <div className="min-h-[120px] flex items-center justify-center">
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center gap-3 text-[#D6B56D]">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><Sparkles className="w-8 h-8" /></motion.div>
                        <span className="font-medium animate-pulse">لوما در حال تحلیل عناصر و انرژی کارت‌هاست...</span>
                      </div>
                    ) : (
                      <div className="text-sm sm:text-base text-[var(--text-main)] leading-loose font-medium text-justify text-right whitespace-pre-wrap">
                        {generateTarotSynthesis(drawnCards, selectedSpread)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {drawnCards.map((drawn, index) => (
                    <Card key={index} className="glow-card rounded-2xl flex flex-col cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedCardModal(drawn.card)}>
                      <CardHeader>
                        <p className="text-xs font-bold text-[#D6B56D] mb-1">{activeSpreadConfig?.positions[index]}</p>
                        <CardTitle className="text-center text-lg text-[#D6B56D]">
                          {drawn.card.nameFa} {drawn.isReversed && <span className="text-xs text-red-500">(معکوس)</span>}
                        </CardTitle>
                        <p className="text-center text-xs text-[var(--text-muted)] tracking-widest">{drawn.card.name}</p>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm leading-relaxed text-justify text-[var(--text-main)] font-medium">
                          {getCardMeaning(drawn.card.id, drawn.isReversed)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center pt-8 pb-10">
                  <button onClick={() => { setDrawnCards([]); setRevealed([]); }} className="btn-gold-wave w-48 h-12 text-sm">
                    فال مجدد
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* مودال اطلاعات کارت با سایز پویا */}
      <AnimatePresence>
        {selectedCardModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedCardModal(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-[var(--bg-card)] rounded-3xl w-full max-w-md shadow-2xl border border-[rgba(var(--glow-color-rgb),0.3)] flex flex-col max-h-[90vh] overflow-hidden">
              <button onClick={() => setSelectedCardModal(null)} className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"><X className="w-5 h-5" /></button>
              
              <div className="w-full flex-1 min-h-[200px] flex items-center justify-center p-6 bg-transparent">
                <img src={images[`../../assets/cards/${selectedCardModal.fileName}`]} alt={selectedCardModal.name} className="max-h-[35vh] w-auto object-contain rounded-lg shadow-xl border-2 border-[#D6B56D]" />
              </div>

              <div className="w-full p-6 flex flex-col text-center overflow-y-auto">
                <h2 className="text-2xl font-bold text-[#D6B56D] mb-1">{selectedCardModal.nameFa}</h2>
                <p className="text-sm text-[var(--text-muted)] tracking-widest mb-4">{selectedCardModal.name}</p>
                <div className="bg-[rgba(214,181,109,0.05)] rounded-xl p-4 border border-[rgba(214,181,109,0.2)]">
                  <p className="text-xs font-bold text-[#D6B56D] mb-2 flex items-center justify-center gap-1"><Sparkles className="w-4 h-4" /> معنی کارت:</p>
                  <p className="text-sm leading-relaxed text-[var(--text-main)] font-medium text-justify">{getCardMeaning(selectedCardModal.id)}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}