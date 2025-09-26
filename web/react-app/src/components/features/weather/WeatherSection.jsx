import WeatherSelector from './WeatherSelector'
import WeatherDisplay from './WeatherDisplay'

const WeatherSection = ({ loading, districts = [], selectedDistrict, onChangeDistrict, currentWeather }) => {
  return (
    <div className="section">
      <div className="panel">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
          <strong>실시간 날씨 정보</strong>
          <WeatherSelector 
            districts={districts}
            selectedDistrict={selectedDistrict}
            onChangeDistrict={onChangeDistrict}
            loading={loading}
          />
        </div>
        <WeatherDisplay 
          currentWeather={currentWeather}
          selectedDistrict={selectedDistrict}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default WeatherSection