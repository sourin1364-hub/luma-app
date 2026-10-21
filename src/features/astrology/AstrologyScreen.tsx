import { useState, useMemo } from "react";
import { useAppStore } from "../../store/useAppStore";
import { CITIES, type City } from "../../lib/cities";
import * as jalaali from "jalaali-js";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, MapPin, Calendar, Clock, Star, Moon, Sun as SunIcon, Search, Quote, Brain, Heart, Flame, TrendingUp, Shield, Zap, Waves, Skull, X, Home } from "lucide-react";
import * as Astronomy from "astronomy-engine";
import { tarotCards, type TarotCard } from "../../lib/tarotData";
import { getCardMeaning } from "../../lib/tarotMeanings";
import { ChartWheel } from "./ChartWheel";
import { PersianDateInput, PersianTimeInput } from "../../components/ui/PersianDate";

const images = import.meta.glob('../../assets/cards/*.webp', { eager: true, import: 'default' }) as Record<string, string>;

const ZODIAC_SIGNS = ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"];
const ZODIAC_EMOJI = ["", "", "", "", "", "", "", "", "", "", "", ""];

const ELEMENTS: Record<string, string> = {
  "حمل": "آتش", "اسد": "آتش", "قوس": "آتش",
  "ثور": "خاک", "سنبله": "خاک", "جدی": "خاک",
  "جوزا": "باد", "میزان": "باد", "دلو": "باد",
  "سرطان": "آب", "عقرب": "آب", "حوت": "آب"
};

const HOUSES_INFO: Record<number, { name: string; theme: string }> = {
  1: { name: "خانه اول (خود)", theme: "هویت، ظاهر، شخصیت و شروع‌های زندگی" },
  2: { name: "خانه دوم (مال)", theme: "دارایی، ارزش‌ها، امنیت مادی و استعدادها" },
  3: { name: "خانه سوم (ارتباط)", theme: "ارتباطات، خواهر و برادر، سفرهای کوتاه و آموزش" },
  4: { name: "خانه چهارم (خانه)", theme: "خانواده، ریشه‌ها، خانه و امنیت عاطفی" },
  5: { name: "خانه پنجم (خلاقیت)", theme: "خلاقیت، عشق رمانتیک، فرزندان و تفریح" },
  6: { name: "خانه ششم (کار)", theme: "سلامت، کار روزانه، خدمت و نظم" },
  7: { name: "خانه هفتم (شریک)", theme: "ازدواج، شراکت، روابط عاطفی و قراردادها" },
  8: { name: "خانه هشتم (دگرگونی)", theme: "دگرگونی، منابع مشترک، مرگ و تولد دوباره" },
  9: { name: "خانه نهم (فلسفه)", theme: "سفرهای دور، فلسفه، معنویت و آموزش عالی" },
  10: { name: "خانه دهم (شغل)", theme: "حرفه، شهرت، جایگاه اجتماعی و هدف زندگی" },
  11: { name: "خانه یازدهم (دوستی)", theme: "دوستی، گروه‌ها، آرزوها و شبکه‌های اجتماعی" },
  12: { name: "خانه دوازدهم (ناخودآگاه)", theme: "ناخودآگاه، معنویت، تنهایی و رازها" },
};

const PLANET_INTERPRETATIONS: Record<string, Record<string, string>> = {
  "عطارد": { "سرطان": "ذهن شما شهودی و احساسی است. در ارتباطات خود همدلی نشان می‌دهید.", "اسد": "ذهن شما خلاق و پرانرژی است. با اعتماد به نفس صحبت می‌کنید.", "ثور": "ذهن شما پایدار و عملی است. به جزئیات توجه دارید." },
  "زهره": { "ثور": "در عشق پایدار و حسی هستید. در روابط وفادار هستید.", "میزان": "در عشق به دنبال تعادل و زیبایی هستید.", "حوت": "در عشق رمانتیک و رؤیایی هستید." },
  "مریخ": { "سرطان": "انرژی خود را غیرمستقیم بروز می‌دهید. برای خانواده می‌جنگید.", "اسد": "انرژی شما پرغرور است. رهبری را دوست دارید.", "عقرب": "انرژی شما شدید و پنهان است." },
  "مشتری": { "سرطان": "خوشبختی شما در خانواده است.", "دلو": "خوشبختی شما در نوآوری است.", "میزان": "خوشبختی شما در روابط است." },
  "زحل": { "جدی": "درس‌های زندگی شما در مسئولیت‌پذیری است.", "دلو": "درس‌های زندگی شما در استقلال است.", "عقرب": "درس‌های زندگی شما در قدرت و دگرگونی است." }
};

