import { useState } from 'react'
import TripTable from '../features/trips/TripTable'
import TripForm from '../features/trips/TripForm'
import DispatchPanel from '../features/trips/DispatchPanel'
import CompleteTripModal from '../features/trips/CompleteTripModal'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'

/**
 * Trip management page. Enforces the lifecycle client-side for the demo:
 *   Draft --dispatch--> Dispatched --complete--> Completed
 *        \--cancel--> Cancelled            \--cancel--> Cancelled
 * The backend performs the real transition + cascades vehicle/driver status.
 */
const AVAILABLE_VEHICLES = [
  { id: 1, regNumber: 'MH-12-AB-1234' },
  { id: 4, regNumber: 'MH-01-GH-7788' },
]
const AVAILABLE_DRIVERS = [
  { id: 1, name: 'Ramesh Kumar' },
  { id: 3, name: 'Anita Desai' },
]

const SEED = [
  { id: 1, reference: 'TRP-1042', origin: 'Depot A', destination: 'Riverside', vehicle: 'MH-14-CD-9911', driver: 'Suresh Patil', status: 'Dispatched', startOdometer: 41230 },
  { id: 2, reference: 'TRP-1041', origin: 'Warehouse', destination: 'Airport', vehicle: 'MH-12-EF-5522', driver: 'Vijay Singh', status: 'Completed' },
  { id: 3, reference: 'TRP-1039', origin: 'Riverside', destination: 'Depot A', vehicle: '', driver: '', status: 'Draft' },
]

const Trips = () => {
  const [trips, setTrips] = useState(SEED)
  const [createOpen, setCreateOpen] = useState(false)
  const [dispatching, setDispatching] = useState(null)
  const [completing, setCompleting] = useState(null)

  const setStatus = (id, changes) =>
    setTrips((list) => list.map((t) => (t.id === id ? { ...t, ...changes } : t)))

  const handleCreate = (values) => {
    // Replace with POST /api/trips (server assigns reference + Draft status)
    const vehicle = AVAILABLE_VEHICLES.find((v) => String(v.id) === String(values.vehicleId))
    const driver = AVAILABLE_DRIVERS.find((d) => String(d.id) === String(values.driverId))
    setTrips((list) => [
      ...list,
      {
        id: Date.now(),
        reference: `TRP-${1043 + list.length}`,
        origin: values.origin,
        destination: values.destination,
        vehicle: vehicle?.regNumber || '',
        driver: driver?.name || '',
        status: 'Draft',
      },
    ])
    setCreateOpen(false)
  }

  const handleDispatch = ({ tripId, vehicleId, driverId }) => {
    // Replace with POST /api/trips/:id/dispatch
    const vehicle = AVAILABLE_VEHICLES.find((v) => String(v.id) === String(vehicleId))
    const driver = AVAILABLE_DRIVERS.find((d) => String(d.id) === String(driverId))
    setStatus(tripId, {
      status: 'Dispatched',
      vehicle: vehicle?.regNumber || '',
      driver: driver?.name || '',
    })
    setDispatching(null)
  }

  const handleComplete = ({ tripId, endOdometer, notes }) => {
    // Replace with POST /api/trips/:id/complete
    setStatus(tripId, { status: 'Completed', endOdometer, notes })
    setCompleting(null)
  }

  const handleCancel = (trip) => {
    // Replace with POST /api/trips/:id/cancel
    if (window.confirm(`Cancel ${trip.reference}?`)) {
      setStatus(trip.id, { status: 'Cancelled' })
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

      <TripTable
        trips={trips}
        onDispatch={(t) => setDispatching(t)}
        onComplete={(t) => setCompleting(t)}
        onCancel={handleCancel}
      />

      {/* Create trip */}
      <Modal open={createOpen} title="New trip" onClose={() => setCreateOpen(false)}>
        <TripForm
          vehicles={AVAILABLE_VEHICLES}
          drivers={AVAILABLE_DRIVERS}
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      {/* Dispatch (DispatchPanel is a self-contained card, so it gets a bare overlay) */}
      {dispatching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg">
            <DispatchPanel
              trip={dispatching}
              vehicles={AVAILABLE_VEHICLES}
              drivers={AVAILABLE_DRIVERS}
              onDispatch={handleDispatch}
              onCancel={() => setDispatching(null)}
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
      />
    </div>
  )
}

export default Trips