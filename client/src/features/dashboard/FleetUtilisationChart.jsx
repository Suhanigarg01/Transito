/**
 * Fleet Utilisation — a single headline magnitude (% of fleet currently on
 * trips), shown as a gradient radial progress ring. Dependency-free SVG.
 *
 * Props:
 *  - value : number 0..100 (utilisation %)
 *  - onTrip / total : optional counts shown under the ring
 */
const RADIUS = 78
const STROKE = 16
const CIRC = 2 * Math.PI * RADIUS

const FleetUtilisationChart = ({ value = 0, onTrip, total }) => {
  const pct = Math.max(0, Math.min(100, Number(value) || 0))
  const dash = (pct / 100) * CIRC
  const idle = total != null ? Math.max(0, total - (onTrip ?? 0)) : null

  return (
    <div className="card p-6">
      <p className="eyebrow">Capacity</p>
      <h3 className="mt-0.5 text-[15px] font-semibold text-stone-800">Fleet Utilisation</h3>

      <div className="mt-2 flex flex-col items-center">
        <svg viewBox="0 0 200 200" className="h-48 w-48" role="img"
          aria-label={`Fleet utilisation ${pct} percent`}>
          <defs>
            <linearGradient id="fu-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4f6fa8" />
              <stop offset="100%" stopColor="#2f4a7a" />
            </linearGradient>
          </defs>
          <g transform="rotate(-90 100 100)">
            <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#efece6"
              strokeWidth={STROKE} />
            <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="url(#fu-grad)"
              strokeWidth={STROKE} strokeLinecap="round"
              strokeDasharray={`${dash} ${CIRC - dash}`} />
          </g>
          <text x="100" y="94" textAnchor="middle" className="fill-stone-900"
            style={{ fontSize: 40, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
            {pct}%
          </text>
          <text x="100" y="118" textAnchor="middle" className="fill-stone-400"
            style={{ fontSize: 12, letterSpacing: '0.02em' }}>
            on trips
          </text>
        </svg>

        {total != null && (
          <div className="mt-2 flex w-full items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              <span className="text-stone-500">Active</span>
              <span className="font-medium text-stone-900 tabular-nums">{onTrip ?? 0}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-stone-300" />
              <span className="text-stone-500">Idle</span>
              <span className="font-medium text-stone-900 tabular-nums">{idle}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default FleetUtilisationChart
