export default function TileKpi({ title, headline, trend, period, stats = [], updatedAt }) {
  const updatedLabel = updatedAt
    ? `${new Date(updatedAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })} ${new Date(updatedAt).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    : null

  const trendValue = trend ?? ''
  const isUpTrend = trendValue.trim().startsWith('+')
  const isDownTrend = trendValue.trim().startsWith('-')
  const trendIcon = isUpTrend ? 'arrow_upward' : isDownTrend ? 'arrow_downward' : 'trending_flat'
  const trendColor = isUpTrend
    ? 'var(--primary-color)'
    : isDownTrend
      ? 'var(--danger-color)'
      : 'var(--muted-color)'
  const trendBg = isUpTrend
    ? 'color-mix(in srgb, var(--primary-color) 18%, transparent)'
    : isDownTrend
      ? 'color-mix(in srgb, var(--danger-color) 18%, transparent)'
      : 'var(--accent-color)'

  function getStatColors(statKey) {
    if (statKey.includes('accepted') || statKey.includes('success')) {
      return { icon: '#16a34a', value: '#16a34a' }
    }
    if (statKey.includes('rejected') || statKey.includes('failed')) {
      return { icon: 'var(--danger-color)', value: 'var(--danger-color)' }
    }
    if (statKey.includes('cancel')) {
      return { icon: '#d97706', value: '#d97706' }
    }
    if (statKey.includes('acceptance') || statKey.includes('rate')) {
      return { icon: 'var(--primary-color)', value: 'var(--primary-color)' }
    }
    return { icon: 'var(--secondary-color)', value: 'var(--text-color)' }
  }

  return (
    <div
      className="relative flex h-full flex-col rounded-lg p-4 pb-10 transition-transform duration-200 ease-out hover:scale-[1.02] will-change-transform"
      style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-color)',
      }}
    >
      {trend ? (
        <div className="absolute right-3 top-3 flex w-28 flex-col items-center text-center">
          <span
            className="material-symbols-outlined text-4xl leading-none"
            style={{ color: trendColor }}
            aria-hidden
          >
            {trendIcon}
          </span>
          <p
            className="mt-1 mb-0 rounded px-2 py-1 text-xs font-semibold"
            style={{ color: trendColor, background: trendBg }}
          >
            {trend}
          </p>
        </div>
      ) : null}

      <h3 className="m-0 text-base font-semibold">{title}</h3>
      <p className="mt-2 mb-0 min-h-[1.75rem] pr-56 text-xl font-bold leading-tight overflow-hidden whitespace-nowrap">
        {headline}
      </p>
      {period ? (
        <p className="mt-0 mb-2 text-xs" style={{ color: 'var(--muted-color)' }}>
          Period: {period}
        </p>
      ) : null}
      <div className="mb-3" />

      <div className="flex flex-1 flex-col gap-2">
        {stats.map((stat) => {
          const colors = getStatColors(stat.key ?? '')
          return (
            <div
              key={stat.key}
              className="flex items-center justify-between gap-3 rounded px-1 py-1"
            >
              <div className="flex items-center gap-2">
                {stat.icon ? (
                  <span
                    className="material-symbols-outlined text-base"
                    style={{ color: colors.icon }}
                    aria-hidden
                  >
                    {stat.icon}
                  </span>
                ) : null}
                <span className="text-sm">{stat.label}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: colors.value }}>
                {stat.value}
              </span>
            </div>
          )
        })}
      </div>
      {updatedLabel ? (
        <p
          className="absolute bottom-3 right-3 m-0 text-xs text-right"
          style={{ color: 'var(--muted-color)' }}
        >
          updated: {updatedLabel}
        </p>
      ) : null}
    </div>
  )
}
