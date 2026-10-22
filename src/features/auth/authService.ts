import { supabase } from "../../lib/supabase";
import { db, type User } from "../../db";
import { useAuthStore } from "../../store/useAuthStore";

// تابع کمکی برای بررسی صحت ایمیل
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// تابع کمکی برای بررسی صحت نام کاربری (فارسی، لاتین، اعداد و فاصله مجاز)
function isValidUsername(username: string): boolean {
  // اجازه کاراکترهای فارسی (\u0600-\u06FF)، لاتین، اعداد، زیرخط و فاصله
  return /^[\u0600-\u06FFa-zA-Z0-9_\s]{2,30}$/.test(username.trim());
}

// تابع کمکی برای بررسی صحت رمز عبور
function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<{ user: User | null; error?: string }> {
  if (!isValidUsername(username)) {
    return {
      user: null,
      error: "نام کاربری باید ۲ تا ۳۰ کاراکتر باشد و فقط شامل حروف فارسی/لاتین، اعداد و زیرخط."
    };
  }
  if (!isValidEmail(email)) {
    return { user: null, error: "لطفاً یک ایمیل معتبر وارد کنید." };
  }
  if (!isValidPassword(password)) {
    return { user: null, error: "رمز عبور باید حداقل ۶ کاراکتر باشد." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username.trim() },
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }

  if (!data.user) {
    return { user: null, error: "ثبت‌نام انجام نشد." };
  }

  const user: User = {
    id: data.user.id,
    username: username.trim(),
    isGuest: false,
    createdAt: Date.now(),
  };

  useAuthStore.getState().setCurrentUser(user);

  // ذخیره نام کاربری فارسی در profiles
  await supabase.from("profiles").upsert({
    id: data.user.id,
    username: username.trim(),
    display_name: username.trim(),
  });

  return { user };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User | null; error?: string }> {
  if (!isValidEmail(email)) {
    return { user: null, error: "لطفاً یک ایمیل معتبر وارد کنید." };
  }
  if (!isValidPassword(password)) {
    return { user: null, error: "رمز عبور باید حداقل ۶ کاراکتر باشد." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  if (!data.user) {
    return { user: null, error: "ورود ناموفق بود." };
  }

  // دریافت اطلاعات پروفایل از Supabase
  const { data: profileData } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("id", data.user.id)
    .limit(1);

  const profile = profileData?.[0];

  // دریافت اطلاعات تولد از Supabase
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
  return { user };
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
    // Guest user: save to Dexie
    await db.users.update(userId, { birthData });
  }

  return {};
}

export async function createGuestUser(): Promise<User> {
  const guestId = Date.now();
  const user: User = {
    id: guestId,
    username: `مهمان ${guestId.toString().slice(-4)}`,
    isGuest: true,
    createdAt: Date.now(),
  };

  await db.users.add(user);
  useAuthStore.getState().setCurrentUser(user);
  return user;
}
