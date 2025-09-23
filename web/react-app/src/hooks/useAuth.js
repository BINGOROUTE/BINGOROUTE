import { useStore } from '../context/StoreContext'

export const useAuth = () => {
  const { session, setSession } = useStore()

  const login = (user) => {
    setSession(user)
  }

  const logout = () => {
    setSession(null)
  }

  const isAuthenticated = !!session

  return {
    user: session,
    login,
    logout,
    isAuthenticated
  }
}