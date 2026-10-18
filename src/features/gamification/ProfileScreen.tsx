import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { db } from "../../db";
import { useGamification } from "./useGamification";
import { ACHIEVEMENTS, getUnlocked, type AchievementStats } from "./achievements";
import { Sparkles, Calendar, Trophy, Lock } from "lucide-react";

const fNum = (val: any) => {
  const n = Number(val);
  if (isNaN(n)) return "";
  return n.toLocaleString('fa-IR');
};

export function ProfileScreen() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const setCurrentRoute = useAppStore((s) => s.setCurrentRoute);
  const { levelInfo } = useGamification();
  const [stats, setStats] = useState<AchievementStats>({ readings: 0, dailyDraws: 0, level: 1 });

  useEffect(() => {
    if (!currentUser?.id) return;
    (async () => {
      try {
        const r = await db.readings.where("userId").equals(currentUser.id!).count();
        const d = await db.dailyDraws.where("userId").equals(currentUser.id!).count();
        setStats({ readings: r || 0, dailyDraws: d || 0, level: levelInfo?.level || 1 });
      } catch { setStats({ readings: 0, dailyDraws: 0, level: 1 }); }
    })();
  }, [currentUser?.id, levelInfo?.level]);

  const unlocked = getUnlocked(stats);
  const displayName = currentUser?.username?.trim() || "کاربر مهمان";
  const xpPercent = Math.round((levelInfo?.progress || 0) * 100);

  return (
    <div className="min-h-screen w-full px-6 py-8 max-w-2xl mx-auto space-y-6 text-slate-800 dark:text-slate-200" dir="rtl">
      <button onClick={() => setCurrentRoute("home")} className="text-sm text-[rgb(var(--glow-color-rgb))] font-bold mb-4"> بازگشت</button>
      
      <div className="glow-card rounded-[2rem] w-full shadow-lg">
        <div className="glow-card-inner rounded-[2rem] p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[rgb(var(--glow-color-rgb))]">{displayName}</h1>
              <span className="bg-[rgba(var(--glow-color-rgb),0.1)] text-[rgb(var(--glow-color-rgb))] px-3 py-1 rounded-full text-xs font-bold mt-2 inline-block border border-[rgba(var(--glow-color-rgb),0.2)]">سطح {fNum(levelInfo?.level || 1)}</span>
            </div>
            <div className="text-center bg-[rgba(var(--glow-color-rgb),0.05)] px-4 py-2 rounded-2xl border border-[rgba(var(--glow-color-rgb),0.2)]">
              <p className="text-[10px] text-[rgb(var(--glow-color-rgb))] font-bold">XP کل</p>
              <p className="text-2xl font-black text-[rgb(var(--glow-color-rgb))]">{fNum(levelInfo?.totalXp || 0)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-[rgb(var(--glow-color-rgb))]">
              <span>{fNum(levelInfo?.xpInLevel || 0)} / {fNum(100)} XP</span>
              <span>{fNum(xpPercent)}</span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glow-card rounded-2xl profile-stat-card">
          <div className="glow-card-inner p-4 text-center flex flex-col items-center justify-center">
            <Sparkles className="w-8 h-8 mb-2 text-[rgb(var(--glow-color-rgb))]" />
            <div className="text-lg font-bold text-[rgb(var(--glow-color-rgb))]">{fNum(stats.readings)}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">فال‌ها</div>
          </div>
        </div>
        <div className="glow-card rounded-2xl profile-stat-card">
          <div className="glow-card-inner p-4 text-center flex flex-col items-center justify-center">
            <Calendar className="w-8 h-8 mb-2 text-[rgb(var(--glow-color-rgb))]" />
            <div className="text-lg font-bold text-[rgb(var(--glow-color-rgb))]">{fNum(stats.dailyDraws)}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">کارت‌ها</div>
          </div>
        </div>
        <div className="glow-card rounded-2xl profile-stat-card">
          <div className="glow-card-inner p-4 text-center flex flex-col items-center justify-center">
            <Trophy className="w-8 h-8 mb-2 text-[rgb(var(--glow-color-rgb))]" />
            <div className="text-lg font-bold text-[rgb(var(--glow-color-rgb))]">{fNum(unlocked.size)}/{fNum(ACHIEVEMENTS.length)}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">دستاورد</div>
          </div>
        </div>
      </div>

      <div className="glow-card rounded-[2rem] w-full">
        <div className="glow-card-inner rounded-[2rem] p-6">
          <h2 className="text-lg font-bold text-[rgb(var(--glow-color-rgb))] mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            دستاوردها
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((a) => {
              const has = unlocked.has(a.id);
              return (
                <div key={a.id} className={`rounded-xl p-3 border flex items-center gap-3 ${has ? "border-[rgba(var(--glow-color-rgb),0.3)] bg-[rgba(var(--glow-color-rgb),0.05)]" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-60"}`}>
                  <div className={`text-2xl ${has ? "" : "grayscale"}`}>
                    {has ? a.icon : <Lock className="w-6 h-6 text-slate-400" />}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${has ? "text-[rgb(var(--glow-color-rgb))]" : "text-slate-500 dark:text-slate-400"}`}>{a.titleFa}</p>
                    <p className={`text-[10px] ${has ? "text-[rgba(var(--glow-color-rgb),0.8)]" : "text-slate-400 dark:text-slate-500"}`}>{a.descFa}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button onClick={() => setCurrentRoute("profile_setup")} className="w-full h-14 bg-white dark:bg-slate-800 text-[rgb(var(--glow-color-rgb))] rounded-full font-bold shadow-sm border border-[rgba(var(--glow-color-rgb),0.2)]"> ویرایش اطلاعات تولد</button>
    </div>
  );
}