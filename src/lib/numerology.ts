// جدول دقیق ابجد کبیر برای حروف فارسی و عربی
const abjadMap: Record<string, number> = {
  'ا': 1, 'آ': 1, 'أ': 1, 'إ': 1, 'ء': 1, 'ب': 2, 'پ': 2, 'ج': 3, 'چ': 3, 'د': 4, 'ذ': 700,
  'ر': 200, 'ز': 7, 'ژ': 7, 'س': 60, 'ش': 300, 'ص': 90, 'ض': 800, 'ط': 9, 'ظ': 900,
  'ع': 70, 'غ': 1000, 'ف': 80, 'ق': 100, 'ک': 20, 'گ': 20, 'ل': 30, 'م': 40, 'ن': 50,
  'و': 6, 'ؤ': 6, 'ه': 5, 'ة': 5, 'ی': 10, 'ي': 10, 'ئ': 10
};

// 1. محاسبه دقیق ابجد کبیر (فقط حروف فارسی/عربی را جمع می‌کند)
export function getAbjadKabir(text: string): number {
  try {
    let sum = 0;
    for (const char of text) {
      const cleanChar = char.trim();
      if (abjadMap[cleanChar] !== undefined) {
        sum += abjadMap[cleanChar];
      }
    }
    return sum || 0;
  } catch (e) { return 0; }
}

// 2. محاسبه استاندارد عدد زندگی (جمع ارقام تاریخ تولد میلادی)
export function getLifePath(year: number, month: number, day: number): number {
  try {
    const str = `${year || 1995}${month || 3}${day || 21}`;
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      const digit = Number(str[i]);
      if (!isNaN(digit)) sum += digit;
    }
    // کاهش تا یک رقم (به جز اعداد شاهکار)
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      let nextSum = 0;
      const s = String(sum);
      for (let i = 0; i < s.length; i++) nextSum += Number(s[i]);
      sum = nextSum;
    }
    return sum || 1;
  } catch (e) { return 1; }
}

// 3. محاسبه عدد شانس از روی نام کاربری (روش فیثاغورثی برای انگلیسی، ابجد برای فارسی)
export function getLuckyNumber(name: string): number {
  try {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name[i].toLowerCase();
      if (abjadMap[char] !== undefined) {
        sum += abjadMap[char]; // اگر فارسی بود
      } else if (char >= 'a' && char <= 'z') {
        sum += (char.charCodeAt(0) - 96); // اگر انگلیسی بود (a=1, b=2...)
      }
    }
    while (sum > 9) {
      let nextSum = 0;
      const s = String(sum);
      for (let i = 0; i < s.length; i++) nextSum += Number(s[i]);
      sum = nextSum;
    }
    return sum || 1;
  } catch (e) { return 1; }
}

// 4. محاسبه عدد ثروت
export function getWealthNumber(lifePath: number, luckyNumber: number): number {
  try {
    let sum = (Number(lifePath) || 0) + (Number(luckyNumber) || 0);
    while (sum > 9) {
      let nextSum = 0;
      const s = String(sum);
      for (let i = 0; i < s.length; i++) nextSum += Number(s[i]);
      sum = nextSum;
    }
    return sum || 1;
  } catch (e) { return 1; }
}