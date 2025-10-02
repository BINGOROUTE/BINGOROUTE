import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '../components/layout'
import { RequireAuth } from '../components/features/auth'
import HomePage from '../pages/HomePage'
import LoginView from '../views/LoginView'
import SignupView from '../views/SignupView'
import FindIdView from '../views/FindIdView'
import FindPasswordView from '../views/FindPasswordView'
import MyPageView from '../views/MyPageView'
import ChatbotView from '../views/ChatbotView'

import { ROUTES } from './routes'

const AppRouter = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<LoginView />} />
          <Route path={ROUTES.SIGNUP} element={<SignupView />} />
          <Route path={ROUTES.FIND_ID} element={<FindIdView />} />
          <Route path={ROUTES.FIND_PASSWORD} element={<FindPasswordView />} />
          <Route path={ROUTES.MYPAGE} element={<RequireAuth><MyPageView /></RequireAuth>} />
          <Route path={ROUTES.PLANNER} element={<RequireAuth><ChatbotView /></RequireAuth>} />
          <Route path={ROUTES.PLACE} element={<HomePage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default AppRouter
