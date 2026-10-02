import React, { useState, useEffect } from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const ThesesEditor = () => {
  const { portfolioData, updateSection, loading } = usePortfolio()
  const [selectedDomain, setSelectedDomain] = useState('')
  const [isAddingDomain, setIsAddingDomain] = useState(false)
  const [newDomainName, setNewDomainName] = useState('')
  const [editingThesis, setEditingThesis] = useState(null)

  // Trouver la section des thèses encadrées
  const thesesSection = portfolioData.sections.find(section => section.id === 'theses-encadrees')
  const thesesData = thesesSection?.content || {}

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      sujet: '',
      statut: 'En cours',
      annee: '',
      color: 'from-blue-500 to-cyan-500'
    }
  })

  const colorOptions = [
    { value: 'from-blue-500 to-cyan-500', label: 'Bleu', preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { value: 'from-green-500 to-teal-500', label: 'Vert', preview: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { value: 'from-purple-500 to-pink-500', label: 'Violet', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { value: 'from-orange-500 to-red-500', label: 'Orange', preview: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { value: 'from-indigo-500 to-purple-500', label: 'Indigo', preview: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
    { value: 'from-teal-500 to-blue-500', label: 'Teal', preview: 'bg-gradient-to-r from-teal-500 to-blue-500' },
    { value: 'from-emerald-500 to-cyan-500', label: 'Emeraude', preview: 'bg-gradient-to-r from-emerald-500 to-cyan-500' }
  ]

  const statutOptions = [
    { value: 'En cours', label: 'En cours' },
    { value: 'Soutenue', label: 'Soutenue' },
    { value: 'Abandonnée', label: 'Abandonnée' }
  ]

  const addDomain = () => {
    if (newDomainName.trim()) {
      const updatedData = {
        ...thesesData,
        [newDomainName]: []
      }
      updateSection('theses-encadrees', { content: updatedData })
      setNewDomainName('')
      setIsAddingDomain(false)
      setSelectedDomain(newDomainName)
    }
  }

  const deleteDomain = (domainName) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le domaine "${domainName}" et toutes ses thèses ?`)) {
      const updatedData = { ...thesesData }
      delete updatedData[domainName]
      updateSection('theses-encadrees', { content: updatedData })
      if (selectedDomain === domainName) {
        setSelectedDomain('')
      }
    }
  }

  const addThesis = (data) => {
    if (!selectedDomain) return

    const newThesis = {
      id: Date.now(),
      ...data
    }

    const updatedData = {
      ...thesesData,
      [selectedDomain]: [...(thesesData[selectedDomain] || []), newThesis]
    }

    updateSection('theses-encadrees', { content: updatedData })
    reset()
  }

  const updateThesis = (domainName, thesisId, updatedThesis) => {
    const updatedData = {
      ...thesesData,
      [domainName]: thesesData[domainName].map(thesis =>
        thesis.id === thesisId ? { ...thesis, ...updatedThesis } : thesis
      )
    }
    updateSection('theses-encadrees', { content: updatedData })
    setEditingThesis(null)
  }

  const deleteThesis = (domainName, thesisId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette thèse ?')) {
      const updatedData = {
        ...thesesData,
        [domainName]: thesesData[domainName].filter(thesis => thesis.id !== thesisId)
      }
      updateSection('theses-encadrees', { content: updatedData })
    }
  }

  const domains = Object.keys(thesesData)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
            <AcademicCapIcon className="w-8 h-8 text-primary-600" />
            Gestion des Thèses Encadrées
          </h2>
          <p className="text-secondary-600 mt-1">
            Gérez les thèses que vous encadrez par domaine de recherche
          </p>
        </div>
      </div>

      {/* Gestion des domaines */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Domaines de recherche</h3>
          <button
            onClick={() => setIsAddingDomain(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Ajouter un domaine
          </button>
        </div>

        {isAddingDomain && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-secondary-50 rounded-lg">
            <input
              type="text"
              value={newDomainName}
              onChange={(e) => setNewDomainName(e.target.value)}
              placeholder="Nom du nouveau domaine"
              className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
            />
            <button
              onClick={addDomain}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsAddingDomain(false)
                setNewDomainName('')
              }}
              className="p-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {domains.map((domain) => (
            <div
              key={domain}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedDomain === domain
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-secondary-200 hover:border-secondary-300'
              }`}
              onClick={() => setSelectedDomain(domain)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-secondary-900">{domain}</h4>
                  <p className="text-sm text-secondary-600">
                    {thesesData[domain]?.length || 0} thèse(s)
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteDomain(domain)
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gestion des thèses pour le domaine sélectionné */}
      {selectedDomain && (
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Thèses en {selectedDomain}
          </h3>

          {/* Formulaire d'ajout */}
          <form onSubmit={handleSubmit(addThesis)} className="space-y-4 mb-6 p-4 bg-secondary-50 rounded-lg">
            <h4 className="font-medium text-secondary-900">Ajouter une nouvelle thèse</h4>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Sujet de la thèse *
              </label>
              <textarea
                {...register('sujet', { required: 'Le sujet est requis' })}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Décrivez le sujet de la thèse..."
              />
              {errors.sujet && (
                <p className="text-red-500 text-sm mt-1">{errors.sujet.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Statut *
                </label>
                <select
                  {...register('statut', { required: 'Le statut est requis' })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {statutOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Année *
                </label>
                <input
                  {...register('annee', { required: 'L\'année est requise' })}
                  type="text"
                  placeholder="ex: 2024, depuis 2022"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {errors.annee && (
                  <p className="text-red-500 text-sm mt-1">{errors.annee.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Couleur
                </label>
                <select
                  {...register('color')}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {colorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Ajouter la thèse
            </button>
          </form>

          {/* Liste des thèses */}
          <div className="space-y-3">
            {thesesData[selectedDomain]?.map((thesis) => (
              <div
                key={thesis.id}
                className="p-4 border border-secondary-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                {editingThesis === thesis.id ? (
                  <ThesisEditForm
                    thesis={thesis}
                    onSave={(updatedThesis) => updateThesis(selectedDomain, thesis.id, updatedThesis)}
                    onCancel={() => setEditingThesis(null)}
                    colorOptions={colorOptions}
                    statutOptions={statutOptions}
                  />
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`inline-block px-3 py-1 rounded-full text-white text-sm mb-2 bg-gradient-to-r ${thesis.color}`}>
                        {thesis.statut} - {thesis.annee}
                      </div>
                      <h5 className="font-medium text-secondary-900 mb-1">
                        {thesis.sujet}
                      </h5>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setEditingThesis(thesis.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteThesis(selectedDomain, thesis.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {(!thesesData[selectedDomain] || thesesData[selectedDomain].length === 0) && (
              <div className="text-center py-8 text-secondary-500">
                <AcademicCapIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucune thèse dans ce domaine</p>
                <p className="text-sm">Utilisez le formulaire ci-dessus pour ajouter une thèse</p>
              </div>
            )}
          </div>
        </div>
      )}

      {domains.length === 0 && (
        <div className="text-center py-12 text-secondary-500">
          <AcademicCapIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Aucun domaine de recherche</h3>
          <p className="mb-4">Commencez par ajouter un domaine de recherche</p>
          <button
            onClick={() => setIsAddingDomain(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ajouter le premier domaine
          </button>
        </div>
      )}
    </div>
  )
}

// Composant pour l'édition d'une thèse
const ThesisEditForm = ({ thesis, onSave, onCancel, colorOptions, statutOptions }) => {
  const [formData, setFormData] = useState({
    sujet: thesis.sujet,
    statut: thesis.statut,
    annee: thesis.annee,
    color: thesis.color
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          Sujet de la thèse
        </label>
        <textarea
          value={formData.sujet}
          onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Statut
          </label>
          <select
            value={formData.statut}
            onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {statutOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Année
          </label>
          <input
            type="text"
            value={formData.annee}
            onChange={(e) => setFormData({ ...formData, annee: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Couleur
          </label>
          <select
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {colorOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckIcon className="w-4 h-4" />
          Sauvegarder
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
          Annuler
        </button>
      </div>
    </form>
  )
}

export default ThesesEditor