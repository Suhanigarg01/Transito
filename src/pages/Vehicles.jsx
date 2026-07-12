import { useMemo, useState } from 'react'
import VehicleTable from '../features/vehicles/VehicleTable'
import VehicleForm from '../features/vehicles/VehicleForm'
import VehicleFilter from '../features/vehicles/VehicleFilter'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'

/**
 * Vehicle registry page. Holds the list in local state so CRUD is interactive
 * in the demo; replace the seed + handlers with /api/vehicles calls.
 */
const SEED = [
  { id: 1, regNumber: 'MH-12-AB-1234', make: 'Tata', model: 'LPT 1613', type: 'Truck', year: 2021, odometer: 84200, status: 'Available' },
  { id: 2, regNumber: 'MH-14-CD-9911', make: 'Ashok Leyland', model: 'Dost', type: 'Van', year: 2022, odometer: 41230, status: 'On Trip' },
  { id: 3, regNumber: 'MH-12-EF-5522', make: 'Eicher', model: 'Pro 2049', type: 'Truck', year: 2020, odometer: 122900, status: 'In Shop' },
  { id: 4, regNumber: 'MH-01-GH-7788', make: 'Force', model: 'Traveller', type: 'Bus', year: 2019, odometer: 156700, status: 'Available' },
]

const Vehicles = () => {
  const [vehicles, setVehicles] = useState(SEED)
  const [filters, setFilters] = useState({ search: '', status: '', type: '' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return vehicles.filter((v) => {
      if (filters.status && v.status !== filters.status) return false
      if (filters.type && v.type !== filters.type) return false
      if (q && !`${v.regNumber} ${v.make} ${v.model}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [vehicles, filters])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (vehicle) => {
    setEditing(vehicle)
    setModalOpen(true)
  }

  const handleSubmit = (values) => {
    // Replace with POST /api/vehicles or PUT /api/vehicles/:id
    if (editing) {
      setVehicles((list) => list.map((v) => (v.id === editing.id ? { ...v, ...values } : v)))
    } else {
      setVehicles((list) => [...list, { ...values, id: Date.now() }])
    }
    setModalOpen(false)
  }

  const handleDelete = (vehicle) => {
    // Replace with DELETE /api/vehicles/:id
    if (window.confirm(`Delete vehicle ${vehicle.regNumber}?`)) {
      setVehicles((list) => list.filter((v) => v.id !== vehicle.id))
    }
  }

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        eyebrow="Registry"
        title="Vehicles"
        description={`${vehicles.length} vehicles across the fleet, tracked by live status.`}
      >
        <button
          onClick={openCreate}
          className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#26406b]"
        >
          + Add vehicle
        </button>
      </PageHeader>

      <VehicleFilter filters={filters} onChange={setFilters} />

      <VehicleTable vehicles={filtered} onEdit={openEdit} onDelete={handleDelete} />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit vehicle' : 'Add vehicle'}
        onClose={() => setModalOpen(false)}
      >
        <VehicleForm
          initialValues={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default Vehicles
