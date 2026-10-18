import { motion } from "framer-motion";
import { useGamification } from "./useGamification";
import { useAppStore } from "../../store/useAppStore";

export function LevelBadge({ onClick }: { onClick?: () => void }) {
  const { levelInfo, loading } = useGamification();
  const language = useAppStore((s) => s.language);
  const isFa = language === "fa";
  const percent = Math.round(levelInfo.progress * 100);

  if (loading) return null;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card glow-border rounded-full px-3 py-1.5 flex items-center gap-2 shrink-0"
      aria-label={isFa ? "\u0633\u0637\u062D \u06A9\u0627\u0631\u0628\u0631" : "User level"}
    >
      <span className="text-xs font-bold text-primary whitespace-nowrap">
        {isFa ? `\u0633\u0637\u062D ${levelInfo.level}` : `Lv.${levelInfo.level}`}
      </span>
      <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-yellow-400 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </motion.button>
  );
}