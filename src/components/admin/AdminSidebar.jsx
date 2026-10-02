import { NavLink } from 'react-router-dom'
import { AcademicCapIcon, ArrowTopRightOnSquareIcon, DocumentTextIcon, Squares2X2Icon, UserIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Tableau de bord', href: '/admin', icon: Squares2X2Icon, end: true },
  { name: 'Profil', href: '/admin/profile', icon: UserIcon },
  { name: 'Sections', href: '/admin/sections', icon: DocumentTextIcon },
  { name: 'Mes cours', href: '/admin/courses', icon: AcademicCapIcon },
]

const AdminSidebar = () => (
  <aside className="admin-sidenav">
    <nav aria-label="Navigation de l’administration">
      <p className="admin-sidenav-label">Gestion</p>
      <ul>
        {navigation.map(item => (
          <li key={item.href}>
            <NavLink to={item.href} end={item.end}><item.icon aria-hidden="true" />{item.name}</NavLink>
          </li>
        ))}
      </ul>
      <div className="admin-sidenav-footer">
        <a href="/" target="_blank" rel="noopener noreferrer"><ArrowTopRightOnSquareIcon aria-hidden="true" />Voir le site<span className="sr-only"> (nouvel onglet)</span></a>
      </div>
    </nav>
  </aside>
)

export default AdminSidebar
