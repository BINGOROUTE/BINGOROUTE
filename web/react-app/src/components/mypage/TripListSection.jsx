// 날씨 점수 헬퍼 함수, 여행 카드, 빈 상태 안내 문구까지 한 곳에 담아놓음
// 여행 계획 섹션 전체를 담당


const getWeatherScoreClass = (score) => {
  if (score >= 80) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 60) return 'fair'
  if (score >= 50) return 'average'
  return 'poor'
}

const getWeatherIcon = (score) => {
  if (score >= 80) return '🌟'
  if (score >= 70) return '☀️'
  if (score >= 60) return '🌤️'
  if (score >= 50) return '⛅'
  return '🌧️'
}

const getWeatherMessage = (score) => {
  if (score >= 80) return '완벽한 여행 날씨!'
  if (score >= 70) return '여행하기 좋은 날씨'
  if (score >= 60) return '괜찮은 날씨'
  if (score >= 50) return '보통 날씨'
  return '주의가 필요한 날씨'
}

const TripListSection = ({ trips = [] }) => {
  return (
    <div className="section">
      <h3>내 여행 계획 ({trips.length})</h3>
      {trips.length > 0 ? (
        <div className="trip-list">
          {trips.map((trip, index) => (
            <div key={index} className="trip-card">
              <div className="trip-header">
                <div>
                  <strong>{trip.title || `여행 계획 ${index + 1}`}</strong>
                  <div className="trip-meta">
                    <span className="trip-date">{trip.date || '날짜 미정'}</span>
                    {trip.weatherScore && (
                      <span className={`weather-score ${getWeatherScoreClass(trip.weatherScore)}`}>
                        날씨 점수: {trip.weatherScore}점
                      </span>
                    )}
                  </div>
                </div>
                {trip.weatherScore && (
                  <div className="score-badge">
                    {trip.weatherScore}
                  </div>
                )}
              </div>

              <div className="trip-details">
                <div className="trip-info-grid">
                  <div className="trip-info-item">
                    <span className="info-label">기간</span>
                    <span className="info-value">{trip.duration || '미정'}</span>
                  </div>
                  <div className="trip-info-item">
                    <span className="info-label">스타일</span>
                    <span className="info-value">{trip.style || '미정'}</span>
                  </div>
                  <div className="trip-info-item">
                    <span className="info-label">예산</span>
                    <span className="info-value">{trip.budget || '미정'}</span>
                  </div>
                  <div className="trip-info-item">
                    <span className="info-label">동행</span>
                    <span className="info-value">{trip.companions || '미정'}</span>
                  </div>
                </div>

                {trip.weatherScore && (
                  <div className="weather-recommendation">
                    <span className="weather-icon">
                      {getWeatherIcon(trip.weatherScore)}
                    </span>
                    <span className="weather-message">
                      {getWeatherMessage(trip.weatherScore)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="center">
          <p className="muted">여행 계획이 없습니다.</p>
          <p className="muted">새로운 여행을 계획해보세요!</p>
        </div>
      )}
    </div>
  )
}

export default TripListSection
