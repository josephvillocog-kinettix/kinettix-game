import React from "react";
import { motion } from "motion/react";
import { Shield, EyeOff } from "lucide-react";

interface InitializationViewProps {
  onStart: () => void;
  key?: string;
}

export function InitializationView({ onStart }: InitializationViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full flex-1 flex flex-col justify-between px-6 py-10 max-w-md mx-auto text-center"
    >
      {/* Top indicator bar */}
      <div className="flex items-center justify-between text-center min-h-[20px]">
        <div className="flex items-center gap-1.5 font-bold text-orange-500/80 uppercase tracking-widest text-[9px] font-mono mx-auto">
          <Shield className="w-3.5 h-3.5 text-orange-500 animate-pulse-slow" /> Security Authorization
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center py-6">
        {/* Animated Security Eye Emblem */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-orange-500/10 blur-2xl rounded-full scale-90 animate-pulse-slow" />
          
          <img
            src="/assets/tikimask.png"
            referrerPolicy="no-referrer"
            alt="Tiki Mask Logo"
            className="w-20 h-20 object-contain filter drop-shadow-[0_0_20px_rgba(249,115,22,0.25)] relative z-10"
          />

          {/* Radar border sweep */}
          <motion.div 
            className="absolute inset-0 border border-orange-500/10 rounded-full"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Security Alert Header */}
        <span className="text-orange-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-4 block">
          DISCRETION PROTOCOL
        </span>

        {/* The Requested Text */}
        <p className="text-[#ebebeb] text-sm sm:text-[15px] font-sans font-light leading-relaxed max-w-sm px-2 md:px-4 text-center">
          "For your eyes only. This task is for you and you alone. Discretion is required—revealing this game to others risks compromising your scoring advantage."
        </p>

        {/* Decorative caution symbol row */}
        <div className="flex gap-2.5 mt-8 items-center justify-center opacity-40">
          <span className="h-[1px] w-6 bg-orange-500/50" />
          <EyeOff className="w-4 h-4 text-orange-400" />
          <span className="h-[1px] w-6 bg-orange-500/50" />
        </div>
      </div>

      {/* Start Button at Bottom */}
      <div className="pt-2 w-full max-w-xs mx-auto">
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="w-full relative py-3 px-8 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-black font-semibold font-mono tracking-wider text-sm uppercase shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.55)] transition-all duration-300 hover:brightness-110 active:brightness-95 cursor-pointer"
        >
          Start
        </motion.button>
        <p className="text-[10px] text-gray-500 font-mono mt-3 tracking-wider">
          ESTABLISHING INTERACTIVE FEED
        </p>
      </div>
    </motion.div>
  );
}
