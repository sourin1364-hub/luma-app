import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { tarotCards } from "../../lib/tarotData";
import { getCardMeaning } from "../../lib/tarotMeanings";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, BookOpen } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";

const images = import.meta.glob('../../assets/cards/*.webp', { eager: true, import: 'default' }) as Record<string, string>;

const CATEGORIES = [
  { id: "all", label: "همه کارت‌ها" },
  { id: "major", label: "کبیر" },
  { id: "cups", label: "جام" },
  { id: "pentacles", label: "سکه" },
  { id: "swords", label: "شمشیر" },
  { id: "wands", label: "چوب" },
];

export function TarotGalleryScreen() {
  const setCurrentRoute = useAppStore((state) => state.setCurrentRoute);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const filteredCards = tarotCards.filter((card) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "major") return card.isMajor;
    if (selectedCategory === "cups") return card.id >= 36 && card.id <= 49;
    if (selectedCategory === "pentacles") return card.id >= 64 && card.id <= 77;
    if (selectedCategory === "swords") return card.id >= 50 && card.id <= 63;
    if (selectedCategory === "wands") return card.id >= 22 && card.id <= 35;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 relative overflow-x-hidden text-slate-200 bg-[#0B0D1A]" dir="rtl">
      <PageHeader title="دایرةالمعارف کارت‌ها" icon={<BookOpen className="w-5 h-5 text-amber-500" />} onBack={() => setCurrentRoute("tarot_menu")} />

      <div className="flex flex-wrap justify-center gap-2 mb-8 relative z-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              selectedCategory === cat.id
                ? "bg-[rgb(var(--glow-color-rgb))] text-[#0B0D1A] shadow-lg"
                : "bg-[#17182B] text-slate-300 hover:bg-slate-800 border border-white/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 relative z-10 pb-20">
        {filteredCards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCard(card)}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="w-full aspect-[2/3] rounded-xl overflow-hidden border-2 border-white/10 hover:border-[rgba(var(--glow-color-rgb),0.8)] shadow-md transition-colors">
              <img src={images[`../../assets/cards/${card.fileName}`]} alt={card.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-center text-[rgb(var(--glow-color-rgb))]">{card.nameFa}</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#17182B] rounded-3xl w-full max-w-sm sm:max-w-md shadow-2xl border border-[rgba(var(--glow-color-rgb),0.3)] relative p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-3 right-3 z-10 bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex justify-center mt-6 mb-4">
                <div className="w-[160px] h-[240px] sm:w-[200px] sm:h-[300px] shrink-0 rounded-xl overflow-hidden border-2 shadow-lg" style={{ borderColor: "rgba(var(--glow-color-rgb), 0.5)" }}>
                  <img src={images[`../../assets/cards/${selectedCard.fileName}`]} alt={selectedCard.name} className="w-full h-full object-cover" />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-center text-[rgb(var(--glow-color-rgb))] mb-1">
                {selectedCard.nameFa}
              </h2>
              <p className="text-center text-xs text-slate-400 tracking-widest mb-4">{selectedCard.name}</p>

              <div className="bg-[rgba(var(--glow-color-rgb),0.05)] rounded-xl sm:rounded-2xl p-4 border border-[rgba(var(--glow-color-rgb),0.2)]">
                <h3 className="text-sm font-bold text-[rgb(var(--glow-color-rgb))] mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  معنی کارت:
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-medium text-justify">
                  {getCardMeaning(selectedCard.id, false)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}