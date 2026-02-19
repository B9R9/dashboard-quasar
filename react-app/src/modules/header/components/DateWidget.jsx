import React from 'react'

export default function DateWidget() {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer) // Cleanup on unmount
  }, [])

  const formattedDate = currentDate.toLocaleDateString('fi-FI', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm" style={{ color: 'var(--muted-color)' }}>
        Date
      </p>
      <span>{formattedDate}</span>
    </div>
  )
}
