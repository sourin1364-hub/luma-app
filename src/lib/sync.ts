import { db } from "../db";
import { supabase } from "./supabase";
import { syncXpQueue } from "./xpSync";

export async function saveReadingOfflineFirst(userId: string | number, type: string, cards: number[], interpretation: string) {
  const uuid = crypto.randomUUID();
  const createdAt = Date.now();

  const localId = await db.readings.add({
    uuid, userId, type, cards, interpretation, createdAt, synced: false
  });

  // فقط اگر کاربر آیدی رشته‌ای (UUID) داشته باشد به Supabase می‌فرستیم
  if (typeof userId === 'string' && userId.includes('-') && navigator.onLine) {
    try {
      const { error } = await supabase.from('tarot_readings').insert({
        id: uuid, user_id: userId, type, cards, interpretation, created_at: new Date(createdAt).toISOString()
      });
      if (!error) {
        await db.readings.update(localId, { synced: true });
      } else {
        console.error("Save error:", error);
      }
    } catch (e) {
      console.log("Offline: Reading saved locally, will sync later.");
    }
  }
}

export async function getReadingsOfflineFirst(userId: string | number) {
  // فقط اگر کاربر آیدی رشته‌ای داشت و آنلاین بود، از Supabase می‌خوانیم
  if (typeof userId === 'string' && userId.includes('-') && navigator.onLine) {
    try {
      const { data, error } = await supabase.from('tarot_readings').select('*').eq('user_id', userId).order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error);
        throw error;
      }

      if (data) {
        await db.readings.where('userId').equals(userId).delete();
        for (const r of data) {
           await db.readings.add({ uuid: r.id, userId: r.user_id, type: r.type, cards: r.cards, interpretation: r.interpretation, createdAt: new Date(r.created_at).getTime(), synced: true });
        }
        return data.map((r: any) => ({ id: r.id, userId: r.user_id, type: r.type, cards: r.cards, interpretation: r.interpretation, createdAt: new Date(r.created_at).getTime() }));
      }
    } catch (e) {
      console.warn("Network error, falling back to offline.");
    }
  }
  
  // فالبک به دیتابیس محلی (برای مهمان‌ها یا حالت آفلاین)
  const localData = await db.readings.where('userId').equals(userId).toArray();
  return localData.sort((a, b) => b.createdAt - a.createdAt).map(r => ({ id: r.uuid, userId: r.userId, type: r.type, cards: r.cards, interpretation: r.interpretation, createdAt: r.createdAt }));
}

window.addEventListener('online', async () => {
   console.log("Back online! Syncing pending readings...");
   const pending = await db.readings.filter(r => !r.synced).toArray();
   for (const r of pending) {
       // فقط برای رکوردهایی که آیدی رشته‌ای (کاربر ابری) دارند
       if (typeof r.userId === 'string' && r.userId.includes('-') && r.userId.includes('-')) {
           const { error } = await supabase.from('tarot_readings').insert({
               id: r.uuid, user_id: r.userId, type: r.type, cards: r.cards, interpretation: r.interpretation, created_at: new Date(r.createdAt).toISOString()
           });
           if (!error) await db.readings.update(r.id!, { synced: true });
       }
   }
   
   await syncXpQueue();
});