const PLANET_IN_HOUSE: Record<string, Record<number, string>> = {
  "خورشید": { 1: "هویت و ظاهر شما بسیار قوی است.", 2: "خودارزشی شما با دارایی گره خورده است.", 3: "در ارتباطات می‌درخشید.", 4: "خانواده برای شما بسیار مهم است.", 5: "خلاقیت و عشق در مرکز زندگی شماست.", 6: "در خدمت به دیگران احساس هدفمندی می‌کنید.", 7: "هویت شما با روابط گره خورده است.", 8: "در دگرگونی و تحولات عمیق زندگی می‌کنید.", 9: "به دنبال معنا و سفر هستید.", 10: "حرفه برای شما اولویت دارد.", 11: "در گروه‌ها می‌درخشید.", 12: "درون‌گرا و معنوی هستید." },
  "ماه": { 1: "احساسات شما در ظاهرتان نمایان است.", 2: "به امنیت عاطفی و مادی نیاز دارید.", 3: "احساسات خود را از طریق کلام بیان می‌کنید.", 4: "به خانه و خانواده وابسته‌اید.", 5: "در عشق و خلاقیت احساسی عمل می‌کنید.", 6: "احساسات خود را در کار بروز می‌دهید.", 7: "در روابط عاطفی به دنبال امنیت هستید.", 8: "احساسات عمیق و پیچیده‌ای دارید.", 9: "به دنبال امنیت معنوی هستید.", 10: "احساسات شما با حرفه گره خورده است.", 11: "در جمع دوستان احساس امنیت می‌کنید.", 12: "احساسات خود را پنهان می‌کنید." },
  "عطارد": { 1: "در ارتباطات و کلام توانا هستید.", 2: "ذهن شما عملی و مادی است.", 3: "در ارتباطات و یادگیری عالی هستید.", 4: "با خانواده ارتباط فکری قوی دارید.", 5: "در بیان خلاقیت توانا هستید.", 6: "در کار از ذهن خود استفاده می‌کنید.", 7: "در مذاکرات توانا هستید.", 8: "به مسائل پنهان علاقه دارید.", 9: "به فلسفه و آموزش عالی علاقه دارید.", 10: "در حرفه خود از توانایی‌های ذهنی بهره می‌برید.", 11: "در گروه‌ها فعال هستید.", 12: "ذهن شما درون‌گرا و شهودی است." },
  "زهره": { 1: "جذابیت شما در ظاهرتان نمایان است.", 2: "ذوق هنری در امور مالی دارید.", 3: "در کلام زیبا هستید.", 4: "خانه شما محل آرامش است.", 5: "در عشق و خلاقیت می‌درخشید.", 6: "در کار با مهربانی عمل می‌کنید.", 7: "در ازدواج موفق هستید.", 8: "در عشق عمیق و پرشور هستید.", 9: "به زیبایی‌های معنوی علاقه دارید.", 10: "در حرفه‌های هنری موفق هستید.", 11: "در جمع دوستان محبوب هستید.", 12: "در عشق پنهانی هستید." },
  "مریخ": { 1: "پرانرژی و قاطع هستید.", 2: "برای دارایی تلاش می‌کنید.", 3: "در ارتباطات قاطع هستید.", 4: "در خانه پرانرژی هستید.", 5: "در عشق پراشتیاق هستید.", 6: "در کار سختکوش هستید.", 7: "در روابط به دنبال شریک پرانرژی هستید.", 8: "انرژی شما در مسائل عمیق صرف می‌شود.", 9: "برای باورها می‌جنگید.", 10: "در حرفه خود جاه‌طلب هستید.", 11: "در گروه‌ها رهبری می‌کنید.", 12: "انرژی خود را پنهان می‌کنید." },
  "مشتری": { 1: "خوش‌شانس هستید.", 2: "در مسائل مالی خوش‌شانس هستید.", 3: "در یادگیری خوش‌شانس هستید.", 4: "خانواده منبع خوشبختی است.", 5: "در عشق خوش‌شانس هستید.", 6: "در کار خوش‌شانس هستید.", 7: "در ازدواج خوش‌شانس هستید.", 8: "از منابع مشترک سود می‌برید.", 9: "در سفر خوش‌شانس هستید.", 10: "در حرفه خود موفق هستید.", 11: "در دوستی خوش‌شانس هستید.", 12: "حفاظت معنوی دارید." },
  "زحل": { 1: "مسئولیت‌پذیر هستید.", 2: "با تلاش مالی می‌سازید.", 3: "در ارتباطات جدی هستید.", 4: "احساس مسئولیت در قبال خانواده دارید.", 5: "در عشق جدی هستید.", 6: "در کار منظم هستید.", 7: "در روابط پایدار هستید.", 8: "درس‌های عمیقی می‌گیرید.", 9: "به دنبال معنای عمیق هستید.", 10: "در حرفه موفق هستید.", 11: "در گروه‌ها مسئولیت‌پذیر هستید.", 12: "درس‌های معنوی می‌گیرید." },
  "اورانوس": { 1: "منحصر به فرد هستید.", 2: "در مسائل مالی نوآور هستید.", 3: "ذهن نوآور دارید.", 4: "در خانواده غیرمتعارف هستید.", 5: "در عشق منحصر به فرد هستید.", 6: "در کار مستقل هستید.", 7: "به دنبال شریک غیرمتعارف هستید.", 8: "در مسائل پنهان نوآور هستید.", 9: "افکار غیرمتعارف دارید.", 10: "در حرفه نوآور هستید.", 11: "در گروه‌ها نوآور هستید.", 12: "شهود غیرمتعارف دارید." },
  "نپتون": { 1: "حساس و رؤیایی هستید.", 2: "ارزش‌های مالی غیرمادی دارید.", 3: "ذهن شهودی دارید.", 4: "خانه شما معنوی است.", 5: "در عشق رؤیایی هستید.", 6: "در کار شهودی هستید.", 7: "به دنبال شریک روحانی هستید.", 8: "در مسائل پنهان حساس هستید.", 9: "به دنبال معنویت هستید.", 10: "در حرفه الهام‌بخش هستید.", 11: "در آرزوها رؤیایی هستید.", 12: "بسیار شهودی هستید." },
  "پلوتو": { 1: "قدرتمند هستید.", 2: "دگرگونی عمیق در مسائل مالی دارید.", 3: "در ارتباطات قدرتمند هستید.", 4: "دگرگونی در خانواده دارید.", 5: "در عشق پرشور هستید.", 6: "در کار دگرگونی دارید.", 7: "روابط شما عمیق است.", 8: "در مسائل پنهان قدرتمند هستید.", 9: "دگرگونی فلسفی دارید.", 10: "در حرفه قدرت دارید.", 11: "در گروه‌ها دگرگون‌کننده هستید.", 12: "دگرگونی درونی دارید." }
};

