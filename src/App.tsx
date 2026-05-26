import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SheetRow } from "./types";
import { ChallengeView } from "./components/ChallengeView";
import { ChallengeTwoView } from "./components/ChallengeTwoView";
import { CodeView } from "./components/CodeView";
import { LoadingLogo } from "./components/LoadingLogo";
import { KeyRound, Smartphone } from "lucide-react";

// Robust Base64 + Repeating-key XOR Decryption with fallback compatibility inside client
function decryptField(cipherText: string, key: string = "Kinettix"): string {
  if (!cipherText) return "";
  const str = cipherText.trim();
  if (str.length === 0) return "";

  // Base64 regex check for valid base64 pattern (ignoring brief non-base64 characters)
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})?$/;
  if (str.length < 3 || !base64Regex.test(str)) {
    return cipherText;
  }

  try {
    let binary = "";
    if (typeof atob !== "undefined") {
      binary = atob(str);
    } else if (typeof Buffer !== "undefined") {
      binary = Buffer.from(str, "base64").toString("binary");
    } else {
      return cipherText;
    }

    // Try XOR decryption with repeating key "Kinettix"
    let decryptedXOR = "";
    for (let i = 0; i < binary.length; i++) {
      const charCode = binary.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decryptedXOR += String.fromCharCode(charCode);
    }

    // Validate if XOR decryption result yields sufficient printable characters
    let printableCount = 0;
    for (let i = 0; i < decryptedXOR.length; i++) {
      const code = decryptedXOR.charCodeAt(i);
      // Clean ASCII printable range space (32) to tilde (126), plus common spacing: Tab (9), LF (10), CR (13)
      if ((code >= 32 && code <= 126) || code === 9 || code === 10 || code === 13) {
        printableCount++;
      }
    }

    const isPrintable = decryptedXOR.length > 0 && (
      (decryptedXOR.length < 12 && printableCount === decryptedXOR.length) ||
      (decryptedXOR.length >= 12 && (printableCount / decryptedXOR.length) >= 0.70)
    );

    if (isPrintable) {
      return decryptedXOR;
    }

    // Rollback 1: Try base64 decoding alone (case where Google Sheet encoded plain text directly)
    let plainBase64 = "";
    try {
      if (typeof atob !== "undefined") {
        plainBase64 = decodeURIComponent(escape(atob(str)));
      } else if (typeof Buffer !== "undefined") {
        plainBase64 = Buffer.from(str, "base64").toString("utf8");
      }
    } catch {
      plainBase64 = "";
    }

    let isPlainPrintable = true;
    if (plainBase64.length > 0) {
      for (let i = 0; i < plainBase64.length; i++) {
        const code = plainBase64.charCodeAt(i);
        if ((code < 32 && code !== 9 && code !== 10 && code !== 13) || code > 126) {
          isPlainPrintable = false;
          break;
        }
      }
    } else {
      isPlainPrintable = false;
    }

    if (isPlainPrintable) {
      return plainBase64;
    }

    return cipherText;
  } catch (err) {
    return cipherText;
  }
}

