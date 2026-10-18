export interface AchievementStats {
  readings: number;
  dailyDraws: number;
  level: number;
}

export interface Achievement {
  id: string;
  icon: string;
  titleFa: string;
  titleEn: string;
  descFa: string;
  descEn: string;
  check: (s: AchievementStats) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_reading", icon: "\uD83D\uDD2E", titleFa: "اولین فال", titleEn: "First Reading", descFa: "اولین فال خود را بگیرید", descEn: "Complete your first tarot reading", check: (s) => s.readings >= 1 },
  { id: "ten_readings", icon: "\uD83C\uDF1F", titleFa: "ده فال", titleEn: "Ten Readings", descFa: " فال انجام دهید", descEn: "Complete 10 tarot readings", check: (s) => s.readings >= 10 },
  { id: "fifty_readings", icon: "\uD83D\uDC8E", titleFa: "پنجاه فال", titleEn: "Fifty Readings", descFa: " فال انجام دهید", descEn: "Complete 50 tarot readings", check: (s) => s.readings >= 50 },
  { id: "first_daily", icon: "\uD83C\uDF05", titleFa: "اولین کارت روزانه", titleEn: "First Daily Card", descFa: "اولین کارت روزانه خود را ببینید", descEn: "Reveal your first daily card", check: (s) => s.dailyDraws >= 1 },
  { id: "seven_daily", icon: "\uD83D\uDCC5", titleFa: "هفت کارت روزانه", titleEn: "Seven Daily Cards", descFa: " کارت روزانه ببینید", descEn: "Collect 7 daily cards", check: (s) => s.dailyDraws >= 7 },
  { id: "thirty_daily", icon: "\uD83C\uDF19", titleFa: "سی کارت روزانه", titleEn: "Thirty Daily Cards", descFa: " کارت روزانه ببینید", descEn: "Collect 30 daily cards", check: (s) => s.dailyDraws >= 30 },
  { id: "level_5", icon: "\u2B50", titleFa: "سطح ", titleEn: "Level 5", descFa: "به سطح  برسید", descEn: "Reach level 5", check: (s) => s.level >= 5 },
  { id: "level_10", icon: "\uD83C\uDFC6", titleFa: "سطح ", titleEn: "Level 10", descFa: "به سطح  برسید", descEn: "Reach level 10", check: (s) => s.level >= 10 },
  { id: "level_25", icon: "\uD83D\uDC51", titleFa: "سطح ", titleEn: "Level 25", descFa: "به سطح  برسید", descEn: "Reach level 25", check: (s) => s.level >= 25 },
  { id: "level_50", icon: "\uD83D\uDCAB", titleFa: "سطح ", titleEn: "Level 50", descFa: "به سطح  برسید", descEn: "Reach level 50", check: (s) => s.level >= 50 },
];

export function getUnlocked(stats: AchievementStats): Set<string> {
  const set = new Set<string>();
  for (const a of ACHIEVEMENTS) {
    if (a.check(stats)) set.add(a.id);
  }
  return set;
}