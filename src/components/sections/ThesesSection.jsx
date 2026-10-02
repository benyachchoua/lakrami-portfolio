import React, { useState } from 'react'
import { 
  AcademicCapIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  ComputerDesktopIcon,
  BeakerIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const ThesesSection = ({ sections }) => {
  const [selectedThesis, setSelectedThesis] = useState(null)
  const thesesSection = sections.find(section => section.id === 'theses-encadrees')
  
  if (!thesesSection || !thesesSection.visible || !thesesSection.content) return null

  const thesesData = thesesSection.content

  const getDomainIcon = (domain) => {
    if (domain.includes('Réseaux')) return ComputerDesktopIcon
    if (domain.includes('E-learning')) return BeakerIcon
    return AcademicCapIcon
  }

  const getStatusIcon = (status) => {
    return status === 'Soutenue' ? CheckCircleIcon : ClockIcon
  }

  const getStatusColor = (status) => {
    return status === 'Soutenue' ? 'text-green-600' : 'text-orange-600'
  }

  return (
    <section id="theses" className="section-padding bg-gradient-to-b from-purple-50 to-white">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-6">
            <AcademicCapIcon className="h-4 w-4 mr-2" />
            Encadrement Doctoral
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Thèses <span className="text-gradient">Encadrées</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Accompagnement de doctorants dans leurs recherches en réseaux informatiques, 
            sécurité et intelligence artificielle appliquée à l'éducation.
          </p>
        </div>

        {/* Theses by Domain */}
        <div className="space-y-16">
          {Object.entries(thesesData).map(([domain, theses], domainIndex) => {
            const DomainIcon = getDomainIcon(domain)
            const gradientColors = domainIndex === 0 
              ? 'from-blue-500 to-cyan-500' 
              : 'from-purple-500 to-pink-500'

            return (
              <div key={domain} className="">
                {/* Domain Header */}
                <div className="flex items-center mb-12">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${gradientColors} shadow-lg`}>
                    <DomainIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold text-slate-900">{domain}</h3>
                    <p className="text-slate-600 mt-1">{theses.length} thèse{theses.length > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Theses Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {theses.map((thesis) => {
                    const StatusIcon = getStatusIcon(thesis.statut)
                    
                    return (
                      <div 
                        key={thesis.id}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-slate-200 cursor-pointer"
                        onClick={() => setSelectedThesis(thesis)}
                      >
                        <div className={`h-2 bg-gradient-to-r ${thesis.color}`}></div>
                        
                        <div className="p-8">
                          {/* Status Badge */}
                          <div className="flex items-center justify-between mb-4">
                            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(thesis.statut)} bg-opacity-10`}>
                              <StatusIcon className={`h-4 w-4 mr-2 ${getStatusColor(thesis.statut)}`} />
                              {thesis.statut}
                            </div>
                            <span className="text-slate-500 text-sm font-medium">{thesis.annee}</span>
                          </div>

                          {/* Thesis Title */}
                          <h4 className="text-lg font-semibold text-slate-900 mb-4 line-clamp-3 group-hover:text-primary-600 transition-colors">
                            {thesis.sujet}
                          </h4>

                          {/* Read More */}
                          <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700 transition-colors">
                            <span>Voir détails</span>
                            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Statistics - SECTION SUPPRIMÉE */}
        {/* 
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {Object.values(thesesData).flat().filter(t => t.statut === 'Soutenue').length}
            </div>
            <div className="text-slate-600 font-medium">Thèses Soutenues</div>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {Object.values(thesesData).flat().filter(t => t.statut === 'En cours').length}
            </div>
            <div className="text-slate-600 font-medium">Thèses En Cours</div>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {Object.keys(thesesData).length}
            </div>
            <div className="text-slate-600 font-medium">Domaines de Recherche</div>
          </div>
        </div>
        */}
      </div>

      {/* Thesis Detail Modal */}
      {selectedThesis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${selectedThesis.color}`}>
                  <AcademicCapIcon className="h-6 w-6 text-white" />
                </div>
                <button
                  onClick={() => setSelectedThesis(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-slate-400" />
                </button>
              </div>

              <div className="mb-6">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedThesis.statut)} bg-opacity-10 mb-4`}>
                  {React.createElement(getStatusIcon(selectedThesis.statut), { className: `h-4 w-4 mr-2 ${getStatusColor(selectedThesis.statut)}` })}
                  {selectedThesis.statut} - {selectedThesis.annee}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {selectedThesis.sujet}
                </h3>
                
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed">
                    Cette thèse s'inscrit dans le cadre de mes recherches en {' '}
                    {selectedThesis.sujet.toLowerCase().includes('réseau') ? 'réseaux informatiques et sécurité' : 'e-learning et intelligence artificielle'}.
                    L'encadrement doctoral permet d'approfondir les aspects théoriques et pratiques 
                    de cette problématique de recherche.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ThesesSection