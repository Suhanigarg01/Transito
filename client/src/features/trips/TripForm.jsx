import { useState } from 'react'

const field =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
const label = 'block text-sm font-medium text-gray-700'

/**
 * Create a trip (starts in Draft). Vehicle/driver assignment can happen here
 * or later at dispatch time.
 *
 * Props:
 *  - vehicles : [{ id, regNumber }]  (should be pre-filtered to Available)
 *  - drivers  : [{ id, name }]       (should be pre-filtered to Available)
 *  - initialValues : partial trip for edit mode
 *  - onSubmit(values) / onCancel()
 *  - submitting : boolean
 */
const empty = {
  origin: '',
  destination: '',
  scheduledDate: '',
  distanceKm: '',
  vehicleId: '',
  driverId: '',
}

const TripForm = ({
  vehicles = [], drivers = [], initialValues, onSubmit, onCancel, submitting = false,
}) => {
  const [values, setValues] = useState({ ...empty, ...initialValues })

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.({
      ...values,
      distanceKm: values.distanceKm ? Number(values.distanceKm) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={label}>Origin</label>
          <input className={field} value={values.origin} onChange={set('origin')} required />
        </div>
        <div className="space-y-1.5">
          <label className={label}>Destination</label>
          <input className={field} value={values.destination}
            onChange={set('destination')} required />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={label}>Scheduled date</label>
          <input type="datetime-local" className={field} value={values.scheduledDate}
            onChange={set('scheduledDate')} required />
        </div>
        <div className="space-y-1.5">
          <label className={label}>Estimated distance (km)</label>
          <input type="number" className={field} value={values.distanceKm}
            onChange={set('distanceKm')} min="0" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={label}>Vehicle (optional)</label>
          <select className={field} value={values.vehicleId} onChange={set('vehicleId')}>
            <option value="">Assign at dispatch</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.regNumber}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className={label}>Driver (optional)</label>
          <select className={field} value={values.driverId} onChange={set('driverId')}>
            <option value="">Assign at dispatch</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
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
          {submitting ? 'Saving…' : 'Save trip'}
        </button>
      </div>
    </form>
  )
}

export default TripForm