import React, { useCallback, useRef, useState } from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import SimpleEditor from '../../components/admin/SimpleEditor'
import { Dialog } from '@headlessui/react'
import { itemTitle, normalizeContent, typeLabel } from '../../components/admin/structured/schemas'
import {
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const plural = (count, one, many) => count + ' ' + (count > 1 ? many : one)

const stripTags = (html) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

// One-line description of what a section currently contains.
const ContentSummary = ({ section }) => {
  const { type, content } = section
  if (type === 'contact') return <p>Coordonnées issues du profil (e-mail, téléphone, affiliation).</p>
  if (type === 'text') {
    const text = typeof content === 'string' ? stripTags(content) : ''
    return text ? <p>{text.length > 160 ? text.slice(0, 159) + '…' : text}</p> : <p className="italic text-secondary-500">Aucun contenu texte.</p>
  }
  if (type === 'about') {
    const about = normalizeContent('about', content)
    return <p>{plural(about.formations.length, 'formation', 'formations')} · {plural(about.langues.length, 'langue', 'langues')}</p>
  }
  if (type === 'teaching') {
    const count = Array.isArray(content) ? content.length : 0
    return <p>{plural(count, 'cours', 'cours')} (modifiables dans « Gérer mes cours »).</p>
  }
  if (type === 'list') {
    const items = Array.isArray(content) ? content : []
    return items.length ? <p>{plural(items.length, 'élément', 'éléments')} : {items.slice(0, 3).map(String).join(' · ')}{items.length > 3 ? ' …' : ''}</p> : <p className="italic text-secondary-500">Liste vide.</p>
  }
  const items = normalizeContent(type, content)
  if (!Array.isArray(items) || items.length === 0) return <p className="italic text-secondary-500">Aucun élément pour l’instant.</p>
  const titles = items.slice(0, 3).map((item) => itemTitle(type, item))
  return <p>{plural(items.length, 'élément', 'éléments')} : {titles.join(' · ')}{items.length > 3 ? ' …' : ''}</p>
}

const SectionsEditor = () => {
  const { portfolioData, updateSection, addSection, deleteSection, reorderSections, loading } = usePortfolio()
  const [editingSection, setEditingSection] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const dirtyRef = useRef(false)
  const sortedSections = [...portfolioData.sections].sort((a, b) => a.order - b.order)

  const handleDirtyChange = useCallback((dirty) => { dirtyRef.current = dirty }, [])

  const moveSection = async (index, direction) => {
    const reordered = [...sortedSections]
    const target = index + direction
    if (target < 0 || target >= reordered.length || loading) return
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    const result = await reorderSections(reordered)
    if (!result.success) toast.error(result.error)
    else toast.success('Ordre des sections enregistré')
  }

  const handleToggleVisibility = async (sectionId, visible) => {
    try {
      const result = await updateSection(sectionId, { visible: !visible })
      if (result && result.success) {
        toast.success(`Section ${!visible ? 'affichée' : 'masquée'}`)
      } else {
        toast.error(result?.error || 'Erreur lors de la modification de la visibilité')
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la visibilité:', error)
      toast.error('Erreur lors de la modification de la visibilité')
    }
  }

  const handleEditSection = (section) => {
    dirtyRef.current = false
    setEditingSection(section)
    setIsEditorOpen(true)
  }

  const handleAddSection = () => {
    dirtyRef.current = false
    setEditingSection(null)
    setIsEditorOpen(true)
  }

  const handleDeleteSection = async (section) => {
    try {
      if (window.confirm(`Supprimer la section « ${section.title} » ? Son contenu sera perdu.`)) {
        const result = await deleteSection(section.id)
        if (result && result.success) {
          toast.success('Section supprimée')
        } else {
          toast.error(result?.error || 'Erreur lors de la suppression de la section')
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression de la section')
    }
  }

  const closeEditor = () => {
    dirtyRef.current = false
    setIsEditorOpen(false)
    setEditingSection(null)
  }

  const handleSaveSection = async (sectionData) => {
    try {
      const result = editingSection
        ? await updateSection(editingSection.id, sectionData)
        : await addSection(sectionData)

      if (result && result.success) {
        toast.success(editingSection ? 'Section mise à jour' : 'Section ajoutée')
        closeEditor()
      } else {
        toast.error(result?.error || 'Erreur lors de la sauvegarde de la section')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error('Erreur lors de la sauvegarde de la section')
    }
  }

  const handleCancelEdit = () => {
    if (dirtyRef.current && !window.confirm('Vous avez des modifications non enregistrées. Fermer sans enregistrer ?')) return
    closeEditor()
  }

  if (isEditorOpen) {
    return (
      <Dialog open onClose={loading ? () => {} : handleCancelEdit} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <Dialog.Panel className="w-full max-w-4xl">
            <Dialog.Title className="sr-only">{editingSection ? 'Modifier la section' : 'Ajouter une section'}</Dialog.Title>
            <SimpleEditor
              key={editingSection?.id || 'new'}
              section={editingSection}
              existingTypes={portfolioData.sections.map((section) => section.type)}
              onSave={handleSaveSection}
              onCancel={handleCancelEdit}
              onDirtyChange={handleDirtyChange}
              loading={loading}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-secondary-900 flex items-center">
            <SparklesIcon className="h-8 w-8 mr-3 text-primary-600" />
            Sections du portfolio
          </h2>
          <p className="text-secondary-600 mt-2">
            Modifiez les contenus, leur visibilité et leur ordre sur le site public.
          </p>
        </div>
        <button
          onClick={handleAddSection}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter une section
        </button>
      </div>

      <div className="space-y-4">
        {sortedSections.map((section, index) => (
          <div key={section.id} className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col gap-1">
                  <button type="button" aria-label={`Monter ${section.title}`} onClick={() => moveSection(index, -1)} disabled={loading || index === 0} className="min-h-[44px] min-w-[44px] px-2 text-secondary-600 disabled:opacity-30">↑</button>
                  <button type="button" aria-label={`Descendre ${section.title}`} onClick={() => moveSection(index, 1)} disabled={loading || index === sortedSections.length - 1} className="min-h-[44px] min-w-[44px] px-2 text-secondary-600 disabled:opacity-30">↓</button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {section.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-secondary-600">
                      Type : {typeLabel(section.type)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      section.visible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {section.visible ? 'Visible' : 'Masqué'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleToggleVisibility(section.id, section.visible)}
                  disabled={loading}
                  className="min-h-[44px] min-w-[44px] p-2 text-secondary-600 hover:text-secondary-900 transition-colors"
                  title={section.visible ? 'Masquer' : 'Afficher'}
                  aria-label={(section.visible ? 'Masquer ' : 'Afficher ') + section.title}
                >
                  {section.visible ? (
                    <EyeIcon className="h-5 w-5 mx-auto" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 mx-auto" />
                  )}
                </button>

                <button
                  onClick={() => handleEditSection(section)}
                  className="min-h-[44px] min-w-[44px] p-2 text-secondary-600 hover:text-primary-600 transition-colors"
                  title="Modifier"
                  aria-label={'Modifier ' + section.title}
                >
                  <PencilIcon className="h-5 w-5 mx-auto" />
                </button>

                <button
                  onClick={() => handleDeleteSection(section)}
                  disabled={loading}
                  className="min-h-[44px] min-w-[44px] p-2 text-secondary-600 hover:text-red-600 transition-colors"
                  title="Supprimer"
                  aria-label={'Supprimer ' + section.title}
                >
                  <TrashIcon className="h-5 w-5 mx-auto" />
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-md px-4 py-3 text-sm text-secondary-600" style={{ background: '#f6f7f2' }}>
              <ContentSummary section={section} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionsEditor
