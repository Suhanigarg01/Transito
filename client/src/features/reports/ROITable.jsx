
const th = 'px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-400'
const td = 'px-5 py-4 text-sm text-stone-600'
const money = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`

const ROITable = ({ rows = [] }) => {
  const enriched = rows.map((r) => {
    const opCost =
      (Number(r.fuelCost) || 0) + (Number(r.maintenanceCost) || 0) + (Number(r.otherCost) || 0)
    const revenue = Number(r.revenue) || 0
    const roi = opCost > 0 ? ((revenue - opCost) / opCost) * 100 : null
    const efficiency = r.fuelLitres > 0 ? (Number(r.distanceKm) || 0) / r.fuelLitres : null
    return { ...r, opCost, revenue, roi, efficiency }
  })

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-stone-100 bg-stone-50/60">
            <tr>
              <th className={th}>Vehicle</th>
              <th className={`${th} text-right`}>Revenue</th>
              <th className={`${th} text-right`}>Op. Cost</th>
              <th className={`${th} text-right`}>Fuel Eff.</th>
              <th className={`${th} text-right`}>ROI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {enriched.length === 0 ? (
              <tr><td className={`${td} text-center text-stone-400`} colSpan={5}>No data for this period</td></tr>
            ) : (
              enriched.map((r) => (
                <tr key={r.vehicle} className="transition-colors hover:bg-stone-50/70">
                  <td className={`${td} font-medium text-stone-900`}>{r.vehicle}</td>
                  <td className={`${td} text-right tabular-nums`}>{money(r.revenue)}</td>
                  <td className={`${td} text-right tabular-nums`}>{money(r.opCost)}</td>
                  <td className={`${td} text-right tabular-nums`}>
                    {r.efficiency != null ? `${r.efficiency.toFixed(1)} km/L` : '—'}
                  </td>
                  <td className={`${td} text-right`}>
                    {r.roi == null ? (
                      <span className="text-stone-300">—</span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset tabular-nums ${
                          r.roi >= 0
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                            : 'bg-red-50 text-red-700 ring-red-600/20'
                        }`}
                      >
                        <span className="text-[10px] leading-none">{r.roi >= 0 ? '↑' : '↓'}</span>
                        {Math.abs(r.roi).toFixed(1)}%
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ROITable