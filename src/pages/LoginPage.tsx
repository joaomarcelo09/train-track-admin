import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { FormField } from '../components/FormField'
import { loginSchema } from '../schemas/authSchema'
import { useAuthStore } from '../stores/authStore'
import { useUiStore } from '../stores/uiStore'

type LocationState = {
  from?: {
    pathname?: string
  }
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const showToast = useUiStore((state) => state.showToast)
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)
    const parsed = loginSchema.safeParse(values)

    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message])))
      return
    }

    setErrors({})
    try {
      await login(parsed.data)
      showToast('success', 'Signed in')
      const state = location.state as LocationState | null
      navigate(state?.from?.pathname ?? '/', { replace: true })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Login failed')
      showToast('error', 'Login failed')
    }
  }

  return (
    <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
      <h1 className="text-2xl font-semibold text-slate-950">Login</h1>
      <p className="mt-2 text-sm text-slate-500">Access the protected rail operations dashboard.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={(event) => setValues((state) => ({ ...state, email: event.target.value }))}
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          error={errors.password}
          onChange={(event) => setValues((state) => ({ ...state, password: event.target.value }))}
        />
        {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in' : 'Login'}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Need an account?{' '}
        <Link className="font-semibold text-amber-700 hover:text-amber-800" to="/register">
          Register
        </Link>
      </p>
    </section>
  )
}

export default LoginPage
