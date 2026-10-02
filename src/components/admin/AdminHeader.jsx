import { Link } from 'react-router-dom'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { usePortfolio } from '../../contexts/PortfolioContext'

const AdminHeader = () => {
  const { user, signOut } = useAuth()
  const { portfolioData } = usePortfolio()
  const profile = portfolioData?.profile || {}
  const initials = `${profile.prenom?.[0] || ''}${profile.nom?.[0] || ''}` || 'A'

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-inner">
        <Link to="/admin" className="admin-brand">
          <span className="brand-monogram" aria-hidden="true">{initials}</span>
          <span><strong>Administration</strong><small>Portfolio académique</small></span>
        </Link>
        <div className="admin-user">
          <span className="admin-user-email" title={user?.email}>{user?.email}</span>
          <button type="button" onClick={signOut} className="btn-secondary"><ArrowRightOnRectangleIcon aria-hidden="true" /><span className="admin-logout-label">Déconnexion</span></button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
