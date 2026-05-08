import { useEffect } from 'react'
import { AppRoutes } from './routes/AppRoutes'
import { useAuthStore } from './stores/authStore'

function App() {
  const loadCurrentUser = useAuthStore((state) => state.loadCurrentUser)

  useEffect(() => {
    void loadCurrentUser()
  }, [loadCurrentUser])

  return <AppRoutes />
}

export default App
