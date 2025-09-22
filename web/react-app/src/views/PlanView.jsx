import { useState } from 'react'
import { useStore } from '../context/StoreContext'

const PlanView = () => {
  const { session, trips, setTrips } = useStore()
  const [step, setStep] = useState(1)
  const [planData, setPlanData] = useState({
    duration: '',
    style: '',
    budget: '',
    companions: '',
    interests: []
  })

  if (!session) {
    return (
      <div className="br-container">
        <div className="center">
          <p>로그인이 필요합니다.</p>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = () => {
    const newTrip = {
      id: Date.now().toString(),
      ...planData,
      date: new Date().toISOString().split('T')[0],
      title: `${planData.duration} 서울 여행`
    }
    setTrips([...trips, newTrip])
    alert('여행 계획이 저장되었습니다!')
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="planner-title">여행 기간을 선택해주세요</h3>
            <p className="planner-sub">일정에 맞는 최적의 루트를 추천해드릴게요</p>
            <div className="chips-grid">
              {['당일치기', '1박2일', '2박3일', '3박4일', '일주일'].map(duration => (
                <div
                  key={duration}
                  className={`chip ${planData.duration === duration ? 'active' : ''}`}
                  onClick={() => setPlanData({...planData, duration})}
                >
                  {duration}
                </div>
              ))}
            </div>
          </div>
        )
      case 2:
        return (
          <div>
            <h3 className="planner-title">여행 스타일을 알려주세요</h3>
            <p className="planner-sub">취향에 맞는 장소를 추천해드릴게요</p>
            <div className="wide-chips">
              {['여유롭게', '알차게', '모험적으로'].map(style => (
                <div
                  key={style}
                  className={`wide-chip ${planData.style === style ? 'active' : ''}`}
                  onClick={() => setPlanData({...planData, style})}
                >
                  <strong>{style}</strong>
                </div>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div>
            <h3 className="planner-title">예산 범위를 선택해주세요</h3>
            <div className="chips-grid">
              {['5만원 이하', '10만원 이하', '20만원 이하', '30만원 이하', '제한없음'].map(budget => (
                <div
                  key={budget}
                  className={`chip ${planData.budget === budget ? 'active' : ''}`}
                  onClick={() => setPlanData({...planData, budget})}
                >
                  {budget}
                </div>
              ))}
            </div>
          </div>
        )
      case 4:
        return (
          <div>
            <h3 className="planner-title">누구와 함께 하시나요?</h3>
            <div className="chips-grid">
              {['혼자', '연인', '가족', '친구', '동료'].map(companion => (
                <div
                  key={companion}
                  className={`chip ${planData.companions === companion ? 'active' : ''}`}
                  onClick={() => setPlanData({...planData, companions: companion})}
                >
                  {companion}
                </div>
              ))}
            </div>
          </div>
        )
      case 5:
        return (
          <div>
            <h3 className="planner-title">계획이 완성되었습니다!</h3>
            <p className="planner-sub">선택하신 조건으로 맞춤 여행 계획을 생성했어요</p>
            <div className="panel">
              <div><strong>기간:</strong> {planData.duration}</div>
              <div><strong>스타일:</strong> {planData.style}</div>
              <div><strong>예산:</strong> {planData.budget}</div>
              <div><strong>동행:</strong> {planData.companions}</div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="br-container">
      <div className="section">
        <div className="steps">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`step ${i <= step ? 'active' : ''}`}></div>
          ))}
        </div>
        
        {renderStep()}

        <div className="planner-actions">
          <button 
            className="neutral-btn" 
            onClick={handlePrev}
            disabled={step === 1}
          >
            이전
          </button>
          {step < 5 ? (
            <button 
              className="brand-btn" 
              onClick={handleNext}
              disabled={
                (step === 1 && !planData.duration) ||
                (step === 2 && !planData.style) ||
                (step === 3 && !planData.budget) ||
                (step === 4 && !planData.companions)
              }
            >
              다음
            </button>
          ) : (
            <button className="brand-btn" onClick={handleComplete}>
              계획 저장
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlanView