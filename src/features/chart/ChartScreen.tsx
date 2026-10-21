import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import * as jalaali from "jalaali-js";
import { getWesternZodiac, getElementFromZodiac, getChineseZodiac } from "../../lib/astrology";
import type { Element } from "../../lib/astrology";
import { ElementBackground } from "../../components/layout/ElementBackground";
import { OceanWaves } from "../../components/layout/OceanWaves";
import { Logo } from "../../components/ui/Logo";
import { LevelBadge } from "../gamification/LevelBadge";
import { Droplets, Flame, Mountain, Wind, Route, Clover, Gem, Hash, Settings, Home } from "lucide-react";

const zodiacIcons = import.meta.glob('../../assets/icons/zodiac/*.{svg,png,webp}', { eager: true, import: 'default' }) as Record<string, string>;
const chineseIcons = import.meta.glob('../../assets/icons/chinese/*.{svg,png,webp}', { eager: true, import: 'default' }) as Record<string, string>;

const findIcon = (icons: Record<string, string>, name: string) => {
  const key = Object.keys(icons).find(k => k.toLowerCase().includes(`/${name.toLowerCase()}.`));
  return key ? icons[key] : undefined;
};

const faDigits = "\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9";
const safeNum = (val: any, fallback: number): number => {
  if (val === undefined || val === null) return fallback;
  const str = String(val).trim();
  if (str === "" || str === "undefined" || str === "NaN" || str === "null") return fallback;
  const num = Number(str);
  return isNaN(num) ? fallback : num;
};
const toFa = (val: any) => {
  const num = safeNum(val, -1);
  if (num === -1) return faDigits[0];
  return String(num).replace(/\d/g, d => faDigits[Number(d)]);
};

