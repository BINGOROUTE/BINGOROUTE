import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../router/routes'

const FindIdView = () => {
  const [name, setName] = useState('')
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
          <h2>아이디 찾기</h2>
          <p className="muted" style={{ marginBottom: '16px' }}>
            가입 시 등록한 이름과 이메일을 입력해 주세요.
          </p>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="input"
              placeholder="이름"
              value={name}
              onChange={(event) => setName(event.target.value)}
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
            <button type="submit" className="brand-btn">아이디 찾기</button>
          </form>
          {submitted && (
            <div className="muted" style={{ marginTop: '12px', fontSize: '14px' }}>
              입력하신 연락처로 아이디 안내 메일을 발송해 드릴게요.
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

export default FindIdView
