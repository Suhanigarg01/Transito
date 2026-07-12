import { useEffect, useMemo, useState } from 'react'
import VehicleTable from '../features/vehicles/VehicleTable'
import VehicleForm from '../features/vehicles/VehicleForm'
import VehicleFilter from '../features/vehicles/VehicleFilter'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import {
  listVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../api/vehicles.api'

/**
 * Vehicle registry page. Backed by /api/vehicles. The list is filtered
 * client-side; CRUD round-trips to the server and reconciles local state from
 * the response.
 */
const Vehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ search: '', status: '', type: '' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    listVehicles()
      .then((data) => active && setVehicles(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return vehicles.filter((v) => {
      if (filters.status && v.status !== filters.status) return false
      if (filters.type && v.type !== filters.type) return false
      if (q && !`${v.regNumber} ${v.name || ''}`.toLowerCase().includes(q)) return false
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

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setError('')
    try {
      if (editing) {
        const updated = await updateVehicle(editing.id, values)
        setVehicles((list) => list.map((v) => (v.id === editing.id ? updated : v)))
      } else {
        const created = await createVehicle(values)
        setVehicles((list) => [created, ...list])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (vehicle) => {
    if (!window.confirm(`Delete vehicle ${vehicle.regNumber}?`)) return
    setError('')
    try {
      await deleteVehicle(vehicle.id)
      setVehicles((list) => list.filter((v) => v.id !== vehicle.id))
    } catch (err) {
      setError(err.message)
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

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <VehicleFilter filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-stone-200/50" />
      ) : (
        <VehicleTable vehicles={filtered} onEdit={openEdit} onDelete={handleDelete} />
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit vehicle' : 'Add vehicle'}
        onClose={() => setModalOpen(false)}
      >
        <VehicleForm
          initialValues={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>
    </div>
  )
}

export default Vehicles
