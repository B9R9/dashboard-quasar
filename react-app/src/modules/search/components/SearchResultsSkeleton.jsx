export default function SearchResultsSkeleton({ rows = 4 }) {
  return (
    <ul className="search-results-list">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="search-result-item skeleton-item">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
        </li>
      ))}
    </ul>
  )
}
