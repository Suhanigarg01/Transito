import { useState } from 'react'
import ExpenseTable from '../features/expenses/ExpenseTable'
import FuelLogForm from '../features/expenses/FuelLogForm'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'

/**
 * Expenses / fuel log page. Feeds the operational-cost and fuel-efficiency
 * reports. Local state stands in for /api/expenses.
 */
const VEHICLES = [
  { id: 1, regNumber: 'MH-12-AB-1234' },
  { id: 2, regNumber: 'MH-14-CD-9911' },
  { id: 3, regNumber: 'MH-12-EF-5522' },
  { id: 4, regNumber: 'MH-01-GH-7788' },
]

const SEED = [
  { id: 1, vehicleId: 2, vehicle: 'MH-14-CD-9911', category: 'Fuel', date: '2026-07-10', amount: 5400, litres: 55, odometer: 41230, notes: 'HP Riverside' },
  { id: 2, vehicleId: 1, vehicle: 'MH-12-AB-1234', category: 'Fuel', date: '2026-07-09', amount: 6100, litres: 62, odometer: 84200, notes: 'IOCL Depot A' },
  { id: 3, vehicleId: 4, vehicle: 'MH-01-GH-7788', category: 'Toll', date: '2026-07-08', amount: 320, litres: null, odometer: null, notes: 'Expressway' },
]

const Expenses = () => {
  const [expenses, setExpenses] = useState(SEED)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (expense) => {
    setEditing(expense)
    setModalOpen(true)
  }

  const handleSubmit = (values) => {
    // Replace with POST /api/expenses or PUT /api/expenses/:id
    const vehicle = VEHICLES.find((v) => String(v.id) === String(values.vehicleId))
    const row = { ...values, vehicle: vehicle?.regNumber || '' }
    if (editing) {
      setExpenses((list) => list.map((e) => (e.id === editing.id ? { ...e, ...row } : e)))
    } else {
      setExpenses((list) => [...list, { ...row, id: Date.now() }])
    }
    setModalOpen(false)
  }

  const handleDelete = (expense) => {
    if (window.confirm('Delete this expense?')) {
      setExpenses((list) => list.filter((e) => e.id !== expense.id))
    }
  }

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        eyebrow="Ledger"
        title="Expenses"
        description="Fuel fills and operating costs that feed cost and efficiency reporting."
      >
        <button
          onClick={openCreate}
          className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#26406b]"
        >
          + Log expense
        </button>
      </PageHeader>

      <ExpenseTable expenses={expenses} onEdit={openEdit} onDelete={handleDelete} />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit expense' : 'Log expense'}
        onClose={() => setModalOpen(false)}
      >
        <FuelLogForm
          vehicles={VEHICLES}
          initialValues={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default Expenses
