export default function DevCard({ username }: { username: string }) {
  // Placeholder data for now until we integrate GitHub API
  return (
    <div className="relative w-[300px] h-[420px] rounded-xl shadow-2xl overflow-hidden border border-zinc-700 bg-gradient-to-b from-zinc-800 to-zinc-950 flex flex-col p-6 animate-[flip_700ms_var(--ease-spring)_forwards]">
       {/* Holographic Sheen Layer */}
       <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 animate-[sheen_1.1s_ease_500ms_forwards]" style={{ backgroundSize: '200% 200%' }}></div>
       
       <div className="flex justify-between items-start z-0 relative">
         <div className="flex flex-col items-center">
            <span className="font-oswald text-[44px] font-bold leading-none text-white tracking-tighter">99</span>
            <span className="font-oswald text-[15px] font-semibold text-white">CAM</span>
         </div>
         {/* Placeholder for tier icon or user avatar */}
         <div className="w-16 h-16 rounded-full bg-zinc-700/50"></div>
       </div>
       
       <div className="mt-auto pt-4 border-t border-zinc-700/50 z-0 relative">
         <h2 className="font-oswald text-[19px] font-semibold text-center text-white mb-4 uppercase tracking-wide">{username}</h2>
         <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-2">
            <div className="flex justify-between items-center"><span className="font-oswald font-bold text-[19px] text-white">99</span><span className="font-oswald font-medium text-[12px] tracking-[1px] text-zinc-400">PAC</span></div>
            <div className="flex justify-between items-center"><span className="font-oswald font-bold text-[19px] text-white">99</span><span className="font-oswald font-medium text-[12px] tracking-[1px] text-zinc-400">DRI</span></div>
            <div className="flex justify-between items-center"><span className="font-oswald font-bold text-[19px] text-white">99</span><span className="font-oswald font-medium text-[12px] tracking-[1px] text-zinc-400">SHO</span></div>
            <div className="flex justify-between items-center"><span className="font-oswald font-bold text-[19px] text-white">99</span><span className="font-oswald font-medium text-[12px] tracking-[1px] text-zinc-400">DEF</span></div>
            <div className="flex justify-between items-center"><span className="font-oswald font-bold text-[19px] text-white">99</span><span className="font-oswald font-medium text-[12px] tracking-[1px] text-zinc-400">PAS</span></div>
            <div className="flex justify-between items-center"><span className="font-oswald font-bold text-[19px] text-white">99</span><span className="font-oswald font-medium text-[12px] tracking-[1px] text-zinc-400">PHY</span></div>
         </div>
       </div>
    </div>
  );
}