export default function App() {
  const [rows, setRows] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the sheet data securely from our secure backend proxy route
  useEffect(() => {
    let active = true;
    const startTime = Date.now();

    async function loadData() {
      let rawList: any[] = [];
      let success = false;

      // 1. Try secure backend proxy first
      try {
        console.log("Attempting to load dataset via secure server proxy...");
        const response = await fetch("/api/sheet-data");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            rawList = data;
            success = true;
          } else if (data && typeof data === "object") {
            const matchingKey = Object.keys(data).find(k => Array.isArray(data[k]));
            if (matchingKey) {
              rawList = data[matchingKey];
              success = true;
            }
          }
        } else {
          console.warn(`Server proxy returned non-200 status: ${response.status}`);
        }
      } catch (proxyError) {
        console.warn("Server proxy request failed, will attempt direct fallback:", proxyError);
      }

      // 2. Try direct Google sheets script fetch fallback from client-side if server proxy didn't succeed
      if (!success || rawList.length === 0) {
        try {
          console.log("Invoking client-side direct fetch failover...");
          const directUrl = "https://script.google.com/macros/s/AKfycbxi1CJQrLEgDvM2xgQQSeEWfDrR3MbRtLlz3zUGtA7Ll1SX26htKXGKktUU8cEPqVRu/exec";
          const response = await fetch(directUrl);
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
              rawList = data;
            } else if (data && typeof data === "object") {
              const matchingKey = Object.keys(data).find(k => Array.isArray(data[k]));
              if (matchingKey) rawList = data[matchingKey];
            }
          }
        } catch (directError) {
          console.error("Direct browser fetch failover also failed:", directError);
        }
      }

      const mappedRows: SheetRow[] = rawList.map((item: any) => {
        const rawEnabled = item.enabled !== undefined ? item.enabled : (item.Enabled !== undefined ? item.Enabled : true);
        const isEnabled = String(rawEnabled).toLowerCase().trim() === "true" || 
                          String(rawEnabled).toLowerCase().trim() === "yes" || 
                          String(rawEnabled).toLowerCase().trim() === "1" || 
                          rawEnabled === true;
        return {
          Text: decryptField(String(item.text || item.Text || "").trim()),
          Keyword: decryptField(String(item.keyword || item.Keyword || "").trim()),
          Code: decryptField(String(item.code || item.Code || "").trim()),
          Text2: decryptField(String(item.text2 || item.Text2 || "").trim()),
          Keyword2: decryptField(String(item.keyword2 || item.Keyword2 || "").trim()),
          Enabled: isEnabled
        };
      });

      // Filter valid sequences
      const activeRows = mappedRows.filter(r => {
        return !!(r.Text && r.Keyword && r.Code);
      });

      if (active) {
        // Guarantee a small beautiful minimum loading delay so users can experience the logo intro animation
        const elapsed = Date.now() - startTime;
        const minDelay = 1500;
        const remaining = Math.max(0, minDelay - elapsed);

        setTimeout(() => {
          setRows(activeRows);
          setLoading(false);
        }, remaining);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, []);

  // Unlocked screen management
  const [solvedRow, setSolvedRow] = useState<SheetRow | null>(null);
  const [stageTwoSolved, setStageTwoSolved] = useState(false);

  // Clean-up and lock again
  const handleLockAgain = () => {
    setSolvedRow(null);
    setStageTwoSolved(false);
  };

  const handleSolveSuccess = (matched: SheetRow) => {
    setSolvedRow(matched);
    const hasStageTwo = !!(matched.Text2 && matched.Text2.trim() && matched.Keyword2 && matched.Keyword2.trim());
    if (!hasStageTwo) {
      setStageTwoSolved(true);
    } else {
      setStageTwoSolved(false);
    }
  };

  const handleStageTwoSuccess = () => {
    setStageTwoSolved(true);
  };

  const handleBackToStageOne = () => {
    setSolvedRow(null);
    setStageTwoSolved(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] flex flex-col items-center justify-start antialiased selection:bg-orange-500/30 selection:text-white">
      
      {/* Decorative orange flare background for deep aesthetic depth */}
      <div className="fixed top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-orange-950/15 to-transparent pointer-events-none -z-10" />

      {/* Main Container - Framed like a high-end device on large screens */}
      <div className="w-full max-w-md min-h-screen bg-[#0d0d0d] shadow-2xl md:my-6 md:rounded-3xl md:min-h-[820px] flex flex-col overflow-hidden border border-white/5 relative">
        
        {/* Seamless Transparent Logo Watermark across all pages */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <svg
            viewBox="0 0 1000 1000"
            className="w-4/5 max-w-[280px] aspect-square opacity-[0.045] drop-shadow-[0_0_40px_rgba(44,181,232,0.15)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Blue Chevron (Left Part) */}
            <path
              d="M 60 40 H 350 L 580 500 L 350 960 H 60 L 290 500 Z"
              fill="#2cb5e8"
            />
            {/* Green Shape (Top-Right Part) */}
            <path
              d="M 640 40 H 930 L 670 430 H 490 L 560 330 Z"
              fill="#89d027"
            />
            {/* Orange Shape (Bottom-Right Part) */}
            <path
              d="M 490 570 H 670 L 930 960 H 640 L 565 670 Z"
              fill="#f39f37"
            />
          </svg>
        </div>

        {/* Device Status/Ear bar for mockup style feel */}
        <div className="hidden md:flex justify-between items-center px-6 py-2.5 bg-[#080808] text-gray-500 text-[10px] font-mono z-50 border-b border-white/3">
          <div className="flex items-center gap-1.5 font-bold text-orange-500/80 uppercase tracking-widest text-[9px]">
            <Smartphone className="w-3.5 h-3.5 text-orange-500" /> Station Node
          </div>
          <div className="bg-white/5 h-4 w-16 rounded-full flex items-center justify-center text-[7px] text-gray-400 font-bold uppercase tracking-widest">
            Online
          </div>
          <div className="flex items-center gap-1">
            <span>SECURE</span>
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse-slow inline-block"></span>
          </div>
        </div>


        {/* Dynamic Screen View Router */}
        <div className="flex-1 flex flex-col justify-center bg-[#0d0d0d]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-center items-center py-6"
              >
                <LoadingLogo message="Synchronizing live dataset with secure station..." />
              </motion.div>
            ) : solvedRow && stageTwoSolved ? (
              <CodeView 
                key="unlocked"
                matchedRow={solvedRow}
                onReset={handleLockAgain}
              />
            ) : solvedRow && !stageTwoSolved ? (
              <ChallengeTwoView
                key="stage2"
                matchedRow={solvedRow}
                onSolveSuccess={handleStageTwoSuccess}
                onBackToStageOne={handleBackToStageOne}
              />
            ) : (
              <ChallengeView 
                key="challenges"
                rows={rows}
                onSolveSuccess={handleSolveSuccess}
              />
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
