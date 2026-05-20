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
        <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-75 animate-pulse-slow" />
        
        <svg
          viewBox="0 0 1000 1000"
          className="w-28 h-28 md:w-32 md:h-32 drop-shadow-[0_0_25px_rgba(44,181,232,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Blue Chevron (Left Part) */}
          <motion.path
            d="M 60 40 H 350 L 580 500 L 350 960 H 60 L 290 500 Z"
            fill="#2cb5e8"
            initial={{ opacity: 0, x: -60, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              transition: { duration: 0.8, ease: "easeOut" } 
            }}
            whileHover={{ scale: 1.05 }}
          />

          {/* Green Shape (Top-Right Part) */}
          <motion.path
            d="M 640 40 H 930 L 670 430 H 490 L 560 330 Z"
            fill="#89d027"
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { duration: 0.8, delay: 0.15, ease: "easeOut" } 
            }}
          />

          {/* Orange Shape (Bottom-Right Part) */}
          <motion.path
            d="M 490 570 H 670 L 930 960 H 640 L 565 670 Z"
            fill="#f39f37"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { duration: 0.8, delay: 0.25, ease: "easeOut" } 
            }}
          />
        </svg>

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
