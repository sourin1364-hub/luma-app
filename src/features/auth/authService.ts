import { supabase } from "../../lib/supabase";
import { db, type User } from "../../db";
import { useAuthStore } from "../../store/useAuthStore";

// ─── Backward-compatible exports ───
export { createGuestUser as loginAsGuest };

export enum AuthErrorCode {
  EMPTY_FIELDS = "EMPTY_FIELDS",
  USERNAME_TOO_SHORT = "USERNAME_TOO_SHORT",
  PASSWORD_TOO_SHORT = "PASSWORD_TOO_SHORT",
  USER_LIMIT = "USER_LIMIT",
  USERNAME_TAKEN = "USERNAME_TAKEN",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  INVALID_USERNAME_FORMAT = "INVALID_USERNAME_FORMAT",
  EMAIL_NOT_CONFIRMED = "EMAIL_NOT_CONFIRMED",
  NETWORK_ERROR = "NETWORK_ERROR",
}
// ────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// اجازه نام کاربری فارسی، لاتین، اعداد، زیرخط و فاصله
function isValidUsername(username: string): boolean {
  return /^[\u0600-\u06FFa-zA-Z0-9_\s]{2,30}$/.test(username.trim());
}

function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

// ─── registerUser با backward compatibility ───
// ۲ آرگومان: registerUser(username, password) → email = username@luma.guest
// ۳ آرگومان: registerUser(username, email, password)
export async function registerUser(
  usernameOrEmail: string,
  passwordOrEmail: string,
  password?: string
): Promise<{ user: User | null; success: boolean; error?: AuthErrorCode; errorMessage?: string }> {
  let username: string;
  let email: string;
  let pass: string;

  if (password === undefined) {
    // ۲ آرگومان (قدیمی): registerUser(username, password)
    username = usernameOrEmail;
    email = `${usernameOrEmail}@luma.guest`;
    pass = passwordOrEmail;
  } else {
    // ۳ آرگومان (جدید): registerUser(username, email, password)
    username = usernameOrEmail;
    email = passwordOrEmail;
    pass = password;
  }

  if (!username.trim() || !pass.trim() || (password !== undefined && !email.trim())) {
    return {
      user: null,
      success: false,
      error: AuthErrorCode.EMPTY_FIELDS,
      errorMessage: "لطفاً همه فیلدها را پر کنید",
    };
  }

  if (!isValidUsername(username)) {
    return {
      user: null,
      success: false,
      error: AuthErrorCode.INVALID_USERNAME_FORMAT,
      errorMessage: "نام کاربری باید ۲ تا ۳۰ کاراکتر باشد و فقط شامل حروف فارسی/لاتین، اعداد و زیرخط.",
    };
  }

  if (password !== undefined && !isValidEmail(email)) {
    return {
      user: null,
      success: false,
      error: AuthErrorCode.INVALID_USERNAME_FORMAT,
      errorMessage: "لطفاً یک ایمیل معتبر وارد کنید.",
    };
  }

  if (!isValidPassword(pass)) {
    return {
      user: null,
      success: false,
      error: AuthErrorCode.PASSWORD_TOO_SHORT,
      errorMessage: "رمز عبور باید حداقل ۶ کاراکتر باشد.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: { username: username.trim() },
    },
  });

  if (error) {
    const code = error.message.includes("confirmed")
      ? AuthErrorCode.EMAIL_NOT_CONFIRMED
      : AuthErrorCode.UNKNOWN_ERROR;
    return {
      user: null,
      success: false,
      error: code,
      errorMessage: error.message,
    };
  }

  if (!data.user) {
    return {
      user: null,
      success: false,
      error: AuthErrorCode.UNKNOWN_ERROR,
      errorMessage: "ثبت‌نام انجام نشد.",
    };
  }

  const user: User = {
    id: data.user.id,
    username: username.trim(),
    isGuest: false,
    createdAt: Date.now(),
  };

  useAuthStore.getState().setCurrentUser(user);

  await supabase.from("profiles").upsert({
    id: data.user.id,
    username: username.trim(),
    display_name: username.trim(),
  });

  return { user, success: true };
}

// ─── loginUser با backward compatibility ───
// اگر username شامل @ باشد، به عنوان email استفاده می‌شود
export async function loginUser(
  usernameOrEmail: string,
  password: string
): Promise<{ user: User | null; success: boolean; error?: AuthErrorCode; errorMessage?: string }> {
  if (!usernameOrEmail.trim() || !password.trim()) {
    return {
      user: null,
      success: false,
      error: AuthErrorCode.EMPTY_FIELDS,
      errorMessage: "لطفاً همه فیلدها را پر کنید",
    };
  }

  const email = usernameOrEmail.includes("@")
    ? usernameOrEmail
    : `${usernameOrEmail}@luma.guest`;

  if (!isValidPassword(password)) {
    return {
      user: null,
      success: false,
      error: AuthErrorCode.PASSWORD_TOO_SHORT,
      errorMessage: "رمز عبور باید حداقل ۶ کاراکتر باشد.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const code = error.message.includes("Invalid login")
      ? AuthErrorCode.INVALID_CREDENTIALS
      : AuthErrorCode.UNKNOWN_ERROR;
    return {
      user: null,
      success: false,
      error: code,
      errorMessage: error.message,
    };
  }

  if (!data.user) {
    return {
      user: null,
      success: false,
      error: AuthErrorCode.UNKNOWN_ERROR,
      errorMessage: "ورود ناموفق بود.",
    };
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("id", data.user.id)
    .limit(1);

  const profile = profileData?.[0];

  const { data: birthDataRecords } = await supabase
    .from("birth_profiles")
    .select("*")
    .eq("user_id", data.user.id)
    .limit(1);

  const birthDataRecord = birthDataRecords?.[0];

  const user: User = {
    id: data.user.id,
    username: profile?.display_name || profile?.username || (data.user.user_metadata?.username as string) || data.user.email?.split("@")[0] || "User",
    isGuest: false,
    createdAt: new Date(data.user.created_at).getTime(),
    birthData: birthDataRecord
      ? {
          year: birthDataRecord.year,
          month: birthDataRecord.month,
          day: birthDataRecord.day,
          motherName: birthDataRecord.mother_name,
          birthTime: birthDataRecord.birth_time,
          birthPlace: birthDataRecord.birth_place,
        }
      : undefined,
  };

  useAuthStore.getState().setCurrentUser(user);
  return { user, success: true };
}

export async function updateUserBirthData(
  userId: string | number,
  birthData: {
    year: number;
    month: number;
    day: number;
    motherName: string;
    birthTime: string;
    birthPlace: string;
  }
): Promise<{ error?: string }> {
  if (typeof userId === "string") {
    const { error } = await supabase.from("birth_profiles").upsert({
      user_id: userId,
      year: birthData.year,
      month: birthData.month,
      day: birthData.day,
      mother_name: birthData.motherName,
      birth_time: birthData.birthTime,
      birth_place: birthData.birthPlace,
    });

    if (error) {
      console.error("Error saving birth data:", error);
      return { error: error.message };
    }
  } else {
    await db.users.update(userId, { birthData });
  }

  return {};
}

export async function createGuestUser(): Promise<{ user: User | null; success: boolean; error?: AuthErrorCode; errorMessage?: string }> {
  const guestId = Date.now();
  const user: User = {
    id: guestId,
    username: `مهمان ${guestId.toString().slice(-4)}`,
    isGuest: true,
    createdAt: Date.now(),
  };

  await db.users.add(user);
  useAuthStore.getState().setCurrentUser(user);
  return { user, success: true };
}
