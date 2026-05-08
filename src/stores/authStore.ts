import { create } from 'zustand'
import { getCurrentUser, login, register } from '../api/auth'
import { clearAuthToken, getAuthToken, setAuthToken } from '../api/authToken'
import type { LoginFormValues, RegisterFormValues } from '../schemas/authSchema'
import type { AuthUser } from '../types'

const userKey = 'train_track_admin_user'

function readStoredUser(): AuthUser | null {
  const stored = window.localStorage.getItem(userKey)

  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as AuthUser
  } catch {
    window.localStorage.removeItem(userKey)
    return null
  }
}

type AuthStore = {
  token: string | null
  user: AuthUser | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (payload: LoginFormValues) => Promise<void>
  register: (payload: RegisterFormValues) => Promise<void>
  loadCurrentUser: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: getAuthToken(),
  user: readStoredUser(),
  loading: false,
  error: null,
  isAuthenticated: Boolean(getAuthToken()),
  login: async (payload) => {
    set({ loading: true, error: null })
    try {
      const token = await login(payload)
      setAuthToken(token)
      const user = await getCurrentUser()
      window.localStorage.setItem(userKey, JSON.stringify(user))
      set({
        token,
        user,
        isAuthenticated: true,
        loading: false,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      set({ error: message, loading: false, isAuthenticated: false })
      throw error
    }
  },
  register: async (payload) => {
    set({ loading: true, error: null })
    try {
      await register(payload)
      const token = await login(payload)
      setAuthToken(token)
      const user = await getCurrentUser()
      window.localStorage.setItem(userKey, JSON.stringify(user))
      set({
        token,
        user,
        isAuthenticated: true,
        loading: false,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      set({ error: message, loading: false, isAuthenticated: false })
      throw error
    }
  },
  loadCurrentUser: async () => {
    const token = getAuthToken()

    if (!token) {
      return
    }

    set({ loading: true, error: null })
    try {
      const user = await getCurrentUser()
      window.localStorage.setItem(userKey, JSON.stringify(user))
      set({ token, user, isAuthenticated: true, loading: false })
    } catch (error) {
      clearAuthToken()
      window.localStorage.removeItem(userKey)
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Session validation failed',
      })
    }
  },
  logout: () => {
    clearAuthToken()
    window.localStorage.removeItem(userKey)
    set({ token: null, user: null, isAuthenticated: false, error: null })
  },
}))

window.addEventListener('auth:unauthorized', () => {
  useAuthStore.getState().logout()
})
