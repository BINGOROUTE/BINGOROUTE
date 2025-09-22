import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const DestinationCard = ({ destination }) => {
  const { wishlist, setWishlist } = useStore()
  const navigate = useNavigate()
  
  const isSaved = wishlist.includes(destination.id)

  const toggleSave = () => {
    const newWishlist = isSaved 
      ? wishlist.filter(id => id !== destination.id)
      : [...wishlist, destination.id]
    setWishlist(newWishlist)
  }

  const handleMoreClick = () => {
    navigate(`/place/${destination.id}`)
  }

  return (
    <div className="card">
      <div className="img"></div>
      <div className="body">
        <div className="row">
          <strong>{destination.name}</strong>
          <span className="pill">{destination.duration}</span>
          <button className="ghost-btn right" onClick={toggleSave}>
            {isSaved ? '찜 해제' : '찜하기'}
          </button>
        </div>
        <div className="meta">
          {destination.area} · 평점 {destination.rating}
        </div>
        <p className="muted">{destination.short}</p>
        <div>
          <button className="brand-btn" onClick={handleMoreClick}>
            자세히 보기
          </button>
        </div>
      </div>
    </div>
  )
}

export default DestinationCard