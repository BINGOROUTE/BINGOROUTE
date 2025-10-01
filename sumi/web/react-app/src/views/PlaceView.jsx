import { useParams, useNavigate } from 'react-router-dom' // 라우터 훅 임포트. useParams: URL 파라미터 읽기. useNavigate: 코드로 페이지 이동
import { DESTINATIONS } from '../data/destinations'      // 정적 데이터 임포트. 여행지 목록 원천
import { useStore } from '../context/StoreContext'        // 전역 상태 훅 임포트. 위시리스트 상태 접근/갱신
import { useAuth } from '../hooks/useAuth'

// 기능별 컴포넌트 불러오기기
import Back from '../components/place/Back'  // 상세페이지 뒤로가기 버튼
import Head from '../components/place/Head'  // 상세페이지 헤더
import Info from '../components/place/info'  // 상세정보 및 방문정보
import Addlist from '../components/place/Addlist'   // 여행계획 추가 버튼
              // 인증 훅 임포트. 로그인 여부 확인, 로그인 유도

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
    if (!isAuthenticated) 
      return promptLogin()                          // 비로그인 방어. 조기 종료
    const newWishlist = isSaved                           // 새 위시리스트 계산. 불변성 유지
      ? wishlist.filter(id => id !== destination.id)      // 이미 저장됨 → 제거
      : [...wishlist, destination.id]                     // 미저장 → 추가
    setWishlist(newWishlist)                              // 전역 상태 갱신. 렌더 자동 반영
  }


  return (                                                // 정상 UI 반환 시작
    <div className="br-container">                        {/* 페이지 컨테이너 */}

{/* 뒤로가기 섹션(back.jsx 컴포넌트) */}
      <Back />

{/* 히어로 섹션(Head.jsx 컴포넌트) */}
      <Head
        destination={destination}
        toggleSave={toggleSave}
        isSaved={isSaved}
        isAuthenticated={isAuthenticated}
      />

{/* 상세 정보 및 방문 정보 섹션(Info.jsx 컴포넌트) */}
      <Info destination={destination} />

{/* 여행계획 추가 버튼 섹션(Addlist.jsx 컴포넌트) */}
      <Addlist destination={destination} />
    </div>
  )
}



export default PlaceView                                   // 기본 내보내기. 라우터에서 사용
