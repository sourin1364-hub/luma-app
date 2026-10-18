import { db } from "../db";
import { tarotCards, type TarotCard } from "./tarotData";

export async function getOrCreateDailyCard(userId: number): Promise<{ card: TarotCard; isNew: boolean }> {
  if (!tarotCards || tarotCards.length === 0) {
    throw new Error("داده‌های کارت‌های تاروت (tarotCards) خالی است!");
  }

  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  
  try {
    const existing = await db.dailyDraws.where({ userId, dateStr }).first();
    if (existing) {
      const card = tarotCards.find((c) => c.id === existing.cardId);
      if (card) return { card, isNew: false };
    }

    const seed = userId * 13 + today.getFullYear() * 17 + (today.getMonth() + 1) * 19 + today.getDate() * 23;
    const index = Math.abs(seed) % tarotCards.length;
    const card = tarotCards[index];

    if (!card) throw new Error("کارت تصادفی پیدا نشد!");

    await db.dailyDraws.add({ userId, dateStr, cardId: card.id, createdAt: Date.now() });
    return { card, isNew: true };
  } catch (e: any) {
    console.error("DB Error in getOrCreateDailyCard:", e);
    throw new Error(e.message || "خطا در ارتباط با دیتابیس");
  }
}