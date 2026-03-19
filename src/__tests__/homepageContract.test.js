import { describe, it, expect } from 'vitest'
import { UNIVERSE_CATALOG } from '../data/catalog'
import {
  getHomepageFeaturedUniverses,
  getHomepageRequestCandidates,
  getSystemStructureGroups,
  HOMEPAGE_SECTION_ORDER,
  REQUESTABLE_UNIVERSE_POOL,
} from '../config/homepageContract'

describe('homepage contract', () => {
  it('keeps required section order', () => {
    expect(HOMEPAGE_SECTION_ORDER).toEqual([
      'hero',
      'explore-by-system-structure',
      'featured-archive-systems',
      'continue-next-paths',
      'browse-universes',
      'community-pulse',
      'support-footer',
    ])
  })

  it('returns deterministic top featured universes', () => {
    const first = getHomepageFeaturedUniverses(UNIVERSE_CATALOG, 3).map((entry) => entry.id)
    const second = getHomepageFeaturedUniverses(UNIVERSE_CATALOG, 3).map((entry) => entry.id)
    expect(first).toEqual(second)
    expect(first.length).toBe(3)
  })

  it('derives system structure groups from live catalog data', () => {
    const groups = getSystemStructureGroups(UNIVERSE_CATALOG, 6)
    expect(groups.length).toBeGreaterThan(0)
    expect(groups.some((group) => group.count > 0)).toBe(true)
  })

  it('filters request candidates against implemented universes', () => {
    const implemented = new Set(UNIVERSE_CATALOG.map((entry) => entry.anime.toLowerCase().replace(/[^a-z0-9]/g, '')))
    const quickVotes = getHomepageRequestCandidates(UNIVERSE_CATALOG, 8)

    const hasImplemented = quickVotes.some((candidate) => implemented.has(candidate.anime.toLowerCase().replace(/[^a-z0-9]/g, '')))
    expect(hasImplemented).toBe(false)

    const isSubsetOfPool = quickVotes.every((candidate) => REQUESTABLE_UNIVERSE_POOL.some((pool) => pool.slug === candidate.slug))
    expect(isSubsetOfPool).toBe(true)
  })
})
