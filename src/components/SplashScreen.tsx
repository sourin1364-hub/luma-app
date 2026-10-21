import { motion } from "framer-motion";
import { useEffect } from "react";
import { Logo } from "./ui/Logo";

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3500); // 3.5 ثانیه
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0D1A] overflow-hidden"
    >
      {/* افکت نور پس‌زمینه */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[300px] h-[300px] bg-[#D6B56D] rounded-full blur-[120px] opacity-30"
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="text-[#D6B56D] mb-6">
          <Logo size={80} className="animate-[spin_10s_linear_infinite]" />
        </div>
        
        <motion.h1
          animate={{ 
            textShadow: [
              "0 0 10px rgba(214,181,109,0.1)", 
              "0 0 30px rgba(214,181,109,0.8)", 
              "0 0 10px rgba(214,181,109,0.1)"
            ] 
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl font-logo font-bold tracking-[0.3em] text-[#D6B56D] mb-4"
        >
          LUMA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-lg text-slate-300 font-light tracking-widest"
        >
          سفری به دنیای درون
        </motion.p>
      </motion.div>
    </motion.div>
  );
}