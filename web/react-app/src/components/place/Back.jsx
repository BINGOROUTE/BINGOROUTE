// BackButton.jsx                                      // 파일 식별 주석. 컴포넌트 용도 명시(뒤로가기 버튼).

import { useNavigate } from 'react-router-dom'         // 라우터 훅 임포트. useNavigate: 코드로 경로 이동 수행 목적.

const BackButton = () => {                             // 함수형 컴포넌트 선언. 이름: BackButton. 독립 UI 블록 정의 목적.
  const navigate = useNavigate()                       // const: 재할당 금지 변수 선언. useNavigate() 호출 → 네비게이션 함수 획득.

  return (                                             // JSX 반환 시작. 화면에 렌더링할 마크업 구조 기술.
    <div className="section">                          {/* 상단 섹션 컨테이너. 공통 레이아웃/여백 적용 목적. */}
      <button
        className="ghost-btn"                          // 버튼 스타일 클래스. 테두리형(고스트) 시각 표현 목적.
        onClick={() => navigate(-1)}                   // 클릭 핸들러. 화살표 함수. 브라우저 히스토리 한 단계 뒤로 이동(-1).
      >
        ← 뒤로가기                                     // 버튼 라벨 텍스트. 사용자 동작 의미 명시.
      </button>
    </div>
  )
}

export default BackButton                              // 기본(default) 내보내기. 외부 모듈에서 import 사용 가능.
