import { useEffect, useMemo, useState } from 'react'
import { listTrips } from '../../api/trips.api'
import { listVehicles } from '../../api/vehicles.api'
import KpiGrid from './KpiGrid'
import PageHeader from '../../components/PageHeader'
import Panel from '../../components/Panel'
import StatusBadge from '../../components/StatusBadge'
import { TripsIcon, ClockIcon, GaugeIcon, VehiclesIcon } from '../../components/icons'

/**
 * Driver dashboard — the trip lifecycle at a glance: what's awaiting dispatch,
 * what's on the road, and how many vehicles are free to take. Built from
 * /api/trips and /api/vehicles (both readable by the Driver role).
 */
const TripList = ({ trips, empty }) => (
  <ul className="divide-y divide-stone-100">
    {trips.length === 0 ? (
      <li className="px-5 py-6 text-center text-sm text-stone-400">{empty}</li>
    ) : (
      trips.map((t) => (
        <li
          key={t.id}
          className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-stone-50/70"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-stone-900 tabular-nums">{t.reference}</p>
            <p className="truncate text-xs text-stone-500">{t.route}</p>
          </div>
          <div className="flex items-center gap-4 pl-4">
            <span className="hidden text-xs text-stone-400 tabular-nums sm:block">{t.vehicle || '—'}</span>
            <StatusBadge status={t.status} />
          </div>
        </li>
      ))
    )}
  </ul>
)

const DriverDashboard = () => {
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([listTrips(), listVehicles()])
      .then(([t, v]) => {
        if (!active) return
        setTrips(t)
        setVehicles(v)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const { kpis, drafts, dispatched } = useMemo(() => {
    const drafts = trips.filter((t) => t.status === 'Draft')
    const dispatched = trips.filter((t) => t.status === 'Dispatched')
    const completed = trips.filter((t) => t.status === 'Completed')
    const availableVehicles = vehicles.filter((v) => v.status === 'Available').length

    const kpis = [
      { label: 'Active Trips', value: dispatched.length, sublabel: 'on the road', Icon: TripsIcon },
      { label: 'Awaiting Dispatch', value: drafts.length, sublabel: 'draft trips', Icon: ClockIcon },
      { label: 'Completed', value: completed.length, sublabel: 'trips closed out', Icon: GaugeIcon },
      { label: 'Available Vehicles', value: availableVehicles, sublabel: 'free to take', Icon: VehiclesIcon },
    ]
    return { kpis, drafts, dispatched }
  }, [trips, vehicles])

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Couldn’t load your trips: {error}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-stone-200/70" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-stone-200/50" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-stone-200/50" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        eyebrow="Driver"
        title="Dispatch Board"
        description="Trips waiting to go out, trips on the road, and vehicles free to take."
      />

      <KpiGrid kpis={kpis} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel eyebrow="To do" title="Awaiting Dispatch" noBodyPadding>
          <TripList trips={drafts.slice(0, 8)} empty="Nothing waiting — all clear" />
        </Panel>
        <Panel eyebrow="In progress" title="On the Road" noBodyPadding>
          <TripList trips={dispatched.slice(0, 8)} empty="No active trips right now" />
        </Panel>
      </div>
    </div>
  )
}

export default DriverDashboard
