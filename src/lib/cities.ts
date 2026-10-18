export interface City {
  name: string;
  province?: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
}

export const CITIES: City[] = [
  // --- تهران ---
  { name: "تهران", province: "تهران", country: "ایران", lat: 35.6892, lon: 51.3890, timezone: "Asia/Tehran" },
  { name: "اسلامشهر", province: "تهران", country: "ایران", lat: 35.5486, lon: 51.2327, timezone: "Asia/Tehran" },
  { name: "شهریار", province: "تهران", country: "ایران", lat: 35.6585, lon: 51.0576, timezone: "Asia/Tehran" },
  { name: "ورامین", province: "تهران", country: "ایران", lat: 35.3240, lon: 51.6457, timezone: "Asia/Tehran" },
  { name: "رباط‌کریم", province: "تهران", country: "ایران", lat: 35.4658, lon: 51.0808, timezone: "Asia/Tehran" },
  { name: "پاکدشت", province: "تهران", country: "ایران", lat: 35.4722, lon: 51.6840, timezone: "Asia/Tehran" },
  { name: "قرچک", province: "تهران", country: "ایران", lat: 35.4419, lon: 51.5697, timezone: "Asia/Tehran" },
  { name: "پردیس", province: "تهران", country: "ایران", lat: 35.7417, lon: 51.7758, timezone: "Asia/Tehran" },
  { name: "دماوند", province: "تهران", country: "ایران", lat: 35.7174, lon: 52.0651, timezone: "Asia/Tehran" },
  { name: "فیروزکوه", province: "تهران", country: "ایران", lat: 35.7551, lon: 52.7711, timezone: "Asia/Tehran" },

  // --- البرز ---
  { name: "کرج", province: "البرز", country: "ایران", lat: 35.8400, lon: 50.9391, timezone: "Asia/Tehran" },
  { name: "فردیس", province: "البرز", country: "ایران", lat: 35.7286, lon: 50.9675, timezone: "Asia/Tehran" },
  { name: "کمال‌شهر", province: "البرز", country: "ایران", lat: 35.8800, lon: 50.8600, timezone: "Asia/Tehran" },
  { name: "نظرآباد", province: "البرز", country: "ایران", lat: 35.9535, lon: 50.6053, timezone: "Asia/Tehran" },
  { name: "هشتگرد", province: "البرز", country: "ایران", lat: 35.9622, lon: 50.6772, timezone: "Asia/Tehran" },
  { name: "اشتهارد", province: "البرز", country: "ایران", lat: 35.7258, lon: 50.3658, timezone: "Asia/Tehran" },
  { name: "طالقان", province: "البرز", country: "ایران", lat: 36.1727, lon: 50.7628, timezone: "Asia/Tehran" },

  // --- اصفهان ---
  { name: "اصفهان", province: "اصفهان", country: "ایران", lat: 32.6546, lon: 51.6680, timezone: "Asia/Tehran" },
  { name: "کاشان", province: "اصفهان", country: "ایران", lat: 33.9833, lon: 51.4333, timezone: "Asia/Tehran" },
  { name: "خمینی‌شهر", province: "اصفهان", country: "ایران", lat: 32.7000, lon: 51.5333, timezone: "Asia/Tehran" },
  { name: "نجف‌آباد", province: "اصفهان", country: "ایران", lat: 32.6333, lon: 51.3667, timezone: "Asia/Tehran" },
  { name: "شاهین‌شهر", province: "اصفهان", country: "ایران", lat: 32.8667, lon: 51.5500, timezone: "Asia/Tehran" },
  { name: "شهرضا", province: "اصفهان", country: "ایران", lat: 32.0000, lon: 51.8667, timezone: "Asia/Tehran" },
  { name: "فلاورجان", province: "اصفهان", country: "ایران", lat: 32.5667, lon: 51.5167, timezone: "Asia/Tehran" },
  { name: "زرین‌شهر", province: "اصفهان", country: "ایران", lat: 32.5000, lon: 51.0333, timezone: "Asia/Tehran" },
  { name: "گلپایگان", province: "اصفهان", country: "ایران", lat: 33.4500, lon: 50.2833, timezone: "Asia/Tehran" },
  { name: "نطنز", province: "اصفهان", country: "ایران", lat: 33.5111, lon: 51.9167, timezone: "Asia/Tehran" },
  { name: "سمیرم", province: "اصفهان", country: "ایران", lat: 31.4167, lon: 51.5667, timezone: "Asia/Tehran" },
  { name: "اردستان", province: "اصفهان", country: "ایران", lat: 33.3764, lon: 52.3667, timezone: "Asia/Tehran" },

  // --- خراسان رضوی ---
  { name: "مشهد", province: "خراسان رضوی", country: "ایران", lat: 36.2605, lon: 59.6168, timezone: "Asia/Tehran" },
  { name: "نیشابور", province: "خراسان رضوی", country: "ایران", lat: 36.2133, lon: 58.7958, timezone: "Asia/Tehran" },
  { name: "سبزوار", province: "خراسان رضوی", country: "ایران", lat: 36.2122, lon: 57.6781, timezone: "Asia/Tehran" },
  { name: "تربت حیدریه", province: "خراسان رضوی", country: "ایران", lat: 35.2753, lon: 59.2178, timezone: "Asia/Tehran" },
  { name: "قوچان", province: "خراسان رضوی", country: "ایران", lat: 37.1053, lon: 58.5083, timezone: "Asia/Tehran" },
  { name: "کاشمر", province: "خراسان رضوی", country: "ایران", lat: 35.2383, lon: 58.4653, timezone: "Asia/Tehran" },
  { name: "تربت جام", province: "خراسان رضوی", country: "ایران", lat: 35.2442, lon: 60.6064, timezone: "Asia/Tehran" },
  { name: "چناران", province: "خراسان رضوی", country: "ایران", lat: 36.6458, lon: 59.1208, timezone: "Asia/Tehran" },
  { name: "گناباد", province: "خراسان رضوی", country: "ایران", lat: 34.3525, lon: 58.6817, timezone: "Asia/Tehran" },
  { name: "درگز", province: "خراسان رضوی", country: "ایران", lat: 37.4444, lon: 59.1081, timezone: "Asia/Tehran" },
  { name: "خواف", province: "خراسان رضوی", country: "ایران", lat: 34.5731, lon: 60.1392, timezone: "Asia/Tehran" },

  // --- فارس ---
  { name: "شیراز", province: "فارس", country: "ایران", lat: 29.5918, lon: 52.5837, timezone: "Asia/Tehran" },
  { name: "مرودشت", province: "فارس", country: "ایران", lat: 29.8742, lon: 52.8075, timezone: "Asia/Tehran" },
  { name: "کازرون", province: "فارس", country: "ایران", lat: 29.6189, lon: 51.6533, timezone: "Asia/Tehran" },
  { name: "جهرم", province: "فارس", country: "ایران", lat: 28.5022, lon: 53.5614, timezone: "Asia/Tehran" },
  { name: "فسا", province: "فارس", country: "ایران", lat: 28.9383, lon: 53.6475, timezone: "Asia/Tehran" },
  { name: "داراب", province: "فارس", country: "ایران", lat: 28.7525, lon: 54.5425, timezone: "Asia/Tehran" },
  { name: "لار", province: "فارس", country: "ایران", lat: 27.6831, lon: 54.3394, timezone: "Asia/Tehran" },
  { name: "آباده", province: "فارس", country: "ایران", lat: 31.1611, lon: 52.6506, timezone: "Asia/Tehran" },
  { name: "نی‌ریز", province: "فارس", country: "ایران", lat: 29.1981, lon: 54.3272, timezone: "Asia/Tehran" },
  { name: "فیروزآباد", province: "فارس", country: "ایران", lat: 28.8444, lon: 52.5703, timezone: "Asia/Tehran" },

  // --- آذربایجان شرقی ---
  { name: "تبریز", province: "آذربایجان شرقی", country: "ایران", lat: 38.0962, lon: 46.2738, timezone: "Asia/Tehran" },
  { name: "مراغه", province: "آذربایجان شرقی", country: "ایران", lat: 37.3900, lon: 46.2378, timezone: "Asia/Tehran" },
  { name: "مرند", province: "آذربایجان شرقی", country: "ایران", lat: 38.4329, lon: 45.7749, timezone: "Asia/Tehran" },
  { name: "میانه", province: "آذربایجان شرقی", country: "ایران", lat: 37.4214, lon: 47.7147, timezone: "Asia/Tehran" },
  { name: "اهر", province: "آذربایجان شرقی", country: "ایران", lat: 38.4758, lon: 47.0647, timezone: "Asia/Tehran" },
  { name: "بناب", province: "آذربایجان شرقی", country: "ایران", lat: 37.3417, lon: 46.0558, timezone: "Asia/Tehran" },
  { name: "سراب", province: "آذربایجان شرقی", country: "ایران", lat: 37.9414, lon: 47.5356, timezone: "Asia/Tehran" },
  { name: "شبستر", province: "آذربایجان شرقی", country: "ایران", lat: 38.1803, lon: 45.7042, timezone: "Asia/Tehran" },
  { name: "آذرشهر", province: "آذربایجان شرقی", country: "ایران", lat: 37.7536, lon: 45.9781, timezone: "Asia/Tehran" },
  { name: "اسکو", province: "آذربایجان شرقی", country: "ایران", lat: 37.9092, lon: 46.1289, timezone: "Asia/Tehran" },

  // --- آذربایجان غربی ---
  { name: "ارومیه", province: "آذربایجان غربی", country: "ایران", lat: 37.5527, lon: 45.0761, timezone: "Asia/Tehran" },
  { name: "خوی", province: "آذربایجان غربی", country: "ایران", lat: 38.5500, lon: 44.9500, timezone: "Asia/Tehran" },
  { name: "میاندوآب", province: "آذربایجان غربی", country: "ایران", lat: 36.9667, lon: 46.1000, timezone: "Asia/Tehran" },
  { name: "بوکان", province: "آذربایجان غربی", country: "ایران", lat: 36.5200, lon: 46.2100, timezone: "Asia/Tehran" },
  { name: "نقده", province: "آذربایجان غربی", country: "ایران", lat: 36.9539, lon: 45.3867, timezone: "Asia/Tehran" },
  { name: "پیرانشهر", province: "آذربایجان غربی", country: "ایران", lat: 36.6956, lon: 45.1414, timezone: "Asia/Tehran" },
  { name: "سلماس", province: "آذربایجان غربی", country: "ایران", lat: 38.1981, lon: 44.7711, timezone: "Asia/Tehran" },
  { name: "ماکو", province: "آذربایجان غربی", country: "ایران", lat: 39.2944, lon: 44.4631, timezone: "Asia/Tehran" },
  { name: "سردشت", province: "آذربایجان غربی", country: "ایران", lat: 36.1531, lon: 45.4769, timezone: "Asia/Tehran" },
  { name: "شاهین‌دژ", province: "آذربایجان غربی", country: "ایران", lat: 36.6772, lon: 46.5672, timezone: "Asia/Tehran" },
  { name: "تکاب", province: "آذربایجان غربی", country: "ایران", lat: 36.4000, lon: 47.1100, timezone: "Asia/Tehran" },
  { name: "مهاباد", province: "آذربایجان غربی", country: "ایران", lat: 36.7667, lon: 45.7167, timezone: "Asia/Tehran" },

  // --- خوزستان ---
  { name: "اهواز", province: "خوزستان", country: "ایران", lat: 31.3183, lon: 48.6706, timezone: "Asia/Tehran" },
  { name: "آبادان", province: "خوزستان", country: "ایران", lat: 30.3392, lon: 48.3043, timezone: "Asia/Tehran" },
  { name: "خرمشهر", province: "خوزستان", country: "ایران", lat: 30.4408, lon: 48.1814, timezone: "Asia/Tehran" },
  { name: "دزفول", province: "خوزستان", country: "ایران", lat: 32.3811, lon: 48.4042, timezone: "Asia/Tehran" },
  { name: "اندیمشک", province: "خوزستان", country: "ایران", lat: 32.4625, lon: 48.3569, timezone: "Asia/Tehran" },
  { name: "بهبهان", province: "خوزستان", country: "ایران", lat: 30.5958, lon: 50.2417, timezone: "Asia/Tehran" },
  { name: "شوش", province: "خوزستان", country: "ایران", lat: 32.1942, lon: 48.2436, timezone: "Asia/Tehran" },
  { name: "شوشتر", province: "خوزستان", country: "ایران", lat: 32.0456, lon: 48.8567, timezone: "Asia/Tehran" },
  { name: "مسجدسلیمان", province: "خوزستان", country: "ایران", lat: 31.9333, lon: 49.3000, timezone: "Asia/Tehran" },
  { name: "ایذه", province: "خوزستان", country: "ایران", lat: 31.8333, lon: 49.8667, timezone: "Asia/Tehran" },

  // --- قم ---
  { name: "قم", province: "قم", country: "ایران", lat: 34.6399, lon: 50.8759, timezone: "Asia/Tehran" },
  { name: "کهک", province: "قم", country: "ایران", lat: 34.3833, lon: 50.9000, timezone: "Asia/Tehran" },
  { name: "جعفریه", province: "قم", country: "ایران", lat: 34.6333, lon: 50.5667, timezone: "Asia/Tehran" },

  // --- کرمانشاه ---
  { name: "کرمانشاه", province: "کرمانشاه", country: "ایران", lat: 34.3142, lon: 47.0650, timezone: "Asia/Tehran" },
  { name: "اسلام‌آباد غرب", province: "کرمانشاه", country: "ایران", lat: 34.1125, lon: 46.5269, timezone: "Asia/Tehran" },
  { name: "هرسین", province: "کرمانشاه", country: "ایران", lat: 34.2714, lon: 47.5858, timezone: "Asia/Tehran" },
  { name: "کنگاور", province: "کرمانشاه", country: "ایران", lat: 34.5050, lon: 47.9669, timezone: "Asia/Tehran" },
  { name: "سنقر", province: "کرمانشاه", country: "ایران", lat: 34.7833, lon: 47.6000, timezone: "Asia/Tehran" },
  { name: "پاوه", province: "کرمانشاه", country: "ایران", lat: 35.0444, lon: 46.3572, timezone: "Asia/Tehran" },
  { name: "جوانرود", province: "کرمانشاه", country: "ایران", lat: 34.8083, lon: 46.4889, timezone: "Asia/Tehran" },
  { name: "قصر شیرین", province: "کرمانشاه", country: "ایران", lat: 34.5156, lon: 45.5792, timezone: "Asia/Tehran" },
  { name: "گیلانغرب", province: "کرمانشاه", country: "ایران", lat: 34.1422, lon: 45.9203, timezone: "Asia/Tehran" },

  // --- گیلان ---
  { name: "رشت", province: "گیلان", country: "ایران", lat: 37.2808, lon: 49.5832, timezone: "Asia/Tehran" },
  { name: "بندر انزلی", province: "گیلان", country: "ایران", lat: 37.4725, lon: 49.4622, timezone: "Asia/Tehran" },
  { name: "لاهیجان", province: "گیلان", country: "ایران", lat: 37.2011, lon: 50.0031, timezone: "Asia/Tehran" },
  { name: "آستارا", province: "گیلان", country: "ایران", lat: 38.4253, lon: 48.8756, timezone: "Asia/Tehran" },
  { name: "تالش", province: "گیلان", country: "ایران", lat: 37.8000, lon: 48.9000, timezone: "Asia/Tehran" },
  { name: "فومن", province: "گیلان", country: "ایران", lat: 37.2211, lon: 49.3167, timezone: "Asia/Tehran" },
  { name: "صومعه‌سرا", province: "گیلان", country: "ایران", lat: 37.3108, lon: 49.3211, timezone: "Asia/Tehran" },
  { name: "رودسر", province: "گیلان", country: "ایران", lat: 37.1403, lon: 50.2897, timezone: "Asia/Tehran" },
  { name: "لنگرود", province: "گیلان", country: "ایران", lat: 37.1978, lon: 50.1494, timezone: "Asia/Tehran" },

  // --- سیستان و بلوچستان ---
  { name: "زاهدان", province: "سیستان و بلوچستان", country: "ایران", lat: 29.4963, lon: 60.8629, timezone: "Asia/Tehran" },
  { name: "زابل", province: "سیستان و بلوچستان", country: "ایران", lat: 31.0300, lon: 61.4900, timezone: "Asia/Tehran" },
  { name: "چابهار", province: "سیستان و بلوچستان", country: "ایران", lat: 25.2919, lon: 60.6431, timezone: "Asia/Tehran" },
  { name: "ایرانشهر", province: "سیستان و بلوچستان", country: "ایران", lat: 27.2025, lon: 60.6847, timezone: "Asia/Tehran" },
  { name: "سراوان", province: "سیستان و بلوچستان", country: "ایران", lat: 27.3708, lon: 62.3342, timezone: "Asia/Tehran" },
  { name: "خاش", province: "سیستان و بلوچستان", country: "ایران", lat: 28.2214, lon: 61.2147, timezone: "Asia/Tehran" },
  { name: "نیک‌شهر", province: "سیستان و بلوچستان", country: "ایران", lat: 26.2267, lon: 60.2136, timezone: "Asia/Tehran" },
  { name: "کنارک", province: "سیستان و بلوچستان", country: "ایران", lat: 25.3575, lon: 60.3836, timezone: "Asia/Tehran" },

  // --- همدان ---
  { name: "همدان", province: "همدان", country: "ایران", lat: 34.7983, lon: 48.5148, timezone: "Asia/Tehran" },
  { name: "ملایر", province: "همدان", country: "ایران", lat: 34.2964, lon: 48.8239, timezone: "Asia/Tehran" },
  { name: "نهاوند", province: "همدان", country: "ایران", lat: 34.1886, lon: 48.3739, timezone: "Asia/Tehran" },
  { name: "تویسرکان", province: "همدان", country: "ایران", lat: 34.5461, lon: 48.4472, timezone: "Asia/Tehran" },
  { name: "اسدآباد", province: "همدان", country: "ایران", lat: 34.7842, lon: 48.1178, timezone: "Asia/Tehran" },
  { name: "بهار", province: "همدان", country: "ایران", lat: 34.9075, lon: 48.4414, timezone: "Asia/Tehran" },
  { name: "کبودراهنگ", province: "همدان", country: "ایران", lat: 35.2067, lon: 48.7253, timezone: "Asia/Tehran" },

  // --- کرمان ---
  { name: "کرمان", province: "کرمان", country: "ایران", lat: 30.2839, lon: 57.0834, timezone: "Asia/Tehran" },
  { name: "سیرجان", province: "کرمان", country: "ایران", lat: 29.4514, lon: 55.6711, timezone: "Asia/Tehran" },
  { name: "رفسنجان", province: "کرمان", country: "ایران", lat: 30.4067, lon: 55.9933, timezone: "Asia/Tehran" },
  { name: "جیرفت", province: "کرمان", country: "ایران", lat: 28.6781, lon: 57.7333, timezone: "Asia/Tehran" },
  { name: "بم", province: "کرمان", country: "ایران", lat: 29.1061, lon: 58.3569, timezone: "Asia/Tehran" },
  { name: "زرند", province: "کرمان", country: "ایران", lat: 30.8125, lon: 56.5639, timezone: "Asia/Tehran" },
  { name: "کهنوج", province: "کرمان", country: "ایران", lat: 27.9500, lon: 57.7000, timezone: "Asia/Tehran" },
  { name: "بردسیر", province: "کرمان", country: "ایران", lat: 29.9275, lon: 56.5719, timezone: "Asia/Tehran" },
  { name: "بافت", province: "کرمان", country: "ایران", lat: 29.2333, lon: 56.6000, timezone: "Asia/Tehran" },

  // --- یزد ---
  { name: "یزد", province: "یزد", country: "ایران", lat: 31.8974, lon: 54.3569, timezone: "Asia/Tehran" },
  { name: "میبد", province: "یزد", country: "ایران", lat: 32.2500, lon: 54.0167, timezone: "Asia/Tehran" },
  { name: "اردکان", province: "یزد", country: "ایران", lat: 32.3100, lon: 54.0175, timezone: "Asia/Tehran" },
  { name: "بافق", province: "یزد", country: "ایران", lat: 31.6125, lon: 55.4111, timezone: "Asia/Tehran" },
  { name: "مهریز", province: "یزد", country: "ایران", lat: 31.5914, lon: 54.4428, timezone: "Asia/Tehran" },
  { name: "تفت", province: "یزد", country: "ایران", lat: 31.7456, lon: 54.2053, timezone: "Asia/Tehran" },
  { name: "ابرکوه", province: "یزد", country: "ایران", lat: 31.1289, lon: 53.2822, timezone: "Asia/Tehran" },

  // --- اردبیل ---
  { name: "اردبیل", province: "اردبیل", country: "ایران", lat: 38.2498, lon: 48.2933, timezone: "Asia/Tehran" },
  { name: "پارس‌آباد", province: "اردبیل", country: "ایران", lat: 39.6497, lon: 47.9183, timezone: "Asia/Tehran" },
  { name: "مشگین‌شهر", province: "اردبیل", country: "ایران", lat: 38.3994, lon: 47.6803, timezone: "Asia/Tehran" },
  { name: "خلخال", province: "اردبیل", country: "ایران", lat: 37.6189, lon: 48.5256, timezone: "Asia/Tehran" },
  { name: "گرمی", province: "اردبیل", country: "ایران", lat: 39.0389, lon: 48.0817, timezone: "Asia/Tehran" },
  { name: "بیله‌سوار", province: "اردبیل", country: "ایران", lat: 39.3778, lon: 48.3453, timezone: "Asia/Tehran" },
  { name: "نمین", province: "اردبیل", country: "ایران", lat: 38.4258, lon: 48.4839, timezone: "Asia/Tehran" },
  { name: "سرعین", province: "اردبیل", country: "ایران", lat: 38.1500, lon: 48.0667, timezone: "Asia/Tehran" },

  // --- هرمزگان ---
  { name: "بندرعباس", province: "هرمزگان", country: "ایران", lat: 27.1832, lon: 56.2666, timezone: "Asia/Tehran" },
  { name: "قشم", province: "هرمزگان", country: "ایران", lat: 26.9500, lon: 56.2667, timezone: "Asia/Tehran" },
  { name: "میناب", province: "هرمزگان", country: "ایران", lat: 27.1500, lon: 57.0833, timezone: "Asia/Tehran" },
  { name: "بندر لنگه", province: "هرمزگان", country: "ایران", lat: 26.5525, lon: 54.8836, timezone: "Asia/Tehran" },
  { name: "بندر خمیر", province: "هرمزگان", country: "ایران", lat: 26.9525, lon: 55.5847, timezone: "Asia/Tehran" },
  { name: "پارسیان", province: "هرمزگان", country: "ایران", lat: 27.2086, lon: 53.0356, timezone: "Asia/Tehran" },
  { name: "رودان", province: "هرمزگان", country: "ایران", lat: 27.4500, lon: 57.1833, timezone: "Asia/Tehran" },

  // --- مرکزی ---
  { name: "اراک", province: "مرکزی", country: "ایران", lat: 34.0917, lon: 49.6892, timezone: "Asia/Tehran" },
  { name: "ساوه", province: "مرکزی", country: "ایران", lat: 35.0211, lon: 50.3569, timezone: "Asia/Tehran" },
  { name: "خمین", province: "مرکزی", country: "ایران", lat: 33.6419, lon: 50.0806, timezone: "Asia/Tehran" },
  { name: "محلات", province: "مرکزی", country: "ایران", lat: 33.9103, lon: 50.4533, timezone: "Asia/Tehran" },
  { name: "دلیجان", province: "مرکزی", country: "ایران", lat: 33.9892, lon: 50.6853, timezone: "Asia/Tehran" },
  { name: "شازند", province: "مرکزی", country: "ایران", lat: 33.9350, lon: 49.4114, timezone: "Asia/Tehran" },
  { name: "زرندیه", province: "مرکزی", country: "ایران", lat: 35.3500, lon: 50.4833, timezone: "Asia/Tehran" },
  { name: "تفرش", province: "مرکزی", country: "ایران", lat: 34.6919, lon: 50.0131, timezone: "Asia/Tehran" },

  // --- قزوین ---
  { name: "قزوین", province: "قزوین", country: "ایران", lat: 36.2797, lon: 50.0049, timezone: "Asia/Tehran" },
  { name: "تاکستان", province: "قزوین", country: "ایران", lat: 36.0697, lon: 49.6933, timezone: "Asia/Tehran" },
  { name: "آبیک", province: "قزوین", country: "ایران", lat: 36.0400, lon: 50.5311, timezone: "Asia/Tehran" },
  { name: "بویین‌زهرا", province: "قزوین", country: "ایران", lat: 35.7706, lon: 50.0522, timezone: "Asia/Tehran" },
  { name: "الوند", province: "قزوین", country: "ایران", lat: 36.1844, lon: 50.0653, timezone: "Asia/Tehran" },
  { name: "آوج", province: "قزوین", country: "ایران", lat: 35.5803, lon: 49.2222, timezone: "Asia/Tehran" },

  // --- کردستان ---
  { name: "سنندج", province: "کردستان", country: "ایران", lat: 35.3219, lon: 46.9862, timezone: "Asia/Tehran" },
  { name: "سقز", province: "کردستان", country: "ایران", lat: 36.2450, lon: 46.2736, timezone: "Asia/Tehran" },
  { name: "مریوان", province: "کردستان", country: "ایران", lat: 35.5264, lon: 46.1764, timezone: "Asia/Tehran" },
  { name: "بانه", province: "کردستان", country: "ایران", lat: 35.9953, lon: 45.8853, timezone: "Asia/Tehran" },
  { name: "قروه", province: "کردستان", country: "ایران", lat: 35.1667, lon: 47.8000, timezone: "Asia/Tehran" },
  { name: "بیجار", province: "کردستان", country: "ایران", lat: 35.8667, lon: 47.6000, timezone: "Asia/Tehran" },
  { name: "دیواندره", province: "کردستان", country: "ایران", lat: 35.9117, lon: 47.0244, timezone: "Asia/Tehran" },
  { name: "کامیاران", province: "کردستان", country: "ایران", lat: 34.7942, lon: 46.9347, timezone: "Asia/Tehran" },

  // --- زنجان ---
  { name: "زنجان", province: "زنجان", country: "ایران", lat: 36.6736, lon: 48.4787, timezone: "Asia/Tehran" },
  { name: "ابهر", province: "زنجان", country: "ایران", lat: 36.1444, lon: 49.2208, timezone: "Asia/Tehran" },
  { name: "خرمدره", province: "زنجان", country: "ایران", lat: 36.2114, lon: 49.1831, timezone: "Asia/Tehran" },
  { name: "قیدار", province: "زنجان", country: "ایران", lat: 36.1197, lon: 48.5872, timezone: "Asia/Tehran" },
  { name: "ماه‌نشان", province: "زنجان", country: "ایران", lat: 36.7425, lon: 47.6742, timezone: "Asia/Tehran" },
  { name: "طارم", province: "زنجان", country: "ایران", lat: 36.9333, lon: 48.8667, timezone: "Asia/Tehran" },

  // --- گلستان ---
  { name: "گرگان", province: "گلستان", country: "ایران", lat: 36.8427, lon: 54.4437, timezone: "Asia/Tehran" },
  { name: "گنبد کاووس", province: "گلستان", country: "ایران", lat: 37.2444, lon: 55.1667, timezone: "Asia/Tehran" },
  { name: "علی‌آباد", province: "گلستان", country: "ایران", lat: 36.9092, lon: 54.8519, timezone: "Asia/Tehran" },
  { name: "بندر ترکمن", province: "گلستان", country: "ایران", lat: 36.9000, lon: 54.0667, timezone: "Asia/Tehran" },
  { name: "آق‌قلا", province: "گلستان", country: "ایران", lat: 37.0114, lon: 54.4558, timezone: "Asia/Tehran" },
  { name: "آزادشهر", province: "گلستان", country: "ایران", lat: 37.0753, lon: 55.1708, timezone: "Asia/Tehran" },
  { name: "کردکوی", province: "گلستان", country: "ایران", lat: 36.7931, lon: 54.1094, timezone: "Asia/Tehran" },
  { name: "مینودشت", province: "گلستان", country: "ایران", lat: 37.2283, lon: 55.3733, timezone: "Asia/Tehran" },

  // --- مازندران ---
  { name: "ساری", province: "مازندران", country: "ایران", lat: 36.5633, lon: 53.0601, timezone: "Asia/Tehran" },
  { name: "بابل", province: "مازندران", country: "ایران", lat: 36.5386, lon: 52.6789, timezone: "Asia/Tehran" },
  { name: "آمل", province: "مازندران", country: "ایران", lat: 36.4697, lon: 52.3506, timezone: "Asia/Tehran" },
  { name: "قائم‌شهر", province: "مازندران", country: "ایران", lat: 36.4633, lon: 52.8600, timezone: "Asia/Tehran" },
  { name: "بهشهر", province: "مازندران", country: "ایران", lat: 36.6931, lon: 53.5528, timezone: "Asia/Tehran" },
  { name: "بابلسر", province: "مازندران", country: "ایران", lat: 36.7025, lon: 52.6517, timezone: "Asia/Tehran" },
  { name: "نکا", province: "مازندران", country: "ایران", lat: 36.6500, lon: 53.3000, timezone: "Asia/Tehran" },
  { name: "چالوس", province: "مازندران", country: "ایران", lat: 36.6489, lon: 51.4219, timezone: "Asia/Tehran" },
  { name: "نوشهر", province: "مازندران", country: "ایران", lat: 36.6478, lon: 51.4956, timezone: "Asia/Tehran" },
  { name: "رامسر", province: "مازندران", country: "ایران", lat: 36.9189, lon: 50.6531, timezone: "Asia/Tehran" },
  { name: "تنکابن", province: "مازندران", country: "ایران", lat: 36.8194, lon: 50.8731, timezone: "Asia/Tehran" },
  { name: "فریدون‌کنار", province: "مازندران", country: "ایران", lat: 36.6903, lon: 52.5117, timezone: "Asia/Tehran" },

  // --- بوشهر ---
  { name: "بوشهر", province: "بوشهر", country: "ایران", lat: 28.9234, lon: 50.8203, timezone: "Asia/Tehran" },
  { name: "برازجان", province: "بوشهر", country: "ایران", lat: 29.2667, lon: 51.2167, timezone: "Asia/Tehran" },
  { name: "گناوه", province: "بوشهر", country: "ایران", lat: 29.5786, lon: 50.5192, timezone: "Asia/Tehran" },
  { name: "دیلم", province: "بوشهر", country: "ایران", lat: 30.0500, lon: 50.1667, timezone: "Asia/Tehran" },
  { name: "کنگان", province: "بوشهر", country: "ایران", lat: 27.8381, lon: 52.0636, timezone: "Asia/Tehran" },
  { name: "جم", province: "بوشهر", country: "ایران", lat: 27.8281, lon: 52.3344, timezone: "Asia/Tehran" },
  { name: "دیر", province: "بوشهر", country: "ایران", lat: 27.7333, lon: 51.9333, timezone: "Asia/Tehran" },
  { name: "خورموج", province: "بوشهر", country: "ایران", lat: 28.6403, lon: 51.3839, timezone: "Asia/Tehran" },

  // --- خراسان جنوبی ---
  { name: "بیرجند", province: "خراسان جنوبی", country: "ایران", lat: 32.8649, lon: 59.2262, timezone: "Asia/Tehran" },
  { name: "قائن", province: "خراسان جنوبی", country: "ایران", lat: 33.7256, lon: 59.1833, timezone: "Asia/Tehran" },
  { name: "فردوس", province: "خراسان جنوبی", country: "ایران", lat: 34.0189, lon: 58.1719, timezone: "Asia/Tehran" },
  { name: "نهبندان", province: "خراسان جنوبی", country: "ایران", lat: 31.5419, lon: 60.0397, timezone: "Asia/Tehran" },
  { name: "بشرویه", province: "خراسان جنوبی", country: "ایران", lat: 33.8672, lon: 57.4294, timezone: "Asia/Tehran" },
  { name: "سربیشه", province: "خراسان جنوبی", country: "ایران", lat: 32.5764, lon: 59.7972, timezone: "Asia/Tehran" },
  { name: "طبس", province: "خراسان جنوبی", country: "ایران", lat: 33.5964, lon: 56.9272, timezone: "Asia/Tehran" },

  // --- خراسان شمالی ---
  { name: "بجنورد", province: "خراسان شمالی", country: "ایران", lat: 37.4747, lon: 57.3290, timezone: "Asia/Tehran" },
  { name: "شیروان", province: "خراسان شمالی", country: "ایران", lat: 37.3975, lon: 57.9294, timezone: "Asia/Tehran" },
  { name: "اسفراین", province: "خراسان شمالی", country: "ایران", lat: 37.0761, lon: 57.5083, timezone: "Asia/Tehran" },
  { name: "آشخانه", province: "خراسان شمالی", country: "ایران", lat: 37.5603, lon: 56.9197, timezone: "Asia/Tehran" },
  { name: "گرمه", province: "خراسان شمالی", country: "ایران", lat: 37.1667, lon: 56.5333, timezone: "Asia/Tehran" },
  { name: "جاجرم", province: "خراسان شمالی", country: "ایران", lat: 36.9500, lon: 56.3833, timezone: "Asia/Tehran" },
  { name: "فاروج", province: "خراسان شمالی", country: "ایران", lat: 37.2314, lon: 58.2158, timezone: "Asia/Tehran" },

  // --- ایلام ---
  { name: "ایلام", province: "ایلام", country: "ایران", lat: 33.6374, lon: 46.4227, timezone: "Asia/Tehran" },
  { name: "دهلران", province: "ایلام", country: "ایران", lat: 32.6939, lon: 47.2675, timezone: "Asia/Tehran" },
  { name: "آبدانان", province: "ایلام", country: "ایران", lat: 32.9925, lon: 47.4197, timezone: "Asia/Tehran" },
  { name: "ایوان", province: "ایلام", country: "ایران", lat: 33.8894, lon: 46.1708, timezone: "Asia/Tehran" },
  { name: "دره‌شهر", province: "ایلام", country: "ایران", lat: 33.1431, lon: 47.3786, timezone: "Asia/Tehran" },
  { name: "مهران", province: "ایلام", country: "ایران", lat: 33.2708, lon: 46.1639, timezone: "Asia/Tehran" },

  // --- سمنان ---
  { name: "سمنان", province: "سمنان", country: "ایران", lat: 35.5729, lon: 53.3971, timezone: "Asia/Tehran" },
  { name: "شاهرود", province: "سمنان", country: "ایران", lat: 36.4167, lon: 54.9833, timezone: "Asia/Tehran" },
  { name: "دامغان", province: "سمنان", country: "ایران", lat: 36.1667, lon: 54.3500, timezone: "Asia/Tehran" },
  { name: "گرمسار", province: "سمنان", country: "ایران", lat: 35.2167, lon: 52.3333, timezone: "Asia/Tehran" },
  { name: "مهدی‌شهر", province: "سمنان", country: "ایران", lat: 35.7108, lon: 53.3511, timezone: "Asia/Tehran" },
  { name: "آرادان", province: "سمنان", country: "ایران", lat: 35.2522, lon: 52.4944, timezone: "Asia/Tehran" },

  // --- کهگیلویه و بویراحمد ---
  { name: "یاسوج", province: "کهگیلویه و بویراحمد", country: "ایران", lat: 30.6682, lon: 51.5879, timezone: "Asia/Tehran" },
  { name: "دوگنبدان", province: "کهگیلویه و بویراحمد", country: "ایران", lat: 30.3547, lon: 50.7986, timezone: "Asia/Tehran" },
  { name: "دهدشت", province: "کهگیلویه و بویراحمد", country: "ایران", lat: 30.7944, lon: 50.5653, timezone: "Asia/Tehran" },
  { name: "سی‌سخت", province: "کهگیلویه و بویراحمد", country: "ایران", lat: 30.8608, lon: 51.4594, timezone: "Asia/Tehran" },

  // --- لرستان ---
  { name: "خرم‌آباد", province: "لرستان", country: "ایران", lat: 33.4878, lon: 48.3558, timezone: "Asia/Tehran" },
  { name: "بروجرد", province: "لرستان", country: "ایران", lat: 33.8947, lon: 48.7511, timezone: "Asia/Tehran" },
  { name: "دورود", province: "لرستان", country: "ایران", lat: 33.4967, lon: 49.0778, timezone: "Asia/Tehran" },
  { name: "کوهدشت", province: "لرستان", country: "ایران", lat: 33.5339, lon: 47.6061, timezone: "Asia/Tehran" },
  { name: "الیگودرز", province: "لرستان", country: "ایران", lat: 33.4011, lon: 49.6942, timezone: "Asia/Tehran" },
  { name: "ازنا", province: "لرستان", country: "ایران", lat: 33.4547, lon: 49.4553, timezone: "Asia/Tehran" },
  { name: "پل‌دختر", province: "لرستان", country: "ایران", lat: 33.1544, lon: 47.7161, timezone: "Asia/Tehran" },

  // --- چهارمحال و بختیاری ---
  { name: "شهرکرد", province: "چهارمحال و بختیاری", country: "ایران", lat: 32.3256, lon: 50.8644, timezone: "Asia/Tehran" },
  { name: "بروجن", province: "چهارمحال و بختیاری", country: "ایران", lat: 31.9667, lon: 51.2833, timezone: "Asia/Tehran" },
  { name: "فارسان", province: "چهارمحال و بختیاری", country: "ایران", lat: 32.2564, lon: 50.5619, timezone: "Asia/Tehran" },
  { name: "لردگان", province: "چهارمحال و بختیاری", country: "ایران", lat: 31.5103, lon: 50.8294, timezone: "Asia/Tehran" },
  { name: "سامان", province: "چهارمحال و بختیاری", country: "ایران", lat: 32.4500, lon: 50.9167, timezone: "Asia/Tehran" },

  // --- جهان ---
  { name: "لندن", country: "انگلستان", lat: 51.5074, lon: -0.1278, timezone: "Europe/London" },
  { name: "پاریس", country: "فرانسه", lat: 48.8566, lon: 2.3522, timezone: "Europe/Paris" },
  { name: "برلین", country: "آلمان", lat: 52.5200, lon: 13.4050, timezone: "Europe/Berlin" },
  { name: "رم", country: "ایتالیا", lat: 41.9028, lon: 12.4964, timezone: "Europe/Rome" },
  { name: "مادرید", country: "اسپانیا", lat: 40.4168, lon: -3.7038, timezone: "Europe/Madrid" },
  { name: "مسکو", country: "روسیه", lat: 55.7558, lon: 37.6173, timezone: "Europe/Moscow" },
  { name: "نیویورک", country: "آمریکا", lat: 40.7128, lon: -74.0060, timezone: "America/New_York" },
  { name: "لس‌آنجلس", country: "آمریکا", lat: 34.0522, lon: -118.2437, timezone: "America/Los_Angeles" },
  { name: "شیکاگو", country: "آمریکا", lat: 41.8781, lon: -87.6298, timezone: "America/Chicago" },
  { name: "تورنتو", country: "کانادا", lat: 43.6532, lon: -79.3832, timezone: "America/Toronto" },
  { name: "ونکوور", country: "کانادا", lat: 49.2827, lon: -123.1207, timezone: "America/Vancouver" },
  { name: "دبی", country: "امارات", lat: 25.2048, lon: 55.2708, timezone: "Asia/Dubai" },
  { name: "ابوظبی", country: "امارات", lat: 24.4539, lon: 54.3773, timezone: "Asia/Dubai" },
  { name: "استانبول", country: "ترکیه", lat: 41.0082, lon: 28.9784, timezone: "Europe/Istanbul" },
  { name: "آنکارا", country: "ترکیه", lat: 39.9334, lon: 32.8597, timezone: "Europe/Istanbul" },
  { name: "توکیو", country: "ژاپن", lat: 35.6762, lon: 139.6503, timezone: "Asia/Tokyo" },
  { name: "پکن", country: "چین", lat: 39.9042, lon: 116.4074, timezone: "Asia/Shanghai" },
  { name: "سیدنی", country: "استرالیا", lat: -33.8688, lon: 151.2093, timezone: "Australia/Sydney" },
  { name: "ملبورن", country: "استرالیا", lat: -37.8136, lon: 144.9631, timezone: "Australia/Melbourne" },
  { name: "دهلی نو", country: "هند", lat: 28.6139, lon: 77.2090, timezone: "Asia/Kolkata" },
  { name: "قاهره", country: "مصر", lat: 30.0444, lon: 31.2357, timezone: "Africa/Cairo" },
  { name: "ریاض", country: "عربستان", lat: 24.7136, lon: 46.6753, timezone: "Asia/Riyadh" },
  { name: "کویت", country: "کویت", lat: 29.3759, lon: 47.9774, timezone: "Asia/Kuwait" },
  { name: "دوحه", country: "قطر", lat: 25.2854, lon: 51.5310, timezone: "Asia/Qatar" },
  { name: "منامه", country: "بحرین", lat: 26.2285, lon: 50.5860, timezone: "Asia/Bahrain" },
  { name: "مسقط", country: "عمان", lat: 23.5859, lon: 58.4059, timezone: "Asia/Muscat" },
];