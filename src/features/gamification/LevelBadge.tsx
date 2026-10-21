import { motion } from "framer-motion";
import { useGamification } from "./useGamification";
import { useAppStore } from "../../store/useAppStore";

export function LevelBadge({ onClick }: { onClick?: () => void }) {
  const { levelInfo, loading } = useGamification();
  const language = useAppStore((s) => s.language);
  const isFa = language === "fa";
  const percent = Math.round(levelInfo.progress * 100);
  const toFa = (num: number) => num.toLocaleString('fa-IR');

  if (loading) return null;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glow-card px-4 py-2 flex items-center gap-3 shrink-0 rounded-full border border-[var(--border-gold)] shadow-[0_0_15px_rgba(var(--glow-color-rgb),0.2)]"
    >
      <span className="text-xs font-bold text-[rgb(var(--glow-color-rgb))] whitespace-nowrap font-sans">
        {isFa ? `سطح ${toFa(levelInfo.level)}` : `Lv.${levelInfo.level}`}
      </span>
      <div className="w-16 h-1.5 bg-black/20 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D6B56D] to-[#F3D58A] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </motion.button>
  );
}