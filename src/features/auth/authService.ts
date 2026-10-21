import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/useAuthStore";
import { db, type User, type BirthData } from "../../db";

export const GUEST_USERNAME = "guest";
export const MIN_PASSWORD_LENGTH = 8;
export const MIN_USERNAME_LENGTH = 3;

export type AuthErrorCode =
  | "EMPTY_FIELDS"
  | "USERNAME_TOO_SHORT"
  | "PASSWORD_TOO_SHORT"
  | "USER_LIMIT"
  | "USERNAME_TAKEN"
  | "INVALID_CREDENTIALS"
  | "UNKNOWN_ERROR"
  | "INVALID_USERNAME_FORMAT";

export interface AuthResult {
  success: boolean;
  error?: AuthErrorCode;
  errorMessage?: string;
  user?: User;
}

// تابع اختصاصی برای انتقال داده‌های مهمان به حساب اصلی
async function migrateGuestData(guestId: string | number, newUserId: string) {
  try {
    console.log("[Migration] Starting guest data migration...");

    // 1. انتقال XP
    const guestProgress = await db.progress.get(guestId);
    if (guestProgress && guestProgress.xp > 0) {
      const eventId = crypto.randomUUID();
      const { error } = await supabase.rpc('add_xp', {
        p_event_id: eventId,
        p_amount: guestProgress.xp,
        p_source: 'guest_migration'
      });
      if (!error) {
        await db.progress.delete(guestId);
        await db.progress.put({ userId: newUserId, xp: guestProgress.xp, level: guestProgress.level });
      } else {
        console.error("[Migration] Failed to migrate XP:", error);
      }
    }

    // 2. انتقال تاریخچه فال‌ها (Readings)
    const guestReadings = await db.readings.where('userId').equals(guestId).toArray();
    for (const r of guestReadings) {
      const { error } = await supabase.from('tarot_readings').insert({
        id: r.uuid,
        user_id: newUserId,
        type: r.type,
        cards: r.cards,
        interpretation: r.interpretation,
        created_at: new Date(r.createdAt).toISOString()
      });
      // چه خطا بدهد چه نه، رکورد محلی را به کاربر جدید منتقل می‌کنیم تا دوباره ارسال نشود
      await db.readings.update(r.id!, { userId: newUserId, synced: !error });
    }

    // 3. انتقال اطلاعات تولد
    const guestUser = await db.users.get(guestId as number);
    if (guestUser?.birthData) {
      await supabase.from('birth_profiles').delete().eq('user_id', newUserId);
      await supabase.from('birth_profiles').insert({
        user_id: newUserId,
        year: guestUser.birthData.year,
        month: guestUser.birthData.month,
        day: guestUser.birthData.day,
        mother_name: guestUser.birthData.motherName
      });
    }

    // 4. پاکسازی کاربر مهمان از Dexie
    await db.users.delete(guestId as number);
    console.log("[Migration] Guest data migrated successfully.");
  } catch (err) {
    console.error("[Migration] Error during guest migration:", err);
  }
}

export async function registerUser(username: string, password: string): Promise<AuthResult> {
  const trimmed = username.trim();
  if (!trimmed || !password) return { success: false, error: "EMPTY_FIELDS" };
  if (trimmed.length < MIN_USERNAME_LENGTH) return { success: false, error: "USERNAME_TOO_SHORT" };
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return { success: false, error: "INVALID_USERNAME_FORMAT" };
  if (password.length < MIN_PASSWORD_LENGTH) return { success: false, error: "PASSWORD_TOO_SHORT" };

  const email = `${trimmed}@gmail.com`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: trimmed } }
  });

  if (error) {
    console.error("Supabase signUp error:", error);
    if (error.message.includes("already registered") || error.message.includes("already exists") || error.message.includes("User already registered")) {
      return { success: false, error: "USERNAME_TAKEN" };
    }
    return { success: false, error: "UNKNOWN_ERROR", errorMessage: error.message };
  }

  if (!data.user) return { success: false, error: "INVALID_CREDENTIALS" };

  const user: User = {
    id: data.user.id,
    username: trimmed,
    isGuest: false,
    createdAt: new Date(data.user.created_at).getTime(),
  };

  // بررسی و انتقال داده‌های مهمان بعد از ثبت‌نام موفق
  const previousUser = useAuthStore.getState().currentUser;
  if (previousUser && previousUser.isGuest && previousUser.id) {
    await migrateGuestData(previousUser.id, data.user.id);
  }

  return { success: true, user };
}

export async function loginUser(username: string, password: string): Promise<AuthResult> {
  const trimmed = username.trim();
  if (!trimmed || !password) return { success: false, error: "EMPTY_FIELDS" };
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return { success: false, error: "INVALID_USERNAME_FORMAT" };

  const email = `${trimmed}@gmail.com`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase login error:", error);
    return { success: false, error: "INVALID_CREDENTIALS", errorMessage: error.message };
  }

  if (!data.user) return { success: false, error: "INVALID_CREDENTIALS" };

  const user: User = {
    id: data.user.id,
    username: data.user.user_metadata.username || trimmed,
    isGuest: false,
    createdAt: new Date(data.user.created_at).getTime(),
  };

  // بررسی و انتقال داده‌های مهمان بعد از لاگین موفق
  const previousUser = useAuthStore.getState().currentUser;
  if (previousUser && previousUser.isGuest && previousUser.id) {
    await migrateGuestData(previousUser.id, data.user.id);
  }

  return { success: true, user };
}

export async function loginAsGuest(): Promise<AuthResult> {
  const existing = await db.users.where("username").equals(GUEST_USERNAME).first();
  if (existing) return { success: true, user: existing };

  const id = await db.users.add({
    username: GUEST_USERNAME,
    isGuest: true,
    createdAt: Date.now(),
  });
  const user = await db.users.get(id);
  return { success: true, user };
}

export async function updateUserBirthData(userId: string | number, birthData: BirthData): Promise<void> {
  if (typeof userId === 'string') {
    await supabase.from('birth_profiles').delete().eq('user_id', userId);

    const { error } = await supabase.from('birth_profiles').insert({
      user_id: userId,
      year: birthData.year,
      month: birthData.month,
      day: birthData.day,
      mother_name: birthData.motherName
    });
    if (error) throw new Error(`Birth Profile Error: ${error.message}`);
  } else {
    await db.users.update(userId, { birthData });
  }

  const currentUser = useAuthStore.getState().currentUser;
  if (currentUser && currentUser.id === userId) {
    useAuthStore.getState().setCurrentUser({ ...currentUser, birthData });
  }
}