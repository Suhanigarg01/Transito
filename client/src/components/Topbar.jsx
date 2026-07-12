import { useNavigate } from 'react-router-dom'
import { MenuIcon, BellIcon, SearchIcon } from './icons'
import { getCurrentUser, logout } from '../api/auth.api'

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'U'

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-[var(--color-canvas)]/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100 md:hidden"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>

        <label className="relative hidden max-w-xs flex-1 items-center sm:flex">
          <span className="pointer-events-none absolute left-3 text-stone-400">
            <SearchIcon width={16} height={16} />
          </span>
          <input
            type="search"
            placeholder="Search fleet, trips, drivers…"
            className="w-full rounded-lg border border-stone-200 bg-white/70 py-2 pl-9 pr-3 text-sm text-stone-800 placeholder-stone-400 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
        </label>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            className="relative rounded-md p-2 text-stone-500 hover:bg-stone-100"
            aria-label="Notifications"
          >
            <BellIcon />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          </button>

          <span className="hidden rounded-full border border-stone-200 bg-white/70 px-3 py-1 text-xs font-medium text-stone-600 sm:inline">
            {user?.roleLabel || 'Fleet Manager'}
          </span>

          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-semibold text-white"
            title={user?.name || ''}
          >
            {initialsOf(user?.name)}
          </span>

          <button
            onClick={handleLogout}
            className="hidden rounded-md border border-stone-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 sm:inline"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar
