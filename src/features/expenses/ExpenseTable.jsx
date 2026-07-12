/**
 * Expense / fuel log table. Feeds the operational-cost and fuel-efficiency
 * calculations in Reports.
 *
 * Props:
 *  - expenses : [{ id, vehicle, category, date, amount, litres, odometer, notes }]
 *  - onEdit(expense) / onDelete(expense)
 *  - loading : boolean
 */
const categoryDot = {
  Fuel: '#2f4a7a',
  Toll: '#7a5ea8',
  Parking: '#1baf7a',
  Fine: '#d03b3b',
  Other: '#78716c',
}

const th = 'px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-400'
const td = 'px-5 py-4 text-sm text-stone-600'
const actionBtn = 'rounded-md px-2 py-1 text-xs font-medium transition'

const money = (n) => (n != null ? `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—')

const CategoryTag = ({ category }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600 ring-1 ring-inset ring-stone-500/15">
    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: categoryDot[category] || '#78716c' }} />
    {category}
  </span>
)

const ExpenseTable = ({ expenses = [], onEdit, onDelete, loading = false }) => {
  const total = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-stone-100 bg-stone-50/60">
            <tr>
              <th className={th}>Vehicle</th>
              <th className={th}>Category</th>
              <th className={th}>Date</th>
              <th className={`${th} text-right`}>Litres</th>
              <th className={`${th} text-right`}>Amount</th>
              <th className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td className={`${td} text-center text-stone-400`} colSpan={6}>Loading…</td></tr>
            ) : expenses.length === 0 ? (
              <tr><td className={`${td} text-center text-stone-400`} colSpan={6}>No expenses logged</td></tr>
            ) : (
              expenses.map((e) => (
                <tr key={e.id} className="transition-colors hover:bg-stone-50/70">
                  <td className={`${td} font-medium text-stone-900`}>{e.vehicle}</td>
                  <td className={td}><CategoryTag category={e.category} /></td>
                  <td className={`${td} tabular-nums`}>{e.date ? new Date(e.date).toLocaleDateString() : '—'}</td>
                  <td className={`${td} text-right tabular-nums`}>{e.litres != null ? `${e.litres} L` : '—'}</td>
                  <td className={`${td} text-right font-medium text-stone-900 tabular-nums`}>{money(e.amount)}</td>
                  <td className={`${td} text-right whitespace-nowrap`}>
                    <button onClick={() => onEdit?.(e)}
                      className={`${actionBtn} text-stone-600 hover:bg-stone-100 hover:text-stone-900`}>Edit</button>
                    <button onClick={() => onDelete?.(e)}
                      className={`${actionBtn} ml-1 text-stone-500 hover:bg-red-50 hover:text-red-600`}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {expenses.length > 0 && (
            <tfoot className="border-t border-stone-100 bg-stone-50/60">
              <tr>
                <td className={`${td} font-semibold text-stone-900`} colSpan={4}>Total</td>
                <td className={`${td} text-right font-semibold text-stone-900 tabular-nums`}>{money(total)}</td>
                <td className={td} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

export default ExpenseTable
