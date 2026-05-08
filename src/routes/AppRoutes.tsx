import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { AppLayout } from '../layouts/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'

const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const RegisterPage = lazy(() => import('../pages/RegisterPage'))
const TrainsPage = lazy(() => import('../pages/TrainsPage'))
const LinesPage = lazy(() => import('../pages/LinesPage'))
const LineDetailsPage = lazy(() => import('../pages/LineDetailsPage'))
const TracksPage = lazy(() => import('../pages/TracksPage'))
const SimulationPage = lazy(() => import('../pages/SimulationPage'))

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading workspace...</div>}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="trains" element={<TrainsPage />} />
            <Route path="lines" element={<LinesPage />} />
            <Route path="lines/:lineId" element={<LineDetailsPage />} />
            <Route path="tracks" element={<TracksPage />} />
            <Route path="simulation" element={<SimulationPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
