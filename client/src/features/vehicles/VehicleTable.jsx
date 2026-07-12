import StatusBadge from '../../components/StatusBadge'

/**
 * Vehicle registry table.
 *
 * Props:
 *  - vehicles : [{ id, regNumber, make, model, type, year, odometer, status }]
 *  - onEdit(vehicle) / onDelete(vehicle)
 *  - loading : boolean
 */
const th = 'px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-400'
const td = 'px-5 py-4 text-sm text-stone-600'
const actionBtn = 'rounded-md px-2 py-1 text-xs font-medium transition'

const VehicleTable = ({ vehicles = [], onEdit, onDelete, loading = false }) => {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-stone-100 bg-stone-50/60">
            <tr>
              <th className={th}>Reg. No.</th>
              <th className={th}>Vehicle</th>
              <th className={th}>Type</th>
              <th className={`${th} text-right`}>Odometer</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td className={`${td} text-center text-stone-400`} colSpan={6}>Loading…</td></tr>
            ) : vehicles.length === 0 ? (
              <tr><td className={`${td} text-center text-stone-400`} colSpan={6}>No vehicles yet</td></tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className="transition-colors hover:bg-stone-50/70">
                  <td className={`${td} font-medium text-stone-900`}>{v.regNumber}</td>
                  <td className={td}>
                    {[v.make, v.model].filter(Boolean).join(' ')}
                    {v.year ? <span className="text-stone-400"> · {v.year}</span> : null}
                  </td>
                  <td className={td}>{v.type || '—'}</td>
                  <td className={`${td} text-right tabular-nums`}>
                    {v.odometer != null ? `${Number(v.odometer).toLocaleString()} km` : '—'}
                  </td>
                  <td className={td}><StatusBadge status={v.status} /></td>
                  <td className={`${td} text-right whitespace-nowrap`}>
                    <button onClick={() => onEdit?.(v)}
                      className={`${actionBtn} text-stone-600 hover:bg-stone-100 hover:text-stone-900`}>Edit</button>
                    <button onClick={() => onDelete?.(v)}
                      className={`${actionBtn} ml-1 text-stone-500 hover:bg-red-50 hover:text-red-600`}>Delete</button>
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

export default VehicleTable
