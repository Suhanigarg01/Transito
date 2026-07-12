import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

/**
 * Application shell — the persistent frame around every authenticated page.
 * Composes the sidebar rail, the top bar, and an <Outlet> for the routed page.
 */
const AppShell = () => {
  const [menuOpen, setMenuOpen] = useState(false)

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
