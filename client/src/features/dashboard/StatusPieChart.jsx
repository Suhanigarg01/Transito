/**
 * Vehicle status distribution — a donut over a small set of states, paired with
 * a labelled legend (identity never colour-alone). Dependency-free SVG.
 *
 * Props:
 *  - data : [{ label, value, color }]
 */
const RADIUS = 74
const STROKE = 22
const CIRC = 2 * Math.PI * RADIUS
const GAP = 5 // px surface gap between slices

const defaultData = [
  { label: 'Available', value: 0, color: '#0ca30c' },
  { label: 'On Trip', value: 0, color: '#2f4a7a' },
  { label: 'In Shop', value: 0, color: '#d98324' },
]

const StatusPieChart = ({ data = defaultData }) => {
  const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0)

  let offset = 0
  const slices = data.map((d) => {
    const frac = total > 0 ? (Number(d.value) || 0) / total : 0
    const len = Math.max(0, frac * CIRC - GAP)
    const slice = { ...d, len, dashoffset: -offset }
    offset += frac * CIRC
    return slice
  })

  return (
    <div className="card p-6">
      <p className="eyebrow">Composition</p>
      <h3 className="mt-0.5 text-[15px] font-semibold text-stone-800">Vehicle Status</h3>

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <svg viewBox="0 0 200 200" className="h-44 w-44 shrink-0" role="img"
          aria-label="Vehicle status distribution">
          <g transform="rotate(-90 100 100)">
            <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#f1efe9"
              strokeWidth={STROKE} />
            {total > 0 &&
              slices.map((s) => (
                <circle key={s.label} cx="100" cy="100" r={RADIUS} fill="none"
                  stroke={s.color} strokeWidth={STROKE} strokeLinecap="round"
                  strokeDasharray={`${s.len} ${CIRC - s.len}`}
                  strokeDashoffset={s.dashoffset} />
              ))}
          </g>
          <text x="100" y="95" textAnchor="middle" className="fill-stone-900"
            style={{ fontSize: 34, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
            {total}
          </text>
          <text x="100" y="116" textAnchor="middle" className="fill-stone-400"
            style={{ fontSize: 11, letterSpacing: '0.04em' }}>
            VEHICLES
          </text>
        </svg>

        <ul className="w-full max-w-[200px] space-y-3">
          {data.map((d) => {
            const pct = total > 0 ? Math.round(((Number(d.value) || 0) / total) * 100) : 0
            return (
              <li key={d.label}>
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-stone-600">{d.label}</span>
                  <span className="ml-auto font-medium text-stone-900 tabular-nums">{d.value}</span>
                  <span className="w-9 text-right text-xs text-stone-400 tabular-nums">{pct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default StatusPieChart
