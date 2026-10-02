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
  ArrowUpIcon,
  ArrowDownIcon
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
    return text ? <p>{text.length > 160 ? text.slice(0, 159) + '…' : text}</p> : <p className="admin-empty-note">Aucun contenu texte.</p>
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
    return items.length ? <p>{plural(items.length, 'élément', 'éléments')} : {items.slice(0, 3).map(String).join(' · ')}{items.length > 3 ? ' …' : ''}</p> : <p className="admin-empty-note">Liste vide.</p>
  }
  const items = normalizeContent(type, content)
  if (!Array.isArray(items) || items.length === 0) return <p className="admin-empty-note">Aucun élément pour l’instant.</p>
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
    <>
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">Contenus</p>
          <h1>Sections du <em>portfolio.</em></h1>
          <p>Modifiez les contenus, leur visibilité et leur ordre sur le site public. L’ordre ci-dessous est celui du site.</p>
        </div>
        <div className="admin-actions">
          <button type="button" onClick={handleAddSection} className="btn-primary"><PlusIcon aria-hidden="true" />Ajouter une section</button>
        </div>
      </header>

      <ol className="admin-sections">
        {sortedSections.map((section, index) => (
          <li key={section.id} className="admin-section-row">
            <div className="admin-section-order">
              <span className="admin-section-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <button type="button" className="btn-icon" aria-label={`Monter ${section.title}`} onClick={() => moveSection(index, -1)} disabled={loading || index === 0}><ArrowUpIcon aria-hidden="true" /></button>
              <button type="button" className="btn-icon" aria-label={`Descendre ${section.title}`} onClick={() => moveSection(index, 1)} disabled={loading || index === sortedSections.length - 1}><ArrowDownIcon aria-hidden="true" /></button>
            </div>
            <div className="admin-section-body">
              <div className="admin-section-title">
                <h2>{section.title}</h2>
                <span className="admin-section-type">{typeLabel(section.type)}</span>
                <span className={'admin-status' + (section.visible ? '' : ' is-muted')}>{section.visible ? 'Visible' : 'Masquée'}</span>
              </div>
              <div className="admin-section-summary"><ContentSummary section={section} /></div>
            </div>
            <div className="admin-section-actions">
              <button type="button" className="btn-icon" onClick={() => handleToggleVisibility(section.id, section.visible)} disabled={loading} title={section.visible ? 'Masquer' : 'Afficher'} aria-label={(section.visible ? 'Masquer ' : 'Afficher ') + section.title}>
                {section.visible ? <EyeIcon aria-hidden="true" /> : <EyeSlashIcon aria-hidden="true" />}
              </button>
              <button type="button" className="btn-secondary" onClick={() => handleEditSection(section)} aria-label={'Modifier ' + section.title}><PencilIcon aria-hidden="true" />Modifier</button>
              <button type="button" className="btn-icon" onClick={() => handleDeleteSection(section)} disabled={loading} title="Supprimer" aria-label={'Supprimer ' + section.title}><TrashIcon aria-hidden="true" /></button>
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}

export default SectionsEditor
