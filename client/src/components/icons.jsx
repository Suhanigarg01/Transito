/**
 * Small hand-rolled stroke icons (currentColor, 1.6px) — kept in-house so the
 * nav doesn't rely on emoji or a heavy icon package.
 */
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const DashboardIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="7" height="8" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="11" width="7" height="10" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

export const VehiclesIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>
)

export const DriversIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M4 20c0-3 2.2-5 5-5s5 2 5 5" />
    <path d="M16 4.5a3 3 0 0 1 0 6M19 20c0-2.6-1.4-4.4-3.5-4.9" />
  </svg>
)

export const TripsIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="6" r="2.2" />
    <circle cx="18" cy="18" r="2.2" />
    <path d="M8 6h6a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H10a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h6" />
  </svg>
)

export const MaintenanceIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M14.5 6a3.5 3.5 0 0 0-4.6 4.3l-5.6 5.6a1.8 1.8 0 1 0 2.5 2.5l5.6-5.6A3.5 3.5 0 0 0 18 8.5l-2.3 2.3-1.7-1.7L16.3 6.8A3.5 3.5 0 0 0 14.5 6z" />
  </svg>
)

export const ExpensesIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 3h12v18l-2-1.3L14 21l-2-1.3L10 21l-2-1.3L6 21z" />
    <path d="M9 8h6M9 12h6" />
  </svg>
)

export const ReportsIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <rect x="8" y="11" width="3" height="6" rx="0.6" />
    <rect x="14" y="7" width="3" height="10" rx="0.6" />
  </svg>
)

export const GaugeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 15a8 8 0 0 1 16 0" />
    <path d="M4 15h2M18 15h2M12 5V4M6.5 8.5l-1-1M17.5 8.5l1-1" />
    <path d="M12 15l4-3" />
    <circle cx="12" cy="15" r="1.3" />
  </svg>
)

export const ClockIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l2.5 1.5" />
  </svg>
)

export const MenuIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const BellIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
)

export const SearchIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-3.2-3.2" />
  </svg>
)

export const CloseIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
