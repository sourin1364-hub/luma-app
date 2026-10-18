import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fa: {
    translation: {
      welcome: "خوش آمدید",
      subtitle: "به دنیای درون خود خوش آمدید",
      login: "ورود",
      register: "ثبت‌نام",
      guest: "ورود به عنوان مهمان",
      username: "نام کاربری",
      password: "رمز عبور",
      welcome_user: "خوش آمدی، {{name}}",
      welcome_guest: "خوش آمدی، مهمان",
      logout: "خروج از حساب",
      
      tab_tarot: "تاروت",
      tab_chart: "چارت",
      tab_profile: "پروفایل",
      tab_settings: "تنظیمات",
      
      profile_setup: "اطلاعات تولد شما",
      birth_year: "سال",
      birth_month: "ماه",
      birth_day: "روز",
      mother_name: "نام مادر (برای ابجد)",
      save_profile: "ذخیره و ادامه",
      
      your_chart: "چارت تولد شما",
      element: "عنصر",
      zodiac: "برج",
      chinese_zodiac: "زودیاک چینی",
      life_path: "عدد زندگی",
      lucky_number: "عدد شانس",
      wealth_number: "عدد ثروت",
      abjad: "ابجد کبیر",
      
      elements: {
        water: "آب",
        fire: "آتش",
        earth: "خاک",
        air: "باد"
      },
      zodiacs: {
        aries: "حمل",
        taurus: "ثور",
        gemini: "جوزا",
        cancer: "سرطان",
        leo: "اسد",
        virgo: "سنبله",
        libra: "میزان",
        scorpio: "عقرب",
        sagittarius: "قوس",
        capricorn: "جدی",
        aquarius: "دلو",
        pisces: "حوت"
      },
      chinese: {
        rat: "موش",
        ox: "گاو",
        tiger: "ببر",
        rabbit: "خرگوش",
        dragon: "اژدها",
        snake: "مار",
        horse: "اسب",
        goat: "بز",
        monkey: "میمون",
        rooster: "خروس",
        dog: "سگ",
        pig: "خوک"
      },
      
      tarot_reading: "فال تاروت",
      daily_card: "کارت روزانه",
      back_to_chart: "بازگشت",
      start_reading: "شروع فال",
      shuffling: "در حال بُر زدن...",
      luma_advice: "توصیه لوما",
      luma_advice_text: "لوما پیشنهاد می‌کند بر اساس این کارت‌ها به احساسات درونی خود اعتماد کنید.",
      read_again: "فال مجدد",
      positions: {
        past: "گذشته",
        present: "حال",
        future: "آینده"
      },
      
      gamification_profile: "پروفایل",
      gamification_level: "سطح",
      gamification_total_xp: "XP کل",
      gamification_readings: "فال‌ها",
      gamification_daily_cards: "کارت‌های روزانه",
      gamification_achievements: "دستاوردها",
      
      settings: "تنظیمات",
      app_language: "زبان برنامه",
      data_management: "مدیریت داده‌ها",
      export: "دریافت بکاپ",
      clear_data: "پاک کردن داده‌ها"
    }
  },
  en: {
    translation: {
      welcome: "Welcome",
      subtitle: "Welcome to your inner world",
      login: "Login",
      register: "Register",
      guest: "Login as Guest",
      username: "Username",
      password: "Password",
      welcome_user: "Welcome, {{name}}",
      welcome_guest: "Welcome, Guest",
      logout: "Logout",
      
      tab_tarot: "Tarot",
      tab_chart: "Chart",
      tab_profile: "Profile",
      tab_settings: "Settings",
      
      profile_setup: "Your Birth Data",
      birth_year: "Year",
      birth_month: "Month",
      birth_day: "Day",
      mother_name: "Mother's Name",
      save_profile: "Save and Continue",
      
      your_chart: "Your Birth Chart",
      element: "Element",
      zodiac: "Zodiac",
      chinese_zodiac: "Chinese Zodiac",
      life_path: "Life Path",
      lucky_number: "Lucky Number",
      wealth_number: "Wealth Number",
      abjad: "Abjad Kabir",
      
      elements: {
        water: "Water",
        fire: "Fire",
        earth: "Earth",
        air: "Air"
      },
      zodiacs: {
        aries: "Aries",
        taurus: "Taurus",
        gemini: "Gemini",
        cancer: "Cancer",
        leo: "Leo",
        virgo: "Virgo",
        libra: "Libra",
        scorpio: "Scorpio",
        sagittarius: "Sagittarius",
        capricorn: "Capricorn",
        aquarius: "Aquarius",
        pisces: "Pisces"
      },
      chinese: {
        rat: "Rat",
        ox: "Ox",
        tiger: "Tiger",
        rabbit: "Rabbit",
        dragon: "Dragon",
        snake: "Snake",
        horse: "Horse",
        goat: "Goat",
        monkey: "Monkey",
        rooster: "Rooster",
        dog: "Dog",
        pig: "Pig"
      },
      
      tarot_reading: "Tarot Reading",
      daily_card: "Daily Card",
      back_to_chart: "Back",
      start_reading: "Start Reading",
      shuffling: "Shuffling...",
      luma_advice: "Luma's Advice",
      luma_advice_text: "Luma suggests trusting your inner feelings based on these cards.",
      read_again: "Read Again",
      positions: {
        past: "Past",
        present: "Present",
        future: "Future"
      },
      
      gamification_profile: "Profile",
      gamification_level: "Level",
      gamification_total_xp: "Total XP",
      gamification_readings: "Readings",
      gamification_daily_cards: "Daily Cards",
      gamification_achievements: "Achievements",
      
      settings: "Settings",
      app_language: "App Language",
      data_management: "Data Management",
      export: "Export Backup",
      clear_data: "Clear Data"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "fa",
    fallbackLng: "fa",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;