const TAROT_MAP: Record<string, { name: string; desc: string; cardId: number; fileName: string }> = {
  "خورشید": { name: "کارت خورشید (The Sun)", desc: "نماد موفقیت، شادی و حقیقت.", cardId: 19, fileName: "major-19.webp" },
  "ماه": { name: "کارت ماه (The Moon)", desc: "نماد شهود، رؤیا و ناخودآگاه.", cardId: 18, fileName: "major-18.webp" },
  "عطارد": { name: "کارت جادوگر (The Magician)", desc: "نماد ذهن، ارتباط و قدرت تجلی.", cardId: 1, fileName: "major-01.webp" },
  "زهره": { name: "کارت امپراتریس (The Empress)", desc: "نماد عشق، زیبایی و فراوانی.", cardId: 3, fileName: "major-03.webp" },
  "مریخ": { name: "کارت برج (The Tower)", desc: "نماد انرژی، تخریب و دگرگونی ناگهانی.", cardId: 16, fileName: "major-16.webp" },
  "مشتری": { name: "کارت چرخ روزگار (Wheel of Fortune)", desc: "نماد خوشبختی و شانس.", cardId: 10, fileName: "major-10.webp" },
  "زحل": { name: "کارت جهان (The World)", desc: "نماد درس‌ها و تکمیل چرخه.", cardId: 21, fileName: "major-21.webp" },
  "اورانوس": { name: "کارت احمق (The Fool)", desc: "نماد نوآوری و آزادی.", cardId: 0, fileName: "major-00.webp" },
  "نپتون": { name: "کارت مرد حلق‌آویز (The Hanged Man)", desc: "نماد شهود و رؤیا.", cardId: 12, fileName: "major-12.webp" },
  "پلوتو": { name: "کارت داوری (Judgement)", desc: "نماد دگرگونی عمیق.", cardId: 20, fileName: "major-20.webp" },
  "طالع": { name: "کارت جادوگر (The Magician)", desc: "نماد نقاب اجتماعی.", cardId: 1, fileName: "major-01.webp" }
};

