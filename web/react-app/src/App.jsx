import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import MainView from './views/MainView'
import LoginView from './views/LoginView'
import SignupView from './views/SignupView'
import MyPageView from './views/MyPageView'
import PlanView from './views/PlanView'
import PlaceView from './views/PlaceView'
import { StoreProvider } from './context/StoreContext'
import './styles/global.css'

function App() {
  return (
    <StoreProvider>
      <Router>
        <div className="br-layout">
          <Header />
          <main id="outlet">
            <Routes>
              <Route path="/" element={<MainView />} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/signup" element={<SignupView />} />
              <Route path="/mypage" element={<MyPageView />} />
              <Route path="/plan" element={<PlanView />} />
              <Route path="/place/:id" element={<PlaceView />} />
            </Routes>
          </main>
        </div>
      </Router>
    </StoreProvider>
  )
}

export default App
