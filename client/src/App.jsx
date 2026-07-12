import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AppShell from './components/AppShell'
import { getCurrentUser } from './api/auth.api'
import { canAccessPage, landingFor } from './auth/permissions'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import Drivers from './pages/Drivers'
import Trips from './pages/Trips'
import Maintainance from './pages/Maintainance'
import Expenses from './pages/Expenses'
import Report from './pages/Report'
import NotFound from './pages/NotFound'

/**
 * Route-level RBAC guard. Renders inside AppShell (so auth is already assured);
 * redirects to the user's landing page if their role can't open this path.
 * Evaluated on every navigation because it reads the live location.
 */
const RequireAccess = ({ children }) => {
  const location = useLocation()
  const user = getCurrentUser()
  if (!canAccessPage(user?.role, location.pathname)) {
    return <Navigate to={landingFor(user?.role)} replace />
  }
  return children
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Authenticated app — everything inside the shell. AppShell guards
            authentication; RequireAccess guards per-role page access. */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehicles" element={<RequireAccess><Vehicles /></RequireAccess>} />
          <Route path="/drivers" element={<RequireAccess><Drivers /></RequireAccess>} />
          <Route path="/trips" element={<RequireAccess><Trips /></RequireAccess>} />
          <Route path="/maintenance" element={<RequireAccess><Maintainance /></RequireAccess>} />
          <Route path="/expenses" element={<RequireAccess><Expenses /></RequireAccess>} />
          <Route path="/reports" element={<RequireAccess><Report /></RequireAccess>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
