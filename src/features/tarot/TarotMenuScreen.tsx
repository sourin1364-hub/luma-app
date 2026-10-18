import { useAppStore } from "../../store/useAppStore";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, ArrowRight, History } from "lucide-react";

export function TarotMenuScreen() {
  const setCurrentRoute = useAppStore((state) => state.setCurrentRoute);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-slate-800 dark:text-slate-200" dir="rtl">
      <div className="w-full max-w-4xl absolute top-8 right-8 z-20">
        <button onClick={() => setCurrentRoute("home")} className="text-sm font-bold text-[rgb(var(--glow-color-rgb))] hover:bg-[rgba(var(--glow-color-rgb),0.1)] px-4 py-2 rounded-full transition-colors flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> بازگشت به خانه
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 z-10">
        <h1 className="text-4xl font-display font-bold text-[rgb(var(--glow-color-rgb))] drop-shadow-md flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-amber-500" />
          دنیای تاروت
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">به کدام بخش می‌خواهید وارد شوید؟</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl relative z-10">
        
        {/* دکمه شروع فال */}
        <button
          onClick={() => setCurrentRoute("reading")}
          className="glass-card rounded-[2.5rem] p-8 flex flex-col items-center text-center border border-white/40 dark:border-slate-700 hover:border-[rgba(var(--glow-color-rgb),0.5)] transition-all duration-300 shadow-xl group hover:-translate-y-2"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgba(var(--glow-color-rgb),0.2)] to-transparent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Sparkles className="w-10 h-10 text-[rgb(var(--glow-color-rgb))] drop-shadow-[0_0_15px_rgba(var(--glow-color-rgb),0.8)]" />
          </div>
          <h2 className="text-xl font-bold text-[rgb(var(--glow-color-rgb))] mb-2">شروع فال جدید</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">انواع فال‌ها و دریافت پیام کائنات</p>
        </button>

        {/* دکمه دایرةالمعارف */}
        <button
          onClick={() => setCurrentRoute("tarot_library")}
          className="glass-card rounded-[2.5rem] p-8 flex flex-col items-center text-center border border-white/40 dark:border-slate-700 hover:border-[rgba(var(--glow-color-rgb),0.5)] transition-all duration-300 shadow-xl group hover:-translate-y-2"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgba(var(--glow-color-rgb),0.2)] to-transparent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BookOpen className="w-10 h-10 text-[rgb(var(--glow-color-rgb))] drop-shadow-[0_0_15px_rgba(var(--glow-color-rgb),0.8)]" />
          </div>
          <h2 className="text-xl font-bold text-[rgb(var(--glow-color-rgb))] mb-2">دایرةالمعارف</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">معانی کامل  کارت تاروت</p>
        </button>

        {/* دکمه تاریخچه */}
        <button
          onClick={() => setCurrentRoute("tarot_history")}
          className="glass-card rounded-[2.5rem] p-8 flex flex-col items-center text-center border border-white/40 dark:border-slate-700 hover:border-[rgba(var(--glow-color-rgb),0.5)] transition-all duration-300 shadow-xl group hover:-translate-y-2"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgba(var(--glow-color-rgb),0.2)] to-transparent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <History className="w-10 h-10 text-[rgb(var(--glow-color-rgb))] drop-shadow-[0_0_15px_rgba(var(--glow-color-rgb),0.8)]" />
          </div>
          <h2 className="text-xl font-bold text-[rgb(var(--glow-color-rgb))] mb-2">تاریخچه فال‌ها</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">مرور فال‌های گذشته شما</p>
        </button>

      </div>
    </div>
  );
}