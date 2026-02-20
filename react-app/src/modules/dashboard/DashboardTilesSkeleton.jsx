function TileSkeleton({ rows }) {
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

export default function DashboardTilesSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <TileSkeleton key={index} rows={5} />
      ))}
    </div>
  )
}
