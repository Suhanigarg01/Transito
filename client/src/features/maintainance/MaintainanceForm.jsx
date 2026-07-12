import { useState } from 'react'

const field =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
const label = 'block text-sm font-medium text-gray-700'

const MAINT_TYPES = ['Routine Service', 'Repair', 'Inspection', 'Tyre', 'Bodywork', 'Other']

/**
 * Log a maintenance record. Creating an "Open" record signals the backend to
 * move the vehicle to "In Shop"; costs roll into total operational cost.
 *
 * Props:
 *  - vehicles : [{ id, regNumber }]
 *  - initialValues : partial record for edit mode
 *  - onSubmit(values) / onCancel()
 *  - submitting : boolean
 */
const empty = {
  vehicleId: '',
  type: 'Routine Service',
  description: '',
  cost: '',
  serviceDate: '',
  status: 'Open',
}

const MaintainanceForm = ({ vehicles = [], initialValues, onSubmit, onCancel, submitting = false }) => {
  const [values, setValues] = useState({ ...empty, ...initialValues })

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.({ ...values, cost: values.cost ? Number(values.cost) : 0 })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={label}>Vehicle</label>
          <select className={field} value={values.vehicleId} onChange={set('vehicleId')} required>
            <option value="">Select vehicle…</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className={label}>Type</label>
          <select className={field} value={values.type} onChange={set('type')}>
            {MAINT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={label}>Description</label>
        <textarea className={field} rows={2} value={values.description} onChange={set('description')} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className={label}>Cost ($)</label>
          <input type="number" step="0.01" min="0" className={field}
            value={values.cost} onChange={set('cost')} required />
        </div>
        <div className="space-y-1.5">
          <label className={label}>Service date</label>
          <input type="date" className={field} value={values.serviceDate}
            onChange={set('serviceDate')} required />
        </div>
        <div className="space-y-1.5">
          <label className={label}>Status</label>
          <select className={field} value={values.status} onChange={set('status')}>
            <option value="Open">Open (vehicle in shop)</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? 'Saving…' : 'Save record'}
        </button>
      </div>
    </form>
  )
}

export default MaintainanceForm