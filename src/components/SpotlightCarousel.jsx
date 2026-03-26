import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Zap, Users, Network, Clock3, ShieldAlert, Coins } from 'lucide-react'
import { UNIVERSE_CATALOG } from '../data/index.js'
import { getClassificationLabel } from '../utils/getClassificationLabel'

const TYPE_ICONS = {
  'counter-tree': { Icon: Zap, label: 'Counter System', color: 'text-amber-400', bg: 'bg-amber-400/20' },
  'node-graph': { Icon: Network, label: 'Network System', color: 'text-cyan-400', bg: 'bg-cyan-400/20' },
  'affinity-matrix': { Icon: Users, label: 'Affinity System', color: 'text-violet-400', bg: 'bg-violet-400/20' },
  'timeline': { Icon: Clock3, label: 'Timeline System', color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  'counter-tree': { Icon: Zap, label: 'Counter System', color: 'text-amber-400', bg: 'bg-amber-400/20' },
}

function getSystemMeta(hint) {
  return TYPE_ICONS[hint] || { Icon: ShieldAlert, label: 'System', color: 'text-gray-400', bg: 'bg-gray-400/20' }
}

// Universes with strong anime imagery for the hero carousel
const CAROUSEL_CANDIDATES = [
  'naruto', 'one-piece', 'dragonballz', 'jjk', 'aot',
  'hunter-x-hunter', 'solo-leveling', 'demon-slayer', 'blue-lock',
  'one-punch-man', 'bleach', 'hxh', 'chainsaw-man', 're-zero',
]

export default function SpotlightCarousel({ onSearchOpen }) {
  const [index, setIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef(null)

  const candidates = UNIVERSE_CATALOG
    .filter(u => CAROUSEL_CANDIDATES.includes(u.id))
    .slice(0, 7)

  const goTo = useCallback((next) => {
    if (isTransitioning || candidates.length === 0) return
    setIsTransitioning(true)
    setIndex(next)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning, candidates.length])

  const next = useCallback(() => {
    goTo((index + 1) % candidates.length)
  }, [index, candidates.length, goTo])

  const prev = useCallback(() => {
    goTo((index - 1 + candidates.length) % candidates.length)
  }, [index, candidates.length, goTo])

  useEffect(() => {
    intervalRef.current = setInterval(next, 4500)
    return () => clearInterval(intervalRef.current)
  }, [next])

  if (candidates.length === 0) return null

  const current = candidates[index]
  const meta = getSystemMeta(current.visualizationHint)
  const MetaIcon = meta.Icon

  return (
    <div className="w-full" onMouseEnter={() => clearInterval(intervalRef.current)} onMouseLeave={() => { intervalRef.current = setInterval(next, 4500) }}>
      {/* Carousel */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-white/10" style={{ minHeight: '320px' }}>
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundImage: `url(${current.animeImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: isTransitioning ? 0 : 1,
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(to right, rgba(5,5,8,0.97) 0%, rgba(5,5,8,0.85) 50%, rgba(5,5,8,0.4) 100%)',
            opacity: isTransitioning ? 0 : 1,
          }}
        />
        {/* Mobile gradient (stacked) */}
        <div className="absolute inset-0 sm:hidden" style={{ background: 'linear-gradient(to top, rgba(5,5,8,0.98) 0%, rgba(5,5,8,0.6) 60%, rgba(5,5,8,0.2) 100%)' }} />

        {/* Content */}
        <div
          className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8"
          style={{ minHeight: '320px' }}
        >
          <div className="max-w-xl">
            {/* System badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[0.18em] uppercase ${meta.bg} ${meta.color}`}>
                <MetaIcon className="w-3 h-3" />
                {meta.label}
              </span>
              <span className="text-[9px] tracking-[0.15em] uppercase text-gray-500">{current.stats?.characters || 10}+ characters mapped</span>
            </div>

            {/* Title */}
            <h2
              className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-[0.95] mb-2 transition-all duration-500"
              style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)' }}
            >
              {current.anime}
            </h2>

            {/* Tagline */}
            <p
              className="text-sm text-gray-300 leading-relaxed mb-5 line-clamp-2 max-w-lg transition-all duration-500 delay-75"
              style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)' }}
            >
              {current.tagline}
            </p>

            {/* CTAs */}
            <div
              className="flex items-center gap-3 transition-all duration-500 delay-150"
              style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)' }}
            >
              <Link
                to={`/universe/${current.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-[#020617] text-[10px] font-bold tracking-[0.18em] uppercase transition-colors min-h-[44px]"
              >
                Explore System
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link
                to={`/compare?left=${current.id}&right=jjk`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/20 hover:border-white/40 text-white/70 hover:text-white text-[10px] font-bold tracking-[0.18em] uppercase transition-colors min-h-[44px]"
              >
                Compare
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 border border-white/20 hover:bg-black/70 text-white/70 hover:text-white flex items-center justify-center transition-all"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 border border-white/20 hover:bg-black/70 text-white/70 hover:text-white flex items-center justify-center transition-all"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {candidates.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all ${i === index ? 'w-5 h-1.5 bg-cyan-400' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails strip */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
        {candidates.map((u, i) => (
          <button
            key={u.id}
            onClick={() => goTo(i)}
            className={`shrink-0 flex items-center gap-2 rounded-lg px-3 py-2 border transition-all ${
              i === index
                ? 'border-cyan-400/50 bg-cyan-400/10 text-white'
                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'
            }`}
          >
            <img
              src={u.animeImageUrl}
              alt={u.anime}
              className="w-6 h-6 rounded object-cover shrink-0"
              loading="lazy"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap">{u.anime}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
