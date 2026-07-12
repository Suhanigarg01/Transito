import { useEffect, useState } from 'react'
import ExpenseTable from '../features/expenses/ExpenseTable'
import FuelLogForm from '../features/expenses/FuelLogForm'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import {
  listExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../api/expenses.api'
import { listVehicles } from '../api/vehicles.api'

/**
 * Expenses / fuel log page. Backed by /api/expenses. Feeds the operational-cost
 * and fuel-efficiency reports.
 */
const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([listExpenses(), listVehicles()])
      .then(([e, v]) => {
        if (!active) return
        setExpenses(e)
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

  const openEdit = (expense) => {
    setEditing(expense)
    setModalOpen(true)
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setError('')
    try {
      if (editing) {
        const updated = await updateExpense(editing.id, values)
        setExpenses((list) => list.map((e) => (e.id === editing.id ? updated : e)))
      } else {
        const created = await createExpense(values)
        setExpenses((list) => [created, ...list])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (expense) => {
    if (!window.confirm('Delete this expense?')) return
    setError('')
    try {
      await deleteExpense(expense.id)
      setExpenses((list) => list.filter((e) => e.id !== expense.id))
    } catch (err) {
      setError(err.message)
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

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-stone-200/50" />
      ) : (
        <ExpenseTable expenses={expenses} onEdit={openEdit} onDelete={handleDelete} />
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit expense' : 'Log expense'}
        onClose={() => setModalOpen(false)}
      >
        <FuelLogForm
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

export default Expenses
