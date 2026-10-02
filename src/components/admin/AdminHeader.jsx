import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

const AdminHeader = () => {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Administration Portfolio
            </h1>
            <p className="text-secondary-600">
              Gestion du contenu et des sections
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <UserCircleIcon className="h-8 w-8 text-secondary-400 mr-2" />
              <div>
                <div className="text-sm font-medium text-secondary-900">
                  {user?.email}
                </div>
                <div className="text-xs text-secondary-500">
                  Administrateur
                </div>
              </div>
              <div className="text-xs text-green-600 ml-2">
                ● En ligne
              </div>
            </div>
            
            <button
              onClick={signOut}
              className="flex items-center text-secondary-600 hover:text-red-600 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader