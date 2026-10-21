import { db } from "../db";
import { tarotCards } from "./tarotData";

export async function getOrCreateDailyCard(userId: string | number) {
  // دریافت تاریخ امروز به فرمت YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // 1. بررسی اینکه آیا کاربر امروز کارتی گرفته است یا خیر
  // استفاده از ایندکس ترکیبی [userId+dateStr] که در db/index.ts تعریف شده است
  const existing = await db.dailyDraws
    .where("[userId+dateStr]")
    .equals([userId, today])
    .first();

  if (existing) {
    const card = tarotCards.find(c => c.id === existing.cardId);
    if (card) {
      return { card, isNew: false };
    }
  }

  // 2. اگر کارتی وجود نداشت، یک کارت تصادفی جدید انتخاب و ذخیره می‌کنیم
  const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
  const uuid = crypto.randomUUID();

  await db.dailyDraws.add({
    uuid,
    userId,
    dateStr: today,
    cardId: randomCard.id,
    createdAt: Date.now(),
    synced: false
  });

  return { card: randomCard, isNew: true };
}