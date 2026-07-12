import LicenseExpiryTag from './LicenseExpiryTag'
import StatusBadge from '../../components/StatusBadge'

/**
 * Drivers registry table.
 *
 * Props:
 *  - drivers : [{ id, name, licenseNumber, licenseExpiry, phone, status }]
 *  - onEdit(driver) / onDelete(driver)
 *  - loading : boolean
 */
const th = 'px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-400'
const td = 'px-5 py-4 text-sm text-stone-600'
const actionBtn = 'rounded-md px-2 py-1 text-xs font-medium transition'

const initials = (name = '') =>
  name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

const DriverTable = ({ drivers = [], onEdit, onDelete, loading = false }) => {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-stone-100 bg-stone-50/60">
            <tr>
              <th className={th}>Driver</th>
              <th className={th}>Licence No.</th>
              <th className={th}>Licence Expiry</th>
              <th className={th}>Phone</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td className={`${td} text-center text-stone-400`} colSpan={6}>Loading…</td></tr>
            ) : drivers.length === 0 ? (
              <tr><td className={`${td} text-center text-stone-400`} colSpan={6}>No drivers yet</td></tr>
            ) : (
              drivers.map((d) => (
                <tr key={d.id} className="transition-colors hover:bg-stone-50/70">
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-semibold text-stone-500">
                        {initials(d.name)}
                      </span>
                      <span className="font-medium text-stone-900">{d.name}</span>
                    </div>
                  </td>
                  <td className={`${td} tabular-nums`}>{d.licenseNumber}</td>
                  <td className={td}><LicenseExpiryTag expiryDate={d.licenseExpiry} /></td>
                  <td className={`${td} tabular-nums`}>{d.phone || '—'}</td>
                  <td className={td}><StatusBadge status={d.status} /></td>
                  <td className={`${td} text-right whitespace-nowrap`}>
                    <button onClick={() => onEdit?.(d)}
                      className={`${actionBtn} text-stone-600 hover:bg-stone-100 hover:text-stone-900`}>Edit</button>
                    <button onClick={() => onDelete?.(d)}
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

export default DriverTable
