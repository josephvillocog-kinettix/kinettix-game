import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SheetRow } from "../types";
import { Lock, HelpCircle } from "lucide-react";

interface ChallengeViewProps {
  rows: SheetRow[];
  onSolveSuccess: (matchedRow: SheetRow) => void;
  key?: string;
}

export function ChallengeView({ rows, onSolveSuccess }: ChallengeViewProps) {
  const [userInput, setUserInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const activeRow = rows.length > 0 ? rows[0] : null;

  // Reset input when the active row changes
  useEffect(() => {
    setUserInput("");
    setErrorMessage("");
  }, [activeRow]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const verifyMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRow) return;

    const trimmedInput = userInput.trim().toLowerCase();
    const targetKeyword = (activeRow.Keyword || activeRow.Text || "").trim().toLowerCase();

    // Support interchangeable spaces and underscores for forgiving matching
    const normalizedInput = trimmedInput.replace(/[\s_-]/g, "");
    const normalizedTarget = targetKeyword.replace(/[\s_-]/g, "");

    if (normalizedInput === normalizedTarget) {
      onSolveSuccess(activeRow);
    } else {
      setErrorMessage("Incorrect match. Please check spelling and try again.");
    }
  };

  if (!activeRow) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex-1 flex flex-col justify-center items-center px-5 py-12 text-center"
      >
        <div className="relative w-20 h-20 flex items-center justify-center mb-4">
          <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-full scale-75 animate-pulse" />
          <HelpCircle className="w-10 h-10 text-gray-600 relative z-10" />
        </div>
        <h3 className="text-sm font-semibold text-gray-400 font-display">No Active Clue</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-[240px] font-sans leading-relaxed">
          No challenges are currently configured or enabled on the master Google Sheet.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full flex-1 flex flex-col justify-between px-5 py-6 max-w-md mx-auto"
    >
      {/* Header section with status styling */}
      <div className="flex items-center justify-between mb-8 text-center">
        <div className="flex items-center gap-1.5 font-bold text-orange-500/80 uppercase tracking-widest text-[9px] font-mono">
          Kinettix Terminal
        </div>
        <div className="flex items-center gap-1.5 text-[10px] bg-orange-950/40 border border-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          <Lock className="w-3 h-3 text-orange-500" /> Locked Clue
        </div>
      </div>

      {/* CLUE - Adaptive Massive Typography configured with high contrast elegant shades */}
      <div className="flex-1 flex flex-col justify-center items-center text-center py-4 sm:py-8 w-full">
        {activeRow.Enabled ? (
          <>
            <span className="text-orange-500 font-mono text-[11px] tracking-[0.5em] uppercase mb-3 block">
              Individual Challenge
            </span>
            
            <h1 
              className="w-full break-words font-display font-light text-[#e0e0e0] leading-snug tracking-tight max-h-[38vh] overflow-y-auto px-2"
              style={{
                fontSize: (() => {
                  const len = (activeRow.Text || "").length;
                  if (len < 30) return "clamp(1.75rem, 6.5vw, 2.5rem)";
                  if (len < 65) return "clamp(1.4rem, 5.2vw, 1.85rem)";
                  if (len < 120) return "clamp(1.15rem, 4.4vw, 1.5rem)";
                  if (len < 185) return "clamp(1rem, 3.8vw, 1.25rem)";
                  return "clamp(0.85rem, 3.4vw, 1.1rem)";
                })(),
              }}
            >
              {activeRow.Text}
            </h1>

            <p className="text-gray-500 text-xs mt-4 max-w-xs font-sans italic">
              Input the keyword found to unlock the code sequence.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center select-none w-full">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Ambient glow container */}
              <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full scale-75 animate-pulse" />
              
              <motion.img
                src="/assets/tikimask.png"
                referrerPolicy="no-referrer"
                alt="Tiki Mask Logo"
                className="w-20 h-20 md:w-24 md:h-24 object-contain filter drop-shadow-[0_0_20px_rgba(249,115,22,0.5)] select-none relative z-10"
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

            <div className="mt-6">
              <span className="text-orange-500 font-mono text-[9px] tracking-[0.3em] uppercase block font-semibold">
                Kinettix Node Locked
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SOLVER AT THE BOTTOM - Integrated custom input-glow with absolute validation layout, only visible if Enabled is true */}
      {activeRow.Enabled ? (
        <div className="w-full mt-auto pt-6 border-t border-white/5">
          <form onSubmit={verifyMatch} className="space-y-3">
            <div>
              <label htmlFor="keyword-solver-input" className="block text-left text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase mb-1.5">
                Type Your Answer Here
              </label>
              
              <div className="relative flex items-center">
                <input
                  id="keyword-solver-input"
                  type="text"
                  placeholder="Enter keyword..."
                  value={userInput}
                  onChange={handleInputChange}
                  autoComplete="off"
                  autoFocus
                  className="w-full bg-[#111] border border-white/10 rounded-full py-4 px-6 pr-24 text-sm text-[#e0e0e0] outline-none transition-all input-glow placeholder:text-gray-700"
                />
                
                <button
                  type="submit"
                  title="Verify Clue"
                  className="absolute right-2 top-2 bottom-2 bg-white text-black hover:bg-gray-200 px-5 rounded-full font-semibold text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                  id="btn-verify-match"
                >
                  Verify
                </button>
              </div>
            </div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-950/20 border border-rose-900/30 text-rose-300 text-xs px-4 py-2.5 rounded-xl text-left"
              >
                {errorMessage}
              </motion.div>
            )}

            <div className="flex justify-between items-center text-[10px] text-gray-600 font-mono pt-1">
              <span>Status: Awaiting decryption</span>
              <span>Case-Insensitive</span>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full mt-auto pt-6 border-t border-white/5 text-center text-[10px] text-gray-600 font-mono">
          Decryption console disabled for locked codes.
        </div>
      )}

      {/* Footer Info Statement */}
      <div className="mt-6 text-center text-[10px] text-gray-600 font-mono flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse-slow"></span>
        Mobile Device Terminal Layout Active
      </div>
    </motion.div>
  );
}
