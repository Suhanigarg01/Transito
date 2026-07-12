const field =
  'rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]'
const label = 'block text-[11px] font-medium uppercase tracking-wide text-stone-400'

const REPORT_TYPES = [
  { value: 'operational-cost', label: 'Operational Cost' },
  { value: 'fuel-efficiency', label: 'Fuel Efficiency' },
  { value: 'roi', label: 'Vehicle ROI' },
]

const ReportFilter = ({ filters = {}, vehicles = [], onChange }) => {
  const update = (key, value) => onChange?.({ ...filters, [key]: value })

  return (
    <div className="card flex flex-wrap items-end gap-4 p-4">
      <div className="space-y-1.5">
        <label className={label}>Report</label>
        <select className={field} value={filters.reportType || 'operational-cost'}
          onChange={(e) => update('reportType', e.target.value)}>
          {REPORT_TYPES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className={label}>From</label>
        <input type="date" className={field} value={filters.from || ''}
          onChange={(e) => update('from', e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <label className={label}>To</label>
        <input type="date" className={field} value={filters.to || ''}
          onChange={(e) => update('to', e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <label className={label}>Vehicle</label>
        <select className={field} value={filters.vehicleId || ''}
          onChange={(e) => update('vehicleId', e.target.value)}>
          <option value="">All vehicles</option>
          {vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber}</option>)}
        </select>
      </div>
    </div>
  )
}

export default ReportFilter