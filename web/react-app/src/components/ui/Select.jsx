const Select = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "선택하세요",
  loading = false,
  loadingText = "로딩 중...",
  className = '',
  ...props 
}) => {
  if (loading) {
    return <span className="muted">{loadingText}</span>
  }

  return (
    <select
      className={`input ${className}`.trim()}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>{placeholder}</option>
      )}
      {options.map((option) => {
        // option이 문자열이면 value와 label이 같음
        if (typeof option === 'string') {
          return <option key={option} value={option}>{option}</option>
        }
        // option이 객체면 value와 label 분리
        return (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )
      })}
    </select>
  )
}

export default Select