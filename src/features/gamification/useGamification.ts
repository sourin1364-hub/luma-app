import { useEffect } from "react";
import { create } from "zustand";
import { db } from "../../db";
import { useAuthStore } from "../../store/useAuthStore";
import { supabase } from "../../lib/supabase";
import { queueXpEvent } from "../../lib/xpSync";

export interface LevelInfo {
  level: number;
  xpInLevel: number;
  xpForNext: number;
  progress: number;
  totalXp: number;
}

const ZERO: LevelInfo = { level: 1, xpInLevel: 0, xpForNext: 100, progress: 0, totalXp: 0 };

interface GamificationState {
  levelInfo: LevelInfo;
  loading: boolean;
  addXp: (amount: number) => Promise<void>;
  init: (userId: string | number) => Promise<void>;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  levelInfo: ZERO,
  loading: false,
  init: async (userId) => {
    set({ loading: true });
    
    // 1. تلاش برای خواندن از ابر (اولویت با دیتابیس آنلاین)
    if (navigator.onLine && typeof userId === 'string') {
      try {
        const { data, error } = await supabase.from('user_stats').select('xp, level').eq('user_id', userId).single();
        if (data && !error) {
          const totalXp = data.xp;
          const level = data.level;
          const xpForNext = 100 + (level - 1) * 20;
          const xpInLevel = totalXp % xpForNext;
          set({ levelInfo: { level, totalXp, xpInLevel, xpForNext, progress: xpInLevel / xpForNext }, loading: false });
          // آپدیت Dexie برای استفاده در زمان آفلاین
          await db.progress.put({ userId, xp: totalXp, level });
          return;
        }
      } catch (e) {
        console.warn("Cloud stats unavailable, using local fallback.");
      }
    }

    // 2. فالبک به Dexie (در صورت آفلاین بودن)
    try {
      const p = await db.progress.get(userId);
      if (p) {
        const level = Number(p.level) || 1;
        const totalXp = Number(p.xp) || 0;
        const xpForNext = 100 + (level - 1) * 20;
        const xpInLevel = totalXp % xpForNext;
        set({ levelInfo: { level, totalXp, xpInLevel, xpForNext, progress: xpInLevel / xpForNext }, loading: false });
      } else {
        set({ levelInfo: ZERO, loading: false });
      }
    } catch {
      set({ levelInfo: ZERO, loading: false });
    }
  },
  addXp: async (amount) => {
    const { levelInfo } = get();
    const user = useAuthStore.getState().currentUser;
    if (!user?.id) return;

    const newXp = (levelInfo.totalXp || 0) + amount;
    const level = Math.floor(newXp / 100) + 1;
    
    // 1. آپدیت آنی رابط کاربری (Optimistic UI)
    set({ levelInfo: { level, totalXp: newXp, xpInLevel: newXp % 100, xpForNext: 100, progress: (newXp % 100) / 100 } });

    // 2. ذخیره در Dexie برای حالت آفلاین
    try {
      const existing = await db.progress.get(user.id);
      if (existing) await db.progress.update(user.id, { xp: newXp, level });
      else await db.progress.add({ userId: user.id, xp: newXp, level });
    } catch (e) { console.error("Dexie save error:", e); }

    // 3. اضافه کردن به صف برای ارسال به Supabase
    if (typeof user.id === 'string') {
      const eventId = crypto.randomUUID();
      queueXpEvent(eventId, amount, 'app_action');
    }
  }
}));

export function useGamification() {
  const userId = useAuthStore((s) => s.currentUser?.id ?? null);
  const init = useGamificationStore((s) => s.init);
  const levelInfo = useGamificationStore((s) => s.levelInfo);
  const loading = useGamificationStore((s) => s.loading);
  const addXp = useGamificationStore((s) => s.addXp);

  useEffect(() => {
    if (userId) init(userId);
  }, [userId, init]);

  return { levelInfo: levelInfo || ZERO, addXp, loading };
}