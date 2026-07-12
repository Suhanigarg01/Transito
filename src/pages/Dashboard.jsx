import { useEffect, useMemo, useState } from 'react'
import KpiGrid from '../features/dashboard/KpiGrid'
import FleetUtilisationChart from '../features/dashboard/FleetUtilisationChart'
import StatusPieChart from '../features/dashboard/StatusPieChart'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import { VehiclesIcon, GaugeIcon, TripsIcon, ClockIcon } from '../components/icons'

/**
 * Dashboard page — fleet overview: KPIs, utilisation, vehicle status mix and
 * the most recent trips.
 *
 * Data flow: a single `summary` object drives every widget so the numbers stay
 * consistent. Swap the mock loader in the effect for a real API call
 * (GET /api/dashboard/summary) — the shape below is the contract.
 */
const VEHICLE_STATUS_COLORS = {
  Available: '#0ca30c',
  'On Trip': '#2f4a7a',
  'In Shop': '#d98324',
}

// Placeholder payload — matches the expected GET /api/dashboard/summary shape.
const MOCK_SUMMARY = {
  vehicles: { Available: 12, 'On Trip': 6, 'In Shop': 2 },
  trips: { active: 6, pending: 3 },
  recentTrips: [
    { id: 1, reference: 'TRP-1042', route: 'Depot A → Riverside', vehicle: 'MH-12-AB-1234', status: 'Dispatched' },
    { id: 2, reference: 'TRP-1041', route: 'Warehouse → Airport', vehicle: 'MH-14-CD-9911', status: 'Completed' },
    { id: 3, reference: 'TRP-1040', route: 'Depot B → Downtown', vehicle: 'MH-12-EF-5522', status: 'Completed' },
    { id: 4, reference: 'TRP-1039', route: 'Riverside → Depot A', vehicle: '—', status: 'Draft' },
    { id: 5, reference: 'TRP-1038', route: 'Airport → Warehouse', vehicle: 'MH-01-GH-7788', status: 'Cancelled' },
  ],
}

const STATUS_DOT = {
  Draft: '#78716c',
  Dispatched: '#2f4a7a',
  Completed: '#0ca30c',
  Cancelled: '#d03b3b',
}

const KPI_ICONS = [VehiclesIcon, GaugeIcon, TripsIcon, ClockIcon]

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    // Replace with: fetch('/api/dashboard/summary').then(r => r.json())
    Promise.resolve(MOCK_SUMMARY).then((data) => {
      if (active) {
        setSummary(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const derived = useMemo(() => {
    if (!summary) return null
    const counts = summary.vehicles || {}
    const total = Object.values(counts).reduce((sum, n) => sum + (Number(n) || 0), 0)
    const onTrip = Number(counts['On Trip']) || 0
    const utilisation = total > 0 ? Math.round((onTrip / total) * 100) : 0

    const statusData = Object.entries(counts).map(([label, value]) => ({
      label,
      value: Number(value) || 0,
      color: VEHICLE_STATUS_COLORS[label] || '#78716c',
    }))

    const kpis = [
      { label: 'Active Vehicles', value: total - (Number(counts['In Shop']) || 0), sublabel: 'in service', trend: 4 },
      { label: 'Fleet Utilisation', value: `${utilisation}%`, sublabel: 'of fleet on trips', trend: 6 },
      { label: 'Active Trips', value: summary.trips?.active ?? 0, sublabel: 'dispatched now' },
      { label: 'Pending Trips', value: summary.trips?.pending ?? 0, sublabel: 'awaiting dispatch', trend: -2 },
    ].map((kpi, i) => ({ ...kpi, Icon: KPI_ICONS[i] }))

    return { total, onTrip, utilisation, statusData, kpis }
  }, [summary])

  if (loading || !derived) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-stone-200/70" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-stone-200/50" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-2xl bg-stone-200/50" />
          <div className="h-72 animate-pulse rounded-2xl bg-stone-200/50" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="A live read on the fleet — utilisation, status mix and the latest dispatches."
      />

      <KpiGrid kpis={derived.kpis} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FleetUtilisationChart
          value={derived.utilisation}
          onTrip={derived.onTrip}
          total={derived.total}
        />
        <StatusPieChart data={derived.statusData} />
      </div>

      <Panel
        eyebrow="Latest activity"
        title="Recent Trips"
        noBodyPadding
        action={
          <span className="text-xs font-medium text-[var(--color-accent)]">This week</span>
        }
      >
        <ul className="divide-y divide-stone-100">
          {summary.recentTrips.length === 0 ? (
            <li className="px-5 py-6 text-center text-sm text-stone-400">No recent trips</li>
          ) : (
            summary.recentTrips.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-stone-50/70"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: STATUS_DOT[t.status] || '#78716c' }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900 tabular-nums">
                      {t.reference}
                    </p>
                    <p className="truncate text-xs text-stone-500">{t.route}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-4">
                  <span className="hidden text-xs text-stone-400 tabular-nums sm:block">
                    {t.vehicle}
                  </span>
                  <StatusBadge status={t.status} />
                </div>
              </li>
            ))
          )}
        </ul>
      </Panel>
    </div>
  )
}

export default Dashboard
