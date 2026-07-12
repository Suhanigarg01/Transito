import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../features/auth/LoginForm'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async ({ email, password }) => {
    setError('')
    setLoading(true)
    try {
      // Replace with a real POST /api/auth/login request.
      await new Promise((r) => setTimeout(r, 600))
      if (!email.includes('@') || password.length < 4) {
        throw new Error('Invalid email or password')
      }
      // e.g. localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-canvas)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-accent)] font-display text-sm font-bold text-white">
            T
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-stone-900">
            Transit<span className="text-[var(--color-accent)]">Ops</span>
          </span>
        </div>
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default Login