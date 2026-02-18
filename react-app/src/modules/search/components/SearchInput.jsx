import React from 'react'

export default function SearchInput({ value, onChange, onClear }) {
  return (
    <div className="search-input__field">
      <span className="material-symbols-outlined search-input__icon-left" aria-hidden>
        search
      </span>

      <input type="text" placeholder="Search..." value={value} onChange={onChange} />

      {value ? (
        <button type="button" className="" onClick={onClear} aria-label="Clear search">
          <span className="material-symbols-outlined">close</span>
        </button>
      ) : null}
    </div>
  )
}
