import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import AuthShell, { Field, inputClass, primaryBtn } from '../components/AuthShell'

export default function Signup() {
  const { user, loading, refreshEmployer } = useAuth()
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [website, setWebsite] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && user) return <Navigate to="/employer" replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) return setError('Use at least 8 characters for your password.')
    setBusy(true)
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    if (err || !data.user) {
      setBusy(false)
      return setError(err?.message || 'Could not create the account.')
    }
    if (!data.session) {
      setBusy(false)
      return setError('Email confirmation is still turned on in Supabase. Turn it off under Authentication > Providers > Email.')
    }
    const { error: profileErr } = await supabase.from('employers').insert({
      id: data.user.id,
      company_name: company.trim(),
      website: website.trim() || null,
    })
    setBusy(false)
    if (profileErr) return setError('Account created, but the company profile failed: ' + profileErr.message)
    await refreshEmployer()
    navigate('/employer/post', { replace: true })
  }

  return (
    <AuthShell
      title="Create an employer account"
      subtitle="Post roles with a verified experience level."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-dark underline">Log in</Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Company name">
          <input required value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Company website" hint="Optional">
          <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} placeholder="https://" />
        </Field>
        <Field label="Work email">
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Password" hint="At least 8 characters">
          <input type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </Field>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button type="submit" disabled={busy} className={primaryBtn}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}