import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout'
import MainView from '../views/MainView'
import LoginView from '../views/LoginView'
import SignupView from '../views/SignupView'
import MyPageView from '../views/MyPageView'
import PlanView from '../views/PlanView'
import PlaceView from '../views/PlaceView'

const AppRouter = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/signup" element={<SignupView />} />
          <Route path="/mypage" element={<MyPageView />} />
          <Route path="/plan" element={<PlanView />} />
          <Route path="/place/:id" element={<PlaceView />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default AppRouter