import React from "react";
import { motion } from "motion/react";

export function LoadingLogo({ message = "Loading secure database..." }: { message?: string }) {
  // SVG paths for the stylized X logo
  // Blue chevron (left): #2cb5e8
  // Green chevron (top-right): #8dc63f / #89d027
  // Orange chevron (bottom-right): #f39f37
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center select-none">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Ambient glow container */}
        <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full scale-75 animate-pulse-slow" />
        
        <motion.img
          src="/assets/tikimask.png"
          referrerPolicy="no-referrer"
          alt="Tiki Mask Logo"
          className="w-24 h-24 md:w-28 md:h-28 object-contain filter drop-shadow-[0_0_25px_rgba(249,115,22,0.5)] select-none relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" } 
          }}
        />

        {/* Outer orbital rings for immersive cyber feel */}
        <motion.div 
          className="absolute inset-0 border border-dashed border-orange-500/20 rounded-full pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -inset-4 border border-dashed border-blue-500/10 rounded-full pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <motion.div 
        className="mt-8 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.4 } }}
      >
        <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono">
          System Initializing
        </h3>
        <p className="text-xs text-gray-500 font-sans max-w-[280px] leading-relaxed mx-auto">
          {message}
        </p>
        
        {/* Interactive animated terminal code string */}
        <div className="pt-2 flex justify-center items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </motion.div>
    </div>
  );
}
