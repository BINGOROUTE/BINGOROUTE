const WeatherDisplay = ({ currentWeather, selectedDistrict, loading }) => {
  if (loading) {
    return <div className="muted">날씨 정보를 불러오는 중...</div>
  }

  return (
    <>
      <div className="meta">
        서울 {selectedDistrict} {currentWeather.temp}°C · 바람 {currentWeather.wind} · 하늘 {currentWeather.sky}
      </div>
      <div className="muted" style={{ marginTop: '6px' }}>
        {currentWeather.advice}
      </div>
      {currentWeather.timeInfo && (
        <div className="muted" style={{ marginTop: '4px', fontSize: '0.9em' }}>
          📅 {currentWeather.timeInfo} | 서울시간 기준
        </div>
      )}
      {currentWeather.rainfall && parseFloat(currentWeather.rainfall) > 0 && (
        <div className="muted" style={{ marginTop: '4px' }}>
          강수량: {currentWeather.rainfall}mm
        </div>
      )}
    </>
  )
}

export default WeatherDisplay