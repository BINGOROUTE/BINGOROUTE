import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const Header = () => {
  const { session, setSession } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleLogout = () => {
    setSession(null)
    navigate('/')
  }

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    // Dispatch custom event for search (maintaining compatibility)
    document.dispatchEvent(new CustomEvent('br:search', { detail: query }))
  }

  const rightArea = () => {
    if (session) {
      return (
        <div className="row">
          <span className="muted">{session.name || session.email}</span>
          <Link to="/mypage" className="ghost-btn">내 정보</Link>
          <button className="ghost-btn" onClick={handleLogout}>로그아웃</button>
        </div>
      )
    }
    return (
      <div className="row">
        <Link to="/login" className="ghost-btn">로그인</Link>
      </div>
    )
  }

  return (
    <header className="br-header">
      <div className="br-container row">
        <Link to="/" className="brand">
          <span className="badge">B</span>
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