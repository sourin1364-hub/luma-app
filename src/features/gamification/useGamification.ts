import { useEffect } from "react";
import { create } from "zustand";
import { db } from "../../db";
import { useAuthStore } from "../../store/useAuthStore";

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
  init: (userId: number) => Promise<void>;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  levelInfo: ZERO,
  loading: false,
  init: async (userId) => {
    set({ loading: true });
    try {
      const p = await db.progress.get(userId);
      if (p) {
        const level = Number(p.level) || 1;
        const totalXp = Number(p.xp) || 0;
        const xpForNext = 100 + (level - 1) * 20;
        set({ levelInfo: { level, totalXp, xpInLevel: totalXp % xpForNext, xpForNext, progress: (totalXp % xpForNext) / xpForNext }, loading: false });
      } else {
        set({ levelInfo: ZERO, loading: false });
      }
    } catch { set({ levelInfo: ZERO, loading: false }); }
  },
  addXp: async (amount) => {
    const { levelInfo } = get();
    const user = useAuthStore.getState().currentUser;
    if (!user?.id) return;
    const newXp = (levelInfo.totalXp || 0) + amount;
    const level = Math.floor(newXp / 100) + 1;
    set({ levelInfo: { level, totalXp: newXp, xpInLevel: newXp % 100, xpForNext: 100, progress: (newXp % 100) / 100 } });
    try {
      const existing = await db.progress.get(user.id);
      if (existing) await db.progress.update(user.id, { xp: newXp, level });
      else await db.progress.add({ userId: user.id, xp: newXp, level });
    } catch (e) { console.error(e); }
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