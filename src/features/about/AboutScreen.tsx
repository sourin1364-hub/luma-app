import { useAppStore } from "../../store/useAppStore";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart } from "lucide-react";

// آیکون SVG اینستاگرام (بدون نیاز به lucide-react)
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export function AboutScreen() {
  const setCurrentRoute = useAppStore((state) => state.setCurrentRoute);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 relative overflow-hidden text-slate-800 dark:text-slate-200" dir="rtl">
      
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 relative z-10">
        <button onClick={() => setCurrentRoute("home")} className="text-sm font-bold text-[rgb(var(--glow-color-rgb))] hover:bg-[rgba(var(--glow-color-rgb),0.1)] px-4 py-2 rounded-full transition-colors flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> بازگشت
        </button>
        <h1 className="text-3xl font-display font-bold text-[rgb(var(--glow-color-rgb))] drop-shadow-md flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-amber-500" /> درباره ما
        </h1>
        <div className="w-24"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg glass-card rounded-[2.5rem] p-8 border border-[rgba(var(--glow-color-rgb),0.2)] shadow-xl relative z-10"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgba(var(--glow-color-rgb),0.2)] to-transparent flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-[rgb(var(--glow-color-rgb))] drop-shadow-[0_0_15px_rgba(var(--glow-color-rgb),0.8)]" />
          </div>
          
          <h2 className="text-4xl font-logo font-bold tracking-widest text-[rgb(var(--glow-color-rgb))] mb-2">LUMERA</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">دنیای نجوم، تاروت و خودشناسی</p>

          <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 text-justify mb-8">
            <p>
              اپلیکیشن LUMA با هدف فراهم کردن فضایی امن، آفلاین و حرفه‌ای برای کاوش در دنیای درون طراحی شده است. 
              در اینجا می‌توانید چارت تولد خود را بر اساس قوانین دقیق نجومی محاسبه کنید، با کارت‌های تاروت فال بگیرید و 
              هر روز با کارت روزانه، پیام کائنات را دریافت کنید.
            </p>
            <p>
              تمامی محاسبات به صورت محلی روی دستگاه شما انجام می‌شود و هیچ‌گونه اطلاعاتی به سرور ارسال نمی‌گردد. 
              LUMA متعلق به مجموعه Lumera است.
            </p>
          </div>

          <a 
            href="https://www.instagram.com/lumera.tv/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <InstagramIcon className="w-5 h-5" />
            <span>ما را در اینستاگرام دنبال کنید</span>
          </a>

          <div className="mt-8 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Heart className="w-3 h-3 text-red-500" />
            <span>ساخته شده با عشق برای جویندگان حقیقت</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}