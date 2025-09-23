import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DESTINATIONS } from '../data/destinations'
import DestinationCard from '../components/DestinationCard'
import { useStore } from '../context/StoreContext'
import { weatherService } from '../services/weatherService'

const MainView = () => {
  const { session } = useStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('')
  const [activeTab, setActiveTab] = useState('전체')
  const [selectedDistrict, setSelectedDistrict] = useState('강남구')
  const [weatherData, setWeatherData] = useState({})
  const [loading, setLoading] = useState(true)

  const tabs = ['전체', '인기', '산책', '전통']

  // 날씨 데이터 로드
  useEffect(() => {
    const loadWeatherData = async () => {
      setLoading(true)
      try {
        const currentWeather = await weatherService.getCurrentWeather()
        if (currentWeather) {
          const formattedData = weatherService.formatSeoulWeatherData(currentWeather)
          setWeatherData(formattedData)

          // 첫 번째 구를 기본 선택
          const districts = Object.keys(formattedData)
          if (districts.length > 0 && !districts.includes(selectedDistrict)) {
            setSelectedDistrict(districts[0])
          }
        }
      } catch (error) {
        console.error('날씨 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWeatherData()
  }, [])

  // Listen for search events from header
  useEffect(() => {
    const handleSearch = (e) => {
      setFilter(e.detail || '')
    }
    document.addEventListener('br:search', handleSearch)
    return () => document.removeEventListener('br:search', handleSearch)
  }, [])

  const handleStartPlanning = () => {
    navigate(session ? '/plan' : '/login')
  }

  const filteredDestinations = DESTINATIONS.filter(d => {
    const tabOk = activeTab === '전체' ||
      (activeTab === '인기' ? d.rating >= 4.6 :
        d.tags.some(tag =>
          (activeTab === '산책' && tag === '산책') ||
          (activeTab === '전통' && tag === '전통')
        ))

    const query = filter.trim().toLowerCase()
    const qOk = !query ||
      [d.name, d.area, d.short, d.tags.join(' ')].join(' ').toLowerCase().includes(query)

    return tabOk && qOk
  })

  const currentWeather = weatherData[selectedDistrict] || {
    temp: '정보없음',
    humidity: '정보없음',
    wind: '정보없음',
    sky: '정보없음',
    advice: '날씨 정보를 불러오는 중입니다...'
  }

  const districts = Object.keys(weatherData)

  return (
    <div className="br-container">
      {/* Hero Section */}
      <div className="hero">
        <div className="pill" style={{ display: 'inline-block', marginBottom: '8px' }}>
          서울 추천 가이드
        </div>
        <h1>서울을 더 스마트하게 여행하세요</h1>
        <p>서울의 흥미로운 로컬 명소를 발견하고, 나만의 여행 루트를 만들어 보세요.</p>
        <div style={{ marginTop: '10px' }}>
          <button className="brand-btn" onClick={handleStartPlanning}>
            여행 계획 시작하기
          </button>
        </div>
      </div>

      {/* Weather Section */}
      <div className="section">
        <div className="panel">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong>실시간 날씨 정보</strong>
            {loading ? (
              <span className="muted">로딩 중...</span>
            ) : (
              <select
                className="input"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            )}
          </div>
          {loading ? (
            <div className="muted">날씨 정보를 불러오는 중...</div>
          ) : (
            <>
              <div className="meta">
                서울 {selectedDistrict} 현재 {currentWeather.temp}°C · 습도 {currentWeather.humidity}% · 바람 {currentWeather.wind} · 하늘 {currentWeather.sky}
              </div>
              <div className="muted" style={{ marginTop: '6px' }}>
                {currentWeather.advice}
              </div>
              {currentWeather.rainfall && parseFloat(currentWeather.rainfall) > 0 && (
                <div className="muted" style={{ marginTop: '4px' }}>
                  강수량: {currentWeather.rainfall}mm
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Destinations Section */}
      <div className="section">
        <h3>추천 여행지</h3>

        {/* Tabs */}
        <div className="tabs">
          {tabs.map(tab => (
            <div
              key={tab}
              className={`tab ${tab === activeTab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="cards">
          {filteredDestinations.map(destination => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MainView