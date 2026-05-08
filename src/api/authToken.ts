const tokenKey = 'train_track_admin_jwt'

export function getAuthToken() {
  return window.localStorage.getItem(tokenKey)
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(tokenKey, token)
}

export function clearAuthToken() {
  window.localStorage.removeItem(tokenKey)
}
