import React from 'react'

import useWeather from '../hooks/useWeather'

export default function WeatherWidget() {
  const { weatherData, loading } = useWeather()
  const icon = 'wb_sunny' // Placeholder icon, you can map weather conditions to icons as needed

  if (loading) {
    return (
      <div className="weather-widget weather-widget--skeleton" aria-hidden>
        <span className="skeleton skeleton-icon" />
        <span className="skeleton skeleton-text" />
      </div>
    )
  }

  return (
    <div className="weather-widget">
      <p className="text-sm" style={{ color: 'var(--muted-color)' }}>
        Weather
      </p>
      <div className="flex flex-row items-center gap-2">
        <span className="material-symbols-outlined" aria-hidden>
          {icon}
        </span>
        {loading ? (
          <span className="skeleton skeleton-text" />
        ) : (
          <span>
            {weatherData?.currentConditions?.temp != null
              ? `${weatherData.currentConditions.temp}°C`
              : '--'}
          </span>
        )}
      </div>
    </div>
  )
}
