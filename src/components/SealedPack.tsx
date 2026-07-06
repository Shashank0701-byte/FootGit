"use client";

import { useState } from "react";

export default function SealedPack({ onOpen }: { onOpen: (username: string) => void }) {
  const [username, setUsername] = useState("");
  const [isTearing, setIsTearing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsTearing(true);
    
    // Play the tear animation (550ms), then trigger the open state
    setTimeout(() => {
      onOpen(username.trim());
      setIsTearing(false);
    }, 550);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <h1 className="font-oswald text-[32px] font-semibold tracking-wide">
        Open your GitHub pack
      </h1>

      {/* The Pack Graphic */}
      <div 
        className={`w-[300px] h-[420px] bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-xl shadow-2xl flex flex-col items-center justify-center border border-zinc-700 transition-transform duration-250 ease-out hover:-translate-y-1 hover:-rotate-1 relative overflow-hidden ${
          isTearing ? "animate-[tear_550ms_ease_forwards]" : ""
        }`}
      >
        {/* Decorative foil line */}
        <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-gray-500 via-gray-300 to-gray-500 opacity-20"></div>
        <span className="font-oswald text-5xl text-zinc-600 font-bold tracking-widest select-none">
          DevFC
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-sm">
        <input
          type="text"
          placeholder="GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-lg font-sans text-[14px] focus:outline-none focus:border-zinc-500 transition-colors placeholder-zinc-500"
          required
        />
        
        <button
          type="submit"
          disabled={!username.trim() || isTearing}
          className="w-full bg-white text-black font-oswald font-semibold text-[13px] uppercase tracking-[1px] py-3 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isTearing ? "Opening..." : "Open Pack"}
        </button>
      </form>
      
      <p className="font-sans text-[12px] text-[var(--color-text-lo)] mt-2">
        Enter any valid GitHub username to reveal their stats.
      </p>
    </div>
  );
}
