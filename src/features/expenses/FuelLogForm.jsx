import { useState } from 'react'

const field =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
const label = 'block text-sm font-medium text-gray-700'

const CATEGORIES = ['Fuel', 'Toll', 'Parking', 'Fine', 'Other']

/**
 * Log an expense (fuel by default). For fuel entries the litres + odometer
 * readings drive the fuel-efficiency report, so they're surfaced prominently.
 *
 * Props:
 *  - vehicles : [{ id, regNumber }]
 *  - initialValues : partial expense for edit mode
 *  - onSubmit(values) / onCancel()
 *  - submitting : boolean
 */
const empty = {
  vehicleId: '',
  category: 'Fuel',
  date: '',
  amount: '',
  litres: '',
  odometer: '',
  notes: '',
}

const FuelLogForm = ({ vehicles = [], initialValues, onSubmit, onCancel, submitting = false }) => {
  const [values, setValues] = useState({ ...empty, ...initialValues })
  const isFuel = values.category === 'Fuel'

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.({
      ...values,
      amount: values.amount ? Number(values.amount) : 0,
      litres: isFuel && values.litres ? Number(values.litres) : null,
      odometer: isFuel && values.odometer ? Number(values.odometer) : null,
    })
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
          <label className={label}>Category</label>
          <select className={field} value={values.category} onChange={set('category')}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={label}>Date</label>
          <input type="date" className={field} value={values.date} onChange={set('date')} required />
        </div>
        <div className="space-y-1.5">
          <label className={label}>Amount ($)</label>
          <input type="number" step="0.01" min="0" className={field}
            value={values.amount} onChange={set('amount')} required />
        </div>
      </div>

      {isFuel && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={label}>Litres</label>
            <input type="number" step="0.01" min="0" className={field}
              value={values.litres} onChange={set('litres')} />
          </div>
          <div className="space-y-1.5">
            <label className={label}>Odometer at fill (km)</label>
            <input type="number" min="0" className={field}
              value={values.odometer} onChange={set('odometer')} />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label className={label}>Notes</label>
        <input className={field} value={values.notes} onChange={set('notes')} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? 'Saving…' : 'Log expense'}
        </button>
      </div>
    </form>
  )
}

export default FuelLogForm
