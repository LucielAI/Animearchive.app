import AffinityMatrix from '../components/AffinityMatrix'
import StandardCardsExplorer from './StandardCardsExplorer'

export default function AffinityMatrixExplorer({ characters = [], isSystemMode, theme }) {
  // Build affinity matrix from character data
  // Types = character names, matrix = cross-compatibility based on relationships
  const types = characters.map(c => c.name)

  if (types.length === 0) {
    return <StandardCardsExplorer characters={characters} isSystemMode={isSystemMode} theme={theme} />
  }

  // Generate a simple affinity matrix from character danger levels and shared traits
  const matrix = characters.map((row, ri) =>
    characters.map((col, ci) => {
      if (ri === ci) return 100
      // Base affinity from danger level similarity
      const dlDiff = Math.abs((row.dangerLevel || 5) - (col.dangerLevel || 5))
      return Math.max(10, 100 - dlDiff * 12 + Math.floor(Math.random() * 15))
    })
  )

  return (
    <div className="space-y-6 font-mono">
      <h3 className="text-xs tracking-widest text-gray-500 mb-3">
        {isSystemMode ? '// COMPATIBILITY MATRIX' : '// CHARACTER AFFINITY WEB'}
      </h3>
      <AffinityMatrix types={types} matrix={matrix} />
      <div className="mt-6">
        <StandardCardsExplorer characters={characters} isSystemMode={isSystemMode} theme={theme} />
      </div>
    </div>
  )
}
