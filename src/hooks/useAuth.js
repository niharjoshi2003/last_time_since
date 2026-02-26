import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      setError(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    setError(null)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      return { user: data.user, error: null }
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign up'
      setError(errorMessage)
      return { user: null, error: errorMessage }
    }
  }

  const signIn = async (email, password) => {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    setError(null)
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      return { user: data.user, error: null }
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign in'
      setError(errorMessage)
      return { user: null, error: errorMessage }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      return { error: 'Supabase not configured' }
    }

    setError(null)
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      return { error: null }
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign out'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  const signInWithMagicLink = async (email) => {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    setError(null)
    try {
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })

      if (magicLinkError) throw magicLinkError

      return { error: null }
    } catch (err) {
      const errorMessage = err.message || 'Failed to send magic link'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    signInWithMagicLink,
  }
}
