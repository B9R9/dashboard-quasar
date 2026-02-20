import React from 'react'

export default function TimeWidget() {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentDate.toLocaleTimeString('fi-FI', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm" style={{ color: 'var(--muted-color)' }}>
        Time
      </p>
      <span>{formattedTime}</span>
    </div>
  )
}
