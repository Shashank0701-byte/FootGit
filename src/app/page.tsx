"use client";

import { useState } from "react";
import SealedPack from "@/components/SealedPack";

export default function Home() {
  const [packOpened, setPackOpened] = useState(false);
  const [username, setUsername] = useState("");

  const handleOpenPack = (user: string) => {
    setUsername(user);
    setPackOpened(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      {!packOpened ? (
        <SealedPack onOpen={handleOpenPack} />
      ) : (
        <div className="flex flex-col items-center justify-center animate-[flashpop_500ms_ease_forwards]">
          <h2 className="font-oswald text-2xl">Card Reveal for {username}</h2>
          <p className="font-sans text-[var(--color-text-lo)] mt-4">
            (Card component coming next!)
          </p>
          <button 
            onClick={() => setPackOpened(false)}
            className="mt-8 font-oswald text-[13px] uppercase tracking-[1px] underline text-gray-400 hover:text-white"
          >
            Reset
          </button>
        </div>
      )}
    </main>
  );
}