const PLANET_ICONS: Record<string, any> = {
  "خورشید": SunIcon, "ماه": Moon, "عطارد": Brain, "زهره": Heart, "مریخ": Flame, "مشتری": TrendingUp, "زحل": Shield, "اورانوس": Zap, "نپتون": Waves, "پلوتو": Skull, "طالع": Star,
};

function getZodiacFromLongitude(lon: number) {
  const normalizedLon = ((lon % 360) + 360) % 360;
  const index = Math.floor(normalizedLon / 30) % 12;
  const degree = (normalizedLon % 30).toFixed(2);
  return { sign: ZODIAC_SIGNS[index], degree, emoji: ZODIAC_EMOJI[index], full: `${degree} ${ZODIAC_SIGNS[index]} ${ZODIAC_EMOJI[index]}`, absoluteLon: normalizedLon };
}

function getHouseForPlanet(planetLon: number, ascendantLon: number): number {
  let diff = planetLon - ascendantLon;
  if (diff < 0) diff += 360;
  const house = Math.floor(diff / 30) + 1;
  return house > 12 ? 12 : house;
}

function localToUTC(year: number, month: number, day: number, hour: number, minute: number, timezone: string): Date {
  const approxUTC = Date.UTC(year, month - 1, day, hour, minute);
  const dtf = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const parts = dtf.formatToParts(new Date(approxUTC));
  const get = (type: string) => parts.find(p => p.type === type)?.value || '0';
  const localRead = Date.UTC(parseInt(get('year')), parseInt(get('month')) - 1, parseInt(get('day')), parseInt(get('hour')), parseInt(get('minute')), parseInt(get('second')));
  return new Date(approxUTC - (localRead - approxUTC));
}

function calculateAscendant(astroTime: Astronomy.AstroTime, lat: number, lon: number): number {
  const gast = Astronomy.SiderealTime(astroTime);
  const last = gast + lon / 15;
  const ramc = (last * 15) % 360;
  const obliquity = 23.4392911 * Math.PI / 180;
  const ramcRad = ramc * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  let asc = Math.atan2(Math.cos(ramcRad), -(Math.sin(ramcRad) * Math.cos(obliquity) + Math.tan(latRad) * Math.sin(obliquity))) * 180 / Math.PI;
  return ((asc % 360) + 360) % 360;
}

