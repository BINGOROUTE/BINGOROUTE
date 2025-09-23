import "../styles/header.css";
import logo from "../assets/BingoRoute.jpeg";
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../router/routes'

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    // Dispatch custom event for search (maintaining compatibility)
    document.dispatchEvent(new CustomEvent('br:search', { detail: query }))
  }

  const rightArea = () => {
    if (isAuthenticated) {
      return (
        <div className="row">
          <span className="muted">{user.name || user.first_name || user.email}</span>
          <Link to={ROUTES.MYPAGE} className="ghost-btn">내 정보</Link>
          <button className="ghost-btn" onClick={logout}>로그아웃</button>
        </div>
      )
    }
    return (
      <div className="row">
        <Link to={ROUTES.LOGIN} className="ghost-btn">로그인</Link>
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
        <div className="search">
          <input 
            placeholder="예: 경복궁, 근처 한옥카페…" 
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        {rightArea()}
      </div>
    </header>
  )
}

export default Header
