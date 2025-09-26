import { Select } from '../../ui'

const DestinationsFilter = ({ areas = [], themes = [], selectedArea, selectedTheme, onAreaChange, onThemeChange }) => {
  const areaOptions = [
    { value: 'ALL', label: '모든 지역' },
    ...areas.map(area => ({ value: area, label: area }))
  ]

  const themeOptions = [
    { value: 'ALL', label: '모든 테마' },
    ...themes.map(theme => ({ value: theme, label: theme }))
  ]

  return (
    <div className="grid-2" style={{ margin: '10px 0 12px' }}>
      <div>
        <div className="muted" style={{ marginBottom: 6 }}>지역 선택</div>
        <Select
          options={areaOptions}
          value={selectedArea}
          onChange={onAreaChange}
        />
      </div>
      <div>
        <div className="muted" style={{ marginBottom: 6 }}>여행 테마</div>
        <Select
          options={themeOptions}
          value={selectedTheme}
          onChange={onThemeChange}
        />
      </div>
    </div>
  )
}

export default DestinationsFilter