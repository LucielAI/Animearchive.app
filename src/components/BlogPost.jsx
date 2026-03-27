import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Calendar, ChevronLeft } from 'lucide-react'
import SeoHead from './SeoHead'
import { UNIVERSE_CATALOG_MAP } from '../data/index.js'
import { getClassificationLabel } from '../utils/getClassificationLabel'
import { SITE_URL, SITE_NAME, buildBlogPostStructuredData } from '../utils/seo'

function NewsletterInline() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const lastSubmit = useRef(0)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const now = Date.now()
    if (now - lastSubmit.current < 5000) return
    lastSubmit.current = now
    const trimmed = email.trim()
    if (!trimmed.includes('@') || !trimmed.includes('.')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: trimmed }) })
      if (res.ok) { setStatus('success'); setEmail('') } else setStatus('error')
    } catch { setStatus('error') }
  }, [email])
  if (status === 'success') return <p className="text-[11px] text-cyan-400 tracking-wider">You're in. Next drop is yours to know first.</p>
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input type="email" value={email} onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }} placeholder="your@email.com" maxLength={254} className="flex-1 min-w-0 bg-transparent border border-white/10 focus:border-cyan-400/40 rounded-lg px-3 py-2 text-xs text-gray-300 placeholder:text-gray-600 outline-none transition-colors font-mono min-h-[38px]" />
      <button type="submit" disabled={status === 'loading' || !email.trim()} className="flex-shrink-0 px-4 py-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/20 text-[10px] font-bold tracking-[0.15em] uppercase text-cyan-400 transition-all cursor-pointer disabled:opacity-40 min-h-[38px] font-mono">
        {status === 'loading' ? '...' : 'Subscribe'}
      </button>
    </form>
  )
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function UniverseLinkBlock({ slug }) {
  const entry = UNIVERSE_CATALOG_MAP[slug]

  if (!entry) {
    return (
      <div className="my-6 px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-[11px] text-gray-500">
        Universe not found: <span className="font-mono">{slug}</span>
      </div>
    )
  }

  const theme = entry.themeColors || { primary: '#374151' }
  const classLabel = getClassificationLabel(entry.visualizationHint)
  const stats = entry.stats || {}

  return (
    <Link
      to={`/universe/${entry.id}`}
      className="group flex items-center gap-4 my-6 px-5 py-4 rounded-xl border border-white/10 bg-white/[0.03] hover:border-cyan-400/30 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      style={{ borderLeftColor: theme.primary, borderLeftWidth: '3px' }}
    >
      {entry.animeImageUrl && (
        <img
          src={entry.animeImageUrl}
          alt={`${entry.anime} cover`}
          loading="lazy"
          decoding="async"
          className="w-14 h-14 rounded-lg object-cover object-center shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
        />
      )}
      <div className="min-w-0 grow">
        <span
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[7px] font-bold tracking-[0.18em] uppercase mb-1 border"
          style={{ color: theme.primary, borderColor: `${theme.primary}40`, backgroundColor: `${theme.primary}10` }}
        >
          {classLabel}
        </span>
        <p className="text-sm font-bold uppercase text-white truncate group-hover:text-cyan-100 transition-colors">
          {entry.anime}
        </p>
        <p className="text-[10px] text-gray-500 line-clamp-1">{entry.tagline}</p>
        {(stats.characters || stats.powerSystem || stats.rules) && (
          <div className="flex gap-2 mt-1 text-[9px] text-gray-600 tracking-wide">
            {stats.characters > 0 && <span>{stats.characters} entities</span>}
            {stats.powerSystem > 0 && <span>{stats.powerSystem} mechanics</span>}
            {stats.rules > 0 && <span>{stats.rules} rules</span>}
          </div>
        )}
      </div>
      <div className="inline-flex items-center gap-1 text-[9px] font-bold tracking-[0.16em] uppercase text-cyan-400 shrink-0 group-hover:gap-2 transition-all">
        Explore <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  )
}

function ContentBlock({ block }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-5">
          {block.text}
        </p>
      )

    case 'heading':
      return (
        <h2 className="text-xl md:text-2xl font-bold uppercase text-white mt-10 mb-4 tracking-tight">
          {block.text}
        </h2>
      )

    case 'universe-link':
      return <UniverseLinkBlock slug={block.slug} />

    case 'section-header':
      return (
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mt-8 mb-3 border-b border-white/5 pb-2">
          {block.text}
        </h2>
      )

    case 'inline-newsletter':
      return (
        <div className="my-8">
          <div className="rounded-xl border border-cyan-400/20 bg-[#0a0a10] p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-0.5 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md bg-cyan-400/10 border border-cyan-400/20">
                <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight text-white">Get the next analysis in your inbox</p>
                <p className="text-[11px] text-gray-500 tracking-wide mt-0.5">No spam. Just structural intelligence on anime worlds.</p>
              </div>
            </div>
            <NewsletterInline />
          </div>
        </div>
      )

    default:
      return null
  }
}

