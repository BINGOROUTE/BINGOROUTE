// HeroSection.jsx
// 역할: 메인 소개 영역(문구 + 시작 버튼)을 화면에 보여주는 작은 블록(컴포넌트)

const HeroSection = ({ onStart }) => { // 부모가 넘겨주는 값(props) 중 onStart 함수만 꺼내 쓰기. 버튼 클릭 시 실행할 함수.
  return ( // 화면에 무엇을 보여줄지 반환 시작(JSX)
    <div className="hero"> {/* 바깥 상자. 화면 배치/배경 스타일을 여기에 적용(className 사용) */}
      <div
        className="pill" // 작은 라벨처럼 보이는 배지 스타일을 적용할 이름표
        style={{ display: 'inline-block', marginBottom: '8px' }} // 인라인 스타일(객체 형태). 아래 여백 8px
      >
        서울 추천 가이드 {/* 배지 안에 들어갈 짧은 안내 문구 */}
      </div>

      <h1>서울을 더 스마트하게 여행하세요</h1> {/* 가장 큰 제목. 페이지 핵심 문구 */}
      <p>서울의 흥미로운 로컬 명소를 발견하고, 나만의 여행 루트를 만들어 보세요.</p> {/* 제목 보조 설명 */}

      <div style={{ marginTop: '10px' }}> {/* 위 요소들과 버튼 사이 간격(위쪽 여백 10px) */}
        <button
          className="brand-btn" // 버튼에 브랜드 스타일 적용할 이름표
          onClick={onStart} // 버튼을 눌렀을 때 onStart 함수 실행(부모가 넘겨준 액션)
        >
          여행 계획 시작하기 {/* 버튼에 보일 글자. 기능을 명확히 설명 */}
        </button>
      </div>
    </div> // 바깥 상자 끝
  ) // 반환 끝
} // 컴포넌트 정의 끝

export default HeroSection // 이 컴포넌트를 다른 파일에서 가져다 쓸 수 있게 내보내기
