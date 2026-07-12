import { useMemo, useState } from 'react'
import ReportFilter from '../features/reports/ReportFilter'
import ROITable from '../features/reports/ROITable'
import CostBreakdownChart from '../features/reports/CostBreakdownChart'
import ExportCSV from '../features/reports/ExportCSV'
import PageHeader from '../components/PageHeader'

const VEHICLES = [
  { id: 1, regNumber: 'MH-12-AB-1234' },
  { id: 2, regNumber: 'MH-14-CD-9911' },
  { id: 3, regNumber: 'MH-12-EF-5522' },
  { id: 4, regNumber: 'MH-01-GH-7788' },
]

const SEED_ROWS = [
  { vehicle: 'MH-12-AB-1234', revenue: 142000, fuelCost: 38400, maintenanceCost: 6200, otherCost: 2100, distanceKm: 9800, fuelLitres: 1180 },
  { vehicle: 'MH-14-CD-9911', revenue: 98000, fuelCost: 29500, maintenanceCost: 0, otherCost: 1600, distanceKm: 7400, fuelLitres: 910 },
  { vehicle: 'MH-12-EF-5522', revenue: 76000, fuelCost: 33200, maintenanceCost: 18500, otherCost: 900, distanceKm: 6100, fuelLitres: 880 },
  { vehicle: 'MH-01-GH-7788', revenue: 118000, fuelCost: 41000, maintenanceCost: 24000, otherCost: 3200, distanceKm: 8600, fuelLitres: 1090 },
]

const COST_COLORS = {
  Fuel: '#2a78d6',
  Maintenance: '#eda100',
  'Tolls & Other': '#1baf7a',
}

const Report = () => {
  const [filters, setFilters] = useState({
    reportType: 'roi',
    from: '',
    to: '',
    vehicleId: '',
  })

  // Apply the vehicle filter to the working row set.
  const rows = useMemo(() => {
    if (!filters.vehicleId) return SEED_ROWS
    const reg = VEHICLES.find((v) => String(v.id) === String(filters.vehicleId))?.regNumber
    return SEED_ROWS.filter((r) => r.vehicle === reg)
  }, [filters.vehicleId])

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

      <ReportFilter filters={filters} vehicles={VEHICLES} onChange={setFilters} />

      <CostBreakdownChart data={costBreakdown} />

      <div>
        <p className="eyebrow">Per vehicle</p>
        <h2 className="mb-3 mt-0.5 text-[15px] font-semibold text-stone-800">Return on Investment</h2>
        <ROITable rows={rows} />
      </div>
    </div>
  )
}

export default Report