import StatusBadge from '../../components/StatusBadge'

/**
 * Maintenance log table. An "Open" record keeps the vehicle "In Shop";
 * closing it (via onClose) is what returns the vehicle to "Available".
 *
 * Props:
 *  - records : [{ id, vehicle, type, description, cost, serviceDate, status }]
 *  - onClose(record) / onEdit(record) / onDelete(record)
 *  - readOnly : hide the actions column (e.g. cost review by a Financial Analyst)
 *  - loading : boolean
 */
const th = 'px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-400'
const td = 'px-5 py-4 text-sm text-stone-600'
const actionBtn = 'rounded-md px-2 py-1 text-xs font-medium transition'

const money = (n) => (n != null ? `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—')

const MaintainanceTable = ({ records = [], onClose, onEdit, onDelete, readOnly = false, loading = false }) => {
  const colSpan = readOnly ? 5 : 6
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-stone-100 bg-stone-50/60">
            <tr>
              <th className={th}>Vehicle</th>
              <th className={th}>Type</th>
              <th className={th}>Service date</th>
              <th className={`${th} text-right`}>Cost</th>
              <th className={th}>Status</th>
              {!readOnly && <th className={`${th} text-right`}>Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td className={`${td} text-center text-stone-400`} colSpan={colSpan}>Loading…</td></tr>
            ) : records.length === 0 ? (
              <tr><td className={`${td} text-center text-stone-400`} colSpan={colSpan}>No maintenance records</td></tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-stone-50/70">
                  <td className={`${td} font-medium text-stone-900`}>{r.vehicle}</td>
                  <td className={td}>
                    {r.type}
                    {r.description && <span className="block text-xs text-stone-400">{r.description}</span>}
                  </td>
                  <td className={`${td} tabular-nums`}>{r.serviceDate ? new Date(r.serviceDate).toLocaleDateString() : '—'}</td>
                  <td className={`${td} text-right font-medium text-stone-900 tabular-nums`}>{money(r.cost)}</td>
                  <td className={td}><StatusBadge status={r.status} /></td>
                  {!readOnly && (
                    <td className={`${td} text-right whitespace-nowrap`}>
                      {r.status === 'Open' && (
                        <button onClick={() => onClose?.(r)}
                          className={`${actionBtn} text-emerald-700 hover:bg-emerald-50`}>Close</button>
                      )}
                      <button onClick={() => onEdit?.(r)}
                        className={`${actionBtn} ml-1 text-stone-600 hover:bg-stone-100 hover:text-stone-900`}>Edit</button>
                      <button onClick={() => onDelete?.(r)}
                        className={`${actionBtn} ml-1 text-stone-500 hover:bg-red-50 hover:text-red-600`}>Delete</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MaintainanceTable