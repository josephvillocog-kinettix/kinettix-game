import React, { useMemo } from "react";
import { motion } from "motion/react";

interface Ember {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
  sway: number;
}

export function EmbersBackground() {
  // Generate a list of stable embers with memoization to prevent recalculations on re-renders
  const embers = useMemo<Ember[]>(() => {
    const items: Ember[] = [];
    for (let i = 0; i < 18; i++) {
      items.push({
        id: i,
        // Particle size between 2px and 5px
        size: Math.random() * 3.5 + 2,
        // Horizontal starting distribution (leaving a small 5% safety margin on outer edges)
        left: Math.random() * 90 + 5,
        // Rising speed duration (slower looks more epic and mysterious)
        duration: Math.random() * 8 + 6,
        // Randomized stagger delay
        delay: Math.random() * -12, // Negative delay triggers them immediately when page loads
        // Opacity variation
        opacity: Math.random() * 0.5 + 0.3,
        // Sway offset width
        sway: Math.random() * 30 + 10,
      });
    }
    return items;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 selection:bg-transparent">
      {embers.map((ember) => (
        <motion.div
          key={ember.id}
          className="absolute rounded-full bg-gradient-to-t from-orange-500 to-amber-400"
          style={{
            left: `${ember.left}%`,
            width: ember.size,
            height: ember.size,
            opacity: ember.opacity,
            boxShadow: "0 0 8px 1.5px rgba(249, 115, 22, 0.65), 0 0 16px 3px rgba(245, 158, 11, 0.35)",
            bottom: "-10px",
          }}
          animate={{
            // Ascent from below bottom to above top
            y: [0, -840],
            // Beautiful organic wind swaying horizontally
            x: [0, ember.sway, -ember.sway, ember.sway / 2, 0],
            // Embers burn bright at bottom, flicker, and slowly fade out as they reach high altitudes
            opacity: [0, ember.opacity, ember.opacity * 1.2, ember.opacity * 0.8, 0],
            // Subtle rotation or scaling to simulate sparkling/spinning ashes
            scale: [1, 1.2, 0.9, 1.1, 0.7],
          }}
          transition={{
            duration: ember.duration,
            repeat: Infinity,
            delay: ember.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
