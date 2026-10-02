import React, { useState, useMemo } from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  PlusIcon,
  TrashIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  PencilIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline'

const CoursesEditor = () => {
  const { portfolioData, updateSection, loading } = usePortfolio()
  const [isEditing, setIsEditing] = useState(false)
  const [editingCourseIndex, setEditingCourseIndex] = useState(null)
  
  // ✅ Utiliser useMemo pour optimiser les recalculs
  const coursesSection = useMemo(() => 
    portfolioData.sections.find(section => section.id === 'enseignement'),
    [portfolioData.sections]
  )
  
  const existingCourses = useMemo(() => 
    Array.isArray(coursesSection?.content) ? coursesSection.content : [],
    [coursesSection]
  )
  
  const handleDeleteSingleCourse = async (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      // ✅ Utiliser les données les plus récentes
      const currentCourses = portfolioData.sections.find(s => s.id === 'enseignement')?.content || []
      const updatedCourses = currentCourses.filter((_, i) => i !== index)
      
      const result = await updateSection('enseignement', {
        title: 'Enseignement',
        type: 'cards',
        content: updatedCourses,
        visible: coursesSection?.visible !== false,
        order: coursesSection?.order ?? 12
      })

      if (result.success) {
        toast.success('Cours supprimé avec succès!')
      } else {
        toast.error('Erreur lors de la suppression')
      }
    }
  }
  
  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      courses: existingCourses.length > 0 ? existingCourses : [
        { 
          title: '', 
          establishment: '',
          level: '', 
          customLevel: '', 
          hours: '', 
          description: '', 
          color: 'from-blue-500 to-cyan-500' 
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'courses'
  })
  
  const colorOptions = [
    { value: 'from-blue-500 to-cyan-500', label: 'Bleu', preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { value: 'from-green-500 to-teal-500', label: 'Vert', preview: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { value: 'from-purple-500 to-pink-500', label: 'Violet', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { value: 'from-orange-500 to-red-500', label: 'Orange', preview: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { value: 'from-indigo-500 to-purple-500', label: 'Indigo', preview: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
    { value: 'from-teal-500 to-blue-500', label: 'Turquoise', preview: 'bg-gradient-to-r from-teal-500 to-blue-500' },
    { value: 'from-pink-500 to-rose-500', label: 'Rose', preview: 'bg-gradient-to-r from-pink-500 to-rose-500' },
    { value: 'from-cyan-500 to-blue-500', label: 'Cyan', preview: 'bg-gradient-to-r from-cyan-500 to-blue-500' }
  ]

  const levelOptions = [
    'Licence 1',
    'Licence 2', 
    'Licence 3',
    'Master 1',
    'Master 2',
    'Doctorat',
    'Ingénieur',
    'Formation Continue',
    'Autre'
  ]

  const establishmentOptions = [
    { value: 'Faculté des Sciences d\'El Jadida', label: 'Faculté des Sciences d\'El Jadida', color: 'from-blue-500 to-cyan-500' },
    { value: 'ENSA d\'El Jadida', label: 'ENSA d\'El Jadida', color: 'from-green-500 to-teal-500' },
    { value: 'SUPEMIR', label: 'SUPEMIR', color: 'from-purple-500 to-pink-500' },
    { value: 'ESEF d\'El Jadida', label: 'ESEF d\'El Jadida', color: 'from-orange-500 to-red-500' },
    { value: 'FLSH d\'El Jadida', label: 'FLSH d\'El Jadida', color: 'from-indigo-500 to-purple-500' },
    { value: 'EST de Sidi Bennour', label: 'EST de Sidi Bennour', color: 'from-teal-500 to-blue-500' },
    { value: 'Autre', label: 'Autre établissement', color: 'from-gray-500 to-slate-500' }
  ]

  const onSubmit = async (data) => {
    try {
      // Filtrer les cours vides et ajouter des IDs uniques
      const validCourses = data.courses
        .filter(course => course.title.trim() && course.level.trim() && course.establishment.trim())
        .map((course, index) => ({
          ...course,
          id: course.id || `course-${Date.now()}-${index}`,
          level: course.level === 'Autre' ? course.customLevel : course.level,
          establishment: course.establishment === 'Autre' ? course.customEstablishment : course.establishment
        }))
    
      if (validCourses.length === 0) {
        toast.error('Veuillez ajouter au moins un cours valide')
        return
      }
    
      // Mettre à jour la section des cours
      const result = await updateSection('enseignement', {
        title: 'Enseignement',
        type: 'cards',
        content: validCourses, // ✅ CORRECTION: utiliser validCourses au lieu de updatedCourses
        visible: coursesSection?.visible !== false,
        order: coursesSection?.order ?? 12
      })

      if (result.success) {
        toast.success(`${validCourses.length} cours sauvegardé${validCourses.length > 1 ? 's' : ''} avec succès!`)
        setIsEditing(false)
        setEditingCourseIndex(null)
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue')
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditingCourseIndex(null)
    reset({
      courses: existingCourses.length > 0 ? existingCourses : [
        { 
          title: '', 
          establishment: '',
          level: '', 
          customLevel: '', 
          hours: '', 
          description: '', 
          color: 'from-blue-500 to-cyan-500' 
        }
      ]
    })
  }

  const handleEditSingleCourse = (index) => {
    setEditingCourseIndex(index)
    setIsEditing(true)
    reset({
      courses: existingCourses
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingCourseIndex(null)
    reset()
  }

  const addNewCourse = () => {
    append({ 
      title: '', 
      establishment: '',
      customEstablishment: '',
      level: '', 
      customLevel: '', 
      hours: '', 
      description: '', 
      color: 'from-blue-500 to-cyan-500' 
    })
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900 flex items-center">
              <AcademicCapIcon className="h-8 w-8 mr-3 text-primary-600" />
              Gestion des Cours
            </h2>
            <p className="text-secondary-600 mt-2">
              Gérez facilement vos cours enseignés - {existingCourses.length} cours actuellement
            </p>
          </div>
          <div className="flex space-x-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              Voir sur le site
            </a>
            <button
              onClick={handleEdit}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              {existingCourses.length > 0 ? 'Modifier les cours' : 'Ajouter des cours'}
            </button>
          </div>
        </div>

        {/* Aperçu des cours existants */}
        {existingCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {existingCourses.map((course, index) => (
              <div key={course.id || index} className="card p-6 relative group hover:shadow-xl transition-all duration-300">
                {/* Boutons d'action */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditSingleCourse(index)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier ce cours"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSingleCourse(index)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer ce cours"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="pr-16">
                  {/* Badge niveau et heures */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${course.color || 'from-blue-500 to-cyan-500'} text-white rounded-full text-sm font-semibold`}>
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
                  <h3 className="text-lg font-bold text-secondary-900 mb-3 line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Description */}
                  {course.description && (
                    <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>
                  )}

                  {/* Barre décorative */}
                  <div className={`w-12 h-1 bg-gradient-to-r ${course.color || 'from-blue-500 to-cyan-500'} rounded-full`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary-50 rounded-lg">
            <BookOpenIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-600 mb-2">Aucun cours ajouté</h3>
            <p className="text-secondary-500 mb-6">Commencez par ajouter vos premiers cours</p>
            <button
              onClick={handleEdit}
              className="btn-primary"
            >
              Ajouter mon premier cours
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-secondary-900 flex items-center">
            <AcademicCapIcon className="h-8 w-8 mr-3 text-primary-600" />
            {editingCourseIndex !== null ? 'Modifier le cours' : 'Gérer mes cours'}
          </h2>
          <p className="text-secondary-600 mt-2">
            {editingCourseIndex !== null 
              ? 'Modifiez les informations de ce cours'
              : 'Ajoutez ou modifiez vos cours de manière simple'
            }
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="p-2 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg transition-colors"
          title="Fermer"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => {
          // Si on modifie un cours spécifique, n'afficher que celui-ci
          if (editingCourseIndex !== null && index !== editingCourseIndex) {
            return null
          }

          return (
            <div key={field.id} className="card p-6 relative">
              {fields.length > 1 && editingCourseIndex === null && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer ce cours"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}

              <h3 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-2 text-primary-600" />
                {editingCourseIndex !== null ? `Cours: ${existingCourses[editingCourseIndex]?.title || 'Nouveau cours'}` : `Cours #${index + 1}`}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom du cours */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <span className="text-red-500">*</span> Nom du cours
                  </label>
                  <input
                    {...register(`courses.${index}.title`, { 
                      required: 'Le nom du cours est requis' 
                    })}
                    type="text"
                    className="input-field"
                    placeholder="Ex: Réseaux Informatiques, Intelligence Artificielle..."
                  />
                  {errors.courses?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.courses[index].title.message}</p>
                  )}
                </div>

                {/* Établissement */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <span className="text-red-500">*</span> Établissement
                  </label>
                  <select
                    {...register(`courses.${index}.establishment`, { 
                      required: 'L\'établissement est requis' 
                    })}
                    className="input-field"
                  >
                    <option value="">Choisir un établissement</option>
                    {establishmentOptions.map(establishment => (
                      <option key={establishment.value} value={establishment.value}>
                        {establishment.label}
                      </option>
                    ))}
                  </select>
                  {errors.courses?.[index]?.establishment && (
                    <p className="mt-1 text-sm text-red-600">{errors.courses[index].establishment.message}</p>
                  )}
                </div>

                {/* Champ établissement personnalisé si "Autre" est sélectionné */}
                {watch(`courses.${index}.establishment`) === 'Autre' && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      <span className="text-red-500">*</span> Nom de l'établissement
                    </label>
                    <input
                      {...register(`courses.${index}.customEstablishment`, { 
                        required: watch(`courses.${index}.establishment`) === 'Autre' ? 'Veuillez préciser le nom de l\'établissement' : false 
                      })}
                      type="text"
                      className="input-field"
                      placeholder="Ex: École Supérieure de Commerce, Institut Polytechnique..."
                    />
                    {errors.courses?.[index]?.customEstablishment && (
                      <p className="mt-1 text-sm text-red-600">{errors.courses[index].customEstablishment.message}</p>
                    )}
                  </div>
                )}
                {/* Niveau */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <span className="text-red-500">*</span> Niveau
                  </label>
                  <select
                    {...register(`courses.${index}.level`, { 
                      required: 'Le niveau est requis' 
                    })}
                    className="input-field"
                  >
                    <option value="">Choisir un niveau</option>
                    {levelOptions.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {errors.courses?.[index]?.level && (
                    <p className="mt-1 text-sm text-red-600">{errors.courses[index].level.message}</p>
                  )}
                </div>
                
                {/* Champ niveau personnalisé si "Autre" est sélectionné */}
                <div>
                  {watch(`courses.${index}.level`) === 'Autre' && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        <span className="text-red-500">*</span> Précisez le niveau
                      </label>
                      <input
                        {...register(`courses.${index}.customLevel`, { 
                          required: watch(`courses.${index}.level`) === 'Autre' ? 'Veuillez préciser le niveau' : false 
                        })}
                        type="text"
                        className="input-field"
                        placeholder="Ex: Cycle préparatoire, Formation professionnelle..."
                      />
                      {errors.courses?.[index]?.customLevel && (
                        <p className="mt-1 text-sm text-red-600">{errors.courses[index].customLevel.message}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Établissement */}
                {/* Nombre d'heures */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    Nombre d'heures
                  </label>
                  <input
                    {...register(`courses.${index}.hours`)}
                    type="text"
                    className="input-field"
                    placeholder="Ex: 40h, 30h..."
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Description du cours
                  </label>
                  <textarea
                    {...register(`courses.${index}.description`)}
                    rows={4}
                    className="input-field"
                    placeholder="Décrivez le contenu du cours, les objectifs pédagogiques, le programme..."
                  />
                </div>

                {/* Objectifs pédagogiques */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Objectifs pédagogiques
                  </label>
                  <textarea
                    {...register(`courses.${index}.objectives`)}
                    rows={3}
                    className="input-field"
                    placeholder="Ex: Maîtriser les concepts fondamentaux, Développer les compétences pratiques..."
                  />
                </div>

                {/* Compétences développées */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Compétences développées
                  </label>
                  <textarea
                    {...register(`courses.${index}.skills`)}
                    rows={3}
                    className="input-field"
                    placeholder="Ex: Analyse technique, Résolution de problèmes, Travail en équipe..."
                  />
                </div>

                {/* Prérequis */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Prérequis
                  </label>
                  <textarea
                    {...register(`courses.${index}.prerequisites`)}
                    rows={2}
                    className="input-field"
                    placeholder="Ex: Mathématiques de base, Notions d'informatique..."
                  />
                </div>

                {/* Méthodes d'évaluation */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Méthodes d'évaluation
                  </label>
                  <textarea
                    {...register(`courses.${index}.evaluation`)}
                    rows={2}
                    className="input-field"
                    placeholder="Ex: Contrôle continu, Examen final, Projets pratiques..."
                  />
                </div>

                {/* Semestre */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Semestre
                  </label>
                  <select
                    {...register(`courses.${index}.semester`)}
                    className="input-field"
                  >
                    <option value="">Choisir un semestre</option>
                    <option value="S1">Semestre 1</option>
                    <option value="S2">Semestre 2</option>
                    <option value="S3">Semestre 3</option>
                    <option value="S4">Semestre 4</option>
                    <option value="S5">Semestre 5</option>
                    <option value="S6">Semestre 6</option>
                    <option value="Annuel">Annuel</option>
                  </select>
                </div>

                {/* Type de cours */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Type de cours
                  </label>
                  <select
                    {...register(`courses.${index}.courseType`)}
                    className="input-field"
                  >
                    <option value="">Choisir un type</option>
                    <option value="Cours magistral">Cours magistral</option>
                    <option value="Travaux dirigés">Travaux dirigés</option>
                    <option value="Travaux pratiques">Travaux pratiques</option>
                    <option value="Cours intégré">Cours intégré</option>
                    <option value="Projet">Projet</option>
                    <option value="Stage">Stage</option>
                  </select>
                </div>

                {/* Couleur */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Couleur du cours
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {colorOptions.map((color) => (
                      <label key={color.value} className="cursor-pointer">
                        <input
                          {...register(`courses.${index}.color`)}
                          type="radio"
                          value={color.value}
                          className="sr-only"
                        />
                        <div className={`w-full h-12 rounded-lg ${color.preview} flex items-center justify-center text-white text-xs font-medium hover:scale-105 transition-transform border-2 border-transparent hover:border-secondary-300 ${
                          watch(`courses.${index}.color`) === color.value ? 'ring-2 ring-primary-500 ring-offset-2' : ''
                        }`}>
                          {color.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Bouton ajouter un cours (seulement si on n'édite pas un cours spécifique) */}
        {editingCourseIndex === null && (
          <div className="text-center">
            <button
              type="button"
              onClick={addNewCourse}
              className="inline-flex items-center px-6 py-3 bg-secondary-100 text-secondary-700 font-medium rounded-lg hover:bg-secondary-200 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Ajouter un autre cours
            </button>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            )}
            {editingCourseIndex !== null ? 'Modifier le cours' : 'Sauvegarder mes cours'}
          </button>
        </div>
      </form>

      {/* Aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          💡 Guide pour bien remplir vos cours
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">Informations essentielles :</h5>
            <ul className="space-y-1">
              <li>• Nom du cours clair et précis</li>
              <li>• Établissement d'enseignement</li>
              <li>• Niveau d'études approprié</li>
              <li>• Volume horaire si disponible</li>
              <li>• Les champs avec * sont obligatoires</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Description détaillée :</h5>
            <ul className="space-y-1">
              <li>• Décrivez le contenu du cours</li>
              <li>• Ajoutez les objectifs pédagogiques</li>
              <li>• Précisez le type de formation</li>
              <li>• Mentionnez les compétences développées</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Astuce :</strong> Les cours sont automatiquement regroupés par établissement selon votre sélection.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CoursesEditor
