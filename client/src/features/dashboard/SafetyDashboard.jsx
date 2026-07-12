import { useEffect, useMemo, useState } from 'react'
import { listDrivers } from '../../api/drivers.api'
import KpiGrid from './KpiGrid'
import PageHeader from '../../components/PageHeader'
import Panel from '../../components/Panel'
import StatusBadge from '../../components/StatusBadge'
import LicenseExpiryTag from '../drivers/LicenseExpiryTag'
import { DriversIcon, GaugeIcon, ClockIcon, ReportsIcon } from '../../components/icons'

/**
 * Safety Officer dashboard — driver compliance at a glance: licence validity,
 * suspensions and safety scores. Built from /api/drivers.
 */
const daysUntil = (date) => {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return Infinity
  return Math.round((d.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86_400_000)
}

const SafetyDashboard = () => {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    listDrivers()
      .then((data) => active && setDrivers(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const { kpis, watchlist } = useMemo(() => {
    const total = drivers.length
    const suspended = drivers.filter((d) => d.status === 'Suspended').length
    const expiring = drivers.filter((d) => daysUntil(d.licenseExpiry) <= 30).length
    const scored = drivers.filter((d) => d.safetyScore != null)
    const avgScore = scored.length
      ? Math.round(scored.reduce((s, d) => s + d.safetyScore, 0) / scored.length)
      : '—'

    const kpis = [
      { label: 'Drivers', value: total, sublabel: 'on the roster', Icon: DriversIcon },
      { label: 'Avg Safety Score', value: avgScore, sublabel: 'out of 100', Icon: GaugeIcon },
      { label: 'Suspended', value: suspended, sublabel: 'off the road', Icon: ClockIcon },
      { label: 'Licences Expiring', value: expiring, sublabel: 'within 30 days', Icon: ReportsIcon },
    ]

    // Soonest-to-expire first — the officer's action list.
    const watchlist = [...drivers].sort((a, b) => daysUntil(a.licenseExpiry) - daysUntil(b.licenseExpiry))
    return { kpis, watchlist }
  }, [drivers])

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Couldn’t load drivers: {error}
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
        eyebrow="Safety Officer"
        title="Driver Compliance"
        description="Licence validity, suspensions and safety scores across the roster."
      />

      <KpiGrid kpis={kpis} />

      <Panel eyebrow="Action list" title="Licence Watchlist" noBodyPadding>
        <ul className="divide-y divide-stone-100">
          {watchlist.length === 0 ? (
            <li className="px-5 py-6 text-center text-sm text-stone-400">No drivers on the roster</li>
          ) : (
            watchlist.slice(0, 8).map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-stone-50/70"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-900">{d.name}</p>
                  <p className="truncate text-xs text-stone-500 tabular-nums">
                    {d.licenseNumber} · {d.licenseCategory || '—'}
                  </p>
                </div>
                <div className="flex items-center gap-3 pl-4">
                  <LicenseExpiryTag expiryDate={d.licenseExpiry} />
                  <StatusBadge status={d.status} />
                </div>
              </li>
            ))
          )}
        </ul>
      </Panel>
    </div>
  )
}

export default SafetyDashboard
