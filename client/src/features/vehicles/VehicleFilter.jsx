const field =
  'rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]'

const VEHICLE_TYPES = ['Truck', 'Van', 'Bus', 'Car', 'Trailer']
const VEHICLE_STATUSES = ['Available', 'On Trip', 'In Shop']

/**
 * Filter/search bar for the vehicle registry.
 *
 * Props:
 *  - filters : { search, status, type }
 *  - onChange(next) : called with the merged filter object on any change
 */
const VehicleFilter = ({ filters = {}, onChange }) => {
  const update = (key, value) => onChange?.({ ...filters, [key]: value })

  return (
    <div className="card flex flex-wrap items-center gap-3 p-3">
      <input
        type="search"
        placeholder="Search reg no, make…"
        value={filters.search || ''}
        onChange={(e) => update('search', e.target.value)}
        className={`${field} min-w-56 flex-1`}
      />

      <select value={filters.status || ''} onChange={(e) => update('status', e.target.value)}
        className={field}>
        <option value="">All statuses</option>
        {VEHICLE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <select value={filters.type || ''} onChange={(e) => update('type', e.target.value)}
        className={field}>
        <option value="">All types</option>
        {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      {(filters.search || filters.status || filters.type) && (
        <button
          onClick={() => onChange?.({ search: '', status: '', type: '' })}
          className="text-sm font-medium text-stone-500 hover:text-stone-800"
        >
          Clear
        </button>
      )}
    </div>
  )
}

export default VehicleFilter
