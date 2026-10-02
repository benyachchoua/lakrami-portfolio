import React, { useState } from 'react'
import { 
  AcademicCapIcon,
  BookOpenIcon,
  ComputerDesktopIcon,
  SparklesIcon,
  ClockIcon,
  BuildingOffice2Icon,
  XMarkIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
  UserGroupIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

const TeachingSection = ({ sections }) => {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const teachingSection = sections.find(section => section.id === 'enseignement')
  
  if (!teachingSection || !teachingSection.visible) return null

  const getTeachingContent = () => {
    if (typeof teachingSection.content === 'string' && teachingSection.content.trim()) {
      return <div dangerouslySetInnerHTML={{ __html: teachingSection.content }} />
    }
    return <span>Mon engagement dans la formation des futurs ingénieurs et chercheurs en technologies de l'information et de la communication.</span>
  }

  // Récupérer les cours depuis teachingSection - correction pour afficher tous les cours
  const coursesData = Array.isArray(teachingSection.content) ? teachingSection.content : []

  // Organiser les cours par établissement
  const coursesByInstitution = coursesData.reduce((acc, course) => {
    // Utiliser l'établissement défini dans le cours (personnalisé ou prédéfini)
    let institution = course.establishment || 'Autres établissements'
    let institutionColor = 'from-gray-500 to-slate-500'
    let institutionIcon = BookOpenIcon

    // Déterminer les couleurs et icônes basées sur l'établissement
    if (institution.includes('Faculté des Sciences')) {
      institution = 'Faculté des Sciences d\'El Jadida'
      institutionColor = 'from-blue-500 to-cyan-500'
      institutionIcon = AcademicCapIcon
    } else if (institution.includes('ENSA')) {
      institution = 'ENSA d\'El Jadida'
      institutionColor = 'from-green-500 to-teal-500'
      institutionIcon = SparklesIcon
    } else if (institution.includes('SUPEMIR')) {
      institution = 'SUPEMIR'
      institutionColor = 'from-purple-500 to-pink-500'
      institutionIcon = ComputerDesktopIcon
    } else if (institution.includes('ESEF')) {
      institution = 'ESEF d\'El Jadida'
      institutionColor = 'from-orange-500 to-red-500'
      institutionIcon = BookOpenIcon
    } else if (institution.includes('FLSH')) {
      institution = 'FLSH d\'El Jadida'
      institutionColor = 'from-indigo-500 to-purple-500'
      institutionIcon = UserGroupIcon
    } else if (institution.includes('EST')) {
      institution = 'EST de Sidi Bennour'
      institutionColor = 'from-teal-500 to-blue-500'
      institutionIcon = BeakerIcon
    } else if (!['Faculté des Sciences d\'El Jadida', 'ENSA d\'El Jadida', 'SUPEMIR', 'ESEF d\'El Jadida', 'FLSH d\'El Jadida', 'EST de Sidi Bennour'].includes(institution)) {
      // Pour les établissements personnalisés, garder le nom exact et utiliser une couleur par défaut
      institutionColor = 'from-slate-500 to-gray-500'
      institutionIcon = BuildingOffice2Icon
    } else if (!course.establishment) {
      // Fallback sur l'ancienne logique si pas d'établissement défini
      if (course.description?.includes('Faculté des Sciences')) {
        institution = 'Faculté des Sciences d\'El Jadida'
        institutionColor = 'from-blue-500 to-cyan-500'
        institutionIcon = AcademicCapIcon
      } else if (course.description?.includes('ENSA')) {
        institution = 'ENSA d\'El Jadida'
        institutionColor = 'from-green-500 to-teal-500'
        institutionIcon = SparklesIcon
      } else if (course.description?.includes('SUPEMIR')) {
        institution = 'SUPEMIR'
        institutionColor = 'from-purple-500 to-pink-500'
        institutionIcon = ComputerDesktopIcon
      } else if (course.description?.includes('ESEF')) {
        institution = 'ESEF d\'El Jadida'
        institutionColor = 'from-orange-500 to-red-500'
        institutionIcon = BookOpenIcon
      } else if (course.description?.includes('FLSH')) {
        institution = 'FLSH d\'El Jadida'
        institutionColor = 'from-indigo-500 to-purple-500'
        institutionIcon = UserGroupIcon
      } else if (course.description?.includes('EST')) {
        institution = 'EST de Sidi Bennour'
        institutionColor = 'from-teal-500 to-blue-500'
        institutionIcon = BeakerIcon
      }
    }

    if (!acc[institution]) {
      acc[institution] = {
        name: institution,
        color: institutionColor,
        icon: institutionIcon,
        courses: []
      }
    }
    
    acc[institution].courses.push(course)
    return acc
  }, {})

  const institutionsList = Object.values(coursesByInstitution)

  return (
    <section id="teaching" className="section-padding bg-gradient-to-b from-white to-slate-50">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-6">
            <AcademicCapIcon className="h-4 w-4 mr-2" />
            Enseignement & Formation
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Pédagogie & <span className="text-gradient">Innovation</span>
          </h2>
          <div className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            {getTeachingContent()}
          </div>
        </div>

        {/* Cours par Établissement */}
        {institutionsList.length > 0 ? (
          <div className="space-y-16">
            {institutionsList.map((institution, index) => {
              const IconComponent = institution.icon
              return (
                <div key={index} className="group">
                  {/* En-tête de l'établissement */}
                  <div className="flex items-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${institution.color} rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {institution.name}
                      </h3>
                      <div className="flex items-center mt-2 text-sm text-slate-500">
                        <BuildingOffice2Icon className="h-4 w-4 mr-1" />
                        {institution.courses.length} cours • {institution.courses.reduce((total, course) => total + (parseInt(course.hours?.replace('h', '')) || 0), 0)}h
                      </div>
                    </div>
                  </div>

                  {/* Grille des cours */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {institution.courses.map((course, courseIndex) => (
                      <div 
                        key={course.id || courseIndex} 
                        className="card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group/card cursor-pointer"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${course.color || institution.color} opacity-0 group-hover/card:opacity-5 transition-opacity duration-300`}></div>
                        
                        <div className="relative z-10">
                          {/* Badge niveau et heures */}
                          <div className="flex items-center justify-between mb-4">
                            <span className={`px-3 py-1 bg-gradient-to-r ${course.color || institution.color} text-white rounded-full text-xs font-semibold`}>
                              {course.level}
                            </span>
                            {course.hours && (
                              <div className="flex items-center text-slate-500 text-sm">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {course.hours}
                              </div>
                            )}
                          </div>

                          {/* Titre du cours */}
                          <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover/card:text-blue-600 transition-colors line-clamp-2">
                            {course.title}
                          </h4>

                          {/* Description courte */}
                          {course.description && (
                            <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                              {course.description}
                            </p>
                          )}

                          {/* Barre de progression décorative */}
                          <div className={`w-12 h-1 bg-gradient-to-r ${course.color || institution.color} rounded-full group-hover/card:w-20 transition-all duration-300`}></div>
                          
                          {/* Indicateur de clic */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity">
                            <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-400 group-hover/card:text-blue-600 transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Message si aucun cours */
          <div className="text-center py-16">
            <BookOpenIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Aucun cours disponible</h3>
            <p className="text-slate-500">Les cours seront affichés ici une fois ajoutés depuis l'administration.</p>
          </div>
        )}

        {/* Course Detail Popup */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Popup Header */}
              <div className={`flex items-center justify-between p-6 bg-gradient-to-r ${selectedCourse.color || 'from-blue-500 to-cyan-500'} text-white`}>
                <div className="flex items-center">
                  <AcademicCapIcon className="h-8 w-8 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                    <p className="text-blue-100">{selectedCourse.level} • {selectedCourse.hours}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Popup Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                <div className="space-y-6">
                  {/* Informations générales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-slate-500">Établissement</span>
                        <p className="text-slate-900 font-medium">{selectedCourse.establishment || 'Non spécifié'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-500">Niveau d'études</span>
                        <p className="text-slate-900 font-medium">{selectedCourse.level}</p>
                      </div>
                      {selectedCourse.hours && (
                        <div>
                          <span className="text-sm font-medium text-slate-500">Volume horaire</span>
                          <p className="text-slate-900 font-medium">{selectedCourse.hours}</p>
                        </div>
                      )}
                      {selectedCourse.semester && (
                        <div>
                          <span className="text-sm font-medium text-slate-500">Semestre</span>
                          <p className="text-slate-900 font-medium">{selectedCourse.semester}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                  {/* Établissement */}
                  <div className="mb-4">
                    <div className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                      <BuildingOffice2Icon className="h-4 w-4 mr-2" />
                      {selectedCourse.establishment || 'Non spécifié'}
                    </div>
                  </div>

                      <div>
                        <span className="text-sm font-medium text-slate-500">Type de cours</span>
                        <p className="text-slate-900 font-medium">{selectedCourse.courseType || 'Cours magistral et travaux pratiques'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-500">Méthodes d'évaluation</span>
                        <p className="text-slate-900 font-medium">{selectedCourse.evaluation || 'Contrôle continu et examen final'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedCourse.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                        <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Description du cours
                      </h3>
                      <p className="text-slate-700 leading-relaxed">{selectedCourse.description}</p>
                    </div>
                  )}

                  {/* Prérequis */}
                  {selectedCourse.prerequisites && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                        <BookOpenIcon className="h-5 w-5 mr-2 text-purple-600" />
                        Prérequis
                      </h3>
                      <p className="text-slate-700 leading-relaxed">{selectedCourse.prerequisites}</p>
                    </div>
                  )}
                  {/* Objectifs pédagogiques */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
                      Objectifs pédagogiques
                    </h3>
                    {selectedCourse.objectives ? (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-slate-700 leading-relaxed">{selectedCourse.objectives}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Maîtriser les concepts fondamentaux',
                          'Développer les compétences pratiques',
                          'Appliquer les connaissances théoriques',
                          'Résoudre des problèmes complexes'
                        ].map((objective, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-700">{objective}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Compétences développées */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <SparklesIcon className="h-5 w-5 mr-2 text-purple-600" />
                      Compétences développées
                    </h3>
                    {selectedCourse.skills ? (
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-slate-700 leading-relaxed">{selectedCourse.skills}</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Analyse technique',
                          'Résolution de problèmes',
                          'Travail en équipe',
                          'Communication technique',
                          'Innovation'
                        ].map((skill, index) => (
                          <span key={index} className={`px-3 py-1 bg-gradient-to-r ${selectedCourse.color || 'from-purple-500 to-pink-500'} text-white rounded-full text-sm font-medium`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Informations complémentaires */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-3">📚 Informations complémentaires</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Support pédagogique numérique
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Projets pratiques
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Évaluation continue
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Accompagnement personnalisé
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Innovation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="group card p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <ComputerDesktopIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Pédagogie Numérique
                </h3>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-6">
                Développement et mise en œuvre de solutions d'enseignement à distance, 
                intégration des nouvelles technologies dans les pratiques pédagogiques.
              </p>
              
              <ul className="space-y-3">
                {[
                  'Plateformes d\'apprentissage en ligne',
                  'Évaluation automatisée',
                  'Réalité virtuelle en éducation',
                  'Intelligence artificielle pédagogique'
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-slate-600">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-3"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="group card p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <SparklesIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                  Formation Continue
                </h3>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-6">
                Organisation de formations pour les professionnels et les enseignants 
                sur les dernières avancées technologiques.
              </p>
              
              <ul className="space-y-3">
                {[
                  'Ateliers sur l\'IA en éducation',
                  'Formations en cybersécurité',
                  'Séminaires sur les réseaux',
                  'Conférences technologiques'
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-slate-600">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mr-3"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeachingSection