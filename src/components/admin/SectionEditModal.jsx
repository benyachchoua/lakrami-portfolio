import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { 
  XMarkIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const SectionEditModal = ({ isOpen, onClose, section, onSave, loading }) => {
  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      type: 'text',
      content: '',
      listItems: [''],
      visible: true
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'listItems'
  })

  const watchType = watch('type')

  useEffect(() => {
    if (section) {
      reset({
        title: section.title,
        type: section.type,
        content: section.type === 'text' 
          ? section.content 
          : section.type === 'cards' 
            ? JSON.stringify(section.content, null, 2)
            : '',
        listItems: section.type === 'list' && Array.isArray(section.content) 
          ? section.content 
          : [''],
        visible: section.visible
      })
    } else {
      reset({
        title: '',
        type: 'text',
        content: '',
        listItems: [''],
        visible: true
      })
    }
  }, [section, reset])

  const onSubmit = (data) => {
    let content
    
    switch (data.type) {
      case 'list':
        content = data.listItems.filter(item => item.trim() !== '')
        break
      case 'text':
        content = data.content
        break
      case 'cards':
        try {
          content = data.content ? JSON.parse(data.content) : []
        } catch (error) {
          alert('Format JSON invalide. Veuillez vérifier la syntaxe.')
          return
        }
        break
      default:
        content = data.content
    }

    onSave({
      title: data.title,
      type: data.type,
      content,
      visible: data.visible
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            {section ? 'Modifier la section' : 'Ajouter une section'}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Titre de la section
            </label>
            <input
              {...register('title', { required: 'Le titre est requis' })}
              type="text"
              className="input-field"
              placeholder="Ex: Mes publications"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Type de contenu
            </label>
            <select
              {...register('type')}
              className="input-field"
            >
              <option value="text">Texte libre</option>
              <option value="list">Liste à puces</option>
              <option value="cards">Cartes (publications, projets...)</option>
            </select>
          </div>

          {/* Contenu selon le type */}
          {watchType === 'text' && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Contenu
              </label>
              <textarea
                {...register('content')}
                rows={6}
                className="input-field"
                placeholder="Saisissez votre contenu ici..."
              />
            </div>
          )}

          {watchType === 'list' && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Éléments de la liste
              </label>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input
                      {...register(`listItems.${index}`)}
                      type="text"
                      className="input-field flex-1"
                      placeholder={`Élément ${index + 1}`}
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append('')}
                  className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Ajouter un élément
                </button>
              </div>
            </div>
          )}

          {watchType === 'cards' && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Éléments (format JSON)
              </label>
              <textarea
                {...register('content')}
                rows={8}
                className="input-field font-mono text-sm"
                placeholder={`Exemple pour publications:
[
  {
    "id": 1,
    "title": "Titre de la publication",
    "authors": "Auteurs",
    "journal": "Nom du journal",
    "year": "2023",
    "type": "Article de journal",
    "link": "https://..."
  }
]`}
              />
              <p className="text-xs text-secondary-500 mt-1">
                Format JSON requis. Consultez la documentation pour les structures de données.
              </p>
            </div>
          )}

          {/* Visibilité */}
          <div className="flex items-center">
            <input
              {...register('visible')}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-secondary-700">
              Section visible sur le site public
            </label>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
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
              ) : null}
              {section ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SectionEditModal