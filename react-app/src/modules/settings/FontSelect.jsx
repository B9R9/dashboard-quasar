import React from 'react'

export default function FontSelect({ id, value, options, onChange }) {
  const [open, setOpen] = React.useState(false)
  const wrapperRef = React.useRef(null)

  const selected = options.find((f) => f.id === value) ?? options[0]

  React.useEffect(() => {
    function handleOutsideClick(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      <button
        id={id}
        type="button"
        className="w-full rounded-md px-3 py-2 text-left"
        style={{
          fontFamily: selected?.css,
          border: '1px solid var(--control-border)',
          background: 'var(--accent-color)',
          color: 'var(--control-text)',
        }}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center justify-between">
          <span>{selected?.label}</span>
          <span
            className="material-symbols-outlined"
            style={{ color: 'var(--muted-color)' }}
            aria-hidden
          >
            {open ? 'expand_less' : 'expand_more'}
          </span>
        </span>
      </button>

      {open && (
        <ul
          className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-md p-1 shadow-lg"
          style={{ background: 'var(--control-bg)', border: '1px solid var(--control-border)' }}
          role="listbox"
          aria-labelledby={id}
        >
          {options.map((fontOption) => (
            <li key={fontOption.id}>
              <button
                type="button"
                className="w-full rounded px-2 py-2 text-left"
                style={{
                  fontFamily: fontOption.css,
                  background: fontOption.id === value ? 'var(--accent-color)' : 'transparent',
                  color: 'var(--text-color)',
                }}
                onClick={() => {
                  onChange(fontOption.id)
                  setOpen(false)
                }}
                role="option"
                aria-selected={fontOption.id === value}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-color)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    fontOption.id === value ? 'var(--accent-color)' : 'transparent'
                }}
              >
                {fontOption.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
