import SearchResultsSkeleton from './SearchResultsSkeleton'
import SearchResultsList from './SearchResultsList'

export default function SearchResultPanel({ active, loading, error, results = [] }) {
  if (!active) return null

  return (
    <div className="search-result-panel">
      {loading && active && <SearchResultsSkeleton rows={4} />}
      {!loading && error && active && <p className="search-state">{error}</p>}
      {!loading && !error && results.length > 0 && active && (
        <SearchResultsList results={results} />
      )}
      {!loading && !error && results.length === 0 && active && (
        <div className="search-empty">
          <p className="search-empty-title">No results found</p>
          <p className="search-empty-subtitle">Try another keyword.</p>
        </div>
      )}
    </div>
  )
}
