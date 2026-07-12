import { useEffect, useMemo, useState } from 'react'
import ReportFilter from '../features/reports/ReportFilter'
import ROITable from '../features/reports/ROITable'
import CostBreakdownChart from '../features/reports/CostBreakdownChart'
import ExportCSV from '../features/reports/ExportCSV'
import PageHeader from '../components/PageHeader'
import { getRoiReport } from '../api/reports.api'
import { listVehicles } from '../api/vehicles.api'

const COST_COLORS = {
  Fuel: '#2a78d6',
  Maintenance: '#eda100',
  'Tolls & Other': '#1baf7a',
}

/**
 * Reports & analytics page. Rows come from GET /api/reports (per-vehicle
 * revenue/cost/distance aggregates); the vehicle + date filters are applied
 * server-side, so we refetch whenever they change. ROI and fuel-efficiency are
 * derived here from the raw figures.
 */
const Report = () => {
  const [filters, setFilters] = useState({
    reportType: 'roi',
    from: '',
    to: '',
    vehicleId: '',
  })
  const [rows, setRows] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Vehicle list for the filter dropdown (loaded once).
  useEffect(() => {
    listVehicles()
      .then(setVehicles)
      .catch((err) => setError(err.message))
  }, [])

  // Report rows — refetch when the filters change.
  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const data = await getRoiReport({
          type: filters.reportType,
          vehicleId: filters.vehicleId,
          from: filters.from,
          to: filters.to,
        })
        if (active) setRows(data.rows || [])
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [filters.reportType, filters.vehicleId, filters.from, filters.to])

  const costBreakdown = useMemo(() => {
    const totals = rows.reduce(
      (acc, r) => ({
        Fuel: acc.Fuel + (r.fuelCost || 0),
        Maintenance: acc.Maintenance + (r.maintenanceCost || 0),
        'Tolls & Other': acc['Tolls & Other'] + (r.otherCost || 0),
      }),
      { Fuel: 0, Maintenance: 0, 'Tolls & Other': 0 },
    )
    return Object.entries(totals).map(([label, value]) => ({
      label,
      value,
      color: COST_COLORS[label],
    }))
  }, [rows])

  // Flatten the derived figures for CSV export.
  const exportRows = useMemo(
    () =>
      rows.map((r) => {
        const opCost = (r.fuelCost || 0) + (r.maintenanceCost || 0) + (r.otherCost || 0)
        const roi = opCost > 0 ? (((r.revenue || 0) - opCost) / opCost) * 100 : 0
        const efficiency = r.fuelLitres > 0 ? (r.distanceKm || 0) / r.fuelLitres : 0
        return {
          vehicle: r.vehicle,
          revenue: r.revenue,
          operationalCost: opCost,
          fuelEfficiencyKmPerL: efficiency.toFixed(2),
          roiPercent: roi.toFixed(1),
        }
      }),
    [rows],
  )

  const exportColumns = [
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'operationalCost', label: 'Operational Cost' },
    { key: 'fuelEfficiencyKmPerL', label: 'Fuel Efficiency (km/L)' },
    { key: 'roiPercent', label: 'ROI (%)' },
  ]

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        eyebrow="Analytics"
        title="Reports & Analytics"
        description="Where the money goes — operational cost, fuel efficiency and per-vehicle ROI."
      >
        <ExportCSV rows={exportRows} columns={exportColumns} filename="fleet-roi.csv" />
      </PageHeader>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <ReportFilter filters={filters} vehicles={vehicles} onChange={setFilters} />

      <CostBreakdownChart data={costBreakdown} />

      <div>
        <p className="eyebrow">Per vehicle</p>
        <h2 className="mb-3 mt-0.5 text-[15px] font-semibold text-stone-800">Return on Investment</h2>
        {loading ? (
          <div className="h-48 animate-pulse rounded-2xl bg-stone-200/50" />
        ) : (
          <ROITable rows={rows} />
        )}
      </div>
    </div>
  )
}

export default Report
