import { supabase } from './supabase';
import { tarotCards } from './tarotData';
import { db } from '../db';

export async function getOrCreateDailyCard(userId: string | number) {
  if (typeof userId !== 'string') throw new Error("User must be logged in");
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  let localDraw = await db.dailyDraws.where('[userId+dateStr]').equals([userId, dateStr]).first();

  if (navigator.onLine) {
    const { data: existing } = await supabase.from('daily_draws').select('*').eq('user_id', userId).eq('date_str', dateStr).maybeSingle();
    if (existing) {
      const card = tarotCards.find(c => c.id === existing.card_id);
      if (card) return { card, isNew: false };
    }
  } else if (localDraw) {
    const card = tarotCards.find(c => c.id === localDraw!.cardId);
    if (card) return { card, isNew: false };
  }

  const randomIndex = Math.floor(Math.random() * tarotCards.length);
  const newCard = tarotCards[randomIndex];
  const uuid = crypto.randomUUID();

  await db.dailyDraws.add({ uuid, userId, dateStr, cardId: newCard.id, createdAt: Date.now(), synced: false });

  if (navigator.onLine) {
     try { await supabase.from('daily_draws').insert({ id: uuid, user_id: userId, date_str: dateStr, card_id: newCard.id, created_at: new Date().toISOString() }); } catch(e) {}
  }
  return { card: newCard, isNew: true };
}