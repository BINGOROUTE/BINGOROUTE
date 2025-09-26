import { Select } from '../../ui'

const WeatherSelector = ({ districts = [], selectedDistrict, onChangeDistrict, loading }) => {
  return (
    <Select
      options={districts}
      value={selectedDistrict}
      onChange={onChangeDistrict}
      loading={loading}
      loadingText="로딩 중..."
      placeholder="구를 선택하세요"
    />
  )
}

export default WeatherSelector