export default function BlogPost() {
  const { slug } = useParams()
  const [state, setState] = useState({ post: null, loading: true, error: null, loadedSlug: null })

  useEffect(() => {
    let cancelled = false

    fetch(`/blog/${slug}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Post not found (${res.status})`)
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setState({ post: data, loading: false, error: null, loadedSlug: slug })
      })
      .catch((err) => {
        if (cancelled) return
        setState({ post: null, loading: false, error: err.message, loadedSlug: slug })
      })

    return () => { cancelled = true }
  }, [slug])

  const { post, loading, error } = state.loadedSlug === slug ? state : { post: null, loading: true, error: null }

  const canonicalUrl = `${SITE_URL}/blog/${slug}`
  const seoTitle = post ? `${post.title} | ${SITE_NAME}` : `Blog | ${SITE_NAME}`
  const seoDescription = post?.description || ''
  const seoKeywords = post?.keywords || ''

  const structuredData = buildBlogPostStructuredData(post || null, canonicalUrl)

  return (
    <div className="min-h-screen bg-[#050508] text-white font-mono selection:bg-cyan-500/30 overflow-x-hidden">
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalUrl={canonicalUrl}
        type="article"
        structuredData={structuredData}
      />

      {/* Nav */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-white/5 sticky top-0 z-30 backdrop-blur-md bg-[#050508]/90">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-3 h-3" /> Blog
        </Link>
        <div className="flex items-center gap-4 text-[10px] text-gray-600 tracking-widest uppercase">
          <Link to="/" className="hover:text-white transition-colors">Archive</Link>
          <Link to="/universes" className="hover:text-white transition-colors">Universes</Link>
        </div>
      </nav>

      {/* Loading */}
      {loading && (
        <div className="max-w-2xl mx-auto px-6 py-24">
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-1/3 rounded bg-white/5 animate-pulse" />
            <div className="mt-10 space-y-3">
              <div className="h-4 rounded bg-white/5 animate-pulse" />
              <div className="h-4 rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <p className="text-xs text-rose-400 tracking-widest uppercase mb-3">Post not found</p>
          <p className="text-[11px] text-gray-500 mb-8">{error}</p>
          <Link to="/blog" className="text-[10px] tracking-[0.2em] uppercase text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Back to blog
          </Link>
        </div>
      )}

      {/* Post content */}
      {!loading && !error && post && (
        <article className="max-w-2xl mx-auto px-6 py-16">
          {/* Meta */}
          <header className="mb-10">
            <div className="flex items-center gap-2 text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-4">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.date)}</span>
              {post.author && (
                <>
                  <span className="text-white/10">·</span>
                  <span>{post.author}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight mb-5">
              {post.title}
            </h1>

            <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-cyan-400/30 pl-4">
              {post.description}
            </p>
          </header>

          {/* Content blocks */}
          <div>
            {Array.isArray(post.content) && post.content.map((block, index) => (
              <ContentBlock key={index} block={block} />
            ))}
          </div>

          {/* Footer CTA */}
          <footer className="mt-16 pt-10 border-t border-white/5">
            <p className="text-[10px] text-gray-600 tracking-widest uppercase mb-4">Continue exploring</p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/universes"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-300 hover:border-cyan-400/40 hover:text-white transition-all"
              >
                Browse All Universes <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-300 hover:border-cyan-400/40 transition-all"
              >
                More Blog Posts <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </footer>
        </article>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-[10px] text-gray-600 tracking-widest uppercase">
        <p>
          <Link to="/" className="hover:text-gray-400 transition-colors">{SITE_NAME}</Link>
          {' · '}
          <Link to="/blog" className="hover:text-gray-400 transition-colors">Blog</Link>
          {' · '}
          <Link to="/universes" className="hover:text-gray-400 transition-colors">Catalog</Link>
          {' · '}
          <Link to="/about" className="hover:text-gray-400 transition-colors">About</Link>
        </p>
      </footer>
    </div>
  )
}
