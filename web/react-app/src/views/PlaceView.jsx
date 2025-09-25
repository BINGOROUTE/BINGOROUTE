import { useParams, useNavigate } from 'react-router-dom' // 라우터 훅 임포트. useParams: URL 파라미터 읽기. useNavigate: 코드로 페이지 이동
import { DESTINATIONS } from '../data/destinations'      // 정적 데이터 임포트. 여행지 목록 원천
import { useStore } from '../context/StoreContext'        // 전역 상태 훅 임포트. 위시리스트 상태 접근/갱신
import { useAuth } from '../hooks/useAuth'                // 인증 훅 임포트. 로그인 여부 확인, 로그인 유도

const PlaceView = () => {                                 // 상세 페이지 컴포넌트 선언
  const { id } = useParams()                              // URL 동적 파라미터 추출. 예: /place/123 → id === "123"
  const navigate = useNavigate()                          // 프로그래매틱 네비게이션 획득. 예: navigate(-1), navigate('/')
  const { wishlist, setWishlist } = useStore()            // 전역 위시리스트와 갱신 함수 구조 분해
  const { isAuthenticated, promptLogin } = useAuth()      // 로그인 여부 플래그와 로그인 유도 함수 구조 분해
  
  const destination = DESTINATIONS.find(d => d.id === id) // 현재 id와 일치하는 여행지 검색. 주의: d.id 타입 불일치 시 비교 실패 가능

  if (!destination) {                                     // 해당 id 여행지 없음 예외 처리
    return (                                              // 대체 UI 즉시 반환
      <div className="br-container">                      {/* 공통 컨테이너. 너비/패딩 표준화 */}
        <div className="center">                          {/* 중앙 정렬 래퍼 */}
          <p>장소를 찾을 수 없습니다.</p>                 {/* 안내 문구 */}
          <button className="brand-btn" onClick={() => navigate('/')}> {/* 홈으로 이동 버튼 */}
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const isSaved = wishlist.includes(destination.id)       // 위시리스트 포함 여부 계산. UI 라벨/동작 분기

  const toggleSave = () => {                              // 찜 토글 핸들러
    if (!isAuthenticated) return                          // 비로그인 방어. 조기 종료
    const newWishlist = isSaved                           // 새 위시리스트 계산. 불변성 유지
      ? wishlist.filter(id => id !== destination.id)      // 이미 저장됨 → 제거
      : [...wishlist, destination.id]                     // 미저장 → 추가
    setWishlist(newWishlist)                              // 전역 상태 갱신. 렌더 자동 반영
  }

  return (                                                // 정상 UI 반환 시작
    <div className="br-container">                        {/* 페이지 컨테이너 */}
      <div className="section">                           {/* 상단 섹션. 뒤로가기 배치 */}
        <button className="ghost-btn" onClick={() => navigate(-1)}> // 이전 페이지로 이동. 히스토리 스택 -1
          ← 뒤로가기
        </button>
      </div>

      <div className="section">                           {/* 히어로 섹션 */}
        <div className="hero" style={{ background: '#c7d2fe' }}> // 배경색 지정. 강조 영역
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}> // 좌우 분배 정렬
            <div>                                          // 제목/메타 영역
              <div className="pill" style={{ marginBottom: '8px' }}> // 배지 표시
                {destination.tags.join(' · ')}             // 태그 목록 연결 출력
              </div>
              <h1>{destination.name}</h1>                  // 장소 이름 대제목
              <p>{destination.area} · 평점 {destination.rating} · {destination.duration}</p> // 지역/평점/소요시간 요약
            </div>
            <button 
              className="ghost-btn" 
              onClick={toggleSave} 
              style={{ background: 'rgba(255,255,255,0.2)' }} // 반투명 배경으로 시각 강조
              disabled={!isAuthenticated}                  // 비로그인 시 비활성화
              title={!isAuthenticated ? '로그인 후 이용해주세요' : ''} // 접근성 툴팁
            >
              {isSaved ? '찜 해제' : '찜하기'}             // 상태 기반 라벨 전환
            </button>
          </div>
        </div>
      </div>

      <div className="section">                           {/* 상세 정보 섹션 */}
        <div className="panel">                           {/* 패널 스타일 래퍼 */}
          <h3>상세 정보</h3>                               // 섹션 제목
          <p>{destination.long}</p>                        // 상세 설명 본문
        </div>
      </div>

      <div className="section">                           {/* 방문 정보 섹션 */}
        <div className="panel">                           {/* 패널 스타일 래퍼 */}
          <h3>방문 정보</h3>                               // 섹션 제목
          <div className="grid-2">                         // 2열 그리드
            <div>                                          // 좌측 칼럼
              <strong>추천 소요시간</strong>               // 라벨
              <p>{destination.duration}</p>                // 값
            </div>
            <div>                                          // 우측 칼럼
              <strong>평점</strong>                        // 라벨
              <p>{destination.rating}/5.0</p>              // 값
            </div>
          </div>
          <div>                                            // 태그 영역
            <strong>태그</strong>                          // 라벨
            <div style={{ marginTop: '8px' }}>             // 위 여백
              {destination.tags.map(tag => (               // 태그 목록 렌더
                <span key={tag} className="pill" style={{ marginRight: '8px' }}> // 배지 스타일 태그
                  {tag}                                    // 태그 텍스트
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section">                           {/* CTA 섹션 */}
        <button
          className="brand-btn"
          style={{ width: '100%' }}                        // 가로 꽉 채움
          onClick={() => {                                 // 클릭 핸들러
            if (!isAuthenticated) return promptLogin()     // 비로그인 시 로그인 유도
            navigate('/planner')                           // 로그인 시 플래너로 이동
          }}
        >
          여행 계획에 추가하기                              // 버튼 라벨
        </button>
      </div>
    </div>
  )
}

export default PlaceView                                   // 기본 내보내기. 라우터에서 사용
