import React from 'react'

const DriverForm = () => {
  return (
    <div>
      
    </div>
  )
}

export default DriverForm
import { useState } from 'react'

const field =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
const label = 'block text-sm font-medium text-gray-700'

const DRIVER_STATUSES = ['Available', 'On Trip', 'Off Duty']


const empty = {
  name: '',
  licenseNumber: '',
  licenseExpiry: '',
  phone: '',
  status: 'Available',
}

const DriverForm = ({ initialValues, onSubmit, onCancel, submitting = false }) => {
  const [values, setValues] = useState({ ...empty, ...initialValues })

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className={label}>Full name</label>
        <input className={field} value={values.name} onChange={set('name')} required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={label}>Licence number</label>
          <input className={field} value={values.licenseNumber}
            onChange={set('licenseNumber')} required />
        </div>
        <div className="space-y-1.5">
          <label className={label}>Licence expiry</label>
          <input type="date" className={field} value={values.licenseExpiry}
            onChange={set('licenseExpiry')} required />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={label}>Phone</label>
          <input className={field} value={values.phone} onChange={set('phone')} />
        </div>
        <div className="space-y-1.5">
          <label className={label}>Status</label>
          <select className={field} value={values.status} onChange={set('status')}>
            {DRIVER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
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
          {submitting ? 'Saving…' : 'Save driver'}
        </button>
      </div>
    </form>
  )
}

export default DriverForm
