// 헤더 전용 CSS 파일을 불러와서 스타일을 적용.
import "../styles/header.css";

// 로고로 쓸 이미지 파일을 불러옴(번들링 시 import 가능).
import logo from "../assets/BingoRoute.jpeg";

// 리액트의 상태 관리 훅(useState) 사용.
import { useState } from 'react'

// 라우터에서 링크 이동용 컴포넌트(Link)와 현재 경로 확인용 훅(useLocation) 사용.
import { Link, useLocation } from 'react-router-dom'

// 인증 관련 상태/함수(로그인 정보, 로그아웃 등)를 제공하는 커스텀 훅.
import { useAuth } from '../hooks/useAuth'

// 라우트 경로를 한 곳에 모아둔 상수(예: { HOME: '/', LOGIN: '/login', ... }).
import { ROUTES } from '../router/routes'

// 헤더 컴포넌트 시작.
const Header = () => {
  // 인증 훅에서 현재 사용자 정보, 로그아웃 함수, 로그인 여부를 꺼냄.
  const { user, logout, isAuthenticated } = useAuth()

  // 현재 페이지의 경로 정보(예: '/login', '/mypage')를 가져옴.
  const location = useLocation()

  // 어떤 경로들에서 검색창을 숨길지에 대한 기준 목록.
  const HIDE_SEARCH_PREFIXES = [ROUTES.PLANNER, ROUTES.LOGIN, ROUTES.SIGNUP, ROUTES.MYPAGE]

  // 현재 경로가 위 목록 중 하나로 시작하면 검색창을 숨김(true).
  const hideSearch = HIDE_SEARCH_PREFIXES.some(prefix => location.pathname.startsWith(prefix))

  // 검색 입력창에 쓰는 값(문자열) 상태.
  const [searchQuery, setSearchQuery] = useState('')

  // 검색 입력창이 바뀔 때마다 실행되는 함수.
  const handleSearch = (e) => {
    const query = e.target.value // 입력창에서 현재 글자 가져오기
    setSearchQuery(query)        // 화면에 보이는 입력값 상태 업데이트

    // (호환성 유지용) 커스텀 이벤트를 문서에 발송.
    // 다른 곳(검색 결과 리스트 등)에서 'br:search' 이벤트를 듣고 반응할 수 있음.
    document.dispatchEvent(new CustomEvent('br:search', { detail: query }))
  }

  // 오른쪽 영역(로그인/로그아웃/내 정보 버튼들)을 렌더링하는 작은 함수.
  const rightArea = () => {
    if (isAuthenticated) { // 로그인한 경우
      return (
        <div className="row">
          {/* 사용자 이름/이메일을 표시(우선순위: name > first_name > email) */}
          <span className="muted">{user.name || user.first_name || user.email}</span>
          {/* 마이페이지로 이동하는 링크 버튼 */}
          <Link to={ROUTES.MYPAGE} className="ghost-btn">내 정보</Link>
          {/* 로그아웃 버튼(클릭 시 logout 함수 실행) */}
          <button className="ghost-btn" onClick={logout}>로그아웃</button>
        </div>
      )
    }
    // 비로그인 상태면 로그인 링크만 보여줌.
    return (
      <div className="row">
        <Link to={ROUTES.LOGIN} className="ghost-btn">로그인</Link>
      </div>
    )
  }

  // 화면에 보이는 실제 헤더 UI 반환.
  return (
    <header className="br-header"> {/* 헤더 바 전체 영역 */}
      <div className="br-container row"> {/* 내부 콘텐츠 정렬용 컨테이너 */}
        {/* 왼쪽: 로고 + 브랜드명. 클릭하면 홈으로 이동 */}
        <Link to={ROUTES.HOME} className="brand">
          <img src={logo} alt="BingoRoute Logo" className="logo-badge" /> {/* 로고 이미지 */}
          <span>빙고루트</span> {/* 텍스트 로고 */}
        </Link>

        {/* 가운데: 검색창(특정 화면에서는 숨김 처리) */}
        {hideSearch ? (
          // 숨길 때는 레이아웃 깨지지 않도록 빈 공간으로 채움(가변 너비).
          <div style={{ flex: 1 }} />
        ) : (
          <div className="search">
            <input 
              placeholder="예: 경복궁, 근처 한옥카페…" // 회색 안내 문구
              value={searchQuery}                      // 입력값(상태) 연결 — 제어 컴포넌트
              onChange={handleSearch}                  // 글자 바뀔 때마다 상태/이벤트 발송
            />
          </div>
        )}

        {/* 오른쪽: 로그인/내정보/로그아웃 영역 */}
        {rightArea()}
      </div>
    </header>
  )
}

// 컴포넌트를 밖에서 가져다 쓸 수 있도록 내보내기.
export default Header


// 왼쪽: 로고(홈으로 이동) / 가운데: 검색창(일부 페이지에서는 숨김) / 오른쪽: 로그인/내 정보/로그아웃.

// 검색 입력이 바뀌면 searchQuery 상태 업데이트 + **커스텀 이벤트 'br:search'**를 브로드캐스트.

// 현재 경로에 따라 검색창을 숨길지(hideSearch) 결정(useLocation + startsWith).