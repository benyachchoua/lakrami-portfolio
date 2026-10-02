import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  PhotoIcon,
  ChartBarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const AdminSidebar = () => {
  const navigation = [
    { name: 'Tableau de bord', href: '/admin', icon: ChartBarIcon, exact: true },
    { name: 'Profil', href: '/admin/profile', icon: UserIcon },
    { name: 'Mes Cours', href: '/admin/courses', icon: AcademicCapIcon },
    { name: 'Sections', href: '/admin/sections', icon: DocumentTextIcon },
  ]

  return (
    <aside className="w-full md:w-64 shrink-0 bg-white shadow-sm border-b md:border-b-0 md:border-r border-gray-200 md:min-h-screen">
      {/* Horizontal scrolling tab bar on phones, vertical sidebar from md up. */}
      <nav className="flex md:block gap-1 overflow-x-auto p-2 md:p-4">
        <div className="flex md:block gap-1 md:space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center shrink-0 whitespace-nowrap min-h-[44px] px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </div>
        
        <div className="md:mt-8 md:pt-8 md:border-t border-gray-200">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center shrink-0 whitespace-nowrap min-h-[44px] px-4 py-3 text-sm font-medium text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 rounded-lg transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-3" />
            Voir le site
          </a>
        </div>
      </nav>
    </aside>
  )
}

export default AdminSidebar