import React, { useState } from "react";
import { motion } from "motion/react";
import { SheetRow } from "../types";
import { Copy, Check, Award, ArrowLeft, RefreshCw, Trophy, Sparkles } from "lucide-react";

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
      {/* Absolute floating ambient sparks calibrated to Elegant Dark amber flares */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-orange-500 rounded-full"
            style={{
              width: Math.random() * 5 + 2,
              height: Math.random() * 5 + 2,
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 60 + 20}%`,
              opacity: 0.2,
            }}
            animate={{
              y: [-10, -110],
              x: [0, (Math.random() - 0.5) * 30],
              opacity: [0, 0.6, 0],
              scale: [0.8, 1.2, 0.4],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              delay: Math.random() * 1.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Header back button aligned with technical station look */}
      <div className="flex items-center justify-start mb-3 sm:mb-6 z-10">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-gray-400 hover:text-white transition-all py-1 sm:py-1.5 px-2.5 sm:px-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-full cursor-pointer"
          id="btn-solve-another"
        >
          <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Back to list
        </button>
      </div>

      {/* Main congratulatory visual area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center py-2 sm:py-6 z-10 my-auto">
        
        {/* Glowing Badge Container with orange indicators */}
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
          className="relative inline-flex mb-3 sm:mb-6"
        >
          <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-xl animate-pulse-slow"></div>
          <div className="relative bg-gradient-to-tr from-orange-500 to-amber-500 text-white p-3 sm:p-4 rounded-full shadow-lg border border-white/10 animate-float">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1 -right-1 text-orange-400 bg-black/80 px-1 py-1 rounded-full shadow-xs border border-white/10"
          >
            <Sparkles className="w-2.5 h-2.5 text-orange-400" />
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
            Access Granted
          </h2>
        </motion.div>

        {/* TARGET SENTENCE - MANDATORY SPECIFIC TEXT REQUIRED */}
        <p className="text-gray-400 mb-4 sm:mb-8 font-light text-xs sm:text-sm font-sans">
          The code you are looking for is below:
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

      {/* Back button at bottom for hand comfort tailored to Terminal styling */}
      <div className="w-full mt-auto pt-3 sm:pt-6 border-t border-white/5 flex flex-col gap-1.5 sm:gap-2 z-10">
        <button
          onClick={onReset}
          className="w-full py-3.5 sm:py-4 px-4 bg-white hover:bg-gray-200 text-black rounded-full font-semibold text-[10px] sm:text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
          id="btn-solve-more"
        >
          Return to Terminal
        </button>
        <p className="text-[8px] sm:text-[9px] text-gray-600 font-mono text-center tracking-widest uppercase line-clamp-2 px-2 leading-relaxed">
          Matching Clue: <span className="font-semibold text-gray-500">{matchedRow.Text}</span>
        </p>
      </div>
    </motion.div>
  );
}
