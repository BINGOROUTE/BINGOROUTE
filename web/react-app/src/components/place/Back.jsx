// BackButton.jsx
import { useNavigate } from 'react-router-dom'  // 페이지 이동을 위한 훅 임포트

const BackButton = () => {
  const navigate = useNavigate()               // 네비게이션 객체 생성

  return (
    <div className="section">                  {/* 상단 섹션. 뒤로가기 버튼 배치 */}
      <button
        className="ghost-btn"
        onClick={() => navigate(-1)}            // 이전 페이지로 이동 (히스토리 -1)
      >
        ← 뒤로가기
      </button>
    </div>
  )
}

export default BackButton
