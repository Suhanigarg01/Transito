import { Link } from 'react-router-dom'

/**
 * 404 page for unmatched routes.
 */
const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-canvas)] px-4 text-center">
      <p className="font-display text-7xl font-bold text-[var(--color-accent)]">404</p>
      <h1 className="mt-4 text-xl font-semibold text-stone-900">Page not found</h1>
      <p className="mt-2 font-serif text-[15px] italic text-stone-500">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#26406b]"
      >
        Back to dashboard
      </Link>
    </div>
  )
}

export default NotFound
