import { NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../api/auth.api'
import {
  DashboardIcon,
  VehiclesIcon,
  DriversIcon,
  TripsIcon,
  MaintenanceIcon,
  ExpensesIcon,
  ReportsIcon,
  CloseIcon,
} from './icons'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { to: '/vehicles', label: 'Vehicles', Icon: VehiclesIcon },
  { to: '/drivers', label: 'Drivers', Icon: DriversIcon },
  { to: '/trips', label: 'Trips', Icon: TripsIcon },
  { to: '/maintenance', label: 'Maintenance', Icon: MaintenanceIcon },
  { to: '/expenses', label: 'Expenses', Icon: ExpensesIcon },
  { to: '/reports', label: 'Reports', Icon: ReportsIcon },
]

const linkClass = ({ isActive }) =>
  [
    'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
    isActive
      ? 'bg-[var(--color-accent-soft)] font-medium text-[var(--color-accent)]'
      : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800',
  ].join(' ')

const Wordmark = () => (
  <div className="flex items-center gap-2.5">
    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-accent)] font-display text-sm font-bold text-white">
      T
    </span>
    <span className="font-display text-[17px] font-semibold tracking-tight text-stone-900">
      Transit<span className="text-[var(--color-accent)]">Ops</span>
    </span>
  </div>
)

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'U'

const SidebarBody = ({ onNavigate }) => {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    onNavigate?.()
    navigate('/login', { replace: true })
  }

  return (
  <div className="flex h-full flex-col">
    <div className="flex h-16 items-center px-5">
      <Wordmark />
    </div>

    <nav className="flex-1 space-y-0.5 px-3 py-2">
      <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
        Operations
      </p>
      {NAV.map((item) => (
        <NavLink key={item.to} to={item.to} className={linkClass} onClick={onNavigate}>
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--color-accent)]" />
              )}
              <item.Icon className="shrink-0" />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>

    <div className="border-t border-stone-200/80 p-3">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600">
          {initialsOf(user?.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-stone-800">{user?.name || 'Signed in'}</p>
          <p className="truncate text-xs text-stone-400">{user?.roleLabel || ''}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="mt-1 w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-800"
      >
        Sign out
      </button>
    </div>
  </div>
  )
}


const Sidebar = ({ mobileOpen = false, onClose }) => {
  return (
    <>
      {/* Fixed desktop rail */}
      <aside className="hidden border-r border-stone-200/80 bg-[#fbfaf7] md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-64 md:flex-col">
        <SidebarBody />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-stone-900/30 transition-opacity ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-64 border-r border-stone-200/80 bg-[#fbfaf7] shadow-xl transition-transform duration-200 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-4 text-stone-400 hover:text-stone-700"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
          <SidebarBody onNavigate={onClose} />
        </aside>
      </div>
    </>
  )
}

export default Sidebar
