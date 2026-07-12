import { useState } from 'react'

const field =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
const label = 'block text-xs font-medium text-gray-500'

/**
 * Dispatch panel for a single Draft trip. Confirms vehicle + driver assignment
 * and fires the Draft -> Dispatched transition (which the backend uses to flip
 * the vehicle to "On Trip" and the driver to "On Trip").
 *
 * Props:
 *  - trip     : the draft trip being dispatched
 *  - vehicles : available vehicles [{ id, regNumber }]
 *  - drivers  : available drivers  [{ id, name }]
 *  - onDispatch({ tripId, vehicleId, driverId }) / onCancel()
 *  - submitting : boolean
 */
const DispatchPanel = ({ trip, vehicles = [], drivers = [], onDispatch, onCancel, submitting = false }) => {
  const [vehicleId, setVehicleId] = useState(trip?.vehicleId || '')
  const [driverId, setDriverId] = useState(trip?.driverId || '')

  if (!trip) return null

  const canDispatch = vehicleId && driverId

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Dispatch {trip.reference || `#${trip.id}`}
        </h3>
        <span className="text-xs text-gray-400">{trip.origin} → {trip.destination}</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={label}>Assign vehicle</label>
          <select className={field} value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            <option value="">Select vehicle…</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className={label}>Assign driver</label>
          <select className={field} value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            <option value="">Select driver…</option>
            {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      {!canDispatch && (
        <p className="mt-3 text-xs text-amber-600">
          A vehicle and driver are required before dispatch.
        </p>
      )}

      <div className="mt-4 flex justify-end gap-3">
        <button onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button
          disabled={!canDispatch || submitting}
          onClick={() => onDispatch?.({ tripId: trip.id, vehicleId, driverId })}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Dispatching…' : 'Dispatch trip'}
        </button>
      </div>
    </div>
  )
}

export default DispatchPanel