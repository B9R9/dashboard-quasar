import React from 'react'

export default function useWeather() {
  const [weatherData, setWeatherData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    async function fetchWeatherData() {
      // Fetch weather data from an API and update the state
      const apiKey = 'LEYF4HKLK55DCFE822AC7CYSD'
      const location = 'Helsinki'
      const unitGroup = 'metric'
      const contentType = 'json'

      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=${unitGroup}&key=${apiKey}&contentType=${contentType}`

      try {
        const response = await fetch(url)
        const data = await response.json()
        setWeatherData(data)
      } catch (error) {
        console.error('Error fetching weather data:', error)
      }
    }
    fetchWeatherData()
    setLoading(false)
  }, [])
  return { weatherData, loading }
}
