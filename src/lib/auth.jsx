import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [employer, setEmployer] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadEmployer = useCallback(async (user) => {
    if (!user) {
      setEmployer(null)
      return
    }
    const { data } = await supabase
      .from('employers')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    setEmployer(data || null)
  }, [])

  useEffect(() => {
    let alive = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!alive) return
      setSession(data.session)
      await loadEmployer(data.session?.user)
      if (alive) setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      // defer: do not call supabase inside the auth callback
      setTimeout(() => loadEmployer(s?.user), 0)
    })
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [loadEmployer])

  const value = {
    user: session?.user ?? null,
    session,
    employer,
    loading,
    refreshEmployer: () => loadEmployer(session?.user),
    signOut: () => supabase.auth.signOut(),
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}