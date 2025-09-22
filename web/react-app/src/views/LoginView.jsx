import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const LoginView = () => {
  const { users, setSession } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      setSession(user)
      navigate('/')
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <div className="br-container">
      <div className="center">
        <div className="panel" style={{ maxWidth: '400px', width: '100%' }}>
          <h2>로그인</h2>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="input"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="input"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}
            <button type="submit" className="brand-btn">로그인</button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            계정이 없으신가요? <Link to="/signup" className="link">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginView