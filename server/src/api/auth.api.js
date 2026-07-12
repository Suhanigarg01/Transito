import api, { apiError, clearSession, TOKEN_KEY, USER_KEY } from './axios'

export function saveSession({ token, user }) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/** The currently cached user, or null. */
export function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/** True when a token is present. */
export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY))
}

export async function login({ email, password }) {
  try {
    const { data } = await api.post('/auth/login', { email, password })
    saveSession(data)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function register(payload) {
  try {
    const { data } = await api.post('/auth/register', payload)
    saveSession(data)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function fetchMe() {
  try {
    const { data } = await api.get('/auth/me')
    if (data?.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data.user
  } catch (err) {
    throw apiError(err)
  }
}

/** Clear the session locally (no server round-trip — the API is stateless JWT). */
export function logout() {
  clearSession()
}