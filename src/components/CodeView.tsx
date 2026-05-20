import React, { useState } from "react";
import { motion } from "motion/react";
import { SheetRow } from "../types";
import { Copy, Check, Sparkles, Flame } from "lucide-react";

interface CodeViewProps {
  matchedRow: SheetRow;
  onReset: () => void;
  key?: string;
}

export function CodeView({ matchedRow, onReset }: CodeViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(matchedRow.Code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback if inside an iframe restriction
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full flex-1 flex flex-col justify-between px-4 sm:px-5 py-3 sm:py-6 max-w-md mx-auto relative overflow-hidden congrats-gradient"
    >
      {/* Absolute floating small fire graphics with multiple warm colors and glowing drop shadows */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[...Array(8)].map((_, i) => {
          const flameSize = Math.floor(Math.random() * 10) + 14; // natural size variance between 14px and 24px
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 50 + 45}%`, // emerge from lower half of the viewport
              }}
              animate={{
                y: [0, -280],
                x: [0, (Math.random() - 0.5) * 60],
                opacity: [0, 0.8, 0.5, 0],
                scale: [0.4, 1.2, 0.8, 0.3],
                rotate: [0, (Math.random() - 0.5) * 40],
              }}
              transition={{
                duration: Math.random() * 4 + 4, // slower natural fluid float time
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            >
              <Flame
                style={{
                  width: flameSize,
                  height: flameSize,
                  filter: "drop-shadow(0 0 8px rgba(249, 115, 22, 0.6))",
                }}
                className={
                  i % 3 === 0
                    ? "text-red-500/40"
                    : i % 3 === 1
                    ? "text-orange-500/50"
                    : "text-amber-400/40"
                }
                fill="currentColor"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Header aligned with technical station look */}
      <div className="flex items-center justify-start mb-3 sm:mb-6 z-10 min-h-[32px]">
        <span className="text-gray-500 font-mono text-[9px] uppercase tracking-widest font-bold">Station Unlocked</span>
      </div>

      {/* Main congratulatory visual area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center py-2 sm:py-6 z-10 my-auto">
        
        {/* Glowing Badge Container with orange indicators and Tiki graphics */}
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
          className="relative inline-flex mb-4 sm:mb-8"
        >
          {/* External cyber-orbital spinning ring and pulse glow */}
          <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse-slow"></div>
          <div className="absolute -inset-3 sm:-inset-4 border border-orange-500/20 border-dashed rounded-full animate-pulse pointer-events-none z-0" />
          <motion.div
            className="absolute -inset-1.5 sm:-inset-2 border border-orange-500/40 border-dotted rounded-full pointer-events-none z-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />

          {/* Premium styled circular image holder */}
          <div className="relative bg-[#0d0d0d] p-3 sm:p-4 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.25)] border border-orange-500/30 animate-float flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 z-10 overflow-hidden">
            {/* Atmospheric inner gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-orange-950/30 pointer-events-none" />
            
            <img
              src="/assets/tikimask.png"
              referrerPolicy="no-referrer"
              alt="Kinettix Tiki Mask"
              className="w-[85%] h-[85%] object-contain filter drop-shadow-[0_0_12px_rgba(249,115,22,0.75)] select-none relative z-10"
            />
          </div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1 -right-1 text-orange-400 bg-black/90 p-1.5 rounded-full shadow-lg border border-orange-500/30 z-20"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          </motion.div>
        </motion.div>

        {/* Celebratory Messaging */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-1 mb-2 sm:mb-3"
        >
          <h2 className="text-xs sm:text-sm uppercase tracking-[0.4em] text-orange-500 mb-1 font-display font-medium">
            Correct!
          </h2>
        </motion.div>

        {/* TARGET SENTENCE - MANDATORY SPECIFIC TEXT REQUIRED */}
        <p className="text-gray-400 mb-4 sm:mb-8 font-light text-xs sm:text-sm font-sans px-4">
          Your clue is the <span className="font-semibold text-orange-400 select-all">{matchedRow.Keyword}</span>. Please use this as your clue and make sure to take note of the code below.
        </p>

        {/* CODE - Massive text format encased inside the custom glass-card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full glass-card px-5 sm:px-8 py-5 sm:py-8 rounded-2xl sm:rounded-3xl shadow-lg relative flex flex-col items-center justify-center max-w-xs border border-white/10"
        >
          <div className="absolute top-1.5 sm:top-2 right-2.5 sm:right-3 text-[7px] sm:text-[8px] font-mono font-bold text-gray-600 uppercase tracking-widest select-none">
            Unlocked Code
          </div>
          
          <code 
            className="w-full break-all font-mono font-semibold text-white tracking-tighter leading-none text-center select-all py-3 sm:py-4 px-2 my-1 block text-lg sm:text-xl"
            style={{
              fontSize: (() => {
                const len = (matchedRow.Code || "").length;
                if (len < 8) return "clamp(1.5rem, 8vw, 3rem)";
                if (len < 16) return "clamp(1.3rem, 6.5vw, 2.4rem)";
                if (len < 24) return "clamp(1.1rem, 5.5vw, 1.8rem)";
                return "clamp(0.85rem, 4.5vw, 1.35rem)";
              })(),
            }}
          >
            {matchedRow.Code}
          </code>

          {/* Interactive touch copy element */}
          <button
            onClick={handleCopy}
            className={`mt-3 sm:mt-4 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all w-full justify-center cursor-pointer ${
              copied
                ? "bg-orange-500 text-white hover:bg-orange-600 border border-transparent"
                : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
            id="btn-copy-code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" /> Copied Secure Code
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gray-400" /> Copy Secret Code
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Detail info at bottom tailored to Terminal styling */}
      <div className="w-full mt-auto pt-3 sm:pt-6 border-t border-white/5 flex flex-col gap-1.5 sm:gap-2 z-10">
        <p className="text-[8px] sm:text-[9px] text-gray-600 font-mono text-center tracking-widest uppercase line-clamp-2 px-2 leading-relaxed">
          Matching Clue: <span className="font-semibold text-gray-500">{matchedRow.Text}</span>
        </p>
      </div>
    </motion.div>
  );
}
