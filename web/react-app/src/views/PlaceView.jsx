import { useParams, useNavigate } from 'react-router-dom'
import { DESTINATIONS } from '../data/destinations'
import { useStore } from '../context/StoreContext'
import { useAuth } from "../hooks/api/useAuth";


const PlaceView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { wishlist, setWishlist } = useStore()
  const { isAuthenticated, promptLogin } = useAuth()
  
  const destination = DESTINATIONS.find(d => d.id === id)
  
  if (!destination) {
    return (
      <div className="br-container">
        <div className="center">
          <p>장소를 찾을 수 없습니다.</p>
          <button className="brand-btn" onClick={() => navigate('/')}>
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const isSaved = wishlist.includes(destination.id)

  const toggleSave = () => {
    if (!isAuthenticated) return
    const newWishlist = isSaved 
      ? wishlist.filter(id => id !== destination.id)
      : [...wishlist, destination.id]
    setWishlist(newWishlist)
  }

  return (
    <div className="br-container">
      <div className="section">
        <button className="ghost-btn" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
      </div>

      <div className="section">
        <div className="hero" style={{ background: '#c7d2fe' }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="pill" style={{ marginBottom: '8px' }}>
                {destination.tags.join(' · ')}
              </div>
              <h1>{destination.name}</h1>
              <p>{destination.area} · 평점 {destination.rating} · {destination.duration}</p>
            </div>
            <button 
              className="ghost-btn" 
              onClick={toggleSave} 
              style={{ background: 'rgba(255,255,255,0.2)' }}
              disabled={!isAuthenticated}
              title={!isAuthenticated ? '로그인 후 이용해주세요' : ''}
            >
              {isSaved ? '찜 해제' : '찜하기'}
            </button>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="panel">
          <h3>상세 정보</h3>
          <p>{destination.long}</p>
        </div>
      </div>

      <div className="section">
        <div className="panel">
          <h3>방문 정보</h3>
          <div className="grid-2">
          </div>

           {/* 🔽 추가 정보 블록 */}
          <div
            style={{
              marginTop: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px 24px' // 세로 12px, 가로 24px 간격
            }}
          >
            <div><strong>전화번호</strong><p>{destination.phone || '-'}</p></div>
            <div><strong>휴무일</strong><p>{destination.closed || '-'}</p></div>
            <div><strong>운영시간</strong><p>{destination.hours || '-'}</p></div>
            <div><strong>운영계절</strong><p>{destination.season || '-'}</p></div>
            <div><strong>주차장</strong><p>{destination.parking ? '가능' : '불가'}</p></div>
            <div><strong>유모차</strong><p>{destination.stroller ? '가능' : '불가'}</p></div>
            <div><strong>반려동물 입장</strong><p>{destination.pet ? '가능' : '불가'}</p></div>
            <div><strong>신용카드</strong><p>{destination.card ? '가능' : '불가'}</p></div>
              <div>
                <strong>태그</strong>
                <div style={{ marginTop: '8px' }}>
                  {destination.tags.map(tag => (
                    <span key={tag} className="pill" style={{ marginRight: '8px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
          </div>
        </div>
      </div>

      <div className="section">
        <button
          className="brand-btn"
          style={{ width: '100%' }}
          onClick={() => {
            if (!isAuthenticated) return promptLogin()
            navigate('/planner')
          }}
        >
          여행 계획에 추가하기
        </button>
      </div>
    </div>
  )
}

export default PlaceView
