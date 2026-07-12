/**
 * KPI stat cards for the dashboard.
 *
 * Props:
 *  - kpis : [{ label, value, sublabel, trend, Icon }]
 *      trend : signed number (+/- %)   Icon : optional component for the tile
 *
 * Falls back to placeholder KPIs so the page renders before the API is wired.
 */
const defaultKpis = [
  { label: 'Active Vehicles', value: 0, sublabel: 'in service' },
  { label: 'Fleet Utilisation', value: '0%', sublabel: 'of fleet on trips' },
  { label: 'Active Trips', value: 0, sublabel: 'dispatched now' },
  { label: 'Pending Trips', value: 0, sublabel: 'awaiting dispatch' },
]

const TrendPill = ({ trend }) => {
  if (trend == null) return null
  const up = trend >= 0
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
        up
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
          : 'bg-red-50 text-red-700 ring-red-600/20'
      }`}
    >
      <span className="text-[10px] leading-none">{up ? '↑' : '↓'}</span>
      {Math.abs(trend)}%
    </span>
  )
}

const KpiGrid = ({ kpis = defaultKpis }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="card card-interactive relative overflow-hidden p-5">
          {/* faint accent wash in the corner */}
          <div className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-[var(--color-accent)]/5" />

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              {kpi.Icon && (
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <kpi.Icon width={18} height={18} />
                </span>
              )}
              <p className="text-[13px] font-medium text-stone-500">{kpi.label}</p>
            </div>
            <TrendPill trend={kpi.trend} />
          </div>

          <p className="mt-4 font-display text-[32px] font-semibold leading-none tracking-tight text-stone-900 tabular-nums">
            {kpi.value}
          </p>
          {kpi.sublabel && <p className="mt-2 text-xs text-stone-400">{kpi.sublabel}</p>}
        </div>
      ))}
    </div>
  )
}

export default KpiGrid
