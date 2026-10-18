import { motion } from "framer-motion";

const ZODIAC_SIGNS = ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"];
const ZODIAC_EMOJI = ["", "", "", "", "", "", "", "", "", "", "", ""];

const ELEMENT_COLORS: Record<string, string> = {
  "حمل": "#EF4444", "اسد": "#F97316", "قوس": "#F59E0B",
  "ثور": "#22C55E", "سنبله": "#16A34A", "جدی": "#15803D",
  "جوزا": "#3B82F6", "میزان": "#0EA5E9", "دلو": "#06B6D4",
  "سرطان": "#A855F7", "عقرب": "#8B5CF6", "حوت": "#D946EF"
};

// استفاده از یونیکد برای جلوگیری از خرابی در PowerShell
const PLANET_SYMBOLS: Record<string, string> = {
  "خورشید": "\u2609",   // 
  "ماه": "\u263D",      // 
  "عطارد": "\u263F",    // 
  "زهره": "\u2640",     // 
  "مریخ": "\u2642",     // 
  "مشتری": "\u2643",    // 
  "زحل": "\u2644",      // 
  "اورانوس": "\u2645",  // 
  "نپتون": "\u2646",    // 
  "پلوتو": "\u2647"     // 
};

const SIZE = 500;
const CX = SIZE / 2;
const CY = SIZE / 2;

const R = {
  outer: 240,
  signOuter: 230,
  signInner: 185,
  planet: 150,
  house: 120,
  houseInner: 85,
  center: 40
};

function polarToCartesian(r: number, angleDeg: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(angleRad), y: CY - r * Math.sin(angleRad) };
}

interface Planet {
  name: string;
  sign: string;
  degree: string;
  absoluteLon: number;
  houseNumber: number;
}

interface ChartWheelProps {
  planets: Planet[];
  ascendantAbsoluteLon: number;
}

