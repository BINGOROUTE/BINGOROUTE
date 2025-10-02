import { Select } from '../../ui'

const WeatherSelector = ({ districts = [], selectedDistrict, onChangeDistrict, loading }) => {
  return (
    <Select
      options={districts}
      value={selectedDistrict}
      onChange={onChangeDistrict}
      loading={loading}
      loadingText="로딩 중..."
      placeholder="지역구 선택"
    />
  )
}

export default WeatherSelector