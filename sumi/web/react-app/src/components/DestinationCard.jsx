// 라우팅(페이지 이동) 기능을 쓰기 위한 훅을 불러옴.
import { useNavigate } from 'react-router-dom'

// 전역 상태(위시리스트 등)를 쓰기 위한 커스텀 컨텍스트 훅을 불러옴.
import { useStore } from '../context/StoreContext'

// 로그인 여부/로그인 유도 팝업 등을 쓰기 위한 인증 훅을 불러옴.
import { useAuth } from '../hooks/useAuth'

// 컴포넌트 시작. 부모가 내려준 travel 데이터 1개를 props로 받음.
const DestinationCard = ({ destination }) => {
  // 전역 상태에서 wishlist 배열과 이를 바꾸는 함수(setWishlist)를 꺼냄.
  const { wishlist, setWishlist } = useStore()

  // 인증 훅에서 로그인 여부와 로그인 유도 함수(promptLogin)를 꺼냄.
  const { isAuthenticated, promptLogin } = useAuth()

  // 프로그래밍 방식 네비게이션(코드로 페이지 이동)용 훅.
  const navigate = useNavigate()
  
  // 현재 destination이 위시리스트에 들어있는지 여부 계산(배열 포함 여부).
  const isSaved = wishlist.includes(destination.id)

  // "찜하기/해제" 버튼 클릭 시 실행되는 함수.
  const toggleSave = () => {
    // 로그인 안 되어 있으면 아무것도 안 함(보안/권한).
    if (!isAuthenticated) return

    // 이미 저장된 상태라면 제거, 아니면 추가. 불변성 유지 위해 새 배열 생성.
    const newWishlist = isSaved 
      ? wishlist.filter(id => id !== destination.id) // 같지 않은 것만 남겨 제거
      : [...wishlist, destination.id]                // 기존 + 새 id 추가

    // 전역 상태 업데이트(화면도 함께 갱신됨).
    setWishlist(newWishlist)
  }

  // "자세히 보기" 버튼 클릭 시 실행되는 함수.
  const handleMoreClick = () => {
    // 비로그인 시 로그인 유도 팝업/동작 실행 후 종료.
    if (!isAuthenticated) return promptLogin()

    // 로그인 상태면 상세 페이지로 이동. URL에 아이디 삽입.
    navigate(`/place/${destination.id}`)
  }

  // 화면에 보일 UI 반환.
  return (
    <div className="card"> {/* 카드 외곽 상자. 스타일용 클래스 */}
      <div className="img"></div> {/* 이미지 영역(백그라운드 이미지 등으로 채울 예정) */}
      <div className="body"> {/* 텍스트/버튼들이 들어가는 본문 컨테이너 */}
        <div className="row"> {/* 가로 정렬 행. 제목/배지/버튼 배치 */}
          <strong>{destination.name}</strong> {/* 장소 이름 굵게 표시 */}
          <span className="pill">{destination.duration}</span> {/* 소요 시간 등 짧은 배지 정보 */}
          <button 
            className="ghost-btn right" // 보더만 있는 가벼운 스타일 + 오른쪽 정렬용 클래스 가정
            onClick={toggleSave}         // 클릭 시 찜 토글 함수 실행
            disabled={!isAuthenticated}  // 비로그인 시 버튼 비활성화(UX+안전)
            title={!isAuthenticated ? '로그인 후 이용해주세요' : ''} // 비활성화 시 툴팁 제공
          >
            {isSaved ? '찜 해제' : '찜하기'} {/* 상태에 따라 라벨 변경 */}
          </button>
        </div>

        <div className="meta">
          {destination.area} · 평점 {destination.rating} {/* 지역/평점 보조 정보 */}
        </div>

        <p className="muted">{destination.short}</p> {/* 짧은 소개 문구(흐린 스타일) */}

        <div> {/* 버튼 묶음 컨테이너 */}
          <button className="brand-btn" onClick={handleMoreClick}>
            자세히 보기 {/* 상세 페이지로 이동 */}
          </button>
        </div>
      </div>
    </div>
  )
}

// 이 컴포넌트를 다른 파일에서 사용할 수 있게 내보냄.
export default DestinationCard
