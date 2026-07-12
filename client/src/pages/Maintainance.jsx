import { useEffect, useState } from 'react'
import MaintainanceTable from '../features/maintainance/MaintainanceTable'
import MaintainanceForm from '../features/maintainance/MaintainanceForm'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import {
  listMaintenance,
  createMaintenance,
  updateMaintenance,
  closeMaintenance,
  deleteMaintenance,
} from '../api/maintenance.api'
import { listVehicles } from '../api/vehicles.api'
import { getCurrentUser } from '../api/auth.api'
import { can } from '../auth/permissions'

/**
 * Maintenance page. Backed by /api/maintenance. Creating an "Open" record moves
 * the vehicle to "In Shop"; closing it frees the vehicle — the backend performs
 * those cascades, so we refresh the vehicle list after a close.
 *
 * The Fleet Manager manages records; a Financial Analyst opens this page in a
 * read-only mode to review maintenance costs.
 */
const Maintainance = () => {
  const canManage = can(getCurrentUser()?.role, 'maintenance.manage')
  const [records, setRecords] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([listMaintenance(), listVehicles()])
      .then(([m, v]) => {
        if (!active) return
        setRecords(m)
        setVehicles(v)
      })
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

  const openEdit = (record) => {
    setEditing(record)
    setModalOpen(true)
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setError('')
    try {
      if (editing) {
        const updated = await updateMaintenance(editing.id, values)
        setRecords((list) => list.map((r) => (r.id === editing.id ? updated : r)))
      } else {
        const created = await createMaintenance(values)
        setRecords((list) => [created, ...list])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = async (record) => {
    setError('')
    try {
      const updated = await closeMaintenance(record.id)
      setRecords((list) => list.map((r) => (r.id === record.id ? updated : r)))
      listVehicles().then(setVehicles).catch(() => {})
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (record) => {
    if (!window.confirm('Delete this maintenance record?')) return
    setError('')
    try {
      await deleteMaintenance(record.id)
      setRecords((list) => list.filter((r) => r.id !== record.id))
    } catch (err) {
      setError(err.message)
    }
  }

  const openCount = records.filter((r) => r.status === 'Open').length

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        eyebrow="Workshop"
        title="Maintenance"
        description={`${openCount} vehicles currently in the shop and out of service.`}
      >
        {canManage && (
          <button
            onClick={openCreate}
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#26406b]"
          >
            + Log maintenance
          </button>
        )}
      </PageHeader>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-stone-200/50" />
      ) : (
        <MaintainanceTable
          records={records}
          onClose={handleClose}
          onEdit={openEdit}
          onDelete={handleDelete}
          readOnly={!canManage}
        />
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit maintenance' : 'Log maintenance'}
        onClose={() => setModalOpen(false)}
      >
        <MaintainanceForm
          vehicles={vehicles}
          initialValues={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>
    </div>
  )
}

export default Maintainance
