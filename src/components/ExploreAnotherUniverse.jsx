import { Link } from 'react-router-dom'
import { ANIME_LIST } from '../data/index'
import { Database, Lock, ArrowRight } from 'lucide-react'

const PENDING_UNIVERSES = [
  { name: 'Steins;Gate', id: 'steinsgate' },
  { name: 'One Piece', id: 'op' },
  { name: 'Code Geass', id: 'geass' },
  { name: 'Monster', id: 'monster' }
]

export default function ExploreAnotherUniverse({ currentId, isSystemMode, theme }) {
  const accentColor = isSystemMode ? (theme?.modeGlow || '#22d3ee') : (theme?.primary || '#8b5cf6')
  
  // Filter out the current universe
  const liveUniverses = ANIME_LIST.filter(a => a.id !== currentId)
  
  // Pick a couple stubs randomly or just slice
  const pendingStubs = PENDING_UNIVERSES.slice(0, 3)

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-16 mt-8 font-mono border-t border-white/5">
      <div className="flex flex-col items-center text-center gap-6">
        
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5" style={{ color: accentColor }} />
          <h2 className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-white">
            {isSystemMode ? 'ACCESS ADDITIONAL DATABASES' : 'EXPLORE ANOTHER SYSTEM'}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-2">
          {/* Live Links */}
          {liveUniverses.map(anime => (
            <Link 
              key={anime.id} 
              to={`/universe/${anime.id}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
              className="group flex flex-col items-start px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 w-full md:w-[260px] relative overflow-hidden text-left"
            >
              <div 
                className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: accentColor }}
              />
              <span className="text-xs text-gray-500 font-bold tracking-widest mb-1 group-hover:text-gray-400">STATUS: ONLINE</span>
              <span className="text-sm text-gray-200 font-bold uppercase truncate w-full flex items-center justify-between">
                {anime.anime}
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ color: accentColor }} />
              </span>
            </Link>
          ))}

          {/* Pending Stubs */}
          {pendingStubs.map(stub => (
            <div 
              key={stub.id}
              className="flex flex-col items-start px-5 py-4 bg-transparent border border-white/5 border-dashed rounded-xl w-full md:w-[260px] opacity-60 grayscale relative cursor-not-allowed text-left"
            >
              <span className="text-xs font-bold tracking-widest mb-1 flex items-center gap-1.5 text-gray-600">
                <Lock className="w-3 h-3" /> ARCHIVE PENDING
              </span>
              <span className="text-sm text-gray-500 font-bold uppercase truncate w-full">
                {stub.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
