import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, EyeOff } from "lucide-react";

interface InitializationViewProps {
  onStart: () => void;
  key?: string;
}

interface Particle {
  id: number;
  x: number; // Ending X coordinate
  y: number; // Ending Y coordinate
  size: number;
  color: string;
  duration: number;
  scale: number;
}

export function InitializationView({ onStart }: InitializationViewProps) {
  const [isExploding, setIsExploding] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleStart = () => {
    if (isExploding) return;
    setIsExploding(true);

    // Create 35 dynamic exploding ember particles
    const newParticles: Particle[] = [];
    const colors = [
      "from-orange-500 to-amber-400",
      "from-amber-500 to-yellow-300",
      "from-red-600 to-orange-400",
      "from-yellow-400 to-amber-200"
    ];

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Scatter distance from center of the button
      const distance = Math.random() * 140 + 60;
      
      newParticles.push({
        id: i,
        // Calculate dynamic directional explosion vector
        x: Math.cos(angle) * distance,
        // Negative Y component extra bias so they float upwards in a nice chimney draft look
        y: Math.sin(angle) * (distance * 0.8) - (Math.random() * 100 + 40),
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 0.5 + 0.5, // 0.5s to 1s
        scale: Math.random() * 0.6 + 0.6
      });
    }

    setParticles(newParticles);

    // Wait for the glorious explosion to finish before changing the phase
    setTimeout(() => {
      onStart();
    }, 950);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: isExploding ? 0 : 1, scale: isExploding ? 0.97 : 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: isExploding ? 0.8 : 0.4, ease: "easeInOut" }}
      className="w-full flex-1 flex flex-col justify-between px-6 py-10 max-w-md mx-auto text-center relative"
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
      <div className="pt-2 w-full max-w-xs mx-auto relative min-h-[80px] flex flex-col justify-start items-center">
        {/* Particle render overlay */}
        <AnimatePresence>
          {isExploding && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none z-50">
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: p.scale }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    opacity: 0,
                    scale: 0.1,
                  }}
                  transition={{
                    duration: p.duration,
                    ease: "easeOut",
                  }}
                  className={`absolute rounded-full bg-gradient-to-t ${p.color}`}
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    boxShadow: "0 0 10px 2px rgba(249, 115, 22, 0.7), 0 0 20px 4px rgba(245, 158, 11, 0.4)",
                    marginLeft: `-${p.size / 2}px`,
                    marginTop: `-${p.size / 2}px`,
                  }}
                />
              ))}

              {/* Extra instantaneous shockwave ring */}
              <motion.div
                initial={{ scale: 0.1, opacity: 0.8 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute w-20 h-20 -left-10 -top-10 rounded-full border-2 border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
              />
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!isExploding && (
            <motion.button
              onClick={handleStart}
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full relative py-3 px-8 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-black font-semibold font-mono tracking-wider text-sm uppercase shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.55)] transition-all duration-300 hover:brightness-110 active:brightness-95 cursor-pointer z-20"
            >
              Start
            </motion.button>
          )}
        </AnimatePresence>

        {!isExploding && (
          <motion.p 
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] text-gray-500 font-mono mt-3 tracking-wider z-10"
          >
            ESTABLISHING INTERACTIVE FEED
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

