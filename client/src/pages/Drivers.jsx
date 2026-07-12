import { useEffect, useState } from 'react'
import DriverTable from '../features/drivers/DriverTable'
import DriverForm from '../features/drivers/DriverForm'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import {
  listDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from '../api/drivers.api'

/**
 * Drivers registry page. Backed by /api/drivers.
 */
const Drivers = () => {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    listDrivers()
      .then((data) => active && setDrivers(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (driver) => {
    setEditing(driver)
    setModalOpen(true)
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setError('')
    try {
      if (editing) {
        const updated = await updateDriver(editing.id, values)
        setDrivers((list) => list.map((d) => (d.id === editing.id ? updated : d)))
      } else {
        const created = await createDriver(values)
        setDrivers((list) => [created, ...list])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (driver) => {
    if (!window.confirm(`Delete driver ${driver.name}?`)) return
    setError('')
    try {
      await deleteDriver(driver.id)
      setDrivers((list) => list.filter((d) => d.id !== driver.id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        eyebrow="Registry"
        title="Drivers"
        description={`${drivers.length} drivers on the roster, with licence validity at a glance.`}
      >
        <button
          onClick={openCreate}
          className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#26406b]"
        >
          + Add driver
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
        <DriverTable drivers={drivers} onEdit={openEdit} onDelete={handleDelete} />
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit driver' : 'Add driver'}
        onClose={() => setModalOpen(false)}
      >
        <DriverForm
          initialValues={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>
    </div>
  )
}

export default Drivers
