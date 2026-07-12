import { useEffect, useMemo, useState } from 'react'
import { getRoiReport } from '../../api/reports.api'
import KpiGrid from './KpiGrid'
import PageHeader from '../../components/PageHeader'
import CostBreakdownChart from '../reports/CostBreakdownChart'
import ROITable from '../reports/ROITable'
import { ReportsIcon, ExpensesIcon, GaugeIcon, ClockIcon } from '../../components/icons'

/**
 * Financial Analyst dashboard — profitability at a glance: revenue against
 * operating cost, the cost breakdown, and per-vehicle return. Built from the
 * /api/reports rows (Financial-Analyst only).
 */
const COST_COLORS = {
  Fuel: '#2a78d6',
  Maintenance: '#eda100',
  'Tolls & Other': '#1baf7a',
}

const money = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`

const FinanceDashboard = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getRoiReport()
      .then((data) => active && setRows(data.rows || []))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const { kpis, costBreakdown } = useMemo(() => {
    const totals = rows.reduce(
      (acc, r) => ({
        revenue: acc.revenue + (r.revenue || 0),
        fuel: acc.fuel + (r.fuelCost || 0),
        maintenance: acc.maintenance + (r.maintenanceCost || 0),
        other: acc.other + (r.otherCost || 0),
      }),
      { revenue: 0, fuel: 0, maintenance: 0, other: 0 },
    )
    const opCost = totals.fuel + totals.maintenance + totals.other
    const net = totals.revenue - opCost

    const kpis = [
      { label: 'Total Revenue', value: money(totals.revenue), sublabel: 'completed trips', Icon: ReportsIcon },
      { label: 'Operating Cost', value: money(opCost), sublabel: 'fuel + repairs + tolls', Icon: ExpensesIcon },
      { label: 'Net Result', value: money(net), sublabel: 'revenue − cost', Icon: GaugeIcon },
      { label: 'Fuel Spend', value: money(totals.fuel), sublabel: 'across the fleet', Icon: ClockIcon },
    ]

    const costBreakdown = [
      { label: 'Fuel', value: totals.fuel },
      { label: 'Maintenance', value: totals.maintenance },
      { label: 'Tolls & Other', value: totals.other },
    ].map((c) => ({ ...c, color: COST_COLORS[c.label] }))

    return { kpis, costBreakdown }
  }, [rows])

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Couldn’t load financials: {error}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-stone-200/70" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-stone-200/50" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-stone-200/50" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        eyebrow="Financial Analyst"
        title="Profitability"
        description="Revenue against operating cost, the cost mix, and per-vehicle return."
      />

      <KpiGrid kpis={kpis} />

      <CostBreakdownChart data={costBreakdown} />

      <div>
        <p className="eyebrow">Per vehicle</p>
        <h2 className="mb-3 mt-0.5 text-[15px] font-semibold text-stone-800">Return on Investment</h2>
        <ROITable rows={rows} />
      </div>
    </div>
  )
}

export default FinanceDashboard
