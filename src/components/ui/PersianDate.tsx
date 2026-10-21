import { useEffect, useRef } from "react";
import * as jalaali from "jalaali-js";

const MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const enToFa = (str: string | number) => String(str).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

// کامپوننت مشترک اسلایدر
const ScrollPicker = <T extends string | number>({ items, value, onChange, label, format }: { items: T[], value: T, onChange: (v: T) => void, label: string, format: (v: T) => string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // اسکرول به آیتم انتخاب شده در زمان لود اولیه
  useEffect(() => {
    if (containerRef.current) {
      const index = items.indexOf(value);
      if (index !== -1) {
        containerRef.current.scrollTop = index * 40;
      }
    }
  }, []); // فقط یک بار در ابتدا اجرا شود

  const handleScroll = () => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const index = Math.round(el.scrollTop / 40);
    if (items[index] !== undefined && items[index] !== value) {
      onChange(items[index]);
    }
  };

  return (
    <div className="flex flex-col items-center flex-1">
      <span className="text-xs text-[var(--text-muted)] mb-2">{label}</span>
      <div className="relative w-full rounded-xl bg-[var(--bg-card)] border border-[var(--border-gold)] overflow-hidden">
        <div className="picker-fade-top" />
        <div className="picker-fade-bottom" />
        <div className="picker-indicator" />
        <div ref={containerRef} onScroll={handleScroll} className="picker-container py-[40px]">
          {items.map(item => (
            <div
              key={String(item)}
              onClick={() => {
                onChange(item);
                if (containerRef.current) {
                  containerRef.current.scrollTo({ top: items.indexOf(item) * 40, behavior: 'smooth' });
                }
              }}
              className={`picker-item ${value === item ? 'selected' : ''}`}
            >
              {format(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function PersianDateInput({ value, onChange }: { value: { year: number, month: number, day: number }, onChange: (val: { year: number, month: number, day: number }) => void }) {
  const getDaysInMonth = (y: number, m: number) => {
    if (m <= 6) return 31;
    if (m <= 11) return 30;
    return jalaali.isLeapJalaaliYear(y) ? 30 : 29;
  };

  const maxDays = getDaysInMonth(value.year, value.month);

  useEffect(() => {
    if (value.day > maxDays) {
      onChange({ ...value, day: maxDays });
    }
  }, [value.month, value.year, maxDays, value.day, onChange]);

  const years = Array.from({ length: 150 }, (_, i) => 1300 + i); // از ۱۳۰۰ تا ۱۴۵۰
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  return (
    <div className="flex justify-center gap-2 mt-2" dir="rtl">
      <ScrollPicker items={days} value={value.day} onChange={(v) => onChange({ ...value, day: v })} label="روز" format={(v) => enToFa(String(v).padStart(2, '0'))} />
      <ScrollPicker items={MONTHS} value={MONTHS[value.month - 1]} onChange={(v) => onChange({ ...value, month: MONTHS.indexOf(v) + 1 })} label="ماه" format={(v) => v} />
      <ScrollPicker items={years} value={value.year} onChange={(v) => onChange({ ...value, year: v })} label="سال" format={(v) => enToFa(v)} />
    </div>
  );
}

export function PersianTimeInput({ value, onChange }: { value: { hour: number, minute: number }, onChange: (val: { hour: number, minute: number }) => void }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="flex justify-center gap-4 mt-2" dir="rtl">
      <ScrollPicker items={hours} value={value.hour} onChange={(v) => onChange({ ...value, hour: v })} label="ساعت" format={(v) => enToFa(String(v).padStart(2, '0'))} />
      <ScrollPicker items={minutes} value={value.minute} onChange={(v) => onChange({ ...value, minute: v })} label="دقیقه" format={(v) => enToFa(String(v).padStart(2, '0'))} />
    </div>
  );
}