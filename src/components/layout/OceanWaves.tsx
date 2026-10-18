export function OceanWaves() {
  return (
    <div 
      style={{ 
        position: "fixed", 
        bottom: 0, 
        left: 0, 
        width: "100%", 
        height: "20vh", 
        overflow: "hidden", 
        pointerEvents: "none", 
        zIndex: 5 
      }}
    >
      <style>{`
        @keyframes waveMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes waveMoveReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Wave 1 (Back) */}
      <div 
        style={{ 
          position: "absolute", 
          bottom: 0, 
          left: 0, 
          width: "200%", 
          display: "flex", 
          opacity: 0.3, 
          color: "#60A5FA", 
          animation: "waveMove 20s linear infinite" 
        }}
      >
        <svg style={{ width: "50%", height: "15vh", flexShrink: 0 }} viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,160 C240,80 480,240 720,160 C960,80 1200,240 1440,160 L1440,320 L0,320 Z" />
        </svg>
        <svg style={{ width: "50%", height: "15vh", flexShrink: 0 }} viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,160 C240,80 480,240 720,160 C960,80 1200,240 1440,160 L1440,320 L0,320 Z" />
        </svg>
      </div>

      {/* Wave 2 (Middle) */}
      <div 
        style={{ 
          position: "absolute", 
          bottom: 0, 
          left: 0, 
          width: "200%", 
          display: "flex", 
          opacity: 0.5, 
          color: "#3B82F6", 
          animation: "waveMoveReverse 15s linear infinite" 
        }}
      >
        <svg style={{ width: "50%", height: "12vh", flexShrink: 0 }} viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,160 C320,300 420,0 720,160 C1020,320 1120,0 1440,160 L1440,320 L0,320 Z" />
        </svg>
        <svg style={{ width: "50%", height: "12vh", flexShrink: 0 }} viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,160 C320,300 420,0 720,160 C1020,320 1120,0 1440,160 L1440,320 L0,320 Z" />
        </svg>
      </div>

      {/* Wave 3 (Front) */}
      <div 
        style={{ 
          position: "absolute", 
          bottom: 0, 
          left: 0, 
          width: "200%", 
          display: "flex", 
          opacity: 0.8, 
          color: "#2563EB", 
          animation: "waveMove 10s linear infinite" 
        }}
      >
        <svg style={{ width: "50%", height: "8vh", flexShrink: 0 }} viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,160 C240,240 480,80 720,160 C960,240 1200,80 1440,160 L1440,320 L0,320 Z" />
        </svg>
        <svg style={{ width: "50%", height: "8vh", flexShrink: 0 }} viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,160 C240,240 480,80 720,160 C960,240 1200,80 1440,160 L1440,320 L0,320 Z" />
        </svg>
      </div>
    </div>
  );
}