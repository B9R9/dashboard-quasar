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
    <div className="flex flex-col items-center gap-2 rounded p-2 bg-gray-100 hover-widget">
      <p className="text-sm text-gray-400">Weather</p>
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
