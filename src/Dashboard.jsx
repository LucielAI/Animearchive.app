import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import Toggle from './components/Toggle'
import TabContent from './components/TabContent'
import SystemSummary from './components/SystemSummary'
import ExploreAnotherUniverse from './components/ExploreAnotherUniverse'
import WhyThisRenderer from './components/WhyThisRenderer'
import AIInsightPanel from './components/AIInsightPanel'

const TABS = ['POWER ENGINE', 'ENTITY DATABASE', 'FACTIONS', 'CORE LAWS']

const TAB_DESCRIPTIONS = {
  0: 'Abilities, techniques, and the mechanics that define combat.',
  1: 'Key figures, their threat levels, and how they connect.',
  2: 'Organizations, alliances, and the groups that shape the world.',
  3: 'The unbreakable rules that govern this universe.',
}

const DEFAULT_THEME = {
  primary: '#22d3ee',
  secondary: '#8b5cf6',
  accent: '#f59e0b',
  glow: 'rgba(34,211,238,0.35)',
  tabActive: '#22d3ee',
  badgeBg: 'rgba(139,92,246,0.12)',
  badgeText: '#8b5cf6',
  modeGlow: 'rgba(34,211,238,0.25)',
  heroGradient: 'rgba(5,5,20,0.95)',
}

const getBackgroundMotif = (anime) => {
  switch (anime) {
    case 'Attack on Titan':
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10l20 30-10 40 30-20 40 30-20-40 30-20-40 10z' stroke='rgba(255,255,255,1)' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`
    case 'Jujutsu Kaisen':
      return `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`
    case 'Hunter x Hunter':
      return `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='40' stroke='rgba(255,255,255,1)' fill='none' stroke-width='1.5'/%3E%3Ccircle cx='60' cy='60' r='60' stroke='rgba(255,255,255,1)' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`
    case 'Vinland Saga':
      return `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' result='noise'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0' in='noise'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`
    default:
      return 'none'
  }
}

const getClassificationLabel = (hint) => {
  switch (hint) {
    case 'timeline': return 'TIMELINE SYSTEM'
    case 'counter-tree': return 'COUNTERPLAY SYSTEM'
    case 'node-graph': return 'RELATIONAL SYSTEM'
    case 'affinity-matrix': return 'AFFINITY SYSTEM'
    default: return 'CLASSIFIED SYSTEM'
  }
}

export default function Dashboard({ data }) {
  const [activeTab, setActiveTab] = useState(0)
  const [isSystemMode, setIsSystemMode] = useState(false)

  const theme = data?.themeColors || DEFAULT_THEME
  const animeName = data?.anime || 'UNKNOWN ARCHIVE'
  const isAoT = data?.anime === 'Attack on Titan'
  const isJJK = data?.anime === 'Jujutsu Kaisen'
  const isHxH = data?.anime === 'Hunter x Hunter'

  return (
    <div
      className="min-h-screen bg-[#050508] text-white font-mono selection:bg-cyan-500/30 overflow-x-hidden relative"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none z-0 mix-blend-overlay" 
        style={{ 
          backgroundImage: getBackgroundMotif(data?.anime),
          opacity: 0.03 
        }} 
      />
      <div className={`sys-mode-overlay ${isSystemMode ? 'active' : ''}`} />
      {/* Header */}
      <header
        className="pt-14 pb-6 px-6 relative"
        style={{ background: `radial-gradient(ellipse at center, ${theme.heroGradient} 0%, transparent 100%)` }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-[#050508]/20 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-4 md:flex-row md:justify-between">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-full text-[10px] tracking-[0.3em] font-bold text-white/50 bg-white/5 backdrop-blur-xl">
                <span className={`w-1.5 h-1.5 rounded-full ${isSystemMode ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]' : 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]'}`} />
                ARCHIVE ACTIVE <span className="text-white/20 mx-1">|</span> ID: {data?.malId}
              </div>
              <div 
                className="px-2 py-1 rounded text-[9px] font-bold tracking-[0.25em] border backdrop-blur-md" 
                style={{ color: theme.primary, borderColor: `${theme.primary}40`, backgroundColor: `${theme.primary}10` }}
              >
                {getClassificationLabel(data?.visualizationHint)}
              </div>
            </div>
            
            {data?.logoUrl && (
              <img src={data.logoUrl} alt={`${animeName} Logo`} className="h-16 md:h-20 object-contain mt-2 mb-1 drop-shadow-lg" />
            )}

            {!data?.logoUrl && (
              <h1 
                key={isSystemMode ? 'sys' : 'lore'} 
                className={`text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter uppercase bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent mt-2`}
              >
                {animeName}
              </h1>
            )}

            {/* Casual Discovery Hook */}
            <p className="text-xs md:text-md text-gray-300 tracking-[0.1em] italic max-w-xl font-sans mt-1 border-l-2 pl-3" style={{ borderLeftColor: theme.secondary }}>
              "{data?.tagline}"
            </p>

            {isAoT && isSystemMode && (
              <div className="flex items-center gap-2 text-[10px] text-red-400/70 tracking-widest mt-2 rounded bg-red-900/10 px-3 py-1.5 border border-red-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse box-shadow-glow-red" />
                <span>// [SYS_WARN]: DETERMINISTIC LOOP LOCKED — CAUSALITY INTACT</span>
              </div>
            )}
            {isAoT && !isSystemMode && (
              <div className="flex items-center gap-2 text-[10px] text-gray-400/70 tracking-widest mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                <span>"THIS WORLD IS CRUEL... AND ALSO VERY BEAUTIFUL."</span>
              </div>
            )}
            {isJJK && isSystemMode && (
              <div className="flex items-center gap-2 text-[10px] text-blue-400/70 tracking-widest mt-2 rounded bg-blue-900/10 px-3 py-1.5 border border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse box-shadow-glow-blue" />
                <span>// [SYS_OP]: NEGATIVE ENERGY ECONOMY — COUNTERPLAY ACTIVE</span>
              </div>
            )}
            {isJJK && !isSystemMode && (
              <div className="flex items-center gap-2 text-[10px] text-gray-400/70 tracking-widest mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                <span>"WE AREN'T HEROES. WE'RE JUJUTSU SORCERERS."</span>
              </div>
            )}
            {isHxH && isSystemMode && (
              <div className="flex items-center gap-2 text-[10px] text-green-400/70 tracking-widest mt-2 rounded bg-green-900/10 px-3 py-1.5 border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse box-shadow-glow-green" />
                <span>// [SYS_EXEC]: CONTRACTUAL ENGAGEMENT — ASYMMETRIC YIELD</span>
              </div>
            )}
            {isHxH && !isSystemMode && (
              <div className="flex items-center gap-2 text-[10px] text-gray-400/70 tracking-widest mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                <span>"YOU SHOULD ENJOY THE LITTLE DETOURS TO THE FULLEST."</span>
              </div>
            )}
          </div>

          <div className="w-full md:w-auto mt-2 md:mt-0 relative z-20 shrink-0">
            <Toggle isSystemMode={isSystemMode} setIsSystemMode={setIsSystemMode} theme={theme} />
          </div>
        </div>
      </header>

      {/* 5-Bullet System Summary */}
      <SystemSummary data={data} isSystemMode={isSystemMode} theme={theme} />

      {/* Why This Lens? */}
      <WhyThisRenderer data={data} isSystemMode={isSystemMode} theme={theme} />

      {/* AI Insight Panel */}
      <AIInsightPanel aiInsights={data?.aiInsights} theme={theme} isSystemMode={isSystemMode} />

      {/* Navigation Tabs */}
      <nav className="max-w-6xl mx-auto px-6 mb-2 mt-4 flex overflow-x-auto relative flex-nowrap border-b border-white/5 scrollbar-hide">
        {TABS.map((tab, idx) => {
          const isActive = activeTab === idx
          const activeColor = isSystemMode ? theme.secondary : theme.primary
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`relative px-4 py-3.5 min-h-[44px] md:px-6 md:py-4 text-[10px] md:text-xs font-bold tracking-[0.2em] whitespace-nowrap transition-all duration-300 cursor-pointer ${isActive ? '' : 'hover:text-gray-300'}`}
              style={{
                color: isActive ? activeColor : '#4b5563',
                textShadow: isActive ? `0 0 12px ${activeColor}60` : 'none'
              }}
            >
              <span className="relative z-10">{tab}</span>
              {isActive && (
                <span
                  className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: activeColor,
                    boxShadow: `0 0 8px ${isSystemMode ? theme.modeGlow : theme.glow}`
                  }}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Tab Description */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <p className="text-[10px] md:text-xs text-gray-600 tracking-wider">{TAB_DESCRIPTIONS[activeTab]}</p>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        <TabContent
          activeTab={activeTab}
          data={data}
          isSystemMode={isSystemMode}
          theme={theme}
        />
      </main>

      <ExploreAnotherUniverse currentId={data?.id || data?.malId} isSystemMode={isSystemMode} theme={theme} />

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 relative z-10 flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-3">
          {data?.malId && (
            <a
              href={`https://myanimelist.net/anime/${data.malId}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300"
              style={{ color: theme.primary }}
            >
              VIEW ON MAL
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <a
            href="https://www.tiktok.com/@kenshipeak"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/30 rounded-full transition-all duration-300"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.63a8.23 8.23 0 004.79 1.53V6.71a4.85 4.85 0 01-1.03-.02z"/>
            </svg>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors uppercase">
              @KENSHIPEAK
            </span>
          </a>
        </div>
        <p className="text-[10px] text-white/15 tracking-[0.2em] uppercase max-w-2xl mx-auto px-6 text-center">
          Unofficial fan-made interactive analysis. All characters, names, and lore belong to their respective creators and studios.
        </p>
      </footer>
    </div>
  )
}
