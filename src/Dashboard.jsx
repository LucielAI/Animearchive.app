import { useState } from 'react';
import Toggle from './components/Toggle';
import SeverityBadge from './components/SeverityBadge';
import Timeline from './components/Timeline';
import * as Icons from 'lucide-react';

const HoverCard = ({ children, className, hoverGlow }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered ? `0 0 24px ${hoverGlow}` : 'none'
      }}
    >
      {children}
    </div>
  );
};

const Dashboard = ({ DATA }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isSystemMode, setIsSystemMode] = useState(false);
  
  const tabs = ['POWER ENGINE', 'ENTITY DATABASE', 'FACTIONS', 'CORE LAWS'];

  const theme = DATA.themeColors || {
    primary: "#22d3ee",
    secondary: "#8b5cf6",
    accent: "#f59e0b",
    glow: "rgba(34,211,238,0.35)",
    tabActive: "#22d3ee",
    badgeBg: "rgba(139,92,246,0.12)",
    badgeText: "#8b5cf6",
    modeGlow: "rgba(34,211,238,0.25)",
    heroGradient: "rgba(5,5,20,0.95)"
  };

  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : <Icons.HelpCircle className="w-5 h-5" />;
  };

  return (
    <div 
      className="min-h-screen bg-[#050508] text-white font-mono selection:bg-cyan-500/30 overflow-x-hidden"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}
    >
      
      {/* Header */}
      <header 
        className="pt-12 pb-6 px-6 relative"
        style={{ background: `radial-gradient(ellipse at center, ${theme.heroGradient} 0%, transparent 100%)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/20 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-4 md:flex-row md:justify-between">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="inline-block px-3 py-1 border border-white/20 rounded-full text-[10px] tracking-[0.3em] font-bold text-gray-400 bg-white/5 backdrop-blur-md">
              INTELLIGENCE SCHEMA <span className="text-cyan-400 mx-2">|</span> ID: {DATA.malId}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {DATA.anime}
            </h1>
            <p className="text-xs md:text-sm lg:text-base text-gray-400 tracking-widest uppercase">
              {DATA.tagline}
            </p>
          </div>
          
          {/* Dual Mode Toggle moved to header for mobile stack context */}
          <div className="w-full md:w-auto mt-4 md:mt-0 relative z-20 shrink-0">
            <Toggle isSystemMode={isSystemMode} setIsSystemMode={setIsSystemMode} theme={theme} />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-6xl mx-auto px-6 mb-8 mt-4 border-b border-white/10 flex overflow-x-auto scrollbar-hide relative flex-nowrap">
        {tabs.map((tab, idx) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(idx)}
            className="px-4 py-3 min-h-[44px] md:px-6 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors duration-300"
            style={{ color: activeTab === idx ? (isSystemMode ? theme.secondary : theme.primary) : '#6b7280' }}
          >
            {tab}
          </button>
        ))}
        {/* Animated indicator */}
        <div 
          className="absolute bottom-0 h-0.5 transition-all duration-300" 
          style={{ 
            width: `${100 / tabs.length}%`, 
            transform: `translateX(${activeTab * 100}%)`,
            backgroundColor: isSystemMode ? theme.secondary : theme.primary,
            boxShadow: `0 0 10px ${isSystemMode ? theme.modeGlow : theme.glow}`
          }} 
        />
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        
        {/* TAB 0 : POWER ENGINE */}
        {activeTab === 0 && (
          <div key={activeTab} className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DATA.powerSystem.map((power, idx) => (
                <HoverCard 
                  key={idx} 
                  hoverGlow={isSystemMode ? theme.modeGlow : theme.glow}
                  className="bg-white/5 backdrop-blur-sm border rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-300 group hover:bg-white/10 active:bg-white/15 cursor-default [@media(hover:none)]:transform-none"
                >
                  <div className="p-6 h-full flex flex-col" style={{ borderLeft: `4px solid ${isSystemMode ? theme.secondary : theme.primary}`, borderColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: `${isSystemMode ? theme.secondary : theme.primary}20`, color: isSystemMode ? theme.secondary : theme.primary }}>
                        {getIcon(power.icon)}
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider truncate">{power.name}</h2>
                        <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase" style={{ color: isSystemMode ? theme.secondary : theme.primary }}>{power.subtitle}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs md:text-sm text-gray-300 leading-relaxed mb-6 flex-grow">
                      {isSystemMode ? power.systemDesc : power.loreDesc}
                    </p>
                    
                    <div className="pt-4 border-t border-white/10 mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[8px] md:text-[10px] text-white/50 uppercase tracking-widest block mb-1">SIGNATURE MOMENT</span>
                      <p className="text-[10px] md:text-xs text-gray-400 italic">"{power.signatureMoment}"</p>
                    </div>
                  </div>
                </HoverCard>
              ))}
            </div>
            
            {/* Rankings/Tiers Section */}
            <div className="mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8" style={{ background: `radial-gradient(ellipse at top left, ${theme.glow} 0%, transparent 60%)` }}>
              <h2 className="text-lg md:text-xl font-bold mb-8 text-center tracking-[0.2em] text-gray-400 uppercase">
                {DATA.rankings.systemName}
              </h2>
              
              <div className="flex flex-col gap-4">
                {/* Top Tier */}
                <div className="p-6 border rounded-lg" style={{ backgroundColor: theme.badgeBg, borderColor: theme.badgeBg }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <h3 className="text-xl md:text-2xl font-bold uppercase" style={{ color: theme.badgeText }}>{DATA.rankings.topTierName}</h3>
                    <div className="px-3 py-1 text-[10px] font-bold tracking-widest rounded" style={{ backgroundColor: theme.badgeBg, color: theme.badgeText, boxShadow: `0 0 10px ${theme.badgeBg}` }}>ABSOLUTE AUTHORITY</div>
                  </div>
                  <p className="text-xs md:text-sm" style={{ color: theme.badgeText, opacity: 0.8 }}>
                    {isSystemMode ? DATA.rankings.topTierSystem : DATA.rankings.topTierLore}
                  </p>
                </div>
                
                {/* Other Tiers */}
                {DATA.rankings.tiers.map((tier, idx) => (
                  <div key={idx} className="p-4 border border-white/10 rounded-lg bg-black/20 flex flex-col md:flex-row gap-4 md:items-center hover:bg-white/5 transition-colors">
                    <div className="md:w-1/4 text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">{tier.name}</div>
                    <div className="md:w-3/4 text-xs md:text-sm text-gray-500">
                      {isSystemMode ? tier.systemDesc : tier.loreDesc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1 : ENTITY DATABASE (Timeline Layout) */}
        {activeTab === 1 && (
          <div key={activeTab} className="animate-fade-in">
            {DATA.visualizationHint === 'timeline' ? (
              <Timeline characters={DATA.characters} causalEvents={DATA.causalEvents} isSystemMode={isSystemMode} theme={theme} />
            ) : (
              <div className="text-center py-20 text-red-500">Fallback Database Layout Invoked (Timeline Expected)</div>
            )}
          </div>
        )}

        {/* TAB 2 : FACTIONS */}
        {activeTab === 2 && (
          <div key={activeTab} className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DATA.factions.map((faction, idx) => {
                const roleColors = {
                  antagonist: theme.accent,
                  protagonist: theme.secondary,
                  neutral: theme.primary,
                  chaotic: theme.accent
                };
                const color = roleColors[faction.role] || theme.primary;
                const glow = faction.role === 'antagonist' || faction.role === 'chaotic' ? theme.badgeBg : theme.glow;
                
                return (
                  <HoverCard 
                    key={idx} 
                    hoverGlow={glow}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:bg-white/10 active:bg-white/15 [@media(hover:none)]:transform-none"
                  >
                    <div className="p-6 md:p-8 flex flex-col items-start h-full" style={{ borderLeft: `4px solid ${color}` }}>
                      <div className="flex w-full items-start justify-between mb-4">
                        <div className="p-3 rounded-full hidden sm:block shrink-0" style={{ backgroundColor: `${color}20`, color: color }}>
                          {getIcon(faction.icon)}
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-auto">
                          <div className="px-2 py-1 text-[8px] md:text-[10px] font-bold tracking-widest rounded border uppercase" style={{ backgroundColor: `${color}20`, color: color, borderColor: `${color}50` }}>
                            {faction.role}
                          </div>
                          <div className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase flex items-center gap-1">
                            <Icons.Users className="w-3 h-3" />
                            EST: <span className="text-white">{faction.memberCount}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full flex-grow">
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider mb-3 truncate">{faction.name}</h2>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                          {isSystemMode ? faction.systemDesc : faction.loreDesc}
                        </p>
                      </div>
                    </div>
                  </HoverCard>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3 : CORE LAWS */}
        {activeTab === 3 && (
          <div key={activeTab} className="animate-fade-in">
            <div className="grid grid-cols-1 gap-6">
              {DATA.rules.map((rule, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-xl p-6 md:p-8 transition-colors duration-300">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6 pb-6 border-b border-white/10">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white mb-2">{rule.name}</h2>
                      <span className="text-[10px] md:text-xs font-bold tracking-widest text-gray-400 uppercase">{rule.subtitle}</span>
                    </div>
                    <SeverityBadge severity={rule.severity} />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <span 
                      className="text-[10px] font-bold tracking-[0.2em] uppercase"
                      style={{ color: isSystemMode ? theme.secondary : theme.primary }}
                    >
                      {isSystemMode ? 'SYSTEM EXCEPTION' : 'LORE CONSEQUENCE'}
                    </span>
                    <p className="text-sm md:text-lg text-gray-300 leading-relaxed font-light">
                      {isSystemMode ? rule.systemEquivalent : rule.loreConsequence}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Anomalies Addon for Rules */}
            {DATA.anomalies && DATA.anomalies.length > 0 && (
              <div className="mt-16 pt-8 border-t border-dashed" style={{ borderColor: `${theme.accent}50` }}>
                <div className="flex items-center gap-2 mb-8 justify-center">
                  <Icons.AlertTriangle className="w-5 h-5 animate-pulse" style={{ color: theme.accent }} />
                  <span className="font-bold tracking-[0.2em] text-xs md:text-sm uppercase" style={{ color: theme.accent }}>Known System Anomalies</span>
                  <Icons.AlertTriangle className="w-5 h-5 animate-pulse" style={{ color: theme.accent }} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {DATA.anomalies.map((anom, idx) => (
                    <div key={idx} className="p-6 border rounded-lg" style={{ borderColor: `${theme.accent}40`, backgroundColor: `${theme.accent}10` }}>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-1 uppercase truncate">{anom.name}</h3>
                      <p className="text-[10px] md:text-xs mb-4 tracking-wider" style={{ color: theme.accent }}>VIOLATION: {anom.ruleViolated.toUpperCase()}</p>
                      <p className="text-xs md:text-sm text-gray-400">
                        {isSystemMode ? anom.systemDesc : anom.loreDesc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/5 relative z-10 flex flex-col items-center">
        <p className="text-[8px] md:text-[10px] text-gray-600 tracking-[0.2em] uppercase max-w-2xl mx-auto px-6 mb-4">
          Unofficial fan-made interactive analysis. All characters, names, and lore belong to their respective creators and studios.
        </p>
        <a 
          href={`https://myanimelist.net/anime/${DATA.malId}`} 
          target="_blank" 
          rel="noreferrer"
          className="text-[10px] hover:text-white transition-colors tracking-widest uppercase font-bold hover:underline"
          style={{ color: theme.primary }}
        >
          VIEW ON MYANIMELIST
        </a>
      </footer>

    </div>
  );
};

export default Dashboard;
