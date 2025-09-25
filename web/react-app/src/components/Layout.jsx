// 상단 공통 헤더 컴포넌트 불러오기.
import Header from './Header'

// 로그인 필요 시 띄우는 모달 컴포넌트 불러오기.
import LoginRequiredModal from './auth/LoginRequiredModal'

// 레이아웃 컴포넌트 시작. 부모가 감싸줄 화면 조각(children)을 받음.
const Layout = ({ children }) => {
  return ( // 화면에 보여줄 구조 반환
    <div className="br-layout"> {/* 전체 페이지 공통 랩퍼. 레이아웃용 스타일 연결 */}
      <Header /> {/* 모든 페이지 상단에 고정 표시할 헤더 */}

      <main id="outlet"> {/* 실제 페이지 내용 들어갈 자리. 라우팅된 화면이 이 안에 렌더됨 */}
        {children} {/* 부모가 넘긴 화면 조각을 그대로 출력 */}
      </main>

      <LoginRequiredModal /> {/* 언제든 필요할 때 띄울 로그인 안내 모달. 전역 위치에 배치 */}
    </div>
  )
}

// 다른 파일에서 이 레이아웃을 사용할 수 있게 내보내기.
export default Layout
