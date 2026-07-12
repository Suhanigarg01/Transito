import StatusBadge from '../../components/StatusBadge'

/**
 * Trips list with status-aware action buttons that mirror the backend state
 * machine (Draft -> Dispatched -> Completed / Cancelled).
 *
 * Props:
 *  - trips : [{ id, reference, vehicle, driver, origin, destination, status, scheduledDate }]
 *  - onDispatch(trip) / onComplete(trip) / onCancel(trip) / onView(trip)
 *  - loading : boolean
 */
const th = 'px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-400'
const td = 'px-5 py-4 text-sm text-stone-600'
const actionBtn = 'rounded-md px-2 py-1 text-xs font-medium transition'

const TripTable = ({ trips = [], onDispatch, onComplete, onCancel, onView, loading = false }) => {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-stone-100 bg-stone-50/60">
            <tr>
              <th className={th}>Trip</th>
              <th className={th}>Route</th>
              <th className={th}>Vehicle</th>
              <th className={th}>Driver</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td className={`${td} text-center text-stone-400`} colSpan={6}>Loading…</td></tr>
            ) : trips.length === 0 ? (
              <tr><td className={`${td} text-center text-stone-400`} colSpan={6}>No trips yet</td></tr>
            ) : (
              trips.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-stone-50/70">
                  <td className={`${td} font-medium text-stone-900`}>
                    <button onClick={() => onView?.(t)} className="tabular-nums hover:text-[var(--color-accent)]">
                      {t.reference || `#${t.id}`}
                    </button>
                  </td>
                  <td className={td}>
                    <span className="text-stone-900">{t.origin}</span>
                    <span className="mx-1.5 text-stone-300">→</span>
                    <span className="text-stone-900">{t.destination}</span>
                  </td>
                  <td className={`${td} tabular-nums`}>{t.vehicle || '—'}</td>
                  <td className={td}>{t.driver || '—'}</td>
                  <td className={td}><StatusBadge status={t.status} /></td>
                  <td className={`${td} text-right whitespace-nowrap`}>
                    {t.status === 'Draft' && (
                      <button onClick={() => onDispatch?.(t)}
                        className={`${actionBtn} text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]`}>Dispatch</button>
                    )}
                    {t.status === 'Dispatched' && (
                      <button onClick={() => onComplete?.(t)}
                        className={`${actionBtn} text-emerald-700 hover:bg-emerald-50`}>Complete</button>
                    )}
                    {(t.status === 'Draft' || t.status === 'Dispatched') && (
                      <button onClick={() => onCancel?.(t)}
                        className={`${actionBtn} ml-1 text-stone-500 hover:bg-red-50 hover:text-red-600`}>Cancel</button>
                    )}
                    {(t.status === 'Completed' || t.status === 'Cancelled') && (
                      <span className="text-stone-300">—</span>
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

export default TripTable