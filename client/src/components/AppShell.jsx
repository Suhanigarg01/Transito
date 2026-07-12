import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { isAuthenticated } from '../api/auth.api'

/**
 * Application shell — the persistent frame around every authenticated page.
 * Composes the sidebar rail, the top bar, and an <Outlet> for the routed page.
 *
 * Doubles as the auth guard: because it mounts when an authenticated route is
 * matched, the check runs fresh on each navigation (unlike a one-shot check in
 * App's JSX, which would go stale after login).
 */
const AppShell = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  if (!isAuthenticated()) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      <Sidebar mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="md:pl-64">
        <Topbar onMenuClick={() => setMenuOpen(true)} />
        <main className="mx-auto max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
