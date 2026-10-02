import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { apiRequest, jsonRequest } from '../utils/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    // Legacy browser identity is never accepted as authentication.
    try { localStorage.removeItem('portfolio_user') } catch { /* Storage may be disabled. */ }
    const expireSession = () => setUser(null)
    window.addEventListener('portfolio:session-expired', expireSession)
    apiRequest('/api/auth/session', { signal: controller.signal })
      .then(result => { if (!controller.signal.aborted) setUser(result.user || null) })
      .catch(() => { if (!controller.signal.aborted) setUser(null) })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
          setInitialized(true)
        }
      })
    return () => {
      controller.abort()
      window.removeEventListener('portfolio:session-expired', expireSession)
    }
  }, [])

  const signIn = async (email, password) => {
    setLoading(true)
    try {
      if (!email?.trim() || !password) throw new Error('Email et mot de passe requis')
      const result = await apiRequest('/api/auth/signin', jsonRequest('POST', { email: email.trim(), password }))
      if (!result.user?.id) throw new Error('Réponse de connexion invalide')
      setUser(result.user)
      toast.success('Connexion réussie !')
      return { data: result.user, error: null }
    } catch (error) {
      toast.error(error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await apiRequest('/api/auth/signout', jsonRequest('POST', {}))
      setUser(null)
      toast.success('Déconnexion réussie !')
      return { success: true }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, initialized, signIn, signOut }}>{children}</AuthContext.Provider>
}