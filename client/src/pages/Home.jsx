import { Link } from 'react-router-dom'
import { isAuthenticated } from '../api/auth.api'

const Wordmark = () => (
  <Link to="/" className="flex items-center gap-2.5">
    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-accent)] font-display text-sm font-bold text-white">
      T
    </span>
    <span className="font-display text-lg font-semibold tracking-tight text-stone-900">
      Transit<span className="text-[var(--color-accent)]">Ops</span>
    </span>
  </Link>
)

// The four things the product actually does — kept terse on purpose.
const CAPABILITIES = [
  ['Vehicle registry', 'Reg, capacity, odometer and live status for every asset.'],
  ['Trip dispatch', 'Draft → dispatched → completed, with driver and vehicle cascades.'],
  ['Maintenance', 'Log service, take a vehicle off the road, track downtime.'],
  ['Cost & ROI', 'Fuel and repairs rolled up into per-vehicle return.'],
]

const Home = () => {
  const authed = isAuthenticated()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <Wordmark />
        <nav className="flex items-center gap-2 sm:gap-4">
          {authed ? (
            <Link
              to="/dashboard"
              className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
              >
                Create account
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16">
        <div className="max-w-2xl">
          <p className="eyebrow">Fleet operations, end to end</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-stone-900 sm:text-5xl">
            Keep the whole fleet moving from a single console.
          </h1>
          <p className="mt-5 font-serif text-lg leading-relaxed text-stone-600">
            TransitOps follows each vehicle and driver through the real trip
            lifecycle — draft, dispatch, completion — logs maintenance downtime,
            and turns fuel and repair costs into per-vehicle ROI.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {authed ? (
              <Link
                to="/dashboard"
                className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-white"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-stone-500">
            Role-based access for managers, drivers, safety officers and finance.
          </p>
        </div>
      </main>

      {/* Capability strip */}
      <section className="border-t border-stone-200/70">
        <div className="mx-auto grid w-full max-w-5xl gap-x-8 gap-y-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map(([title, desc]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200/70">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5 text-xs text-stone-400">
          <span>TransitOps — fleet operations</span>
          <span>Built for the people who keep the trucks rolling.</span>
        </div>
      </footer>
    </div>
  )
}

export default Home
