import { useState } from 'react'
import DriverTable from '../features/drivers/DriverTable'
import DriverForm from '../features/drivers/DriverForm'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'

/**
 * Drivers registry page. Local state stands in for /api/drivers.
 */
const SEED = [
  { id: 1, name: 'Ramesh Kumar', licenseNumber: 'DL-0420110149646', licenseExpiry: '2027-03-15', phone: '+91 98200 11223', status: 'Available' },
  { id: 2, name: 'Suresh Patil', licenseNumber: 'MH-1420190004521', licenseExpiry: '2026-08-01', phone: '+91 99870 55412', status: 'On Trip' },
  { id: 3, name: 'Anita Desai', licenseNumber: 'MH-0120170098712', licenseExpiry: '2026-07-30', phone: '+91 90045 78123', status: 'Available' },
  { id: 4, name: 'Vijay Singh', licenseNumber: 'DL-0520150031200', licenseExpiry: '2025-12-10', phone: '+91 98115 66200', status: 'Off Duty' },
]

const Drivers = () => {
  const [drivers, setDrivers] = useState(SEED)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (driver) => {
    setEditing(driver)
    setModalOpen(true)
  }

  const handleSubmit = (values) => {
    // Replace with POST /api/drivers or PUT /api/drivers/:id
    if (editing) {
      setDrivers((list) => list.map((d) => (d.id === editing.id ? { ...d, ...values } : d)))
    } else {
      setDrivers((list) => [...list, { ...values, id: Date.now() }])
    }
    setModalOpen(false)
  }

  const handleDelete = (driver) => {
    // Replace with DELETE /api/drivers/:id
    if (window.confirm(`Delete driver ${driver.name}?`)) {
      setDrivers((list) => list.filter((d) => d.id !== driver.id))
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

      <DriverTable drivers={drivers} onEdit={openEdit} onDelete={handleDelete} />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit driver' : 'Add driver'}
        onClose={() => setModalOpen(false)}
      >
        <DriverForm
          initialValues={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default Drivers
