/**
 * Coloured tag showing how close a driver's licence is to expiry.
 *  expired            -> critical (red)
 *  <= 30 days left    -> warning  (amber)
 *  otherwise          -> good     (green)
 *
 * Props:
 *  - expiryDate : ISO date string or Date
 */
const daysUntil = (date) => {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return null
  const ms = d.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)
  return Math.round(ms / 86_400_000)
}

const base =
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset'

const LicenseExpiryTag = ({ expiryDate }) => {
  const days = daysUntil(expiryDate)

  if (days == null) {
    return (
      <span className={`${base} bg-stone-100 text-stone-500 ring-stone-500/20`}>No date</span>
    )
  }

  let styles = 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
  let dot = '#0ca30c'
  let label = `Valid · ${days}d`
  if (days < 0) {
    styles = 'bg-red-50 text-red-700 ring-red-600/20'
    dot = '#d03b3b'
    label = `Expired ${Math.abs(days)}d ago`
  } else if (days <= 30) {
    styles = 'bg-amber-50 text-amber-700 ring-amber-600/20'
    dot = '#d98324'
    label = `Expires in ${days}d`
  }

  return (
    <span className={`${base} ${styles}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} />
      {label}
    </span>
  )
}

export default LicenseExpiryTag
