import { Link, Outlet } from 'react-router-dom'
import { RailIcon } from '../components/Icons'
import { ToastRegion } from '../components/ToastRegion'

export function AuthLayout() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between bg-slate-900 px-6 py-8 sm:px-10 lg:px-14">
          <Link to="/login" className="flex w-fit items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-amber-400 text-slate-950">
              <RailIcon />
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-wide text-amber-300">
                RailOps
              </span>
              <span className="block text-xl font-semibold">Track Admin</span>
            </span>
          </Link>
          <div className="my-12 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">
              Secure operations
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Control rail assets with authenticated access.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Sign in to manage trains, lines, tracks, and network statistics through
              protected JWT-backed API requests.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <span className="rounded-md border border-slate-700 px-3 py-2">JWT session</span>
            <span className="rounded-md border border-slate-700 px-3 py-2">Protected routes</span>
            <span className="rounded-md border border-slate-700 px-3 py-2">Bearer API calls</span>
          </div>
        </section>
        <section className="flex items-center justify-center bg-slate-100 px-4 py-10 text-slate-900 sm:px-6">
          <Outlet />
        </section>
      </div>
      <ToastRegion />
    </main>
  )
}
