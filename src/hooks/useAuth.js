import { useState, useEffect } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    if (!supabaseConfigured) { setUser(null); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password })

  const signOut = () => supabase.auth.signOut()

  return { user, signIn, signUp, signOut }
}
