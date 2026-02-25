import '../search.css'
import React from 'react'

import useDebouncedValue from '../hooks/useDebouncedValue'

import SearchInput from './SearchInput'
import SearchResultPanel from './SearchResultPanel'

export default function Search() {
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [searchResults, setSearchResults] = React.useState([])
  const debouncedSearchTerm = useDebouncedValue(searchTerm.trim(), 400)

  const activeSearch = Boolean(debouncedSearchTerm)

  React.useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(debouncedSearchTerm)
    } else {
      setSearchResults([])
      setError(null)
      setLoading(false)
    }
  }, [debouncedSearchTerm])

  async function handleSearch(term) {
    if (!term.trim()) {
      setSearchTerm('')
      setSearchResults([])
      setError(null)
      setLoading(false)
      return
    }
    setError(null)
    setLoading(true)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Mock search results
      const mockResults = [
        { id: 1, name: `Result for "${term}" #1`, description: 'Description of result 1' },
        { id: 2, name: `Result for "${term}" #2`, description: 'Description of result 2' },
        { id: 3, name: `Result for "${term}" #3`, description: 'Description of result 3' },
      ]
      setSearchResults(mockResults)
    } catch {
      setError('An error occurred while searching.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search">
      <SearchInput
        value={searchTerm}
        onChange={(value) => setSearchTerm(value)}
        onClear={() => setSearchTerm('')}
      />
      <small className="block w-1/2 text-right text-xs" style={{ color: 'var(--muted-color)' }}>
        {searchResults.length} results found
      </small>
      <SearchResultPanel
        active={activeSearch}
        loading={loading}
        error={error}
        results={searchResults}
      />
    </div>
  )
}
