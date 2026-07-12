/**
 * Unified status pill used across every table and list. A coloured dot carries
 * the state alongside the label (never colour alone), on a soft tinted chip
 * with an inset ring for a little depth.
 *
 * Covers vehicle, driver, trip and maintenance statuses.
 */
const STATUS = {
  // green — healthy / done
  Available: ['#0ca30c', 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'],
  Completed: ['#0ca30c', 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'],
  Closed: ['#0ca30c', 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'],
  // accent ink-blue — active / in motion
  'On Trip': ['#2f4a7a', 'bg-[#eef1f7] text-[#2f4a7a] ring-[#2f4a7a]/20'],
  Dispatched: ['#2f4a7a', 'bg-[#eef1f7] text-[#2f4a7a] ring-[#2f4a7a]/20'],
  // amber — needs attention / off the road
  'In Shop': ['#d98324', 'bg-amber-50 text-amber-700 ring-amber-600/20'],
  Open: ['#d98324', 'bg-amber-50 text-amber-700 ring-amber-600/20'],
  // red — terminal negative
  Cancelled: ['#d03b3b', 'bg-red-50 text-red-700 ring-red-600/20'],
  Suspended: ['#d03b3b', 'bg-red-50 text-red-700 ring-red-600/20'],
  // neutral — idle
  'Off Duty': ['#78716c', 'bg-stone-100 text-stone-600 ring-stone-500/20'],
  Draft: ['#78716c', 'bg-stone-100 text-stone-600 ring-stone-500/20'],
}

const FALLBACK = ['#78716c', 'bg-stone-100 text-stone-600 ring-stone-500/20']

const StatusBadge = ({ status }) => {
  const [dot, cls] = STATUS[status] || FALLBACK
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} />
      {status || 'Unknown'}
    </span>
  )
}

export default StatusBadge
