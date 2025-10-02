import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../router/routes'

const FindPasswordView = () => {
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="br-container">
      <div className="center">
        <div className="panel" style={{ maxWidth: '400px', width: '100%' }}>
          <h2>비밀번호 찾기</h2>
          <p className="muted" style={{ marginBottom: '16px' }}>
            가입한 아이디와 이메일을 입력하시면, 재설정 링크를 보내드려요.
          </p>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="input"
              placeholder="아이디"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              required
            />
            <input
              type="email"
              className="input"
              placeholder="이메일"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" className="brand-btn">비밀번호 찾기</button>
          </form>
          {submitted && (
            <div className="muted" style={{ marginTop: '12px', fontSize: '14px' }}>
              입력된 이메일로 비밀번호 재설정 안내를 보내드릴게요.
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to={ROUTES.LOGIN} className="link">로그인으로 돌아가기</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FindPasswordView
