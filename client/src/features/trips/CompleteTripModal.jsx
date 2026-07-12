import { useState } from 'react'

const field =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
const label = 'block text-sm font-medium text-gray-700'

/**
 * Modal to complete a Dispatched trip. Captures the closing odometer reading
 * so the backend can compute actual distance and free the vehicle + driver
 * back to "Available" (Dispatched -> Completed transition).
 *
 * Props:
 *  - open : boolean
 *  - trip : the trip being completed (for header + start odometer hint)
 *  - onSubmit({ tripId, endOdometer, notes }) / onClose()
 *  - submitting : boolean
 */
const CompleteTripModal = ({ open, trip, onSubmit, onClose, submitting = false }) => {
  const [endOdometer, setEndOdometer] = useState('')
  const [notes, setNotes] = useState('')

  if (!open || !trip) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.({
      tripId: trip.id,
      endOdometer: endOdometer ? Number(endOdometer) : null,
      notes,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Complete trip</h3>
            <p className="text-sm text-gray-500">
              {trip.reference || `#${trip.id}`} · {trip.origin} → {trip.destination}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <label className={label}>Closing odometer (km)</label>
            <input type="number" className={field} value={endOdometer}
              onChange={(e) => setEndOdometer(e.target.value)}
              min={trip.startOdometer || 0} required />
            {trip.startOdometer != null && (
              <p className="text-xs text-gray-400">
                Start reading: {Number(trip.startOdometer).toLocaleString()} km
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className={label}>Notes (optional)</label>
            <textarea className={field} rows={3} value={notes}
              onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60">
              {submitting ? 'Completing…' : 'Complete trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompleteTripModal