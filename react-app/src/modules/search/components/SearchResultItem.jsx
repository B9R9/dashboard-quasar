export default function SearchResultItem({ item }) {
  return (
    <li className="search-result-item">
      <h4>{item.name ?? 'Sans titre'}</h4>
      <p>{item.description ?? item.snippet ?? ''}</p>
    </li>
  )
}