export function AstrologyScreen() {
  const setCurrentRoute = useAppStore((state) => state.setCurrentRoute);
  const [birthDate, setBirthDate] = useState({ year: 1370, month: 1, day: 1 });
  const [birthTime, setBirthTime] = useState({ hour: 12, minute: 0 });
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [showCityList, setShowCityList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planets, setPlanets] = useState<any[] | null>(null);
  const [ascendant, setAscendant] = useState<any>(null);
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return CITIES;
    const query = citySearch.toLowerCase();
    return CITIES.filter(c => c.name.toLowerCase().includes(query) || (c.province && c.province.toLowerCase().includes(query)) || c.country.toLowerCase().includes(query));
  }, [citySearch]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPlanets(null);
    setAscendant(null);
    let y = birthDate.year, m = birthDate.month, d = birthDate.day, h = birthTime.hour, min = birthTime.minute;
    if (!y || !m || !d) { setError("لطفاً تمام فیلدها را پر کنید."); return; }
    let gYear = y, gMonth = m, gDay = d;
    if (y > 1200 && y < 1700) {
      try { const g = jalaali.toGregorian(y, m, d); gYear = g.gy; gMonth = g.gm; gDay = g.gd; } catch (err) { setError("تاریخ نامعتبر است."); return; }
    }
    setLoading(true);
    try {
      const utcDate = localToUTC(gYear, gMonth, gDay, h, min, selectedCity.timezone);
      const astroTime = Astronomy.MakeTime(utcDate);
      const ascLon = calculateAscendant(astroTime, selectedCity.lat, selectedCity.lon);
      const ascInfo = getZodiacFromLongitude(ascLon);
      
      const bodies = [
        { id: Astronomy.Body.Sun, name: "خورشید" }, { id: Astronomy.Body.Moon, name: "ماه" }, { id: Astronomy.Body.Mercury, name: "عطارد" },
        { id: Astronomy.Body.Venus, name: "زهره" }, { id: Astronomy.Body.Mars, name: "مریخ" }, { id: Astronomy.Body.Jupiter, name: "مشتری" },
        { id: Astronomy.Body.Saturn, name: "زحل" }, { id: Astronomy.Body.Uranus, name: "اورانوس" }, { id: Astronomy.Body.Neptune, name: "نپتون" }, { id: Astronomy.Body.Pluto, name: "پلوتو" }
      ];
      
      const calculatedPlanets = bodies.map(body => {
        const vec = Astronomy.GeoVector(body.id, astroTime, true);
        const ecl = Astronomy.Ecliptic(vec);
        const signInfo = getZodiacFromLongitude(ecl.elon);
        const houseNumber = getHouseForPlanet(signInfo.absoluteLon, ascLon);
        const tarot = TAROT_MAP[body.name];
        const Icon = PLANET_ICONS[body.name] || Star;
        return { name: body.name, ...signInfo, houseNumber, tarot, Icon };
      });
      
      setPlanets(calculatedPlanets);
      setAscendant({ ...ascInfo, houseNumber: 1, tarot: TAROT_MAP["طالع"], Icon: PLANET_ICONS["طالع"] });
    } catch (err: any) { 
      console.error("Astrology error:", err);
      setError("خطا در محاسبه: " + (err.message || "مشکل ناشناخته")); 
    } finally { setLoading(false); }
  };

  const openTarotCardPopup = (cardId: number) => {
    const card = tarotCards.find(c => c.id === cardId);
    if (card) setSelectedCard(card);
  };

  const dominantElement = useMemo(() => {
    if (!planets || !ascendant) return null;
    const counts: Record<string, number> = { "آتش": 0, "خاک": 0, "باد": 0, "آب": 0 };
    planets.forEach(p => { if (ELEMENTS[p.sign]) counts[ELEMENTS[p.sign]]++; });
    if (ELEMENTS[ascendant.sign]) counts[ELEMENTS[ascendant.sign]]++;
    let max = 0, dom = "";
    for (const [el, c] of Object.entries(counts)) { if (c > max) { max = c; dom = el; } }
    return dom;
  }, [planets, ascendant]);

  const getSummary = () => {
    if (dominantElement === "آتش") return "چارت شما دارای غلبه عنصر آتش است. شما فردی پرانرژی، شجاع، پیشرو و مشتاق هستید.";
    if (dominantElement === "خاک") return "چارت شما دارای غلبه عنصر خاک است. شما فردی عملی، پایدار، صبور و قابل اعتماد هستید.";
    if (dominantElement === "باد") return "چارت شما دارای غلبه عنصر باد است. شما فردی ذهنی، کنجکاو، اجتماعی و ارتباط‌گرا هستید.";
    if (dominantElement === "آب") return "چارت شما دارای غلبه عنصر آب است. شما فردی احساسی، شهودی، همدل و عمیق هستید.";
    return "";
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 relative overflow-hidden text-slate-800 dark:text-slate-200" dir="rtl">
      
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 relative z-10">
        <button onClick={() => setCurrentRoute("home")} className="text-sm font-bold text-[rgb(var(--glow-color-rgb))] hover:bg-[rgba(var(--glow-color-rgb),0.1)] px-4 py-2 rounded-full transition-colors flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> بازگشت
        </button>
        <h1 className="text-3xl font-display font-bold text-[rgb(var(--glow-color-rgb))] drop-shadow-md flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-amber-500" /> چارت آسترولوژی
        </h1>
        <div className="w-24"></div>
      </div>

      <div className="w-full max-w-3xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-6 md:p-8 shadow-xl">
          <h2 className="text-xl font-bold text-[rgb(var(--glow-color-rgb))] mb-6">اطلاعات تولد خود را وارد کنید</h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-2"><Calendar className="w-4 h-4" /> تاریخ تولد (شمسی)</label>
              <PersianDateInput value={birthDate} onChange={setBirthDate} />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-2"><Clock className="w-4 h-4" /> ساعت تولد (به وقت محلی)</label>
              <PersianTimeInput value={birthTime} onChange={setBirthTime} />
            </div>
            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-bold mb-2"><MapPin className="w-4 h-4" /> شهر تولد</label>
              <div onClick={() => setShowCityList(!showCityList)} className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center">
                <span className="font-bold text-[rgb(var(--glow-color-rgb))]">{selectedCity.name} <span className="text-xs text-slate-500 font-normal">({selectedCity.province ? `${selectedCity.province} - ` : ''}{selectedCity.country})</span></span>
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              {showCityList && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 max-h-64 flex flex-col">
                  <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                    <input type="text" placeholder="جستجوی شهر..." value={citySearch} onChange={(e) => setCitySearch(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-lg px-4 py-2 text-sm focus:outline-none" autoFocus />
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {filteredCities.map((city, idx) => (
                      <div key={idx} onClick={() => { setSelectedCity(city); setShowCityList(false); setCitySearch(""); }} className="px-4 py-3 hover:bg-[rgba(var(--glow-color-rgb),0.1)] cursor-pointer border-b border-slate-100 dark:border-slate-700/50 last:border-0 flex justify-between items-center">
                        <span className="font-bold text-sm">{city.name}</span>
                        <span className="text-xs text-slate-500">{city.province ? `${city.province} - ` : ''}{city.country}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading} className="btn-animated-primary w-full h-14 flex items-center justify-center text-lg">
              {loading ? "در حال محاسبه..." : "محاسبه چارت تولد"}
            </button>
          </form>
        </motion.div>

        <AnimatePresence>
          {planets && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6 pb-20">
              
              {/* نمودار چرخه چارت */}
              {ascendant && (
                <div className="glass-card rounded-3xl p-6 border-2 border-[rgba(var(--glow-color-rgb),0.3)]">
                  <h3 className="text-xl font-bold text-[rgb(var(--glow-color-rgb))] mb-2 flex items-center gap-2 justify-center">
                    <Sparkles className="w-5 h-5 text-amber-500" /> نقشه گرافیکی چارت
                  </h3>
                  <ChartWheel 
                    planets={planets.map(p => ({ name: p.name, sign: p.sign, degree: p.degree, absoluteLon: p.absoluteLon, houseNumber: p.houseNumber }))}
                    ascendantAbsoluteLon={ascendant.absoluteLon}
                  />
                </div>
              )}

              <div className="glass-card rounded-2xl p-6 border-2 border-[rgba(var(--glow-color-rgb),0.3)] bg-gradient-to-br from-white to-[rgba(var(--glow-color-rgb),0.05)]">
                <h3 className="text-xl font-bold text-[rgb(var(--glow-color-rgb))] mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500" /> جمع‌بندی چارت شما</h3>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium text-justify">{getSummary()}</p>
              </div>

              <div className="space-y-4">
                {planets.map((p, idx) => {
                  const Icon = p.Icon || Star;
                  const houseInfo = HOUSES_INFO[p.houseNumber];
                  return (
                    <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3 mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="w-10 h-10 rounded-full bg-[rgba(var(--glow-color-rgb),0.1)] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-[rgb(var(--glow-color-rgb))]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800 dark:text-slate-200">{p.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-xs font-bold text-[rgb(var(--glow-color-rgb))]">{p.sign} {p.emoji} - {p.degree}</span>
                            <span className="text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Home className="w-3 h-3" /> خانه {p.houseNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 mb-3 border border-purple-100 dark:border-purple-700/50">
                        <p className="text-[10px] font-bold text-purple-700 dark:text-purple-400">{houseInfo?.name}</p>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400">{houseInfo?.theme}</p>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 text-justify mb-3">
                        {PLANET_INTERPRETATIONS[p.name]?.[p.sign] || `${p.name} شما در برج ${p.sign} قرار دارد.`}
                      </p>
                      {PLANET_IN_HOUSE[p.name]?.[p.houseNumber] && (
                        <div className="bg-[rgba(var(--glow-color-rgb),0.05)] rounded-lg p-3 mb-3 border border-[rgba(var(--glow-color-rgb),0.1)]">
                          <p className="text-xs font-bold text-[rgb(var(--glow-color-rgb))] mb-1">در خانه {p.houseNumber}:</p>
                          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 text-justify">{PLANET_IN_HOUSE[p.name][p.houseNumber]}</p>
                        </div>
                      )}
                      {p.tarot && (
                        <div className="bg-[rgba(var(--glow-color-rgb),0.05)] rounded-lg p-3 border border-[rgba(var(--glow-color-rgb),0.1)] flex items-center gap-3">
                          <div className="w-12 h-20 rounded-md overflow-hidden border-2 border-[rgba(var(--glow-color-rgb),0.5)] shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0" onClick={() => openTarotCardPopup(p.tarot.cardId)}>
                            <img src={images[`../../assets/cards/${p.tarot.fileName}`]} alt={p.tarot.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-[rgb(var(--glow-color-rgb))] flex items-center gap-1 mb-1"><Quote className="w-3 h-3" /> {p.tarot.name}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{p.tarot.desc}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {ascendant && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <Star className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">طالع (نقاب اجتماعی) - خانه اول</p>
                      <p className="text-lg font-bold text-[rgb(var(--glow-color-rgb))]">{ascendant.sign} {ascendant.emoji} - {ascendant.degree}</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 mb-3 border border-purple-100 dark:border-purple-700/50">
                    <p className="text-[10px] font-bold text-purple-700 dark:text-purple-400">{HOUSES_INFO[1].name}</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">{HOUSES_INFO[1].theme}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 text-justify mb-3">
                    شما با اعتماد به نفس، شکوه و خلاقیت با دنیا روبرو می‌شوید. دیگران شما را جذاب و رهبر می‌بینند.
                  </p>
                  {ascendant.tarot && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-100 dark:border-purple-700/50 flex items-center gap-3">
                      <div className="w-12 h-20 rounded-md overflow-hidden border-2 border-purple-300 shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0" onClick={() => openTarotCardPopup(ascendant.tarot.cardId)}>
                        <img src={images[`../../assets/cards/${ascendant.tarot.fileName}`]} alt={ascendant.tarot.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1 mb-1"><Quote className="w-3 h-3" /> {ascendant.tarot.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{ascendant.tarot.desc}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCard(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden max-w-md w-full shadow-2xl border border-[rgba(var(--glow-color-rgb),0.3)] flex flex-col md:flex-row relative">
              <button onClick={() => setSelectedCard(null)} className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"><X className="w-5 h-5" /></button>
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-100 dark:bg-slate-800 p-6 flex items-center justify-center">
                <img src={images[`../../assets/cards/${selectedCard.fileName}`]} alt={selectedCard.name} className="w-full max-w-[200px] rounded-lg shadow-xl border border-[rgba(var(--glow-color-rgb),0.5)]" />
              </div>
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-center text-center md:text-right" dir="rtl">
                <h2 className="text-2xl font-bold text-[rgb(var(--glow-color-rgb))] mb-1">{selectedCard.nameFa}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 tracking-widest mb-6">{selectedCard.name}</p>
                <div className="bg-[rgba(var(--glow-color-rgb),0.05)] rounded-xl p-4 border border-[rgba(var(--glow-color-rgb),0.2)]">
                  <p className="text-xs font-bold text-[rgb(var(--glow-color-rgb))] mb-2 flex items-center justify-center md:justify-start gap-1"><Sparkles className="w-4 h-4 text-amber-500" /> معنی کارت:</p>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">{getCardMeaning(selectedCard.id)}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}