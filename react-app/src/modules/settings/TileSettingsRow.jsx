export default function TileSettingsRow({
  id,
  title,
  visible,
  isFirst,
  isLast,
  moveUpTile,
  moveDownTile,
  toggleTileVisibility,
}) {
  const radiusClass = isFirst ? 'rounded-t-md' : isLast ? 'rounded-b-md' : 'rounded-none'

  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_32px_32px_32px] items-center gap-2 p-2 border ${radiusClass}`}
      style={{ borderColor: 'var(--border-color)' }}
    >
      <p className="m-0 truncate">{title}</p>

      <button
        className="justify-self-center"
        style={{ color: 'var(--muted-color)' }}
        onClick={() => moveUpTile(id)}
        aria-label={`Move ${title} up`}
      >
        <span className="material-symbols-outlined" aria-hidden>
          arrow_upward
        </span>
      </button>
      <button
        className="justify-self-center"
        style={{ color: 'var(--muted-color)' }}
        onClick={() => moveDownTile(id)}
        aria-label={`Move ${title} down`}
      >
        <span className="material-symbols-outlined" aria-hidden>
          arrow_downward
        </span>
      </button>
      <button
        className="justify-self-center"
        style={{ color: visible ? 'var(--primary-color)' : 'var(--muted-color)' }}
        onClick={() => toggleTileVisibility(id)}
        aria-label={visible ? `Hide ${title}` : `Show ${title}`}
      >
        <span className="material-symbols-outlined" aria-hidden>
          {visible ? 'visibility' : 'visibility_off'}
        </span>
      </button>
    </div>
  )
}
