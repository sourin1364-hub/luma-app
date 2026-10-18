import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function Logo({ size = 48, className, ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Central Golden Dot */}
      <circle cx="50" cy="50" r="6" fill="currentColor" />
      
      {/* Overlapping Orbits */}
      <ellipse 
        cx="50" cy="50" rx="42" ry="22" 
        stroke="currentColor" strokeWidth="1.5" 
        transform="rotate(30 50 50)" 
      />
      <ellipse 
        cx="50" cy="50" rx="42" ry="22" 
        stroke="currentColor" strokeWidth="1.5" 
        transform="rotate(150 50 50)" 
      />
      <ellipse 
        cx="50" cy="50" rx="42" ry="22" 
        stroke="currentColor" strokeWidth="1.5" 
        transform="rotate(270 50 50)" 
      />
    </svg>
  );
}