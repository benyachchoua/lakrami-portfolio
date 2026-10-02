import React, { useState } from 'react'
import { 
  ShieldCheckIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  AcademicCapIcon,
  XMarkIcon,
  CalendarIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'

const ResponsibilitiesSection = ({ sections }) => {
  const [selectedResponsibility, setSelectedResponsibility] = useState(null)
  const responsibilitiesSection = sections.find(section => section.id === 'responsabilites')
  
  if (!responsibilitiesSection || !responsibilitiesSection.visible) return null

  // Utiliser le contenu de la base de données au lieu des données codées en dur
  const responsibilitiesData = responsibilitiesSection.content && responsibilitiesSection.content.length > 0 
    ? responsibilitiesSection.content 
    : [
        // Données par défaut si la base de données est vide
        {
          id: 1,
          title: "Directrice du pôle de digitalisation",
          organization: "Université Chouaib Doukkali",
          period: "2023-2024",
          status: "Terminé",
          icon: CpuChipIcon,
          color: "from-blue-500 to-cyan-500",
          description: "Direction stratégique de la transformation digitale de l'université avec 8 établissements et plus de 30 000 utilisateurs",
          details: {
            type: "Direction stratégique",
            périmètre: "8 établissements universitaires",
            utilisateurs: "Plus de 30 000 comptes académiques",
            missions: [
              "Définir la stratégie de digitalisation de l'université",
              "Superviser la mise en œuvre des projets numériques",
              "Coordonner les équipes techniques et pédagogiques",
              "Assurer la formation aux outils numériques",
              "Gérer les infrastructures et plateformes digitales"
            ]
          }
        },
        {
          id: 2,
          title: "Responsable pédagogique Master SIGL",
          organization: "Faculté des Sciences El Jadida",
          period: "2020-2024",
          status: "Actuel",
          icon: AcademicCapIcon,
          color: "from-green-500 to-teal-500",
          description: "Coordination pédagogique du Master Systèmes d'Information et Génie Logiciel avec supervision de 120 étudiants",
          details: {
            type: "Responsabilité pédagogique",
            effectifs: "120 étudiants par promotion",
            spécialité: "Systèmes d'Information et Génie Logiciel",
            missions: [
              "Conception et mise à jour des programmes pédagogiques",
              "Coordination des équipes enseignantes",
              "Suivi académique et professionnel des étudiants",
              "Relations avec les entreprises partenaires",
              "Évaluation et amélioration continue des formations"
            ]
          }
        },
        {
          id: 3,
          title: "Coordinatrice des stages et projets",
          organization: "Faculté des Sciences El Jadida",
          period: "2019-2024",
          status: "Actuel",
          icon: UserGroupIcon,
          color: "from-purple-500 to-indigo-500",
          description: "Gestion des relations entreprises et coordination des stages professionnels pour plus de 200 étudiants annuellement",
          details: {
            type: "Coordination professionnelle",
            volume: "200+ stages par an",
            partenaires: "50+ entreprises partenaires",
            missions: [
              "Développement du réseau d'entreprises partenaires",
              "Placement et suivi des stagiaires",
              "Évaluation des projets de fin d'études",
              "Organisation des soutenances",
              "Médiation entreprises-étudiants"
            ]
          }
        },
        {
          id: 4,
          title: "Membre du conseil pédagogique",
          organization: "Faculté des Sciences El Jadida",
          period: "2018-2024",
          status: "Actuel",
          icon: BuildingOffice2Icon,
          color: "from-orange-500 to-red-500",
          description: "Participation aux décisions stratégiques de la faculté et contribution à l'évolution des programmes d'enseignement",
          details: {
            type: "Gouvernance académique",
            périmètre: "Faculté des Sciences",
            domaines: "Informatique et Mathématiques",
            missions: [
              "Validation des programmes pédagogiques",
              "Évaluation des enseignements",
              "Politique de recrutement enseignant",
              "Stratégie de développement académique",
              "Relations internationales académiques"
            ]
          }
        },
        {
          id: 5,
          title: "Responsable qualité pédagogique",
          organization: "Université Chouaib Doukkali",
          period: "2017-2023",
          status: "Terminé",
          icon: ShieldCheckIcon,
          color: "from-pink-500 to-rose-500",
          description: "Mise en place et supervision du système qualité pour l'amélioration continue des formations",
          details: {
            type: "Assurance qualité",
            périmètre: "Formations informatiques",
            certifications: "ISO 9001, référentiels nationaux",
            missions: [
              "Audit et évaluation des formations",
              "Mise en place des procédures qualité",
              "Formation des équipes aux standards qualité",
              "Reporting et tableaux de bord qualité",
              "Préparation aux accréditations"
            ]
          }
        }
      ]

  return (
    <section id="responsibilities" className="section-padding bg-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpolygon points=%2250 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40%22/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="container-max relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-blue-300 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <ShieldCheckIcon className="h-4 w-4 mr-2" />
            Leadership & Gouvernance
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Responsabilités </span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Administratives
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Mes fonctions de direction et de gouvernance dans l'enseignement supérieur 
            et la recherche scientifique.
          </p>
        </div>

        {/* Responsibilities Timeline */}
        <div className="space-y-8 mb-16">
          {responsibilitiesData.map((responsibility, index) => {
            const IconComponent = responsibility.icon
            return (
              <div 
                key={responsibility.id}
                className="group relative"
              >
                {/* Timeline Line */}
                {index < responsibilitiesData.length - 1 && (
                  <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-blue-400 to-transparent"></div>
                )}
                
                <div 
                  className="flex items-start space-x-6 p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                  onClick={() => setSelectedResponsibility(responsibility)}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${responsibility.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                          {responsibility.title}
                        </h3>
                        <p className="text-blue-300 font-medium mb-1">{responsibility.organization}</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-slate-300 text-sm">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {responsibility.period}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            responsibility.status === 'Actuel' 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {responsibility.status}
                          </span>
                        </div>
                      </div>
                      <ArrowTopRightOnSquareIcon className="h-5 w-5 text-slate-400 group-hover:text-blue-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                    
                    <p className="text-slate-300 leading-relaxed">
                      {responsibility.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Statistics supprimées */}
        {/* Responsibility Detail Popup */}
        {selectedResponsibility && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Popup Header */}
              <div className={`flex items-center justify-between p-6 bg-gradient-to-r ${selectedResponsibility.color} text-white`}>
                <div className="flex items-center">
                  <selectedResponsibility.icon className="h-8 w-8 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedResponsibility.title}</h2>
                    <p className="text-blue-100">{selectedResponsibility.organization} • {selectedResponsibility.period}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResponsibility(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Popup Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Description</h3>
                    <p className="text-slate-700 leading-relaxed">{selectedResponsibility.description}</p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-slate-500">Type de responsabilité</span>
                        <p className="text-slate-900 font-medium">{selectedResponsibility.details.type}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-500">Période</span>
                        <p className="text-slate-900 font-medium">{selectedResponsibility.period}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-500">Statut</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          selectedResponsibility.status === 'Actuel' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedResponsibility.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedResponsibility.details.périmètre && (
                        <div>
                          <span className="text-sm font-medium text-slate-500">Périmètre</span>
                          <p className="text-slate-900 font-medium">{selectedResponsibility.details.périmètre}</p>
                        </div>
                      )}
                      {selectedResponsibility.details.utilisateurs && (
                        <div>
                          <span className="text-sm font-medium text-slate-500">Utilisateurs</span>
                          <p className="text-slate-900 font-medium">{selectedResponsibility.details.utilisateurs}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Missions */}
                  {selectedResponsibility.details.missions && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Missions principales</h3>
                      <ul className="space-y-2">
                        {selectedResponsibility.details.missions.map((mission, index) => (
                          <li key={index} className="flex items-start">
                            <div className={`w-2 h-2 bg-gradient-to-r ${selectedResponsibility.color} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                            <span className="text-slate-700">{mission}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Réalisations */}
                  {selectedResponsibility.details.réalisations && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Principales réalisations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedResponsibility.details.réalisations.map((realisation, index) => (
                          <div key={index} className="p-4 bg-slate-50 rounded-lg">
                            <p className="text-sm text-slate-700">{realisation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Domaines/Thématiques */}
                  {(selectedResponsibility.details.domaines || selectedResponsibility.details.thématiques) && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">
                        {selectedResponsibility.details.domaines ? 'Domaines de recherche' : 'Thématiques de recherche'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(selectedResponsibility.details.domaines || selectedResponsibility.details.thématiques).map((item, index) => (
                          <span key={index} className={`px-3 py-1 bg-gradient-to-r ${selectedResponsibility.color} text-white rounded-full text-sm font-medium`}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ResponsibilitiesSection