import { useState, useEffect } from "react";
import * as jalaali from "jalaali-js";
import { ChevronDown } from "lucide-react";

const MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const enToFa = (str: string | number) => String(str).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

export function PersianDateInput({ value, onChange }: { value: { year: number, month: number, day: number }, onChange: (val: { year: number, month: number, day: number }) => void }) {
  const [yearStr, setYearStr] = useState(enToFa(value.year));
  const [month, setMonth] = useState(value.month);
  const [day, setDay] = useState(value.day);

  // محاسبه تعداد روزهای ماه جاری
  const getDaysInMonth = (y: number, m: number) => {
    if (m <= 6) return 31;
    if (m <= 11) return 30;
    return jalaali.isLeapJalaaliYear(y) ? 30 : 29;
  };

  const maxDays = getDaysInMonth(Number(yearStr.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))) || 1360, month);

  useEffect(() => {
    if (day > maxDays) {
      setDay(maxDays);
      onChange({ year: Number(yearStr.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))), month, day: maxDays });
    }
  }, [month, maxDays, day, yearStr, onChange]);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = enToFa(e.target.value).slice(0, 4);
    setYearStr(val);
    const enVal = Number(val.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))));
    if (enVal > 1200 && enVal < 1500) {
      onChange({ year: enVal, month, day });
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = Number(e.target.value);
    setMonth(m);
    onChange({ year: Number(yearStr.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))), month: m, day });
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const d = Number(e.target.value);
    setDay(d);
    onChange({ year: Number(yearStr.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))), month, day: d });
  };

  const enYear = Number(yearStr.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))));

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <div className="relative">
          <input value={yearStr} onChange={handleYearChange} placeholder="۱۳۷۰" className="lux-input w-full text-center" />
        </div>
        <div className="relative">
          <select value={month} onChange={handleMonthChange} className="lux-select w-full">
            {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>
          <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D6B56D] pointer-events-none" />
        </div>
        <div className="relative">
          <select value={day} onChange={handleDayChange} className="lux-select w-full">
            {Array.from({ length: maxDays }, (_, i) => i + 1).map(d => <option key={d} value={d}>{enToFa(d)}</option>)}
          </select>
          <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D6B56D] pointer-events-none" />
        </div>
      </div>
      {enYear > 1200 && (
        <p className="text-center text-xs text-[rgb(var(--glow-color-rgb))] font-bold mt-1">
          {enToFa(day)} {MONTHS[month - 1]} {enToFa(enYear)}
        </p>
      )}
    </div>
  );
}

export function PersianTimeInput({ value, onChange }: { value: { hour: number, minute: number }, onChange: (val: { hour: number, minute: number }) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="relative">
        <select value={value.hour} onChange={(e) => onChange({ ...value, hour: Number(e.target.value) })} className="lux-select w-full">
          {Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={h}>{enToFa(String(h).padStart(2, '0'))}</option>)}
        </select>
        <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D6B56D] pointer-events-none" />
      </div>
      <div className="relative">
        <select value={value.minute} onChange={(e) => onChange({ ...value, minute: Number(e.target.value) })} className="lux-select w-full">
          {Array.from({ length: 60 }, (_, i) => i).map(m => <option key={m} value={m}>{enToFa(String(m).padStart(2, '0'))}</option>)}
        </select>
        <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D6B56D] pointer-events-none" />
      </div>
    </div>
  );
}