export function ChartWheel({ planets, ascendantAbsoluteLon }: ChartWheelProps) {
  const sortedPlanets = [...planets].sort((a, b) => a.absoluteLon - b.absoluteLon);
  
  const planetPositions = sortedPlanets.map((p, i) => {
    let radiusOffset = 0;
    if (i > 0) {
      let diff = p.absoluteLon - sortedPlanets[i - 1].absoluteLon;
      if (diff < 0) diff += 360;
      if (diff < 8) radiusOffset = 18;
    }
    return { ...p, radius: R.planet + radiusOffset };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto my-8"
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-auto drop-shadow-2xl">
        <defs>
          <radialGradient id="wheelGlow">
            <stop offset="0%" stopColor="rgba(var(--glow-color-rgb), 0.15)" />
            <stop offset="70%" stopColor="rgba(var(--glow-color-rgb), 0.02)" />
            <stop offset="100%" stopColor="rgba(var(--glow-color-rgb), 0)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <circle cx={CX} cy={CY} r={R.outer + 20} fill="url(#wheelGlow)" />
        <circle cx={CX} cy={CY} r={R.outer} fill="none" stroke="rgba(var(--glow-color-rgb), 0.4)" strokeWidth="1.5" />
        <circle cx={CX} cy={CY} r={R.signOuter} fill="none" stroke="rgba(var(--glow-color-rgb), 0.6)" strokeWidth="2" filter="url(#glow)" />
        <circle cx={CX} cy={CY} r={R.signInner} fill="none" stroke="rgba(var(--glow-color-rgb), 0.3)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={R.house} fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx={CX} cy={CY} r={R.houseInner} fill="none" stroke="rgba(var(--glow-color-rgb), 0.3)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={R.center} fill="rgba(var(--glow-color-rgb), 0.1)" stroke="rgba(var(--glow-color-rgb), 0.5)" strokeWidth="1" />

        {ZODIAC_SIGNS.map((sign, i) => {
          const startAngle = i * 30;
          const endAngle = (i + 1) * 30;
          const p1 = polarToCartesian(R.signInner, startAngle);
          const p2 = polarToCartesian(R.signOuter, startAngle);
          const p3 = polarToCartesian(R.signOuter, endAngle);
          const p4 = polarToCartesian(R.signInner, endAngle);
          const path = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${R.signOuter} ${R.signOuter} 0 0 0 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${R.signInner} ${R.signInner} 0 0 1 ${p1.x} ${p1.y} Z`;
          
          const centerAngle = startAngle + 15;
          const labelPos = polarToCartesian((R.signOuter + R.signInner) / 2, centerAngle);
          const color = ELEMENT_COLORS[sign] || "#888";
          
          return (
            <g key={sign}>
              <path d={path} fill={color} fillOpacity="0.1" stroke={color} strokeWidth="0.5" strokeOpacity="0.4" />
              <text 
                x={labelPos.x} 
                y={labelPos.y - 6} 
                textAnchor="middle" 
                dominantBaseline="central" 
                fontSize="18" 
                fill={color} 
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
              >
                {ZODIAC_EMOJI[i]}
              </text>
              <text 
                x={labelPos.x} 
                y={labelPos.y + 12} 
                textAnchor="middle" 
                dominantBaseline="central" 
                fontSize="9" 
                fill={color} 
                fontWeight="bold"
                fontFamily="Vazir, sans-serif"
              >
                {sign}
              </text>
            </g>
          );
        })}

        {[...Array(12)].map((_, i) => {
          const angle = ascendantAbsoluteLon + i * 30;
          const inner = polarToCartesian(R.houseInner, angle);
          const outer = polarToCartesian(R.house, angle);
          const isAsc = i === 0;
          
          return (
            <g key={`house-line-${i}`}>
              <line 
                x1={inner.x} 
                y1={inner.y} 
                x2={outer.x} 
                y2={outer.y}
                stroke={isAsc ? "rgba(var(--glow-color-rgb), 1)" : "currentColor"}
                strokeOpacity={isAsc ? 1 : 0.3}
                strokeWidth={isAsc ? 2.5 : 1}
                filter={isAsc ? "url(#glow)" : undefined}
              />
            </g>
          );
        })}

        {[...Array(12)].map((_, i) => {
          const angle = ascendantAbsoluteLon + i * 30 + 15;
          const pos = polarToCartesian((R.house + R.houseInner) / 2, angle);
          return (
            <text 
              key={`house-num-${i}`} 
              x={pos.x} 
              y={pos.y} 
              textAnchor="middle" 
              dominantBaseline="central" 
              fontSize="11" 
              fill="currentColor" 
              opacity="0.6"
              fontWeight="bold"
            >
              {i + 1}
            </text>
          );
        })}

        {(() => {
          const endPos = polarToCartesian(R.outer - 5, ascendantAbsoluteLon);
          const startPos = polarToCartesian(R.center, ascendantAbsoluteLon);
          const labelPos = polarToCartesian(R.outer + 10, ascendantAbsoluteLon);
          
          return (
            <g>
              <line 
                x1={startPos.x} 
                y1={startPos.y} 
                x2={endPos.x} 
                y2={endPos.y} 
                stroke="rgba(var(--glow-color-rgb), 1)" 
                strokeWidth="3" 
                strokeDasharray="6,3"
                filter="url(#glow)"
              />
              <circle cx={startPos.x} cy={startPos.y} r="4" fill="rgba(var(--glow-color-rgb), 1)" />
              <text 
                x={labelPos.x} 
                y={labelPos.y} 
                textAnchor="middle" 
                dominantBaseline="central" 
                fontSize="10" 
                fill="rgba(var(--glow-color-rgb), 1)" 
                fontWeight="bold"
              >
                ASC
              </text>
            </g>
          );
        })()}

        {planetPositions.map((p) => {
          const pos = polarToCartesian(p.radius, p.absoluteLon);
          const color = ELEMENT_COLORS[p.sign] || "#888";
          const symbol = PLANET_SYMBOLS[p.name] || "?";
          
          return (
            <g key={p.name}>
              <line 
                x1={pos.x} 
                y1={pos.y} 
                x2={polarToCartesian(R.house, p.absoluteLon).x} 
                y2={polarToCartesian(R.house, p.absoluteLon).y}
                stroke={color}
                strokeOpacity="0.3"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <circle 
                cx={pos.x} 
                cy={pos.y} 
                r="13" 
                fill={color} 
                fillOpacity="0.2" 
                stroke={color} 
                strokeWidth="1.5" 
              />
              <text 
                x={pos.x} 
                y={pos.y} 
                textAnchor="middle" 
                dominantBaseline="central" 
                fontSize="18" 
                fill={color}
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
              >
                {symbol}
              </text>
            </g>
          );
        })}

        <text 
          x={CX} 
          y={CY} 
          textAnchor="middle" 
          dominantBaseline="central" 
          fontSize="14" 
          fill="rgba(var(--glow-color-rgb), 0.8)" 
          fontWeight="bold"
          fontFamily="serif"
        >
          LUMA
        </text>
      </svg>
      
      <div className="flex flex-wrap justify-center gap-3 mt-4 text-[10px]">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div><span>آتش</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div><span>خاک</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span>باد</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span>آب</span></div>
      </div>
    </motion.div>
  );
}