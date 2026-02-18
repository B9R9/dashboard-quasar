export default function NotificationPanel({
  onMouseLeave,
  title = 'Notifications',
  items = [],
  loading = false,
  error = null,
}) {
  const hasItems = items.length > 0

  return (
    <div className="notif-panel p-2" onMouseLeave={onMouseLeave}>
      <h4 className="notif-panel__title">{title}</h4>
      <hr className="separator" />
      {loading && <p className="notif-panel__empty">Loading...</p>}
      {!loading && error && <p className="notif-panel__empty">{error}</p>}
      {!loading && !error && !hasItems && <p className="notif-panel__empty">No items</p>}
      {!loading && !error && hasItems && (
        <ul className="notif-panel__list">
          {items.map((item) => (
            <li key={item.id} className="notif-panel__item">
              <span className="notif-panel__item-title">{item.title}</span>
              <span className="notif-panel__item-time">{item.time}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
