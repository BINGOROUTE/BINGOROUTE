import { StoreProvider } from './context/StoreContext'
import AppRouter from './router/AppRouter'
import './styles/base.css'
import './styles/utilities.css'
import './styles/planner.css'

function App() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  )
}

export default App
