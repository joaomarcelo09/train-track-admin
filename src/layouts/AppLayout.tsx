import { NavLink, Outlet } from 'react-router-dom'
import { ToastRegion } from '../components/ToastRegion'
import { GaugeIcon, LineIcon, RailIcon, TrainIcon } from '../components/Icons'
import { useBootstrapData } from '../hooks/useBootstrapData'
import { useAuthStore } from '../stores/authStore'

const navItems = [
  { to: '/', label: 'Dashboard', icon: GaugeIcon },
  { to: '/trains', label: 'Trains', icon: TrainIcon },
  { to: '/lines', label: 'Lines', icon: LineIcon },
  { to: '/tracks', label: 'Tracks', icon: RailIcon },
]

export function AppLayout() {
  useBootstrapData()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-x-0 top-0 z-30 border-b border-slate-800 bg-slate-950 text-white lg:inset-y-0 lg:right-auto lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center gap-3 px-5 lg:h-20">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-amber-400 text-slate-950">
            <RailIcon />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">RailOps</p>
            <p className="text-lg font-semibold">Track Admin</p>
          </div>
        </div>
        <nav aria-label="Primary navigation" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex min-w-max items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="hidden border-t border-slate-800 px-5 py-5 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <p className="truncate text-sm font-medium text-white">{user?.email}</p>
          <p className="mt-1 truncate text-xs text-slate-400">{user?.email}</p>
          <button
            type="button"
            className="mt-4 h-10 w-full rounded-md border border-slate-700 px-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="pt-28 lg:ml-64 lg:pt-0">
        <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">{user?.email}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
            <button
              type="button"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              onClick={logout}
            >
              Logout
            </button>
          </div>
          <Outlet />
        </div>
      </main>
      <ToastRegion />
    </div>
  )
}
