import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { db } from "../../db";
import { Logo } from "../../components/ui/Logo";
import { LevelBadge } from "../gamification/LevelBadge";
import { useGamification } from "../gamification/useGamification";
import { DailyCard } from "../chart/DailyCard";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass, User, Settings as SettingsIcon, Star, Moon, Target, Zap, Layers, X } from "lucide-react";

const images = import.meta.glob('../../assets/cards/*.jpg', { eager: true, import: 'default' }) as Record<string, string>;

export function DashboardScreen() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const setCurrentRoute = useAppStore((s) => s.setCurrentRoute);
  const { levelInfo } = useGamification();

  const [readingsCount, setReadingsCount] = useState(0);
  const [showDailyModal, setShowDailyModal] = useState(false);

  useEffect(() => {
    const fetchCount = () => {
      if (currentUser?.id) {
        db.readings.where("userId").equals(currentUser.id).count().then(c => setReadingsCount(c || 0));
      }
    };
    fetchCount();
    window.addEventListener("focus", fetchCount);
    return () => window.removeEventListener("focus", fetchCount);
  }, [currentUser?.id]);

  if (!currentUser) return null;

  const displayName = currentUser.username?.trim() || "کاربر مهمان";
  const menuItems = [
    { id: "chart", label: "چارت تولد", icon: Compass, desc: "نجوم و اعداد" },
    { id: "astrology", label: "چارت آسترولوژی", icon: Moon, desc: "سیارات و خانه‌ها" },
    { id: "tarot_menu", label: "دنیای تاروت", icon: Sparkles, desc: "فال و معانی" },
    { id: "profile", label: "پروفایل من", icon: User, desc: "سطح و دستاوردها" },
    { id: "settings", label: "تنظیمات", icon: SettingsIcon, desc: "مدیریت برنامه" },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col items-center p-6 relative overflow-hidden text-slate-800 dark:text-slate-200" dir="rtl">
      
      <div className="relative z-20 max-w-md w-full space-y-6 py-6">
        
        {/* هدر خوش‌آمدگویی */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center space-y-3">
          <div className="flex items-center gap-4 text-[rgb(var(--glow-color-rgb))] drop-shadow-md">
            <Logo size={44} className="animate-[spin_25s_linear_infinite]" />
            <h1 className="text-5xl font-logo font-bold tracking-[0.2em]">LUMA</h1>
          </div>
          
          <div className="text-center mt-3">
            <h2 className="text-2xl font-bold text-[rgb(var(--glow-color-rgb))] mb-1">
              {currentUser.isGuest ? "خوش آمدی، مهمان" : `خوش آمدی، ${displayName}`}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">به دنیای درون خود قدم بگذارید</p>
          </div>
          
          <div className="pt-1">
            <LevelBadge onClick={() => setCurrentRoute("profile")} />
          </div>
        </motion.div>

        {/* آمار کوتاه ( کارت) */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          <div className="glass-card rounded-2xl p-3 text-center border border-white/40 dark:border-slate-700">
            <div className="w-10 h-10 mx-auto mb-1.5 rounded-full bg-[rgba(var(--glow-color-rgb),0.1)] flex items-center justify-center">
              <Target className="w-5 h-5 text-[rgb(var(--glow-color-rgb))]" />
            </div>
            <div className="text-lg font-bold text-[rgb(var(--glow-color-rgb))]">{levelInfo.level}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">سطح</div>
          </div>
          
          <div className="glass-card rounded-2xl p-3 text-center border border-white/40 dark:border-slate-700">
            <div className="w-10 h-10 mx-auto mb-1.5 rounded-full bg-[rgba(var(--glow-color-rgb),0.1)] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[rgb(var(--glow-color-rgb))]" />
            </div>
            <div className="text-lg font-bold text-[rgb(var(--glow-color-rgb))]">{levelInfo.totalXp}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">XP کل</div>
          </div>
          
          <div className="glass-card rounded-2xl p-3 text-center border border-white/40 dark:border-slate-700">
            <div className="w-10 h-10 mx-auto mb-1.5 rounded-full bg-[rgba(var(--glow-color-rgb),0.1)] flex items-center justify-center">
              <Layers className="w-5 h-5 text-[rgb(var(--glow-color-rgb))]" />
            </div>
            <div className="text-lg font-bold text-[rgb(var(--glow-color-rgb))]">{readingsCount}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">فال‌ها</div>
          </div>

          {/* کارت روزانه در قالب یک کادر کلیک‌پذیر */}
          <div 
            onClick={() => setShowDailyModal(true)}
            className="glass-card rounded-2xl p-2 text-center border border-white/40 dark:border-slate-700 cursor-pointer hover:border-[rgba(var(--glow-color-rgb),0.5)] transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="w-10 h-14 mx-auto mb-1 rounded-md overflow-hidden border border-[rgba(var(--glow-color-rgb),0.4)] shadow-sm group-hover:shadow-[0_0_15px_rgba(var(--glow-color-rgb),0.5)] transition-shadow">
              <img src={images['../../assets/cards/back.jpg']} alt="Daily" className="w-full h-full object-cover" />
            </div>
            <div className="text-[10px] font-bold text-[rgb(var(--glow-color-rgb))] mt-1.5">کارت روزانه</div>
          </div>
        </motion.div>

        {/* منوی اصلی */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="text-base font-bold text-[rgb(var(--glow-color-rgb))] mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            دسترسی سریع
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentRoute(item.id)}
                className="glass-card rounded-2xl p-4 flex flex-col items-center text-center gap-2 border border-white/40 dark:border-slate-700 hover:border-[rgba(var(--glow-color-rgb),0.5)] transition-colors group shadow-md"
              >
                <div className="w-11 h-11 rounded-full bg-[rgba(var(--glow-color-rgb),0.1)] flex items-center justify-center group-hover:bg-[rgba(var(--glow-color-rgb),0.2)] transition-colors">
                  <item.icon className="w-5 h-5 text-[rgb(var(--glow-color-rgb))]" />
                </div>
                <div>
                  <h3 className="font-bold text-[rgb(var(--glow-color-rgb))] text-xs mb-0.5">{item.label}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{item.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

      </div>

      {/* پاپ‌آپ نمایش کارت روزانه */}
      <AnimatePresence>
        {showDailyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowDailyModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-slate-900/95 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl border border-[rgba(var(--glow-color-rgb),0.3)] relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowDailyModal(false)}
                className="absolute top-4 right-4 z-50 bg-black/10 dark:bg-white/10 text-slate-800 dark:text-white p-2 rounded-full hover:bg-black/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <DailyCard />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}