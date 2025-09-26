//로그인 상태와 submit 동작을 담당하는 컴포넌트
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { login as loginRequest } from '../../services/authService'
import LoginForm from './LoginForm'
import SignupPrompt from './SignupPrompt'

const LoginView = () => {
  const { setSession } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    setError('')
    setIsSubmitting(true)

    try {
      const { user, access } = await loginRequest({ email, password })
      setSession({ ...user, access })
      navigate('/')
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="br-container">
      <div className="center">
        <div className="panel" style={{ maxWidth: '400px', width: '100%' }}>
          <h2>로그인</h2>
          <LoginForm
            email={email}
            password={password}
            error={error}
            isSubmitting={isSubmitting}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
          />
          <SignupPrompt />
        </div>
      </div>
    </div>
  )
}

export default LoginView
