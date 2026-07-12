import { getCurrentUser } from '../api/auth.api'
import { ROLES } from '../auth/permissions'
import FleetManagerDashboard from '../features/dashboard/FleetManagerDashboard'
import DriverDashboard from '../features/dashboard/DriverDashboard'
import SafetyDashboard from '../features/dashboard/SafetyDashboard'
import FinanceDashboard from '../features/dashboard/FinanceDashboard'

/**
 * Dashboard router — every role lands here, but each sees a view built from the
 * data their role actually owns:
 *   Fleet Manager     → fleet overview (vehicles, utilisation, recent trips)
 *   Driver            → dispatch board (trips awaiting / on the road)
 *   Safety Officer    → driver compliance (licences, suspensions, scores)
 *   Financial Analyst → profitability (revenue vs cost, ROI)
 */
const Dashboard = () => {
  const role = getCurrentUser()?.role

  switch (role) {
    case ROLES.DRIVER:
      return <DriverDashboard />
    case ROLES.SAFETY_OFFICER:
      return <SafetyDashboard />
    case ROLES.FINANCIAL_ANALYST:
      return <FinanceDashboard />
    case ROLES.FLEET_MANAGER:
    default:
      return <FleetManagerDashboard />
  }
}

export default Dashboard
