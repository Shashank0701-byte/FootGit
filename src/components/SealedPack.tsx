export default function SealedPack({ isTearing }: { isTearing: boolean }) {
  return (
    <div 
      className={`w-[300px] h-[420px] bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-xl shadow-2xl flex flex-col items-center justify-center border border-zinc-700 relative overflow-hidden ${
        isTearing ? "animate-[tear_550ms_ease_forwards]" : "transition-transform duration-250 ease-out hover:-translate-y-1 hover:-rotate-1"
      }`}
    >
      {/* Decorative foil line */}
      <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-gray-500 via-gray-300 to-gray-500 opacity-20"></div>
      <span className="font-oswald text-5xl text-zinc-600 font-bold tracking-widest select-none">
        DevFC
      </span>
    </div>
  );
}
