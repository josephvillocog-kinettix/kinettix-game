import React, { useState } from "react";
import { motion } from "motion/react";
import { SheetRow } from "../types";
import { Search, ChevronRight, CornerDownLeft, Lock, ArrowLeft, Eye, HelpCircle } from "lucide-react";

interface ChallengeViewProps {
  rows: SheetRow[];
  onSolveSuccess: (matchedRow: SheetRow) => void;
  key?: string;
}

export function ChallengeView({ rows, onSolveSuccess }: ChallengeViewProps) {
  const [selectedRow, setSelectedRow] = useState<SheetRow | null>(rows.length > 0 ? rows[0] : null);
  const [userInput, setUserInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Automatically select the first challenge sequence immediately when the rows finish loading
  React.useEffect(() => {
    if (rows.length > 0 && !selectedRow) {
      setSelectedRow(rows[0]);
    }
  }, [rows]);

  const handleBackToList = () => {
    setSelectedRow(null);
    setUserInput("");
    setErrorMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const verifyMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRow) return;

    const trimmedInput = userInput.trim().toLowerCase();
    const targetKeyword = (selectedRow.Keyword || selectedRow.Text || "").trim().toLowerCase();

    // Support interchangeable spaces and underscores for forgiving matching
    const normalizedInput = trimmedInput.replace(/[\s_-]/g, "");
    const normalizedTarget = targetKeyword.replace(/[\s_-]/g, "");

    if (normalizedInput === normalizedTarget) {
      onSolveSuccess(selectedRow);
    } else {
      setErrorMessage("Incorrect match. Please check spelling or case and try again.");
    }
  };

  // If a specific row is selected, show the solver experience
  if (selectedRow) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full flex-1 flex flex-col justify-between px-5 py-6 max-w-md mx-auto"
      >
        {/* Navigation back and header matched to Elegant Dark */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-all py-1.5 px-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-full cursor-pointer"
            id="btn-back-to-clues"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to list
          </button>
          <div className="flex items-center gap-1.5 text-[10px] bg-orange-950/40 border border-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            <Lock className="w-3 h-3 text-orange-500" /> Locked Clue
          </div>
        </div>

        {/* CLUE - Adaptive Massive Typography configured with high contrast elegant shades */}
        <div className="flex-1 flex flex-col justify-center items-center text-center py-4 sm:py-8 w-full">
          {selectedRow.Enabled ? (
            <>
              <span className="text-orange-500 font-mono text-[11px] tracking-[0.5em] uppercase mb-3 block">
                The Challenge
              </span>
              
              <h1 
                className="w-full break-words font-display font-light text-[#e0e0e0] leading-snug tracking-tight max-h-[38vh] overflow-y-auto px-2"
                style={{
                  fontSize: (() => {
                    const len = (selectedRow.Text || "").length;
                    if (len < 30) return "clamp(1.75rem, 6.5vw, 2.5rem)";
                    if (len < 65) return "clamp(1.4rem, 5.2vw, 1.85rem)";
                    if (len < 120) return "clamp(1.15rem, 4.4vw, 1.5rem)";
                    if (len < 185) return "clamp(1rem, 3.8vw, 1.25rem)";
                    return "clamp(0.85rem, 3.4vw, 1.1rem)";
                  })(),
                }}
              >
                {selectedRow.Text}
              </h1>

              <p className="text-gray-500 text-xs mt-4 max-w-xs font-sans italic">
                Input the keyword found to unlock the code sequence.
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center select-none w-full">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Ambient glow container */}
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-75 animate-pulse" />
                
                <svg
                  viewBox="0 0 1000 1000"
                  className="w-24 h-24 md:w-28 md:h-28 drop-shadow-[0_0_20px_rgba(44,181,232,0.25)] relative z-10"
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

              <div className="mt-6">
                <span className="text-orange-500 font-mono text-[9px] tracking-[0.3em] uppercase block font-semibold">
                  Kinettix Node Locked
                </span>
              </div>
            </div>
          )}
        </div>

        {/* SOLVER AT THE BOTTOM - Integrated custom input-glow with absolute validation layout, only visible if Enabled is true */}
        {selectedRow.Enabled ? (
          <div className="w-full mt-auto pt-6 border-t border-white/5">
            <form onSubmit={verifyMatch} className="space-y-3">
              <div>
                <label htmlFor="keyword-solver-input" className="block text-left text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase mb-1.5">
                  Type Keyword to Match
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
      </motion.div>
    );
  }

  // Listing view: Displays the dashboard of all active clues fetched
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex-1 flex flex-col justify-start px-5 py-6 max-w-md mx-auto"
    >
      <div className="mb-6 mt-1">
        <h2 className="text-xl font-display font-light text-white tracking-tight leading-tight">
          Select Keyword to Crack
        </h2>
        <p className="text-gray-500 text-xs mt-1.5 font-sans leading-relaxed">
          Select a riddle sequence below and solve the puzzle by finding its hidden codeword.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center py-12 text-center border border-dashed border-white/5 rounded-2xl bg-white/3 p-6 self-center w-full">
          <HelpCircle className="w-10 h-10 text-gray-600 mb-3" />
          <h3 className="text-sm font-semibold text-gray-400 font-display">No Enabled Sequences</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-[240px]">
            No challenges are currently configured or enabled.
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto max-h-[60vh] pr-1">
          {rows.map((row, idx) => (
            <motion.div
              key={idx + "-" + row.Text}
              whileHover={{ y: -2, transition: { duration: 0.1 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRow(row)}
              className="group flex items-center justify-between p-4 bg-white/3 hover:bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/20 hover:shadow-2xs transition-all cursor-pointer"
              id={`clue-card-${idx}`}
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[9px] text-orange-400 bg-orange-950/40 border border-orange-500/10 font-medium tracking-wider uppercase px-2 py-0.5 rounded-sm">
                    Sequence #{idx + 1}
                  </span>
                </div>
                
                <h3 className="text-sm font-medium text-[#e0e0e0] break-words font-display line-clamp-2 transition-colors">
                  {row.Enabled ? row.Text : "Kinettix Enigma Decryption Node"}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-sans text-gray-500 group-hover:text-orange-400 transition-colors uppercase tracking-widest font-semibold">
                  Unlock
                </span>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-0.5 group-hover:text-orange-500 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer Info Statement */}
      <div className="mt-auto pt-6 text-center text-[10px] text-gray-600 font-mono flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse-slow"></span>
        Mobile Device Terminal Layout Active
      </div>
    </motion.div>
  );
}
