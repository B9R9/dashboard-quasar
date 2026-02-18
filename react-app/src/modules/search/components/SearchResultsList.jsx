import SearchResultItem from './SearchResultItem'

export default function SearchResultsList({ results = [] }) {
  if (!results.length) return null

  return (
    <ul className="search-results-list">
      {results.map((item, index) => (
        <SearchResultItem key={item.id ?? item.objectID ?? index} item={item} />
      ))}
    </ul>
  )
}
