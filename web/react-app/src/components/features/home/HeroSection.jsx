import './HeroSection.css'

const HeroSection = ({ onStart }) => {
  return (
    <div className="hero">
      <div className="pill" style={{ display: 'inline-block', marginBottom: '8px' }}>
        서울 추천 가이드
      </div>
      <h1>서울에서의 마지막 여행을 계획해보세요</h1>
      <p>서울에서 새로운 로컬 명소를 발견하고, 나만의 여행 루트를 만들어보세요</p>
      <div style={{ marginTop: '10px' }}>
        <button className="brand-btn" onClick={onStart}>
          여행 계획 시작하기
        </button>
      </div>
    </div>
  )
}

export default HeroSection
