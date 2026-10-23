import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/useAuthStore";
import { db, type User, type BirthData } from "../../db";

export const GUEST_USERNAME = "guest";
export const MIN_PASSWORD_LENGTH = 8;
export const MIN_USERNAME_LENGTH = 2;

export type AuthErrorCode =
  | "EMPTY_FIELDS"
  | "USERNAME_TOO_SHORT"
  | "PASSWORD_TOO_SHORT"
  | "USER_LIMIT"
  | "USERNAME_TAKEN"
  | "INVALID_CREDENTIALS"
  | "UNKNOWN_ERROR"
  | "INVALID_USERNAME_FORMAT"
  | "EMAIL_NOT_CONFIRMED"
  | "NETWORK_ERROR";

export interface AuthResult {
  success: boolean;
  error?: AuthErrorCode;
  errorMessage?: string;
  user?: User;
}

function isValidUsername(username: string): boolean {
  // Allow Persian (\u0600-\u06FF), Latin letters, numbers, underscore, space
  return /^[\u0600-\u06FFa-zA-Z0-9_\s]{2,30}$/.test(username.trim());
}

async function migrateGuestData(guestId: string | number, newUserId: string) {
  try {
    console.log("[Migration] Starting guest data migration...");

    const guestProgress = await db.progress.get(guestId);
    if (guestProgress && guestProgress.xp > 0) {
      const eventId = crypto.randomUUID();
      const { error } = await supabase.rpc("add_xp", {
        p_event_id: eventId,
        p_amount: guestProgress.xp,
        p_source: "guest_migration",
      });
      if (!error) {
        await db.progress.delete(guestId);
        await db.progress.put({ userId: newUserId, xp: guestProgress.xp, level: guestProgress.level });
      } else {
        console.error("[Migration] Failed to migrate XP:", error);
      }
    }

    const guestReadings = await db.readings.where("userId").equals(guestId).toArray();
    for (const r of guestReadings) {
      const { error } = await supabase.from("tarot_readings").insert({
        id: r.uuid,
        user_id: newUserId,
        type: r.type,
        cards: r.cards,
        interpretation: r.interpretation,
        created_at: new Date(r.createdAt).toISOString(),
      });
      await db.readings.update(r.id!, { userId: newUserId, synced: !error });
    }

    const guestUser = await db.users.get(guestId as number);
    if (guestUser?.birthData) {
      await supabase.from("birth_profiles").delete().eq("user_id", newUserId);
      await supabase.from("birth_profiles").insert({
        user_id: newUserId,
        year: guestUser.birthData.year,
        month: guestUser.birthData.month,
        day: guestUser.birthData.day,
        mother_name: guestUser.birthData.motherName,
        birth_time: guestUser.birthData.birthTime,
        birth_place: guestUser.birthData.birthPlace,
      });
    }

    await db.users.delete(guestId as number);
    console.log("[Migration] Guest data migrated successfully.");
  } catch (err) {
    console.error("[Migration] Error during guest migration:", err);
  }
}

export async function registerUser(
  username: string,
  password: string,
  email?: string
): Promise<AuthResult> {
  const trimmed = username.trim();
  if (!trimmed || !password) return { success: false, error: "EMPTY_FIELDS" };
  if (trimmed.length < MIN_USERNAME_LENGTH) return { success: false, error: "USERNAME_TOO_SHORT" };
  if (!isValidUsername(trimmed)) return { success: false, error: "INVALID_USERNAME_FORMAT" };
  if (password.length < MIN_PASSWORD_LENGTH) return { success: false, error: "PASSWORD_TOO_SHORT" };

  // Use provided email if valid, otherwise generate from username
  const finalEmail = email && email.includes("@") ? email.trim() : `${trimmed}@gmail.com`;

  const { data, error } = await supabase.auth.signUp({
    email: finalEmail,
    password,
    options: { data: { username: trimmed } },
  });

  if (error) {
    console.error("Supabase signUp error:", error);
    if (
      error.message.includes("already registered") ||
      error.message.includes("already exists") ||
      error.message.includes("User already registered")
    ) {
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

  const previousUser = useAuthStore.getState().currentUser;
  if (previousUser && previousUser.isGuest && previousUser.id) {
    await migrateGuestData(previousUser.id, data.user.id);
  }

  return { success: true, user };
}

export async function loginUser(
  usernameOrEmail: string,
  password: string
): Promise<AuthResult> {
  const trimmed = usernameOrEmail.trim();
  if (!trimmed || !password) return { success: false, error: "EMPTY_FIELDS" };

  // If it looks like an email, use it directly; otherwise append @gmail.com
  const email = trimmed.includes("@") ? trimmed : `${trimmed}@gmail.com`;

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
    username: data.user.user_metadata?.username || trimmed.split("@")[0] || "User",
    isGuest: false,
    createdAt: new Date(data.user.created_at).getTime(),
  };

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
  return { success: true, user: user! };
}

export async function updateUserBirthData(
  userId: string | number,
  birthData: BirthData
): Promise<void> {
  if (typeof userId === "string") {
    await supabase.from("birth_profiles").delete().eq("user_id", userId);

    const { error } = await supabase.from("birth_profiles").insert({
      user_id: userId,
      year: birthData.year,
      month: birthData.month,
      day: birthData.day,
      mother_name: birthData.motherName,
      birth_time: birthData.birthTime,
      birth_place: birthData.birthPlace,
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
