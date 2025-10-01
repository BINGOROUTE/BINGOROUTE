// PlaceHeaderBox.jsx                                                     // 파일명 주석. 컴포넌트 목적 파악 용이.

import React from 'react'                                                // React 임포트. JSX → JS로 변환 시 내부적으로 필요(새 JSX 트랜스폼에선 선택적이지만 명시 권장).
import { useStore } from '../../context/StoreContext'                       // 전역 상태 컨텍스트 훅 임포트. 위시리스트 상태 접근/수정 목적.
import { useAuth } from '../../hooks/useAuth'                               // 인증 상태 훅 임포트. 로그인 여부 확인 목적.

const PlaceHeaderBox = ({ destination }) => {                            // 함수형 컴포넌트 선언. props 중 destination만 구조 분해.
  const { wishlist, setWishlist } = useStore()                           // 컨텍스트에서 위시리스트(배열)와 갱신 함수 수령. 갱신 시 이 컴포넌트 리렌더링.
  const { isAuthenticated } = useAuth()                                  // 로그인 여부 불리언 수령. 비로그인 차단 용도.

  const isSaved = wishlist.includes(destination.id)                      // 현재 장소가 위시리스트에 존재하는지 검사. 엄격 비교(===) 사용. 주의: id 타입 일치 필요(string/number 혼동 금지).

  const toggleSave = () => {                                             // 찜 토글 핸들러. 버튼 onClick에서 호출.
    if (!isAuthenticated) return                                         // 비로그인 가드. 조기 반환으로 불필요 연산 방지.
    const newWishlist = isSaved                                          // 새 위시리스트 계산(불변성 유지). 원본 배열 직접 수정 금지.
      ? wishlist.filter(id => id !== destination.id)                     // 이미 저장됨 → 동일 id 제거. filter: 새 배열 반환(O(n)).
      : [...wishlist, destination.id]                                    // 미저장 → 기존 요소 펼침 + 현재 id 추가. 얕은 복사로 새 배열 생성.
    setWishlist(newWishlist)                                             // 전역 상태 갱신. 비동기 스케줄링. 이후 렌더링에서 isSaved 재평가.
  }                                                                       // 핸들러 끝.

  return (                                                               // JSX 반환 시작.
    <div className="section">                                            {/* 섹션 래퍼. 상하 여백/레이아웃 일관성 유지용 클래스. */}
      <div className="hero" style={{ background: '#c7d2fe' }}>          {/* 히어로 영역. 배경색 인라인 지정(간단/지역적 스타일). */}
        <div                                                             // 행 레이아웃 컨테이너.
          className="row"                                                // 공통 가로 정렬 유틸 클래스(추정).
          style={{ justifyContent: 'space-between', alignItems: 'flex-start' }} // 좌우 공간 분배, 상단 정렬. 버튼/텍스트 양끝 배치.
        >
          <div>                                                          {/* 좌측: 제목/메타 정보 영역. */}
            <div className="pill" style={{ marginBottom: '8px' }}>      {/* 태그 배지. 아래 여백 8px. */}
              {destination.tags.join(' · ')}                             {/* 태그 배열을 ' · '로 결합해 한 줄 표시. 주의: tags 미존재 시 오류 → 필요 시 destination.tags?.join(...) 사용. */}
            </div>
            <h1>{destination.name}</h1>                                  {/* 장소명 대제목. 시멘틱 태그(h1)로 접근성 향상. */}
            <p>                                                          {/* 메타 정보 한 줄 요약. */}
              {destination.area} · 평점 {destination.rating} ·{' '}      {/* 지역, 평점 표시. {' '}는 의도적 공백 한 칸. */}
              {destination.duration}                                     {/* 추천 소요시간(예: '2-3시간'). */}
            </p>
        </div>
          <button                                                        // 우측: 찜 토글 버튼.
            className="ghost-btn"                                        // 테두리만 있는 스타일(추정). 배경 투명 감성.
            onClick={toggleSave}                                         // 클릭 시 찜 토글 로직 실행.
            style={{ background: 'rgba(255,255,255,0.2)' }}              // 살짝 보이는 반투명 배경으로 시각적 강조.
            disabled={!isAuthenticated}                                   // 비로그인 시 비활성화(true). 키보드 포커스/클릭 차단.
            title={!isAuthenticated ? '로그인 후 이용해주세요' : ''}      // 비활성 원인 툴팁 제공. 접근성/설명 강화.
          >
            {isSaved ? '찜 해제' : '찜하기'}                             {/* 상태 기반 라벨 전환. 위시리스트 포함 → '찜 해제'. 미포함 → '찜하기'. */}
          </button>
        </div>
      </div>
    </div>
  )                                                                       // JSX 반환 끝.
}                                                                         // 컴포넌트 본문 끝.

export default PlaceHeaderBox                                             // 기본 내보내기. 다른 파일에서 import 가능.
