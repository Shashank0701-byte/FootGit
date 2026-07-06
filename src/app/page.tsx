"use client";

import { useState } from "react";
import SealedPack from "@/components/SealedPack";
import DevCard from "@/components/DevCard";

export default function Home() {
  const [username, setUsername] = useState("");
  const [isTearing, setIsTearing] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || isTearing) return;

    setIsTearing(true);

    // 1. Pack tears for 550ms
    setTimeout(() => {
      // 2. Flash starts ~480ms in (overlapping slightly with end of tear)
      setFlash(true);
      
      setTimeout(() => {
        // 3. Swap to card reveal right after flash peaks
        setCardRevealed(true);
        setIsTearing(false);
        
        setTimeout(() => setFlash(false), 500); // Clear flash
      }, 120);
    }, 480);
  };

  const handleReset = () => {
    setCardRevealed(false);
    setUsername("");
  };

  return (
    <>
      {flash && <div className="fixed inset-0 bg-white z-50 pointer-events-none animate-[flashpop_500ms_ease_forwards]"></div>}
      
      <main className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto items-stretch">
        
        {/* Left Column: Controls (Form) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 border-r border-white/5">
          <div className="max-w-md w-full mx-auto md:mx-0">
            <h1 className="font-oswald text-[40px] font-bold text-white tracking-tight leading-tight mb-2">
              GitHub activity as your Ultimate Team card.
            </h1>
            <p className="font-sans text-[16px] text-[var(--color-text-lo)] mb-12">
              Generate FIFA-style cards from your contribution history.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[11px] font-semibold tracking-widest uppercase text-zinc-500">
                  GitHub Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. torvalds"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white px-4 py-4 rounded-xl font-sans text-[15px] focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all placeholder-zinc-700"
                  disabled={isTearing || cardRevealed}
                  required
                />
              </div>

              {!cardRevealed ? (
                <button
                  type="submit"
                  disabled={!username.trim() || isTearing}
                  className="w-full bg-white text-black font-oswald font-semibold text-[14px] uppercase tracking-[1px] py-4 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4"
                >
                  {isTearing ? "Opening..." : "Open Pack"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full bg-zinc-900 text-white font-oswald font-semibold text-[14px] border border-zinc-700 uppercase tracking-[1px] py-4 rounded-xl hover:bg-zinc-800 transition-colors mt-4"
                >
                  Regenerate →
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Preview Area */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-zinc-950/30">
          {!cardRevealed ? (
            <SealedPack isTearing={isTearing} />
          ) : (
            <DevCard username={username} />
          )}
        </div>

      </main>
    </>
  );
}
