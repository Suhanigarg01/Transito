/**
 * Visual stepper for a trip's lifecycle: Draft -> Dispatched -> Completed.
 * A cancelled trip is shown as a terminal red state instead of the track.
 *
 * Props:
 *  - status : 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled'
 */
const FLOW = ['Draft', 'Dispatched', 'Completed']

const TripStatusStepper = ({ status = 'Draft' }) => {
  if (status === 'Cancelled') {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
        <span className="h-2 w-2 rounded-full bg-red-600" /> Cancelled
      </div>
    )
  }

  const activeIndex = Math.max(0, FLOW.indexOf(status))

  return (
    <ol className="flex items-center">
      {FLOW.map((step, i) => {
        const done = i < activeIndex
        const current = i === activeIndex
        return (
          <li key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  done
                    ? 'bg-blue-600 text-white'
                    : current
                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {done ? '✓' : i + 1}
              </span>
              <span className={`mt-1 text-xs ${
                current ? 'font-medium text-blue-700' : 'text-gray-500'}`}>
                {step}
              </span>
            </div>
            {i < FLOW.length - 1 && (
              <span className={`mx-2 h-0.5 w-8 ${i < activeIndex ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default TripStatusStepper