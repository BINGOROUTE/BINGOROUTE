import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { signup as signupRequest, login as loginRequest } from '../services/authService'

const SignupView = () => {
  const { setSession } = useStore()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const user = await signupRequest({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword
      })
      // Auto-login to obtain access token
      const { access } = await loginRequest({ email: formData.email, password: formData.password })
      setSession({ ...user, access })
      navigate('/')
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.')
    }
  }

  return (
    <div className="br-container">
      <div className="center">
        <div className="panel" style={{ maxWidth: '400px', width: '100%' }}>
          <h2>회원가입</h2>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              className="input"
              placeholder="이름"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              className="input"
              placeholder="이메일"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              className="input"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              className="input"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}
            <button type="submit" className="brand-btn">회원가입</button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            이미 계정이 있으신가요? <Link to="/login" className="link">로그인</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupView
