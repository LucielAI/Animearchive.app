import { Link } from 'react-router-dom'
import { UNIVERSE_CATALOG, UNIVERSE_CATALOG_MAP } from '../data/index'
import { Database, ArrowRight, Compass, Sparkles, Clock3 } from 'lucide-react'

function scoreSimilarity(current, candidate) {
  if (!current || !candidate) return 0

  let score = 0
  if (candidate.visualizationHint === current.visualizationHint) score += 5

  const currentTagline = (current.tagline || '').toLowerCase()
  const candidateTagline = (candidate.tagline || '').toLowerCase()
  const sharedTerms = ['causal', 'network', 'counter', 'economy', 'deterministic', 'hierarchy', 'control', 'strategy']
  for (const term of sharedTerms) {
    if (currentTagline.includes(term) && candidateTagline.includes(term)) score += 1
  }

  const currentRules = current.stats?.rules || 0
  const candidateRules = candidate.stats?.rules || 0
  if (Math.abs(currentRules - candidateRules) <= 1) score += 1

  return score
}

function takeUnique(universes, count, seen) {
  const picked = []
  for (const universe of universes) {
    if (picked.length >= count) break
    if (seen.has(universe.id)) continue
    seen.add(universe.id)
    picked.push(universe)
  }
  return picked
}

function buildSuggestions(currentId) {
  const current = UNIVERSE_CATALOG_MAP[currentId]
  const pool = UNIVERSE_CATALOG.filter((entry) => entry.id !== currentId)
  const seen = new Set()

  const related = takeUnique(
    [...pool].sort((a, b) => scoreSimilarity(current, b) - scoreSimilarity(current, a) || a.anime.localeCompare(b.anime)),
    3,
    seen
  )

  const newest = takeUnique([...pool].reverse(), 2, seen)
  const exploreMore = takeUnique([...pool].sort((a, b) => a.anime.localeCompare(b.anime)), 2, seen)

  return {
    related,
    newest,
    exploreMore,
  }
}

function UniverseCard({ anime, isSystemMode, accentColor }) {
  const cardAccent = isSystemMode ? (anime.themeColors?.secondary || accentColor) : (anime.themeColors?.primary || accentColor)
  const cardGlow = isSystemMode ? (anime.themeColors?.modeGlow || 'rgba(34,211,238,0.25)') : (anime.themeColors?.glow || 'rgba(139,92,246,0.25)')

  return (
    <li key={anime.id} className="w-full md:w-[260px]">
      <Link
        to={`/universe/${anime.id}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
        className="group flex flex-col items-start justify-end p-5 bg-white/5 border border-white/10 rounded-xl transition-all duration-500 h-[120px] relative overflow-hidden text-left shadow-lg hover:border-white/30 hover:-translate-y-1"
        style={{ boxShadow: '0 0 0 rgba(0,0,0,0)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 10px 30px -10px ${cardGlow}`
          e.currentTarget.style.borderColor = cardAccent
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        }}
      >
        {anime.animeImageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 grayscale group-hover:opacity-20 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            style={{ backgroundImage: `url(${anime.animeImageUrl})` }}
          />
        ) : (
          <div
            className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700"
            style={{ background: `radial-gradient(ellipse at 70% 30%, ${cardAccent}12 0%, transparent 60%)` }}
          />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
        <div
          className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ backgroundColor: cardAccent }}
        />

        <div className="relative z-10 w-full flex flex-col gap-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] group-hover:text-white/80 group-hover:scale-105 origin-left transition-all duration-500">STATUS: ONLINE</span>
          <span className="text-sm font-bold uppercase truncate w-full flex items-center justify-between text-gray-200 group-hover:text-white drop-shadow-md">
            {anime.anime}
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" style={{ color: cardAccent }} />
          </span>
        </div>
      </Link>
    </li>
  )
}

function SuggestionGroup({ id, title, description, icon, items, isSystemMode, accentColor }) {
  if (!items.length) return null
  const Icon = icon

  return (
    <section aria-labelledby={id} className="w-full mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" style={{ color: accentColor }} />
        <h3 id={id} className="text-xs font-bold tracking-[0.2em] uppercase text-white">{title}</h3>
      </div>
      <p className="text-[11px] text-gray-500 mb-3">{description}</p>
      <ul className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4" aria-label={title}>
        {items.map((anime) => (
          <UniverseCard key={anime.id} anime={anime} isSystemMode={isSystemMode} accentColor={accentColor} />
        ))}
      </ul>
    </section>
  )
}

export default function ExploreAnotherUniverse({ currentId, isSystemMode, theme }) {
  const accentColor = isSystemMode ? (theme?.secondary || '#22d3ee') : (theme?.primary || '#8b5cf6')
  const { related, newest, exploreMore } = buildSuggestions(currentId)

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-16 mt-8 font-mono border-t border-white/5" aria-labelledby="related-universes-heading">
      <div className="flex flex-col items-center text-center md:text-left md:items-start gap-3">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5" style={{ color: accentColor }} />
          <h2 id="related-universes-heading" className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-white">
            Related Universe Discovery
          </h2>
        </div>
        <p className="text-xs text-gray-500 max-w-3xl leading-relaxed">
          This archive is organized as a connected analysis graph. Use these curated paths to compare universes with similar mechanics, track the newest additions, and branch into adjacent system types without loading the full catalog.
        </p>

        <SuggestionGroup
          id="suggested-universes-heading"
          title="Suggested Universes"
          description="Closest matches based on analytical lens, structural constraints, and system thesis language."
          icon={Compass}
          items={related}
          isSystemMode={isSystemMode}
          accentColor={accentColor}
        />

        <SuggestionGroup
          id="newest-universes-heading"
          title="Newest Universes"
          description="Recently integrated archive entries for ongoing discovery and fresh comparisons."
          icon={Clock3}
          items={newest}
          isSystemMode={isSystemMode}
          accentColor={accentColor}
        />

        <SuggestionGroup
          id="explore-more-universes-heading"
          title="Explore More"
          description="Additional crawlable links to broaden thematic navigation across the archive."
          icon={Sparkles}
          items={exploreMore}
          isSystemMode={isSystemMode}
          accentColor={accentColor}
        />
      </div>
    </section>
  )
}
