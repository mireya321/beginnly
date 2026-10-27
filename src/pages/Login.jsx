import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import AuthShell, { Field, inputClass, primaryBtn } from '../components/AuthShell'

export default function Login() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const next = location.state?.from || '/employer'
  if (!loading && user) return <Navigate to={next} replace />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (err) return setError('Wrong email or password.')
    navigate(next, { replace: true })
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your job listings."
      footer={
        <>
          New to Beginnly?{' '}
          <Link to="/signup" className="font-bold text-dark underline">
            Create an employer account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <input type="email" required autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@company.com" />
        </Field>
        <Field label="Password">
          <input type="password" required autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </Field>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button type="submit" disabled={busy} className={primaryBtn}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthShell>
  )
}