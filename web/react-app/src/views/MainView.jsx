import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DESTINATIONS, WEATHER_PRESETS } from '../data/destinations'
import DestinationCard from '../components/DestinationCard'
import { useStore } from '../context/StoreContext'

const MainView = () => {
  const { session } = useStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('')
  const [activeTab, setActiveTab] = useState('전체')
  const [selectedCity, setSelectedCity] = useState('서울')

  const cities = Object.keys(WEATHER_PRESETS)
  const tabs = ['전체', '인기', '산책', '전통']

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

  const weather = WEATHER_PRESETS[selectedCity]

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
            <strong>날씨 정보</strong>
            <select 
              className="input" 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="meta">
            {selectedCity} 현재 {weather.temp}°C · 습도 {weather.humidity}% · 바람 {weather.wind} · 하늘 {weather.sky}
          </div>
          <div className="muted" style={{ marginTop: '6px' }}>
            {weather.advice}
          </div>
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