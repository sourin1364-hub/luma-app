import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    let baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D6B56D] disabled:pointer-events-none disabled:opacity-50 ";
    
    if (variant === "default") baseClasses += "bg-[#D6B56D] text-[#0B0D1A] hover:bg-[#c4a55f] shadow-[0_0_15px_rgba(214,181,109,0.3)] ";
    else if (variant === "destructive") baseClasses += "bg-red-900/50 text-red-200 border border-red-700/50 hover:bg-red-900/80 ";
    else if (variant === "outline") baseClasses += "border border-[#D6B56D]/40 bg-transparent text-[#D6B56D] hover:bg-[#D6B56D]/10 ";
    else if (variant === "secondary") baseClasses += "bg-slate-800 text-slate-200 hover:bg-slate-700 ";
    else if (variant === "ghost") baseClasses += "hover:bg-slate-800 hover:text-slate-50 ";
    else if (variant === "link") baseClasses += "text-[#D6B56D] underline-offset-4 hover:underline ";

    if (size === "default") baseClasses += "h-12 px-4 py-2 ";
    else if (size === "sm") baseClasses += "h-9 rounded-lg px-3 ";
    else if (size === "lg") baseClasses += "h-14 rounded-xl px-8 ";
    else if (size === "icon") baseClasses += "h-10 w-10 ";

    return (
      <button
        className={`${baseClasses} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };