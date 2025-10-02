import './HeroSection.css'

const HeroSection = ({ onStart }) => {
  return (
    <div className="hero">
      <div className="pill" style={{ display: 'inline-block', marginBottom: '8px' }}>
        AI 추천 가이드
      </div>
      <h1>당신의 루트가 곧 여행이 됩니다.</h1>
      <p>당신만의 길을 따라 서울을 새롭게 발견하세요.</p>
      <div style={{ marginTop: '200px' }}>
        <button className="brand-btn" onClick={onStart}>
          여행 계획 시작하기
        </button>
      </div>
    </div>
  )
}

export default HeroSection
