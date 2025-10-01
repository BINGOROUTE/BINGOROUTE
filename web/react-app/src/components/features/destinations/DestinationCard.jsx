import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../../context/StoreContext'
import { useAuth } from "../../../hooks/api/useAuth"
import DestinationDetailModal from './DestinationDetailModal'

const DestinationCard = ({ destination }) => {
  const { wishlist, setWishlist } = useStore()
  const { isAuthenticated, promptLogin } = useAuth()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isSaved = wishlist.includes(destination.id)

  const toggleSave = useCallback((event) => {
    if (event) {
      event.stopPropagation()
    }

    if (!isAuthenticated) {
      promptLogin()
      return
    }

    setWishlist(prev => {
      const exists = prev.includes(destination.id)
      return exists
        ? prev.filter(id => id !== destination.id)
        : [...prev, destination.id]
    })
  }, [destination.id, isAuthenticated, promptLogin, setWishlist])

  const handleNavigate = useCallback(() => {
    if (!isAuthenticated) {
      promptLogin()
      return
    }

    navigate(`/place/${destination.id}`)
  }, [destination.id, isAuthenticated, navigate, promptLogin])

  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openModal()
    }
  }, [openModal])

  return (
    <>
      <div
        className="card card-interactive"
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={handleKeyDown}
      >
        <div className="img" aria-hidden />
        <div className="body">
          <div className="row">
            <strong>{destination.name}</strong>
            {/* <span className="pill">{destination.duration}</span> */}
            <button
              type="button"
              className={`wishlist-toggle ${isSaved ? 'is-saved' : ''}`}
              onClick={toggleSave}
              aria-pressed={isSaved}
              aria-label={isSaved ? '찜 해제' : '찜하기'}
              title={isSaved ? '찜 해제' : '찜하기'}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 21.35 10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35Z" />
              </svg>
            </button>
          </div>
          <div className="meta">
            📍{destination.area} · ⭐ {destination.rating}
          </div>
          <p className="muted">{destination.short}</p>
        </div>
      </div>

      <DestinationDetailModal
        destination={destination}
        isOpen={isModalOpen}
        onClose={closeModal}
        onNavigate={handleNavigate}
        isSaved={isSaved}
        onToggleSave={toggleSave}
      />
    </>
  )
}

export default DestinationCard
