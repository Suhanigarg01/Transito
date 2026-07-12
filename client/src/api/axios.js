import axios from 'axios'

export const TOKEN_KEY = 'transitops.token'
export const USER_KEY = 'transitops.user'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
})

// Attach the Bearer token to every request when present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** Clear the stored session (token + cached user). */
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// On 401 the token is missing/expired — drop the session and force a re-login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession()
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

/**
 * Normalize an axios error into a plain Error carrying the server's message.
 * The backend errorHandler responds with { error: "<message>", details }.
 */
export function apiError(error) {
  const data = error?.response?.data
  const message =
    (typeof data?.error === 'string' ? data.error : data?.error?.message) ||
    data?.message ||
    error?.message ||
    'Something went wrong'
  const err = new Error(message)
  err.status = error?.response?.status
  err.details = data?.details
  return err
}

export default api
