import { useEffect, useMemo, useState } from 'react'
import TripTable from '../features/trips/TripTable'
import TripForm from '../features/trips/TripForm'
import DispatchPanel from '../features/trips/DispatchPanel'
import CompleteTripModal from '../features/trips/CompleteTripModal'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import {
  listTrips,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
} from '../api/trips.api'
import { listVehicles } from '../api/vehicles.api'
import { listDrivers } from '../api/drivers.api'

/**
 * Trip management page. Backed by /api/trips. The lifecycle transitions are
 * dedicated endpoints; the backend cascades vehicle/driver status, so we simply
 * replace the affected trip with the presented record it returns.
 *
 *   Draft --dispatch--> Dispatched --complete--> Completed
 *        \--cancel--> Cancelled            \--cancel--> Cancelled
 */
const Trips = () => {
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [createOpen, setCreateOpen] = useState(false)
  const [dispatching, setDispatching] = useState(null)
  const [completing, setCompleting] = useState(null)

  useEffect(() => {
    let active = true
    Promise.all([listTrips(), listVehicles(), listDrivers()])
      .then(([t, v, d]) => {
        if (!active) return
        setTrips(t)
        setVehicles(v)
        setDrivers(d)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  // Only free vehicles/drivers can be assigned at create/dispatch time.
  const availableVehicles = useMemo(
    () => vehicles.filter((v) => v.status === 'Available'),
    [vehicles],
  )
  const availableDrivers = useMemo(
    () => drivers.filter((d) => d.status === 'Available'),
    [drivers],
  )

  const replaceTrip = (trip) =>
    setTrips((list) => list.map((t) => (t.id === trip.id ? trip : t)))

  // After a transition, vehicle/driver availability changes server-side too;
  // refresh those lists so the dropdowns stay accurate.
  const refreshFleet = () => {
    Promise.all([listVehicles(), listDrivers()])
      .then(([v, d]) => {
        setVehicles(v)
        setDrivers(d)
      })
      .catch(() => {})
  }

  const handleCreate = async (values) => {
    setSubmitting(true)
    setError('')
    try {
      const created = await createTrip(values)
      setTrips((list) => [created, ...list])
      setCreateOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDispatch = async ({ tripId, vehicleId, driverId }) => {
    setSubmitting(true)
    setError('')
    try {
      const trip = await dispatchTrip(tripId, { vehicleId, driverId })
      replaceTrip(trip)
      refreshFleet()
      setDispatching(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleComplete = async ({ tripId, endOdometer, notes }) => {
    setSubmitting(true)
    setError('')
    try {
      const trip = await completeTrip(tripId, { endOdometer, notes })
      replaceTrip(trip)
      refreshFleet()
      setCompleting(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = async (trip) => {
    if (!window.confirm(`Cancel ${trip.reference}?`)) return
    setError('')
    try {
      const updated = await cancelTrip(trip.id)
      replaceTrip(updated)
      refreshFleet()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        eyebrow="Dispatch"
        title="Trips"
        description="Plan, dispatch and close out journeys as they move through the fleet."
      >
        <button
          onClick={() => setCreateOpen(true)}
          className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#26406b]"
        >
          + New trip
        </button>
      </PageHeader>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-stone-200/50" />
      ) : (
        <TripTable
          trips={trips}
          onDispatch={(t) => setDispatching(t)}
          onComplete={(t) => setCompleting(t)}
          onCancel={handleCancel}
        />
      )}

      {/* Create trip */}
      <Modal open={createOpen} title="New trip" onClose={() => setCreateOpen(false)}>
        <TripForm
          vehicles={availableVehicles}
          drivers={availableDrivers}
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
          submitting={submitting}
        />
      </Modal>

      {/* Dispatch (DispatchPanel is a self-contained card, so it gets a bare overlay) */}
      {dispatching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg">
            <DispatchPanel
              trip={dispatching}
              vehicles={availableVehicles}
              drivers={availableDrivers}
              onDispatch={handleDispatch}
              onCancel={() => setDispatching(null)}
              submitting={submitting}
            />
          </div>
        </div>
      )}

      {/* Complete */}
      <CompleteTripModal
        open={!!completing}
        trip={completing}
        onSubmit={handleComplete}
        onClose={() => setCompleting(null)}
        submitting={submitting}
      />
    </div>
  )
}

export default Trips
