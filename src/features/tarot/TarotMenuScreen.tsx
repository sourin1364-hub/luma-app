import { useAppStore } from "../../store/useAppStore";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, History } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";

export function TarotMenuScreen() {
  const setCurrentRoute = useAppStore((state) => state.setCurrentRoute);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 relative overflow-x-hidden text-[var(--text-main)] bg-[var(--bg-main)]" dir="rtl">
      <PageHeader title="دنیای تاروت" icon={<Sparkles className="w-5 h-5 text-amber-500" />} onBack={() => setCurrentRoute("home")} />

      <p className="text-center text-[var(--text-muted)] mb-8 font-medium">به کدام بخش می‌خواهید وارد شوید؟</p>

      <div className="w-full max-w-2xl flex flex-col gap-6 relative z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentRoute("reading")}
          className="bg-[var(--bg-card)] border border-white/10 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 shadow-xl hover:border-[#D6B56D]/50 transition-colors group"
        >
          <div className="w-20 h-20 rounded-full bg-[rgba(214,181,109,0.1)] flex items-center justify-center group-hover:bg-[rgba(214,181,109,0.2)] transition-colors">
            <Sparkles className="w-10 h-10 text-[#D6B56D]" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#D6B56D] mb-2">شروع فال جدید</h2>
            <p className="text-sm text-[var(--text-muted)]">انواع فال‌ها و دریافت پیام کائنات</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentRoute("tarot_library")}
          className="bg-[var(--bg-card)] border border-white/10 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 shadow-xl hover:border-[#D6B56D]/50 transition-colors group"
        >
          <div className="w-20 h-20 rounded-full bg-[rgba(214,181,109,0.1)] flex items-center justify-center group-hover:bg-[rgba(214,181,109,0.2)] transition-colors">
            <BookOpen className="w-10 h-10 text-[#D6B56D]" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#D6B56D] mb-2">دایرةالمعارف</h2>
            <p className="text-sm text-[var(--text-muted)]">معانی کامل کارت تاروت</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentRoute("tarot_history")}
          className="bg-[var(--bg-card)] border border-white/10 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 shadow-xl hover:border-[#D6B56D]/50 transition-colors group"
        >
          <div className="w-20 h-20 rounded-full bg-[rgba(214,181,109,0.1)] flex items-center justify-center group-hover:bg-[rgba(214,181,109,0.2)] transition-colors">
            <History className="w-10 h-10 text-[#D6B56D]" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#D6B56D] mb-2">تاریخچه فال‌ها</h2>
            <p className="text-sm text-[var(--text-muted)]">مشاهده فال‌های قبلی</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}