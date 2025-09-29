import { useNavigate } from 'react-router-dom'
import { useStore } from '../../../context/StoreContext'
import { useAuth } from "../../../hooks/api/useAuth";
import { Button } from '../../ui'

const DestinationCard = ({ destination }) => {
  const { wishlist, setWishlist } = useStore()
  const { isAuthenticated, promptLogin } = useAuth()
  const navigate = useNavigate()
  
  const isSaved = wishlist.includes(destination.id)

  const toggleSave = () => {
    if (!isAuthenticated) return
    const newWishlist = isSaved 
      ? wishlist.filter(id => id !== destination.id)
      : [...wishlist, destination.id]
    setWishlist(newWishlist)
  }

  const handleMoreClick = () => {
    if (!isAuthenticated) return promptLogin()
    navigate(`/place/${destination.id}`)
  }

  return (
    <div className="card">
      <div className="img"></div>
      <div className="body">
        <div className="row">
          <strong>{destination.name}</strong>
          <span className="pill">{destination.duration}</span>
          <Button 
            variant="ghost"
            className="right"
            onClick={toggleSave}
            disabled={!isAuthenticated}
            title={!isAuthenticated ? '로그인 후 이용해주세요' : ''}
          >
            {isSaved ? '찜 해제' : '찜하기'}
          </Button>
        </div>
        <div className="meta">
          {destination.area} · 평점 {destination.rating}
        </div>
        <p className="muted">{destination.short}</p>
        <div>
          <Button variant="primary" onClick={handleMoreClick}>
            자세히 보기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DestinationCard