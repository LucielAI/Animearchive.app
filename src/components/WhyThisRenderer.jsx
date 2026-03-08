import { Network } from 'lucide-react'

export default function WhyThisRenderer({ data, isSystemMode, theme }) {
  const hint = data?.visualizationHint
  const reason = data?.visualizationReason || data?.thesis

  if (!hint || !reason) return null

  const formattedHint = hint.replace(/-/g, ' ').toUpperCase()

  return (
    <div className="max-w-6xl mx-auto px-6 mb-4 mt-8">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 md:p-6 flex flex-col md:flex-row gap-5 items-start relative overflow-hidden group hover:border-white/20 transition-all duration-300">
        <div 
          className="absolute -inset-2 opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-30 pointer-events-none"
          style={{ backgroundColor: isSystemMode ? theme.secondary : theme.primary }}
        />
        
        <div className="relative z-10 flex shrink-0 items-center justify-center p-3 rounded-lg bg-[#050508]/80 border border-white/5 shadow-inner">
          <Network 
            className="w-5 h-5 md:w-6 md:h-6" 
            style={{ color: isSystemMode ? theme.secondary : theme.primary }}
          />
        </div>

        <div className="relative z-10 flex flex-col gap-2">
          <h3 className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/50 flex items-center gap-3">
            <span>WHY {formattedHint}?</span>
            {isSystemMode && (
               <span className="text-[9px] px-1.5 py-0.5 rounded tracking-widest bg-white/5 text-white/40 border border-white/5">
                 SYS_LENS_ACTIVE
               </span>
            )}
          </h3>
          <p className="text-sm md:text-base text-gray-400 font-mono leading-relaxed">
            <span className="text-white/90">Because</span> {reason.toLowerCase().startsWith('because') ? reason.substring(8).trim() : reason}
          </p>
        </div>
      </div>
    </div>
  )
}
