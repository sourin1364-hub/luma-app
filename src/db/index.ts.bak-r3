import Dexie, { type Table } from "dexie";

export interface BirthData { year: number; month: number; day: number; motherName: string; }
export interface User { id?: number; username: string; passwordHash?: string; isGuest: boolean; createdAt: number; birthData?: BirthData; }
export interface Reading { id?: number; userId: number; type: string; cards: number[]; interpretation: string; createdAt: number; }
export interface DailyDraw { id?: number; userId: number; dateStr: string; cardId: number; createdAt: number; }
export interface Progress { userId: number; level: number; xp: number; }

export class LumaDB extends Dexie {
  users!: Table<User>;
  readings!: Table<Reading>;
  dailyDraws!: Table<DailyDraw>;
  progress!: Table<Progress>;

  constructor() {
    super("LumaDatabase");
    this.version(12).stores({
      users: "++id, username, isGuest",
      readings: "++id, userId, type, createdAt",
      dailyDraws: "++id, userId, dateStr, [userId+dateStr]",
      progress: "userId",
    });
  }
}
export const db = new LumaDB();