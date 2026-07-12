import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import SignupForm from '../features/auth/SignupForm'
import { isAuthenticated, register } from '../api/auth.api'

const Signup = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Already signed in? Skip the form.
  if (isAuthenticated()) return <Navigate to="/dashboard" replace />

  const handleSignup = async ({ name, email, password, role }) => {
    setError('')
    setLoading(true)
    try {
      // register() stores the returned token + user, so we're logged straight in.
      await register({ name, email, password, role })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Sign up failed')
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
        <SignupForm onSubmit={handleSignup} loading={loading} error={error} />
        <p className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[var(--color-accent)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
