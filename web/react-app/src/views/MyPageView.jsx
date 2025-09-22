import { useStore } from '../context/StoreContext'
import { DESTINATIONS } from '../data/destinations'

const MyPageView = () => {
  const { session, wishlist, trips } = useStore()

  if (!session) {
    return (
      <div className="br-container">
        <div className="center">
          <p>로그인이 필요합니다.</p>
        </div>
      </div>
    )
  }

  const wishlistDestinations = DESTINATIONS.filter(d => wishlist.includes(d.id))

  return (
    <div className="br-container">
      <div className="section">
        <h2>내 정보</h2>
        <div className="panel">
          <div className="grid-2">
            <div>
              <strong>이름</strong>
              <p>{session.name}</p>
            </div>
            <div>
              <strong>이메일</strong>
              <p>{session.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>찜한 장소 ({wishlist.length})</h3>
        {wishlistDestinations.length > 0 ? (
          <div className="cards">
            {wishlistDestinations.map(destination => (
              <div key={destination.id} className="card">
                <div className="img"></div>
                <div className="body">
                  <div className="row">
                    <strong>{destination.name}</strong>
                    <span className="pill">{destination.duration}</span>
                  </div>
                  <div className="meta">
                    {destination.area} · 평점 {destination.rating}
                  </div>
                  <p className="muted">{destination.short}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="center">
            <p className="muted">찜한 장소가 없습니다.</p>
          </div>
        )}
      </div>

      <div className="section">
        <h3>내 여행 계획 ({trips.length})</h3>
        {trips.length > 0 ? (
          <div className="panel">
            {trips.map((trip, index) => (
              <div key={index} className="poi-row">
                <div>
                  <strong>{trip.title || `여행 계획 ${index + 1}`}</strong>
                  <div className="muted">{trip.date || '날짜 미정'}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="center">
            <p className="muted">여행 계획이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPageView