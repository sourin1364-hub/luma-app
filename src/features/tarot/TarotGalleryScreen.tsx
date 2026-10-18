import { useState, useMemo, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { tarotCards, type TarotCard } from "../../lib/tarotData";
import { getCardMeaning } from "../../lib/tarotMeanings";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";

const images = import.meta.glob('../../assets/cards/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;

const FILTERS = [
  { id: "all", label: "همه کارت‌ها" },
  { id: "major", label: "کبیر" },
  { id: "cups", label: "جام" },
  { id: "pentacles", label: "سکه" },
  { id: "swords", label: "شمشیر" },
  { id: "wands", label: "چوب" },
];

export function TarotGalleryScreen() {
  const setCurrentRoute = useAppStore((state) => state.setCurrentRoute);
  const selectedTarotCardId = useAppStore((state) => state.selectedTarotCardId);
  const setSelectedTarotCardId = useAppStore((state) => state.setSelectedTarotCardId);
  
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  // اگر از صفحه آسترولوژی کارتی انتخاب شده بود، مودال را باز کن
  useEffect(() => {
    if (selectedTarotCardId !== null) {
      const card = tarotCards.find(c => c.id === selectedTarotCardId);
      if (card) {
        setSelectedCard(card);
        // پاک کردن آیدی تا با رفرش دوباره باز نشود
        setSelectedTarotCardId(null);
      }
    }
  }, [selectedTarotCardId, setSelectedTarotCardId]);

  const filteredCards = useMemo(() => {
    if (activeFilter === "all") return tarotCards;
    if (activeFilter === "major") return tarotCards.filter(c => c.isMajor);
    return tarotCards.filter(c => c.suit === activeFilter && !c.isMajor);
  }, [activeFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 relative overflow-hidden text-slate-800 dark:text-slate-200" dir="rtl">
      
      <div className="w-full max-w-6xl flex justify-between items-center mb-8 relative z-10">
        <button onClick={() => setCurrentRoute("tarot_menu")} className="text-sm font-bold text-[rgb(var(--glow-color-rgb))] hover:bg-[rgba(var(--glow-color-rgb),0.1)] px-4 py-2 rounded-full transition-colors flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> بازگشت
        </button>
        <h1 className="text-3xl font-display font-bold text-[rgb(var(--glow-color-rgb))] drop-shadow-md flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-amber-500" />
          دایرةالمعارف کارت‌ها
        </h1>
        <div className="w-24"></div>
      </div>

      <div className="mb-8 relative z-10">
        <button onClick={() => setCurrentRoute("reading")} className="glow-btn w-64 h-14 transition-transform hover:scale-[1.02] active:scale-95 group shadow-lg">
          <div className="glow-btn-inner w-full h-full flex items-center justify-center gap-2 text-lg font-bold tracking-widest text-white">
            <Sparkles className="w-5 h-5" />
            شروع فال تاروت
          </div>
        </button>
      </div>

      <div className="w-full max-w-6xl flex flex-wrap justify-center gap-2 mb-10 relative z-10">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
              activeFilter === f.id
                ? "bg-[rgb(var(--glow-color-rgb))] text-white border-transparent shadow-[0_0_15px_rgba(var(--glow-color-rgb),0.5)]"
                : "bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-[rgba(var(--glow-color-rgb),0.2)] hover:bg-[rgba(var(--glow-color-rgb),0.1)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 relative z-10 pb-20"
      >
        <AnimatePresence>
          {filteredCards.map((card) => {
            const imageSrc = images[`../../assets/cards/${card.fileName}`];
            return (
              <motion.div
                variants={itemVariants}
                layout
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className="cursor-pointer group flex flex-col items-center"
              >
                <div 
                  className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden border-2 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-105"
                  style={{
                    borderColor: "rgba(var(--glow-color-rgb), 0.5)",
                    boxShadow: "0 8px 25px -5px rgba(var(--glow-color-rgb), 0.2)"
                  }}
                >
                  {imageSrc && (
                    <img src={imageSrc} alt={card.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-6 px-2">
                    <Sparkles className="w-6 h-6 text-amber-400 mb-2 animate-bounce" />
                    <h3 className="text-sm font-bold text-center text-white mb-1">{card.nameFa}</h3>
                    <p className="text-[10px] text-slate-300 tracking-widest text-center mb-2">{card.name}</p>
                    <span className="text-[10px] font-bold bg-[rgba(var(--glow-color-rgb),0.8)] text-white px-3 py-1 rounded-full shadow-lg">مشاهده معنی</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden max-w-md w-full shadow-2xl border border-[rgba(var(--glow-color-rgb),0.3)] flex flex-col md:flex-row relative"
            >
              <button 
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-100 dark:bg-slate-800 p-6 flex items-center justify-center">
                <img 
                  src={images[`../../assets/cards/${selectedCard.fileName}`]} 
                  alt={selectedCard.name} 
                  className="w-full max-w-[200px] rounded-lg shadow-xl border border-[rgba(var(--glow-color-rgb),0.5)]"
                />
              </div>

              <div className="w-full md:w-1/2 p-6 flex flex-col justify-center text-center md:text-right" dir="rtl">
                <h2 className="text-2xl font-bold text-[rgb(var(--glow-color-rgb))] mb-1">{selectedCard.nameFa}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 tracking-widest mb-6">{selectedCard.name}</p>
                
                <div className="bg-[rgba(var(--glow-color-rgb),0.05)] rounded-xl p-4 border border-[rgba(var(--glow-color-rgb),0.2)]">
                  <p className="text-xs font-bold text-[rgb(var(--glow-color-rgb))] mb-2 flex items-center justify-center md:justify-start gap-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    معنی کارت:
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                    {getCardMeaning(selectedCard.id)}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}