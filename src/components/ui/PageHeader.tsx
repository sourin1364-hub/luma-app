import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  icon?: ReactNode;
  onBack: () => void;
}

export function PageHeader({ title, icon, onBack }: PageHeaderProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full max-w-5xl mb-8 relative z-10 px-2 sm:px-0">
      {/* دکمه بازگشت (سمت راست در RTL) */}
      <button
        onClick={onBack}
        className="justify-self-start flex items-center gap-1.5 text-sm font-bold text-[rgb(var(--glow-color-rgb))] hover:bg-[rgba(var(--glow-color-rgb),0.1)] px-2 sm:px-4 py-2 rounded-full transition-colors"
      >
        <ArrowRight className="w-5 h-5 shrink-0" />
        <span className="hidden sm:inline">بازگشت</span>
      </button>

      {/* عنوان و آیکون (دقیقا در مرکز) */}
      <h1 className="justify-self-center text-lg sm:text-2xl font-bold text-[rgb(var(--glow-color-rgb))] drop-shadow-md flex items-center justify-center gap-2 text-center max-w-[200px] sm:max-w-full truncate">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{title}</span>
      </h1>

      {/* فضای خالی برای توازن شبکه (سمت چپ در RTL) */}
      <div className="justify-self-end w-8 sm:w-24"></div>
    </div>
  );
}