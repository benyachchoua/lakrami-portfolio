import React, { useState, useEffect } from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'

const CoursesEditor = () => {
  const { portfolioData, updateSection } = usePortfolio()
  const [courses, setCourses] = useState([])
  const [editingCourse, setEditingCourse] = useState(null)
  const [showForm, setShowForm] = useState(false)

  // Initialiser les cours existants
  useEffect(() => {
    const enseignementSection = portfolioData.sections.find(section => section.id === 'enseignement')
    if (enseignementSection && Array.isArray(enseignementSection.content)) {
      setCourses(enseignementSection.content)
    } else {
      // Initialiser avec un cours vide si aucun cours existant
      setCourses([{
        id: Date.now(),
        title: '',
        level: '',
        hours: '',
        establishment: '',
        color: 'from-blue-500 to-cyan-500',
        description: '',
        objectives: '',
        skills: ''
      }])
    }
  }, [portfolioData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Filtrer les cours valides (avec au moins un titre)
      const validCourses = courses.filter(course => 
        course.title && course.title.trim() !== ''
      )

      // Mettre à jour la section avec les cours valides
      const updatedSection = {
        id: 'enseignement',
        title: 'Enseignement',
        type: 'cards',
        order: 12,
        visible: true,
        content: validCourses
      }

      await updateSection('enseignement', updatedSection)
      alert('Cours sauvegardés avec succès!')
      setShowForm(false)
      setEditingCourse(null)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur lors de la sauvegarde des cours')
    }
  }

  const handleDeleteSingleCourse = async (courseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      try {
        const updatedCourses = courses.filter(course => course.id !== courseId)
        setCourses(updatedCourses)
        
        const updatedSection = {
          id: 'enseignement',
          title: 'Enseignement', 
          type: 'cards',
          order: 12,
          visible: true,
          content: updatedCourses
        }
        
        await updateSection('enseignement', updatedSection)
        alert('Cours supprimé avec succès!')
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        alert('Erreur lors de la suppression du cours')
      }
    }
  }

  const addNewCourse = () => {
    const newCourse = {
      id: Date.now(),
      title: '',
      level: '',
      hours: '',
      establishment: '',
      color: 'from-blue-500 to-cyan-500',
      description: '',
      objectives: '',
      skills: ''
    }
    setCourses([...courses, newCourse])
    setEditingCourse(newCourse.id)
    setShowForm(true)
  }

  const updateCourse = (courseId, field, value) => {
    setCourses(courses.map(course => 
      course.id === courseId ? { ...course, [field]: value } : course
    ))
  }

  const colorOptions = [
    { value: 'from-blue-500 to-cyan-500', label: 'Bleu' },
    { value: 'from-green-500 to-teal-500', label: 'Vert' },
    { value: 'from-red-500 to-pink-500', label: 'Rouge' },
    { value: 'from-purple-500 to-indigo-500', label: 'Violet' },
    { value: 'from-yellow-500 to-orange-500', label: 'Orange' },
    { value: 'from-gray-500 to-slate-500', label: 'Gris' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Cours</h2>
        <button
          onClick={addNewCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Ajouter un cours
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {courses.map((course, index) => (
          <div key={course.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Cours {index + 1}
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCourse(editingCourse === course.id ? null : course.id)
                    setShowForm(editingCourse !== course.id)
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSingleCourse(course.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {(editingCourse === course.id || showForm) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre du cours *
                  </label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => updateCourse(course.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Réseaux Informatiques"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau
                  </label>
                  <input
                    type="text"
                    value={course.level}
                    onChange={(e) => updateCourse(course.id, 'level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Master 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Volume horaire
                  </label>
                  <input
                    type="text"
                    value={course.hours}
                    onChange={(e) => updateCourse(course.id, 'hours', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 40h"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Établissement
                  </label>
                  <input
                    type="text"
                    value={course.establishment}
                    onChange={(e) => updateCourse(course.id, 'establishment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Faculté des Sciences d'El Jadida"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Couleur
                  </label>
                  <select
                    value={course.color}
                    onChange={(e) => updateCourse(course.id, 'color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {colorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={course.description}
                    onChange={(e) => updateCourse(course.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description du cours..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objectifs
                  </label>
                  <textarea
                    value={course.objectives}
                    onChange={(e) => updateCourse(course.id, 'objectives', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Objectifs pédagogiques..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compétences acquises
                  </label>
                  <textarea
                    value={course.skills}
                    onChange={(e) => updateCourse(course.id, 'skills', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Compétences développées..."
                  />
                </div>
              </div>
            )}

            {editingCourse !== course.id && !showForm && (
              <div className="text-sm text-gray-600">
                <p><strong>Titre:</strong> {course.title || 'Non défini'}</p>
                <p><strong>Niveau:</strong> {course.level || 'Non défini'}</p>
                <p><strong>Établissement:</strong> {course.establishment || 'Non défini'}</p>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setShowForm(false)
              setEditingCourse(null)
            }}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sauvegarder les cours
          </button>
        </div>
      </form>
    </div>
  )
}

export default CoursesEditor