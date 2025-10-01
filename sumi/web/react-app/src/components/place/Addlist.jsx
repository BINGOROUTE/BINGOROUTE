// Addlist.jsx                                         // 파일 식별 주석. 컴포넌트 소스 위치 명시 목적.
import React from 'react'                              // React 기본 임포트. JSX 해석 및 컴포넌트 작성 기반 제공.
import { useNavigate } from 'react-router-dom'         // 페이지 이동 훅 임포트. 코드로 특정 경로로 전환 목적.
import { useAuth } from '../../hooks/useAuth'          // 인증 훅 임포트. 로그인 여부 확인, 로그인 유도 로직 사용 목적.

const Addlist = () => {                                // 함수형 컴포넌트 선언. 이름: Addlist. 독립 화면 조각 정의 목적.
  const navigate = useNavigate()                       // const: 재할당 금지 변수 선언. useNavigate() 호출 → 이동 함수 획득.
  const { isAuthenticated, promptLogin } = useAuth()   // 객체 구조 분해 할당. 인증 훅 반환값 중 필요한 키만 추출 사용.

  return (                                             // JSX 반환 시작. 화면에 렌더링할 마크업 구조 기술.
    <div className="section">                          {/* 바깥 컨테이너. 공통 섹션 스타일 적용 목적. */}
      <button
        className="brand-btn"                          // 공통 브랜드 버튼 스타일 클래스. 일관된 UI 유지 목적.
        style={{ width: '100%' }}                      // 인라인 스타일 객체. 버튼 가로폭 100% 설정 목적.
        onClick={() => {                               // 클릭 이벤트 핸들러. 화살표 함수로 지연 실행 형태 구성.
          if (!isAuthenticated) return promptLogin()   // 조건 분기. 비로그인 시 즉시 로그인 유도 후 조기 종료(early return).
          navigate('/planner')                         // 로그인 상태 시 동작. 플래너 페이지로 네비게이션 수행.
        }}
      >
        여행 계획에 추가하기                           {/* 버튼 표시 텍스트. 사용자 행동(추가하기) 명시 목적. */}
      </button>
    </div>
  )
}

export default Addlist                                 // 기본(default) 내보내기. 외부 모듈에서 import 후 사용 가능하게 함.
