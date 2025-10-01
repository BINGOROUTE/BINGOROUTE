import './Header.css'
import logo from '../../assets/BingoRoute.jpeg'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/api/useAuth'
import { ROUTES } from '../../router/routes'

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isLoginPage = location.pathname === ROUTES.LOGIN
  const HIDE_SEARCH_PREFIXES = [
    ROUTES.PLANNER,
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.FIND_ID,
    ROUTES.FIND_PASSWORD,
    ROUTES.MYPAGE,
  ]
  const hideSearch = HIDE_SEARCH_PREFIXES.some((prefix) => location.pathname.startsWith(prefix))
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (event) => {
    const query = event.target.value
    setSearchQuery(query)
    document.dispatchEvent(new CustomEvent('br:search', { detail: query }))
  }

  const goToMyPage = () => {
    if (!isAuthenticated) return
    navigate(ROUTES.MYPAGE)
  }

  const goToLogin = () => {
    navigate(ROUTES.LOGIN)
  }

  const rightArea = () => {
    if (isAuthenticated) {
      return (
        <div className="row">
          <span className="muted">{user.name || user.first_name || user.email}</span>
          <button className="ghost-btn" onClick={goToMyPage}>내 정보</button>
          <button className="ghost-btn" onClick={logout}>로그아웃</button>
        </div>
      )
    }

    if (isLoginPage) {
      return <div className="row" />
    }

    return (
      <div className="row">
        <button className="ghost-btn" onClick={goToLogin}>로그인</button>
      </div>
    )
  }

  return (
    <header className="br-header">
      <div className="br-container row">
        <Link to={ROUTES.HOME} className="brand">
          <img src={logo} alt="BingoRoute Logo" className="logo-badge" />
          <span>빙고루트</span>
        </Link>
        {hideSearch ? (
          <div style={{ flex: 1 }} />
        ) : (
          <div className="search">
            <input
              placeholder="예: 강릉 맛집 카페 투어"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        )}
        {rightArea()}
      </div>
    </header>
  )
}

export default Header
