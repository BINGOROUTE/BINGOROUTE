import { useState, useEffect } from 'react'
import { weatherService } from '../../services/weatherService'

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadWeatherData = async () => {
    setLoading(true)
    setError(null)
    try {
      const currentWeather = await weatherService.getCurrentWeather()
      if (currentWeather) {
        const formattedData = weatherService.formatSeoulWeatherData(currentWeather)
        setWeatherData(formattedData)
      }
    } catch (err) {
      console.error('날씨 데이터 로드 실패:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeatherData()
  }, [])

  return {
    weatherData,
    loading,
    error,
    refetch: loadWeatherData
  }
}