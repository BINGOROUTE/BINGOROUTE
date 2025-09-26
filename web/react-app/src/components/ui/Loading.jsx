const Loading = ({ 
  text = "로딩 중...", 
  size = "medium",
  className = "" 
}) => {
  const sizeClass = size === "small" ? "muted" : ""
  
  return (
    <div className={`${sizeClass} ${className}`.trim()}>
      {text}
    </div>
  )
}

export default Loading