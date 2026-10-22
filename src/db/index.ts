import Dexie, { type Table } from "dexie";

export interface BirthData {
  year: number;
  month: number;
  day: number;
  motherName: string;
  birthTime?: string;
  birthPlace?: string;
}

export interface User {
  id: string;
  username: string;
  isGuest: boolean;
  createdAt: number;
  birthData?: BirthData;
}

export interface Reading {
  id?: number;
  uuid: string;
  userId: string;
  type: string;
  cards: number[];
  interpretation: string;
  createdAt: number;
  synced: boolean;
}

export interface DailyDraw {
  id?: number;
  uuid: string;
  userId: string;
  dateStr: string;
  cardId: number;
  createdAt: number;
  synced: boolean;
}

export interface Progress {
  userId: string;
  level: number;
  xp: number;
}

export class LumaDB extends Dexie {
  users!: Table<User, number>;
  readings!: Table<Reading, number>;
  dailyDraws!: Table<DailyDraw, number>;
  progress!: Table<Progress, string>;

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
