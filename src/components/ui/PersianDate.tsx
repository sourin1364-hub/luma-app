import { useState, useEffect, useRef } from "react";
import * as jalaali from "jalaali-js";
import { ChevronDown } from "lucide-react";

const MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const enToFa = (str: string | number) => String(str).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
const faToEn = (str: string) => str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

export function PersianDateInput({ value, onChange }: { value: { year: number, month: number, day: number }, onChange: (val: { year: number, month: number, day: number }) => void }) {
  const [yearStr, setYearStr] = useState(enToFa(value.year));
  const [month, setMonth] = useState(value.month);
  const [day, setDay] = useState(value.day);

  const getDaysInMonth = (y: number, m: number) => {
    if (m <= 6) return 31;
    if (m <= 11) return 30;
    return jalaali.isLeapJalaaliYear(y) ? 30 : 29;
  };

  const enYear = Number(faToEn(yearStr)) || 1360;
  const maxDays = getDaysInMonth(enYear, month);

  useEffect(() => {
    if (day > maxDays) {
      setDay(maxDays);
      onChange({ year: enYear, month, day: maxDays });
    }
  }, [month, maxDays, day, enYear, onChange]);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = enToFa(e.target.value).slice(0, 4);
    setYearStr(val);
    const enVal = Number(faToEn(val));
    if (enVal > 1200 && enVal < 1500) {
      onChange({ year: enVal, month, day });
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = Number(e.target.value);
    setMonth(m);
    onChange({ year: enYear, month: m, day });
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const d = Number(e.target.value);
    setDay(d);
    onChange({ year: enYear, month, day: d });
  };

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

const ScrollPicker = ({ items, value, onChange, label }: { items: number[], value: number, onChange: (v: number) => void, label: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      const selectedEl = el.children[value] as HTMLElement;
      if (selectedEl) {
        el.scrollTo({ top: selectedEl.offsetTop - el.offsetHeight / 2 + selectedEl.offsetHeight / 2, behavior: 'smooth' });
      }
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center flex-1">
      <span className="text-xs text-[var(--text-muted)] mb-1">{label}</span>
      <div ref={containerRef} className="h-32 overflow-y-auto snap-y snap-mandatory w-full hide-scrollbar border border-[var(--border-gold)] rounded-xl bg-[var(--bg-card)] relative">
        {items.map(item => (
          <div
            key={item}
            onClick={() => onChange(item)}
            className={`snap-center h-10 flex items-center justify-center cursor-pointer transition-all ${
              value === item ? "text-[#D6B56D] font-bold text-lg bg-[rgba(214,181,109,0.1)] rounded-lg mx-2 my-1" : "text-[var(--text-main)] text-sm opacity-50"
            }`}
          >
            {enToFa(String(item).padStart(2, '0'))}
          </div>
        ))}
      </div>
    </div>
  );
};

export function PersianTimeInput({ value, onChange }: { value: { hour: number, minute: number }, onChange: (val: { hour: number, minute: number }) => void }) {
  return (
    <div className="flex justify-center gap-4 mt-2">
      <ScrollPicker items={Array.from({ length: 24 }, (_, i) => i)} value={value.hour} onChange={(v) => onChange({ ...value, hour: v })} label="ساعت" />
      <ScrollPicker items={Array.from({ length: 60 }, (_, i) => i)} value={value.minute} onChange={(v) => onChange({ ...value, minute: v })} label="دقیقه" />
    </div>
  );
}