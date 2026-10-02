import React, { useState } from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import SimpleEditor from '../../components/admin/SimpleEditor'
import { Dialog } from '@headlessui/react'
import { sanitizeHtml } from '../../utils/sanitizeHtml'
import { 
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
  Bars3Icon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const SectionsEditor = () => {
  const { portfolioData, updateSection, addSection, deleteSection, reorderSections, loading } = usePortfolio()
  const [editingSection, setEditingSection] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const sortedSections = [...portfolioData.sections].sort((a, b) => a.order - b.order)

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
    setEditingSection(section)
    setIsEditorOpen(true)
  }

  const handleAddSection = () => {
    setEditingSection(null)
    setIsEditorOpen(true)
  }

  const handleDeleteSection = async (sectionId) => {
    try {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
        const result = await deleteSection(sectionId)
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

  const handleSaveSection = async (sectionData) => {
    try {
      let result
      if (editingSection) {
        result = await updateSection(editingSection.id, sectionData)
      } else {
        result = await addSection(sectionData)
      }
      
      if (result && result.success) {
        toast.success(editingSection ? 'Section mise à jour' : 'Section ajoutée')
        setIsEditorOpen(false)
        setEditingSection(null)
      } else {
        toast.error(result?.error || 'Erreur lors de la sauvegarde de la section')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error('Erreur lors de la sauvegarde de la section')
    }
  }

  const handleCancelEdit = () => {
    setIsEditorOpen(false)
    setEditingSection(null)
  }

  if (isEditorOpen) {
    return (
      <Dialog open onClose={loading ? () => {} : handleCancelEdit} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-4xl">
            <Dialog.Title className="sr-only">{editingSection ? 'Modifier la section' : 'Ajouter une section'}</Dialog.Title>
        <SimpleEditor
          key={editingSection?.id || 'new'}
          section={editingSection}
          onSave={handleSaveSection}
          onCancel={handleCancelEdit}
          loading={loading}
        />
          </Dialog.Panel>
        </div>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col gap-1">
                    <button type="button" aria-label={`Monter ${section.title}`} onClick={() => moveSection(index, -1)} disabled={loading || index === 0} className="px-2 text-secondary-600 disabled:opacity-30">↑</button>
                    <button type="button" aria-label={`Descendre ${section.title}`} onClick={() => moveSection(index, 1)} disabled={loading || index === sortedSections.length - 1} className="px-2 text-secondary-600 disabled:opacity-30">↓</button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {section.title}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-secondary-600">
                        Type: {section.type}
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

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleVisibility(section.id, section.visible)}
                    disabled={loading}
                    className="p-2 text-secondary-600 hover:text-secondary-900 transition-colors"
                    title={section.visible ? 'Masquer' : 'Afficher'}
                  >
                    {section.visible ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleEditSection(section)}
                    className="p-2 text-secondary-600 hover:text-primary-600 transition-colors"
                    title="Modifier"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    disabled={loading}
                    className="p-2 text-secondary-600 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Aperçu du contenu */}
              <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
                <h4 className="text-sm font-medium text-secondary-700 mb-2">Aperçu du contenu:</h4>
                
                {/* Type: list */}
                {section.type === 'list' && Array.isArray(section.content) && section.content.length > 0 && (
                  <ul className="text-sm text-secondary-600 space-y-1">
                    {section.content.slice(0, 3).map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                    {section.content.length > 3 && (
                      <li className="text-secondary-400">... et {section.content.length - 3} autres</li>
                    )}
                  </ul>
                )}
                
                {/* Type: text */}
                {section.type === 'text' && (
                  <div className="text-sm text-secondary-600">
                    {typeof section.content === 'string' && section.content.trim() ? (
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(section.content)
                        }}
                      />
                    ) : (
                      <p className="text-secondary-400 italic">Aucun contenu texte</p>
                    )}
                  </div>
                )}
                
                {/* Type: cards */}
                {section.type === 'cards' && (
                  <div className="text-sm text-secondary-600">
                    {Array.isArray(section.content) && section.content.length > 0 ? (
                      <div>
                        <p className="font-medium mb-2">{section.content.length} élément(s)</p>
                        <div className="space-y-1">
                          {section.content.slice(0, 2).map((item, index) => (
                            <div key={index} className="bg-white p-2 rounded border text-xs">
                              {typeof item === 'object' ? (
                                <div>
                                  {item.title && <span className="font-medium">{item.title}</span>}
                                  {item.sujet && <span className="font-medium">{item.sujet}</span>}
                                  {item.name && <span className="font-medium">{item.name}</span>}
                                </div>
                              ) : (
                                <span>{String(item).substring(0, 50)}...</span>
                              )}
                            </div>
                          ))}
                          {section.content.length > 2 && (
                            <p className="text-secondary-400 text-xs">... et {section.content.length - 2} autres</p>
                          )}
                        </div>
                      </div>
                    ) : typeof section.content === 'object' && section.content !== null ? (
                      <div>
                        <p className="font-medium mb-2">Contenu structuré</p>
                        <div className="bg-white p-2 rounded border text-xs">
                          {Object.keys(section.content).length > 0 ? (
                            <div>
                              {Object.keys(section.content).slice(0, 3).map(key => (
                                <div key={key} className="mb-1">
                                  <span className="font-medium">{key}:</span> 
                                  {Array.isArray(section.content[key]) 
                                    ? ` ${section.content[key].length} élément(s)`
                                    : ` ${String(section.content[key]).substring(0, 30)}...`
                                  }
                                </div>
                              ))}
                              {Object.keys(section.content).length > 3 && (
                                <p className="text-secondary-400">... et {Object.keys(section.content).length - 3} autres clés</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-secondary-400 italic">Objet vide</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-secondary-400 italic">Aucun contenu</p>
                    )}
                  </div>
                )}
                
                {/* Type: list vide */}
                {section.type === 'list' && (!Array.isArray(section.content) || section.content.length === 0) && (
                  <p className="text-sm text-secondary-400 italic">Liste vide</p>
                )}
              </div>
            </div>
          ))}
      </div>

    </div>
  )
}

export default SectionsEditor