export function ChartScreen() {
  const { currentUser, logout } = useAuthStore();
  const setCurrentRoute = useAppStore((state) => state.setCurrentRoute);

  if (!currentUser) return null;

  const birth = currentUser.birthData || { year: 1995, month: 3, day: 21, motherName: "" };
  const u = String(currentUser.username || "User");
  const mn = String(birth.motherName || "");

  let y = safeNum(birth.year, 1995);
  let m = safeNum(birth.month, 3);
  let d = safeNum(birth.day, 21);

  let gregorianYear = y, gregorianMonth = m, gregorianDay = d;
  if (y > 1200 && y < 1700) {
    try {
      const g = jalaali.toGregorian(y, m, d);
      gregorianYear = safeNum(g.gy, 1995);
      gregorianMonth = safeNum(g.gm, 3);
      gregorianDay = safeNum(g.gd, 21);
    } catch (e) {}
  }

  let lifePath = 1;
  try {
    const str = `${gregorianYear}${gregorianMonth}${gregorianDay}`;
    let sum = 0;
    for (let i = 0; i < str.length; i++) sum += safeNum(str[i], 0);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = String(sum).split("").reduce((a, b) => a + safeNum(b, 0), 0);
    }
    lifePath = sum || 1;
  } catch (e) {}

  let luckyNumber = 1;
  try {
    let lSum = 0;
    for (let i = 0; i < u.length; i++) lSum += u.charCodeAt(i);
    while (lSum > 9) lSum = String(lSum).split("").reduce((a, b) => a + safeNum(b, 0), 0);
    luckyNumber = lSum || 1;
  } catch (e) {}

  let wealthNumber = 1;
  try {
    let wSum = lifePath + luckyNumber;
    while (wSum > 9) wSum = String(wSum).split("").reduce((a, b) => a + safeNum(b, 0), 0);
    wealthNumber = wSum || 1;
  } catch (e) {}

  let abjad = 0;
  try {
    const abjadMap: Record<string, number> = {'\u0627':1, '\u0628':2, '\u062C':3, '\u062F':4, '\u0647':5, '\u0648':6, '\u0632':7, '\u062D':8, '\u0637':9, '\u06CC':10, '\u06A9':20, '\u0644':30, '\u0645':40, '\u0646':50, '\u0633':60, '\u0639':70, '\u0641':80, '\u0635':90, '\u0642':100, '\u0631':200, '\u0634':300, '\u062A':400, '\u062B':500, '\u062E':600, '\u0630':700, '\u0636':800, '\u0638':900, '\u063A':1000};
    const text = (u + " " + mn).trim();
    for (let i = 0; i < text.length; i++) if (abjadMap[text[i]]) abjad += abjadMap[text[i]];
  } catch (e) {}

  let zodiac = "aries", element = "fire", chinese = "rat";
  try {
    zodiac = getWesternZodiac(gregorianMonth, gregorianDay) || "aries";
    element = getElementFromZodiac(zodiac) || "fire";
    chinese = getChineseZodiac(gregorianYear) || "rat";
  } catch (e) {}

  let displayDate = toFa(1370) + "/" + toFa(1) + "/" + toFa(1);
  try {
    const j = jalaali.toJalaali(gregorianYear, gregorianMonth, gregorianDay);
    if (j && j.jy && j.jm && j.jd) {
      displayDate = toFa(j.jy) + "/" + toFa(j.jm) + "/" + toFa(j.jd);
    }
  } catch (e) {}

  const zodiacIconSrc = findIcon(zodiacIcons, zodiac);
  const chineseIconSrc = findIcon(chineseIcons, chinese);

  const renderElementIcon = () => {
    const cls = "w-8 h-8 mb-1 text-[rgb(var(--glow-color-rgb))]";
    if (element === "water") return <Droplets className={cls} />;
    if (element === "fire") return <Flame className={cls} />;
    if (element === "earth") return <Mountain className={cls} />;
    if (element === "air") return <Wind className={cls} />;
    return null;
  };

  const elementNames: any = { water: "\u0622\u0628", fire: "\u0622\u062A\u0634", earth: "\u062E\u0627\u06A9", air: "\u0628\u0627\u062F" };
  const zodiacNames: any = { aries: "\u062D\u0645\u0644", taurus: "\u062B\u0648\u0631", gemini: "\u062C\u0648\u0632\u0627", cancer: "\u0633\u0631\u0637\u0627\u0646", leo: "\u0627\u0633\u062F", virgo: "\u0633\u0646\u0628\u0644\u0647", libra: "\u0645\u06CC\u0632\u0627\u0646", scorpio: "\u0639\u0642\u0631\u0628", sagittarius: "\u0642\u0648\u0633", capricorn: "\u062C\u062F\u06CC", aquarius: "\u062F\u0644\u0648", pisces: "\u062D\u0648\u062A" };
  const chineseNames: any = { rat: "\u0645\u0648\u0634", ox: "\u06AF\u0627\u0648", tiger: "\u0628\u0628\u0631", rabbit: "\u062E\u0631\u06AF\u0648\u0634", dragon: "\u0627\u0698\u062F\u0647\u0627", snake: "\u0645\u0627\u0631", horse: "\u0627\u0633\u0628", goat: "\u0628\u0632", monkey: "\u0645\u06CC\u0645\u0648\u0646", rooster: "\u062E\u0631\u0648\u0633", dog: "\u0633\u06AF", pig: "\u062E\u0648\u06A9" };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 relative overflow-hidden text-slate-800 dark:text-slate-200" dir="rtl">
      <ElementBackground element={element as Element} />
      {element === "water" && <OceanWaves />}

      <div className="relative z-20 max-w-md w-full space-y-8 mt-6">
        <div className="flex flex-col items-center space-y-5 relative w-full">
          
          {/* دکمه بازگشت به خانه و تنظیمات */}
          <div className="absolute top-0 w-full flex justify-between items-center px-2">
            <button onClick={() => setCurrentRoute("home")} className="p-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full text-[rgb(var(--glow-color-rgb))]"><Home className="w-5 h-5" /></button>
            <button onClick={() => setCurrentRoute("settings")} className="p-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full text-[rgb(var(--glow-color-rgb))]"><Settings className="w-5 h-5" /></button>
          </div>

          <div className="flex items-center gap-4 text-[rgb(var(--glow-color-rgb))] mt-10"><Logo size={46} /><h2 className="text-5xl font-logo font-bold">LUMA</h2></div>
          <LevelBadge onClick={() => setCurrentRoute("profile")} />
          <div className="flex p-1.5 bg-white/60 dark:bg-slate-800/60 rounded-full w-full shadow-sm">
            <button className="flex-1 py-2 text-sm text-slate-600 dark:text-slate-400" onClick={() => setCurrentRoute("tarot_menu")}>{"\u062A\u0627\u0631\u0648\u062A"}</button>
            <button className="flex-1 py-2 text-sm bg-[rgb(var(--glow-color-rgb))] text-white rounded-full font-bold">{"\u0686\u0627\u0631\u062A"}</button>
            <button className="flex-1 py-2 text-sm text-slate-600 dark:text-slate-400" onClick={() => setCurrentRoute("profile")}>{"\u067E\u0631\u0648\u0641\u0627\u06CC\u0644"}</button>
          </div>
          <div className="text-center mt-2">
            <h1 className="text-2xl font-bold text-[rgb(var(--glow-color-rgb))]">{currentUser.isGuest ? "\u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u060C \u0645\u0647\u0645\u0627\u0646" : `\u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u060C ${u}`}</h1>
            <p className="text-sm text-[rgb(var(--glow-color-rgb))] mt-1">{displayDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glow-card rounded-2xl"><div className="glow-card-inner p-4 text-center">{renderElementIcon()}<p className="font-bold text-slate-800 dark:text-slate-200">{elementNames[element]}</p><p className="text-xs text-slate-400 dark:text-slate-500">{"\u0639\u0646\u0635\u0631"}</p></div></div>
          <div className="glow-card rounded-2xl"><div className="glow-card-inner p-4 text-center">{zodiacIconSrc && <img src={zodiacIconSrc} className="w-12 h-12 mx-auto mb-1" />}<p className="font-bold text-slate-800 dark:text-slate-200">{zodiacNames[zodiac]}</p><p className="text-xs text-slate-400 dark:text-slate-500">{"\u0628\u0631\u062C"}</p></div></div>
          <div className="glow-card rounded-2xl"><div className="glow-card-inner p-4 text-center">{chineseIconSrc && <img src={chineseIconSrc} className="w-12 h-12 mx-auto mb-1" />}<p className="font-bold text-slate-800 dark:text-slate-200">{chineseNames[chinese]}</p><p className="text-xs text-slate-400 dark:text-slate-500">{"\u0632\u0648\u062F\u06CC\u0627\u06A9 \u0686\u06CC\u0646\u06CC"}</p></div></div>
          <div className="glow-card rounded-2xl"><div className="glow-card-inner p-4 text-center"><Route className="w-8 h-8 mx-auto mb-1 text-[rgb(var(--glow-color-rgb))]" /><p className="font-bold text-slate-800 dark:text-slate-200">{toFa(lifePath)}</p><p className="text-xs text-slate-400 dark:text-slate-500">{"\u0639\u062F\u062F \u0632\u0646\u062F\u06AF\u06CC"}</p></div></div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="glow-card rounded-2xl"><div className="glow-card-inner p-4"><Clover className="w-6 h-6 mx-auto mb-1 text-[rgb(var(--glow-color-rgb))]" /><p className="font-bold text-slate-800 dark:text-slate-200">{toFa(luckyNumber)}</p><p className="text-[10px] text-slate-400 dark:text-slate-500">{"\u0634\u0627\u0646\u0633"}</p></div></div>
          <div className="glow-card rounded-2xl"><div className="glow-card-inner p-4"><Gem className="w-6 h-6 mx-auto mb-1 text-[rgb(var(--glow-color-rgb))]" /><p className="font-bold text-slate-800 dark:text-slate-200">{toFa(wealthNumber)}</p><p className="text-[10px] text-slate-400 dark:text-slate-500">{"\u062B\u0631\u0648\u062A"}</p></div></div>
          <div className="glow-card rounded-2xl"><div className="glow-card-inner p-4"><Hash className="w-6 h-6 mx-auto mb-1 text-[rgb(var(--glow-color-rgb))]" /><p className="font-bold text-slate-800 dark:text-slate-200">{toFa(abjad)}</p><p className="text-[10px] text-slate-400 dark:text-slate-500">{"\u0627\u0628\u062C\u062F \u06A9\u0628\u06CC\u0631"}</p></div></div>
        </div>

        <div className="flex flex-col gap-4 pb-10">
          <button onClick={() => setCurrentRoute("tarot_menu")} className="btn-animated-primary w-full h-14 flex items-center justify-center text-lg shadow-lg">{"\u0641\u0627\u0644 \u062a\u0627\u0631\u0648\u062a"}</button>
          <button onClick={logout} className="w-full border border-[rgba(var(--glow-color-rgb),0.3)] text-[rgb(var(--glow-color-rgb))] rounded-full h-12 font-bold">{"\u062E\u0631\u0648\u062C \u0627\u0632 \u062D\u0633\u0627\u0628"}</button>
        </div>
      </div>
    </div>
  );
}