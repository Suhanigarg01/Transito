import { useState } from 'react'
import MaintainanceTable from '../features/maintainance/MaintainanceTable'
import MaintainanceForm from '../features/maintainance/MaintainanceForm'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'

/**
 * Maintenance page. An "Open" record marks the vehicle "In Shop"; closing it
 * (onClose) frees the vehicle back to "Available" — the backend performs that
 * cascade. Local state stands in for /api/maintenance.
 */
const VEHICLES = [
  { id: 1, regNumber: 'MH-12-AB-1234' },
  { id: 2, regNumber: 'MH-14-CD-9911' },
  { id: 3, regNumber: 'MH-12-EF-5522' },
  { id: 4, regNumber: 'MH-01-GH-7788' },
]

const SEED = [
  { id: 1, vehicleId: 3, vehicle: 'MH-12-EF-5522', type: 'Repair', description: 'Clutch replacement', cost: 18500, serviceDate: '2026-07-08', status: 'Open' },
  { id: 2, vehicleId: 1, vehicle: 'MH-12-AB-1234', type: 'Routine Service', description: '80k km service', cost: 6200, serviceDate: '2026-06-20', status: 'Closed' },
  { id: 3, vehicleId: 4, vehicle: 'MH-01-GH-7788', type: 'Tyre', description: '4 x front tyres', cost: 24000, serviceDate: '2026-05-30', status: 'Closed' },
]

const Maintainance = () => {
  const [records, setRecords] = useState(SEED)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditing(record)
    setModalOpen(true)
  }

  const handleSubmit = (values) => {
    // Replace with POST /api/maintenance or PUT /api/maintenance/:id
    const vehicle = VEHICLES.find((v) => String(v.id) === String(values.vehicleId))
    const row = { ...values, vehicle: vehicle?.regNumber || '' }
    if (editing) {
      setRecords((list) => list.map((r) => (r.id === editing.id ? { ...r, ...row } : r)))
    } else {
      setRecords((list) => [...list, { ...row, id: Date.now() }])
    }
    setModalOpen(false)
  }

  const handleClose = (record) => {
    // Replace with POST /api/maintenance/:id/close (frees the vehicle)
    setRecords((list) => list.map((r) => (r.id === record.id ? { ...r, status: 'Closed' } : r)))
  }

  const handleDelete = (record) => {
    if (window.confirm('Delete this maintenance record?')) {
      setRecords((list) => list.filter((r) => r.id !== record.id))
    }
  }

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        eyebrow="Workshop"
        title="Maintenance"
        description={`${
          records.filter((r) => r.status === 'Open').length
        } vehicles currently in the shop and out of service.`}
      >
        <button
          onClick={openCreate}
          className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#26406b]"
        >
          + Log maintenance
        </button>
      </PageHeader>

      <MaintainanceTable
        records={records}
        onClose={handleClose}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit maintenance' : 'Log maintenance'}
        onClose={() => setModalOpen(false)}
      >
        <MaintainanceForm
          vehicles={VEHICLES}
          initialValues={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default Maintainance