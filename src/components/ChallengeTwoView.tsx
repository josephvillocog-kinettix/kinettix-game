import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SheetRow } from "../types";
import { Lock, Sparkles, Shield, ArrowLeft } from "lucide-react";

interface ChallengeTwoViewProps {
  matchedRow: SheetRow;
  onSolveSuccess: () => void;
  onBackToStageOne: () => void;
  key?: string;
}

export function ChallengeTwoView({ matchedRow, onSolveSuccess, onBackToStageOne }: ChallengeTwoViewProps) {
  const [userInput, setUserInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Reset input if row changes
  useEffect(() => {
    setUserInput("");
    setErrorMessage("");
  }, [matchedRow]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const verifyMatch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = userInput.trim().toLowerCase();
    const targetKeyword = (matchedRow.Keyword2 || "").trim().toLowerCase();

    // Flexible forgiving matcher (remove spaces, underscores, dashes)
    const normalizedInput = trimmedInput.replace(/[\s_-]/g, "");
    const normalizedTarget = targetKeyword.replace(/[\s_-]/g, "");

    if (normalizedInput === normalizedTarget) {
      onSolveSuccess();
    } else {
      setErrorMessage("Incorrect access keyword for Stage 2. Please double check and try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: -25, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full flex-1 flex flex-col justify-between px-5 py-6 max-w-md mx-auto"
    >
      {/* Header section with status styling */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToStageOne}
          className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-gray-500 hover:text-orange-500 transition-colors py-1 px-2.5 bg-white/5 border border-white/5 hover:border-orange-500/20 rounded-full cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
        <div className="flex items-center gap-1.5 text-[10px] bg-amber-950/40 border border-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          <Shield className="w-3 h-3 text-amber-500" /> Stage 2 Security
        </div>
      </div>

      {/* CLUE 2 - Elegant Centered Text display */}
      <div className="flex-1 flex flex-col justify-center items-center text-center py-4 sm:py-8 w-full">
        <span className="text-amber-500 font-mono text-[11px] tracking-[0.5em] uppercase mb-3 block">
          Secondary Decryption Clue
        </span>

        <h1
          className="w-full break-words font-display font-light text-[#e0e0e0] leading-snug tracking-tight max-h-[38vh] overflow-y-auto px-2"
          style={{
            fontSize: (() => {
              const len = (matchedRow.Text2 || "").length;
              if (len < 30) return "clamp(1.75rem, 6.5vw, 2.5rem)";
              if (len < 65) return "clamp(1.4rem, 5.2vw, 1.85rem)";
              if (len < 120) return "clamp(1.15rem, 4.4vw, 1.5rem)";
              if (len < 185) return "clamp(1rem, 3.8vw, 1.25rem)";
              return "clamp(0.85rem, 3.4vw, 1.1rem)";
            })(),
          }}
        >
          {matchedRow.Text2}
        </h1>

        <p className="text-gray-500 text-xs mt-4 max-w-xs font-sans italic">
          Enter the second secret key to unlock the master code sequence.
        </p>
      </div>

      {/* SOLVER AT THE BOTTOM */}
      <div className="w-full mt-auto pt-6 border-t border-white/5">
        <form onSubmit={verifyMatch} className="space-y-3">
          <div>
            <label htmlFor="keyword2-solver-input" className="block text-left text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase mb-1.5">
              Type Stage 2 Answer Here
            </label>

            <div className="relative flex items-center">
              <input
                id="keyword2-solver-input"
                type="text"
                placeholder="Enter stage 2 keyword..."
                value={userInput}
                onChange={handleInputChange}
                autoComplete="off"
                autoFocus
                className="w-full bg-[#111] border border-white/10 rounded-full py-4 px-6 pr-24 text-sm text-[#e0e0e0] outline-none transition-all input-glow focus:border-amber-500/30 placeholder:text-gray-700"
              />

              <button
                type="submit"
                title="Verify Second Clue"
                className="absolute right-2 top-2 bottom-2 bg-amber-500 text-black hover:bg-amber-400 px-5 rounded-full font-semibold text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                id="btn-verify-match-stage2"
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
            <span>Status: Verification Stage 2</span>
            <span>Case-Insensitive</span>
          </div>
        </form>
      </div>

      {/* Footer Info Statement */}
      <div className="mt-6 text-center text-[10px] text-gray-600 font-mono flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse-slow"></span>
        Securing Kinettix decryption channel
      </div>
    </motion.div>
  );
}
