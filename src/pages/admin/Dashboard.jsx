import React from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { 
  EyeIcon,
  DocumentTextIcon,
  PhotoIcon,
  UserIcon,
  ChartBarIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CogIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { portfolioData } = usePortfolio()

  const stats = [
    {
      name: 'Sections visibles',
      value: portfolioData.sections.filter(s => s.visible).length,
      total: portfolioData.sections.length,
      icon: EyeIcon,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Total sections',
      value: portfolioData.sections.length,
      icon: DocumentTextIcon,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Profil complété',
      value: '100%',
      icon: UserIcon,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      change: 'Complet',
      changeType: 'neutral'
    },
    {
      name: 'Médias',
      value: '1',
      icon: PhotoIcon,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50',
      change: 'Stable',
      changeType: 'neutral'
    }
  ]

  const quickActions = [
    {
      title: 'Modifier le profil',
      description: 'Mettre à jour vos informations personnelles',
      href: '/admin/profile',
      icon: UserIcon,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Gérer mes cours',
      description: 'Ajouter ou modifier vos enseignements',
      href: '/admin/courses',
      icon: DocumentTextIcon,
      gradient: 'from-purple-500 to-indigo-600',
      bgGradient: 'from-purple-50 to-indigo-50'
    },
    {
      title: 'Gérer les sections',
      description: 'Organiser le contenu de votre portfolio',
      href: '/admin/sections',
      icon: CogIcon,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    {
      title: 'Prévisualiser',
      description: 'Voir votre portfolio en ligne',
      href: '/',
      icon: EyeIcon,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50',
      external: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header moderne */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 rounded-3xl mx-6 mt-6 mb-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl mr-4">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Tableau de bord
                  </h1>
                  <p className="text-blue-100 text-lg">
                    Vue d'ensemble de votre portfolio académique
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <div>
                      <p className="text-white font-medium">Portfolio en ligne</p>
                      <p className="text-blue-100 text-sm">Synchronisation automatique</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Éléments décoratifs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
      </div>

      <div className="px-6 space-y-8">
        {/* Statistiques modernes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.name} 
              className={`group relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${stat.gradient} rounded-xl shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stat.changeType === 'positive' ? 'bg-green-100 text-green-700' :
                    stat.changeType === 'negative' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                    {stat.total && <span className="text-lg text-gray-500 ml-1">/{stat.total}</span>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* État des sections */}
          <div className="xl:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mr-3">
                  <ChartBarIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">État des sections</h3>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {portfolioData.sections.map((section, index) => (
                  <div 
                    key={section.id} 
                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{section.title}</div>
                      <div className="text-sm text-gray-600 mb-1">Type: {section.type}</div>
                      <div className="text-xs text-gray-500">
                        Contenu: {
                          section.type === 'list' && Array.isArray(section.content) 
                            ? `${section.content.length} éléments`
                            : section.type === 'cards' && Array.isArray(section.content)
                              ? `${section.content.length} cartes`
                              : section.type === 'text' && section.content
                                ? `${section.content.length} caractères`
                                : 'Vide'
                        }
                      </div>
                    </div>
                    <div className="flex items-center ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        section.visible 
                          ? 'bg-green-100 text-green-800 shadow-sm' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {section.visible ? '✓ Visible' : '○ Masqué'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Informations du profil */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mr-3">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Profil</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl">
                  <span className="text-gray-600 font-medium">Nom complet</span>
                  <span className="font-bold text-gray-900">{portfolioData.profile.prenom} {portfolioData.profile.nom}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl">
                  <span className="text-gray-600 font-medium">Email</span>
                  <span className="font-bold text-gray-900 text-sm">{portfolioData.profile.email}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl">
                  <span className="text-gray-600 font-medium">Téléphone</span>
                  <span className="font-bold text-gray-900">{portfolioData.profile.gsm}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl">
                  <span className="text-gray-600 font-medium">Grade</span>
                  <span className="font-bold text-gray-900">Maître de Conférence</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides modernes */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl mr-3">
              <RocketLaunchIcon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Actions rapides</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <a
                key={action.title}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
                className={`group relative overflow-hidden bg-gradient-to-br ${action.bgGradient} rounded-2xl p-6 border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 group-hover:from-white/60 group-hover:to-white/20 transition-all duration-300"></div>
                <div className="relative">
                  <div className={`p-3 bg-gradient-to-r ${action.gradient} rounded-xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                      {action.title}
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                      {action.description}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard