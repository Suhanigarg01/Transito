import { useState } from 'react'

const field =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
const label = 'block text-sm font-medium text-gray-700'

const VEHICLE_TYPES = ['Truck', 'Van', 'Bus', 'Car', 'Trailer']
const VEHICLE_STATUSES = ['Available', 'On Trip', 'In Shop']

/**
 * Create / edit vehicle form.
 *
 * Props:
 *  - initialValues : partial vehicle for edit mode
 *  - onSubmit(values) / onCancel()
 *  - submitting : boolean
 */
const empty = {
  regNumber: '',
  make: '',
  model: '',
  type: 'Truck',
  year: '',
  odometer: '',
  status: 'Available',
}

const VehicleForm = ({ initialValues, onSubmit, onCancel, submitting = false }) => {
  const [values, setValues] = useState({ ...empty, ...initialValues })

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.({
      ...values,
      year: values.year ? Number(values.year) : null,
      odometer: values.odometer ? Number(values.odometer) : 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className={label}>Registration number</label>
        <input className={field} value={values.regNumber}
          onChange={set('regNumber')} required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={label}>Make</label>
          <input className={field} value={values.make} onChange={set('make')} required />
        </div>
        <div className="space-y-1.5">
          <label className={label}>Model</label>
          <input className={field} value={values.model} onChange={set('model')} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className={label}>Type</label>
          <select className={field} value={values.type} onChange={set('type')}>
            {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className={label}>Year</label>
          <input type="number" className={field} value={values.year}
            onChange={set('year')} min="1980" max="2100" />
        </div>
        <div className="space-y-1.5">
          <label className={label}>Odometer (km)</label>
          <input type="number" className={field} value={values.odometer}
            onChange={set('odometer')} min="0" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={label}>Status</label>
        <select className={field} value={values.status} onChange={set('status')}>
          {VEHICLE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? 'Saving…' : 'Save vehicle'}
        </button>
      </div>
    </form>
  )
}

export default VehicleForm
