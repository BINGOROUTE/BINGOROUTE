import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../../ui'
import './DestinationDetailModal.css'

const DestinationDetailModal = ({
  destination,
  isOpen,
  onClose,
  onNavigate,
  isSaved,
  onToggleSave,
}) => {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
    }
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  const handleBackdropClick = () => {
    onClose()
  }

  const handleContentClick = (event) => {
    event.stopPropagation()
  }

  const handleToggleSave = () => {
    onToggleSave()
  }

  return createPortal(
    <div className="destination-modal__backdrop" onClick={handleBackdropClick}>
      <div className="destination-modal" role="dialog" aria-modal="true" onClick={handleContentClick}>
        <div className="destination-modal__header">
          <h2>{destination.name}</h2>
          <button type="button" className="destination-modal__close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div className="destination-modal__meta">
          <span>{destination.area}</span>
          <span>평점 {destination.rating}</span>
          {destination.duration ? <span>추천 시간 {destination.duration}</span> : null}
        </div>

        {destination.tags?.length ? (
          <ul className="destination-modal__tags">
            {destination.tags.map(tag => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}

        <p className="destination-modal__description">
          {destination.long || destination.short}
        </p>

        <div className="destination-modal__actions">
          <Button variant="ghost" onClick={handleToggleSave} type="button">
            {isSaved ? '찜 해제' : '찜하기'}
          </Button>
          <Button variant="primary" onClick={onNavigate} type="button">
            자세히 보기
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default DestinationDetailModal
