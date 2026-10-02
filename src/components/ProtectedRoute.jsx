import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { usePortfolio } from '../contexts/PortfolioContext'

const ProtectedRoute = ({ children }) => {
  const { user, initialized } = useAuth()
  const { ready, error, loadPortfolioData } = usePortfolio()
  const location = useLocation()

  if (!initialized || (user && !ready && !error)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p role="status">Chargement de votre espace…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!ready) return (
    <main className="min-h-screen flex flex-col gap-4 items-center justify-center p-6">
      <p role="alert">{error || 'Chargement des données impossible.'}</p>
      <button className="btn-primary" onClick={() => loadPortfolioData()}>Réessayer</button>
    </main>
  )

  return children
}

export default ProtectedRoute
