export type Element = "water" | "fire" | "earth" | "air";

export function getWesternZodiac(month: number, day: number): string {
  const dates = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  const signs = ["capricorn", "aquarius", "pisces", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius"];
  const index = Math.max(0, Math.min(11, month - 1));
  if (day < dates[index]) {
    return signs[index];
  }
  return signs[(index + 1) % 12];
}

export function getElementFromZodiac(zodiac: string): string {
  const fire = ["aries", "leo", "sagittarius"];
  const earth = ["taurus", "virgo", "capricorn"];
  const air = ["gemini", "libra", "aquarius"];
  const water = ["cancer", "scorpio", "pisces"];
  if (fire.includes(zodiac)) return "fire";
  if (earth.includes(zodiac)) return "earth";
  if (air.includes(zodiac)) return "air";
  if (water.includes(zodiac)) return "water";
  return "fire";
}

export function getChineseZodiac(year: number): string {
  const animals = ["rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig"];
  const index = Math.abs(year - 4) % 12;
  return animals[index];
}