
const escapeCell = (value) => {
  const s = value == null ? '' : String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const toCsv = (rows, columns) => {
  const cols =
    columns ||
    (rows[0] ? Object.keys(rows[0]).map((key) => ({ key, label: key })) : [])
  const header = cols.map((c) => escapeCell(c.label)).join(',')
  const body = rows
    .map((row) => cols.map((c) => escapeCell(row[c.key])).join(','))
    .join('\n')
  return `${header}\n${body}`
}

const ExportCSV = ({ rows = [], columns, filename = 'report.csv', label = 'Export CSV' }) => {
  const handleExport = () => {
    if (!rows.length) return
    const csv = toCsv(rows, columns)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      disabled={!rows.length}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      ↓ {label}
    </button>
  )
}

export default ExportCSV