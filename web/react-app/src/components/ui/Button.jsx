const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick, 
  className = '',
  ...props 
}) => {
  const baseClass = 'btn'
  const variantClass = variant === 'primary' ? 'brand-btn' : 'ghost-btn'
  const classes = `${baseClass} ${variantClass} ${className}`.trim()

  return (
    <button 
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button