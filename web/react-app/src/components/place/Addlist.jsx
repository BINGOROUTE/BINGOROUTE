// Addlist.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'   // 페이지 이동용 훅
import { useAuth } from '../../hooks/useAuth'       // 인증 상태 확인 훅

const Addlist = () => {
  const navigate = useNavigate()                 // 페이지 이동 함수
  const { isAuthenticated, promptLogin } = useAuth() // 로그인 여부, 로그인 유도 함수

  return (
    <div className="section">                    {/* CTA 섹션 */}
      <button
        className="brand-btn"
        style={{ width: '100%' }}                // 버튼 가로 100%
        onClick={() => {                         // 클릭 핸들러
          if (!isAuthenticated) return promptLogin() // 비로그인 → 로그인 유도
          navigate('/planner')                   // 로그인 → 플래너 페이지 이동
        }}
      >
        여행 계획에 추가하기                      {/* 버튼 라벨 */}
      </button>
    </div>
  )
}

export default Addlist
