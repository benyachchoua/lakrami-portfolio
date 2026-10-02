import React, { useState } from 'react'
import { 
  RocketLaunchIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  ComputerDesktopIcon,
  XMarkIcon,
  CalendarIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

const ProjectsSection = ({ sections }) => {
  const [selectedProject, setSelectedProject] = useState(null)
  const projectsSection = sections.find(section => section.id === 'projets')
  
  if (!projectsSection || !projectsSection.visible) return null

  // Utiliser le contenu de la base de données au lieu des données codées en dur
  const projectsData = projectsSection.content && projectsSection.content.length > 0 
    ? projectsSection.content 
    : [
        // Données par défaut si la base de données est vide
        {
          id: 1,
          title: "Réinvention et valorisation du patrimoine d'El Jadida",
          category: "Recherche Territoriale",
          year: "2024",
          status: "Terminé",
          icon: BuildingOffice2Icon,
          color: "from-blue-500 to-cyan-500",
          description: "Membre d'équipe de recherche du projet « Réinvention et valorisation du patrimoine d'El Jadida : Impact des dynamiques économiques et culturelles sur le développement territorial et les transformations sociales », retenu dans le cadre de l'appel à projet PROGRES Edition 2024",
          details: {
            type: "Projet de recherche",
            financement: "PROGRES Edition 2024",
            role: "Membre d'équipe de recherche",
            objectifs: [
              "Étudier l'impact des dynamiques économiques sur le patrimoine",
              "Analyser les transformations sociales liées au développement territorial",
              "Proposer des stratégies de valorisation du patrimoine"
            ]
          }
        },
        {
          id: 2,
          title: "Open2SUSTAIN - Erasmus+",
          category: "Éducation Durable",
          year: "2023",
          status: "Terminé",
          icon: GlobeAltIcon,
          color: "from-green-500 to-teal-500",
          description: "Membre du projet Erasmus+ CBHE : « Developing SDG Literacy through innovative open Learning within Higher Education in the Euro Mediterranean Region - Open2SUSTAIN »",
          details: {
            type: "Projet Erasmus+ CBHE",
            financement: "Union Européenne - Programme Erasmus+",
            role: "Membre du projet",
            region: "Euro-Méditerranéenne",
            objectifs: [
              "Développer la littératie des ODD dans l'enseignement supérieur",
              "Créer des ressources d'apprentissage ouvert innovantes",
              "Renforcer la coopération euro-méditerranéenne"
            ]
          }
        },
        {
          id: 3,
          title: "CORETEV - Technologies en Évaluation",
          category: "Innovation Pédagogique",
          year: "2020-2024",
          status: "Terminé",
          icon: AcademicCapIcon,
          color: "from-purple-500 to-pink-500",
          description: "Membre du projet CORETEV (CO-construction Nord-Sud d'un Réseau d'Expertises pour l'utilisation des nouvelles Technologies en Evaluation des apprentissages et des enseignements) sur l'ingénierie de l'évaluation cofinancé par le programme ERASMUS+ de l'union européenne",
          details: {
            type: "Projet Erasmus+ de coopération",
            financement: "Union Européenne - Programme Erasmus+",
            role: "Membre du projet",
            durée: "2020-2024",
            objectifs: [
              "Co-construire un réseau d'expertises Nord-Sud",
              "Développer l'usage des nouvelles technologies en évaluation",
              "Former aux nouvelles méthodes d'évaluation des apprentissages"
            ]
          }
        },
        {
          id: 4,
          title: "MOOC SPOC prépa-TP",
          category: "Formation Numérique",
          year: "2019",
          status: "Terminé",
          icon: ComputerDesktopIcon,
          color: "from-orange-500 to-red-500",
          description: "Coordinatrice d'un Projet MOOC « SPOC prépa-TP : Initiation aux mesures électriques », sélectionné par le ministère de l'éducation nationale dans le cadre de la mise en place de « MAROC Université Numérique »",
          details: {
            type: "MOOC/SPOC",
            financement: "Ministère de l'Éducation Nationale",
            role: "Coordinatrice",
            plateforme: "MAROC Université Numérique (www.mun.ma)",
            objectifs: [
              "Initier aux mesures électriques",
              "Préparer aux travaux pratiques",
              "Développer l'apprentissage numérique au Maroc"
            ]
          }
        },
        {
          id: 5,
          title: "Projets de Digitalisation Universitaire",
          category: "Transformation Digitale",
          year: "2022-2023",
          status: "Terminé",
          icon: SparklesIcon,
          color: "from-indigo-500 to-purple-500",
          description: "Projets en tant que directrice du pôle de digitalisation de l'université Chouaib Doukkali",
          details: {
            type: "Projets institutionnels",
            role: "Directrice du pôle de digitalisation",
            établissements: "8 établissements de l'université",
            projets: [
              {
                nom: "Plateforme Moodle LMS",
                description: "Mise en œuvre d'un Learning Management System pour les 8 établissements"
              },
              {
                nom: "Plateforme de guichet unique",
                description: "Portail centralisé pour candidatures Licences & Masters"
              },
              {
                nom: "Gestion des visiteurs Datacenter",
                description: "Application de gestion centralisée des interventions"
              },
              {
                nom: "Récupération d'emails académiques",
                description: "Solution automatique de récupération de mots de passe"
              },
              {
                nom: "Configuration VPN",
                description: "Déploiement VPN site-to-site pour accès sécurisé Apogée"
              },
              {
                nom: "Google Workspace",
                description: "Gestion de plus de 30 000 comptes académiques"
              }
            ]
          }
        }
      ]

  // SUPPRIMER COMPLÈTEMENT la seconde déclaration de projectsData qui commence à la ligne 151
  // et se termine à la ligne 268 (tout le tableau hardcodé dupliqué)

  return (
    <section id="projects" className="section-padding bg-gradient-to-b from-slate-50 to-white">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold mb-6">
            <RocketLaunchIcon className="h-4 w-4 mr-2" />
            Innovation & Collaboration
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Mes <span className="text-gradient">Projets</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Découvrez mes contributions à des projets de recherche, d'innovation pédagogique 
            et de transformation digitale dans l'enseignement supérieur.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => {
            const IconComponent = project.icon
            return (
              <div 
                key={project.id}
                className="group card p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedProject(project)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${project.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'En cours' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status}
                      </span>
                      <div className="text-sm text-slate-500 mt-1">{project.year}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <div className="text-sm font-medium text-slate-600 mb-3">
                      {project.category}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={`w-16 h-1 bg-gradient-to-r ${project.color} rounded-full group-hover:w-24 transition-all duration-300`}></div>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Project Detail Popup */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Popup Header */}
              <div className={`flex items-center justify-between p-6 bg-gradient-to-r ${selectedProject.color} text-white`}>
                <div className="flex items-center">
                  <selectedProject.icon className="h-8 w-8 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                    <p className="text-blue-100">{selectedProject.category} • {selectedProject.year}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
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
                    <p className="text-slate-700 leading-relaxed">{selectedProject.description}</p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-slate-500">Type de projet</span>
                        <p className="text-slate-900 font-medium">{selectedProject.details.type}</p>
                      </div>
                      {selectedProject.details.financement && (
                        <div>
                          <span className="text-sm font-medium text-slate-500">Financement</span>
                          <p className="text-slate-900 font-medium">{selectedProject.details.financement}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-slate-500">Mon rôle</span>
                        <p className="text-slate-900 font-medium">{selectedProject.details.role}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedProject.details.durée && (
                        <div>
                          <span className="text-sm font-medium text-slate-500">Durée</span>
                          <p className="text-slate-900 font-medium">{selectedProject.details.durée}</p>
                        </div>
                      )}
                      {selectedProject.details.établissements && (
                        <div>
                          <span className="text-sm font-medium text-slate-500">Établissements</span>
                          <p className="text-slate-900 font-medium">{selectedProject.details.établissements}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-slate-500">Statut</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          selectedProject.status === 'En cours' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedProject.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Objectifs */}
                  {selectedProject.details.objectifs && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Objectifs</h3>
                      <ul className="space-y-2">
                        {selectedProject.details.objectifs.map((objectif, index) => (
                          <li key={index} className="flex items-start">
                            <div className={`w-2 h-2 bg-gradient-to-r ${selectedProject.color} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                            <span className="text-slate-700">{objectif}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Projets spécifiques (pour digitalisation) */}
                  {selectedProject.details.projets && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Projets Réalisés</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedProject.details.projets.map((projet, index) => (
                          <div key={index} className="p-4 bg-slate-50 rounded-lg">
                            <h4 className="font-semibold text-slate-900 mb-2">{projet.nom}</h4>
                            <p className="text-sm text-slate-600">{projet.description}</p>
                          </div>
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

export default ProjectsSection