import Dexie, { type Table } from "dexie";

export interface BirthData { year: number; month: number; day: number; motherName: string; birthTime?: string; birthPlace?: string; }
export interface User { id?: string | number; username: string; passwordHash?: string; passwordSalt?: string; hashVersion?: number; isGuest: boolean; createdAt: number; birthData?: BirthData; }
export interface Reading { id?: number; uuid: string; userId: string | number; type: string; cards: number[]; interpretation: string; createdAt: number; synced: boolean; }
export interface DailyDraw { id?: number; uuid: string; userId: string | number; dateStr: string; cardId: number; createdAt: number; synced: boolean; }
export interface Progress { userId: string | number; level: number; xp: number; }

export class LumaDB extends Dexie {
  users!: Table<User>;
  readings!: Table<Reading>;
  dailyDraws!: Table<DailyDraw>;
  progress!: Table<Progress>;

  constructor() {
    super("LumaDatabase");
    this.version(13).stores({
      users: "++id, username, isGuest",
      readings: "++id, uuid, userId, type, createdAt, synced",
      dailyDraws: "++id, uuid, userId, dateStr, [userId+dateStr], synced",
      progress: "userId",
    });
  }
}
export const db = new LumaDB();