// 찜한 장소 목록과 빈 상태 메시지를 모두 포함
// 호출 시 필터링된 여행지 배열과 개수만 넘기면 동일한 UI가 그려지도록


const WishlistSection = ({ wishlistDestinations = [], wishlistCount = 0 }) => {
  return (
    <div className="section">
      <h3>찜한 장소 ({wishlistCount})</h3>
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
  )
}

export default WishlistSection
