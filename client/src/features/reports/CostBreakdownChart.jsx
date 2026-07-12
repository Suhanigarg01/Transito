
const GAP = 3 // px surface gap between segments
const WIDTH = 600
const HEIGHT = 44

const defaultData = [
  { label: 'Fuel', value: 0, color: '#2f4a7a' },
  { label: 'Maintenance', value: 0, color: '#d98324' },
  { label: 'Tolls & Parking', value: 0, color: '#1baf7a' },
  { label: 'Other', value: 0, color: '#7a5ea8' },
]

const money = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`

const CostBreakdownChart = ({ data = defaultData }) => {
  const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0)

  let x = 0
  const segments = data.map((d) => {
    const frac = total > 0 ? (Number(d.value) || 0) / total : 0
    const w = Math.max(0, frac * WIDTH - GAP)
    const seg = { ...d, x, w, frac }
    x += frac * WIDTH
    return seg
  })

  return (
    <div className="card p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Where it goes</p>
          <h3 className="mt-0.5 text-[15px] font-semibold text-stone-800">
            Operational Cost Breakdown
          </h3>
        </div>
        <div className="text-right">
          <p className="eyebrow">Total</p>
          <p className="font-display text-xl font-semibold text-stone-900 tabular-nums">
            {money(total)}
          </p>
        </div>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mt-5 w-full" role="img"
        aria-label="Operational cost breakdown by category" preserveAspectRatio="none">
        {total > 0 ? (
          segments.map((s) => (
            <rect key={s.label} x={s.x} y="0" width={s.w} height={HEIGHT} rx="6" fill={s.color} />
          ))
        ) : (
          <rect x="0" y="0" width={WIDTH} height={HEIGHT} rx="6" fill="#f1efe9" />
        )}
      </svg>

      <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        {data.map((d) => {
          const pct = total > 0 ? Math.round(((Number(d.value) || 0) / total) * 100) : 0
          return (
            <li key={d.label} className="border-l-2 pl-3" style={{ borderColor: d.color }}>
              <p className="text-xs text-stone-500">{d.label}</p>
              <p className="mt-0.5 text-sm font-semibold text-stone-900 tabular-nums">{money(d.value)}</p>
              <p className="text-[11px] text-stone-400 tabular-nums">{pct}% of spend</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CostBreakdownChart