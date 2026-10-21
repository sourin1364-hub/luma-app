import { supabase } from "./supabase";

export async function syncXpQueue() {
  if (!navigator.onLine) return;
  
  const queueStr = localStorage.getItem('luma_xp_queue');
  if (!queueStr) return;
  
  const queue = JSON.parse(queueStr);
  if (queue.length === 0) return;

  console.log(`[XP Sync] Syncing ${queue.length} pending XP events...`);
  const remaining = [];

  for (const item of queue) {
    try {
      // استفاده از تابع RPC که در دیتابیس ساختیم
      const { error } = await supabase.rpc('add_xp', {
        p_event_id: item.id,
        p_amount: item.amount,
        p_source: item.source
      });
      if (error) {
        console.error("[XP Sync] Error syncing event:", error);
        remaining.push(item);
      }
    } catch (e) {
      console.error("[XP Sync] Network error:", e);
      remaining.push(item);
    }
  }

  localStorage.setItem('luma_xp_queue', JSON.stringify(remaining));
  console.log(`[XP Sync] Sync completed. Remaining in queue: ${remaining.length}`);
}

export function queueXpEvent(id: string, amount: number, source: string) {
  const queueStr = localStorage.getItem('luma_xp_queue') || '[]';
  const queue = JSON.parse(queueStr);
  queue.push({ id, amount, source });
  localStorage.setItem('luma_xp_queue', JSON.stringify(queue));
  syncXpQueue(); // تلاش برای ارسال فوری
}