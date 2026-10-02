import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import WysiwygEditor from './WysiwygEditor'

const SimpleEditor = ({ section, onSave, onCancel, loading }) => {
  const { register, handleSubmit, control, watch, setValue, setError, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: section?.title || '',
      type: section?.type || 'text',
      content: section?.type === 'cards' ? JSON.stringify(section.content, null, 2) : (typeof section?.content === 'string' ? section.content : ''),
      visible: section?.visible !== false,
      items: section?.type === 'list' && Array.isArray(section.content) && section.content.length
        ? section.content.map(value => ({ value: String(value) }))
        : [{ value: '' }],
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const type = watch('type')
  const busy = loading || isSubmitting

  const onSubmit = async (data) => {
    let content = data.content || ''
    if (data.type === 'list') {
      content = data.items.map(item => item.value.trim()).filter(Boolean)
    } else if (data.type === 'cards') {
      try {
        content = data.content.trim() ? JSON.parse(data.content) : []
        if (!content || typeof content !== 'object') throw new Error('Structure invalide')
      } catch {
        setError('content', { type: 'validate', message: 'Saisissez un tableau ou un objet JSON valide.' })
        return
      }
    } else if (data.type !== 'text') {
      // Specialised sections (research, teaching…) have no content field here; keep what is stored.
      content = section?.content ?? ''
    }
    await onSave({ title: data.title.trim(), type: data.type, content, visible: data.visible })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-secondary-900">{section ? 'Modifier : ' + section.title : 'Nouvelle section'}</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div>
          <label htmlFor="section-title" className="block text-sm font-medium mb-2">Titre de la section</label>
          <input id="section-title" autoFocus {...register('title', { required: 'Le titre est requis', validate: value => Boolean(value.trim()) || 'Le titre est requis' })} className="input-field" />
          {errors.title && <p role="alert" className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="section-type" className="block text-sm font-medium mb-2">Type de contenu</label>
          <select id="section-type" {...register('type')} className="input-field" disabled={Boolean(section)}>
            <option value="text">Texte</option>
            <option value="list">Liste</option>
            <option value="cards">Contenu structuré</option>
            {!['text', 'list', 'cards'].includes(type) && <option value={type}>{type}</option>}
          </select>
        </div>
        {type === 'text' && (
          <div>
            <label htmlFor="section-content" className="block text-sm font-medium mb-2">Contenu</label>
            <WysiwygEditor id="section-content" value={watch('content')} onChange={value => setValue('content', value, { shouldDirty: true })} placeholder="Saisissez votre texte. Les balises HTML simples sont acceptées." />
          </div>
        )}
        {type === 'list' && (
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium mb-2">Éléments de la liste</legend>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <input aria-label={'Élément ' + (index + 1)} {...register('items.' + index + '.value')} className="input-field flex-1" />
                <button type="button" aria-label={'Supprimer l’élément ' + (index + 1)} onClick={() => remove(index)} className="p-2 text-red-600" disabled={busy}><TrashIcon className="h-5 w-5" /></button>
              </div>
            ))}
            <button type="button" onClick={() => append({ value: '' })} className="flex items-center gap-2 text-primary-600" disabled={busy}><PlusIcon className="h-4 w-4" />Ajouter un élément</button>
          </fieldset>
        )}
        {type === 'cards' && (
          <div>
            <label htmlFor="section-json" className="block text-sm font-medium mb-2">Contenu structuré (JSON)</label>
            <textarea id="section-json" {...register('content')} rows={14} className="input-field font-mono text-sm" spellCheck={false} />
            {errors.content && <p role="alert" className="text-sm text-red-600 mt-1">{errors.content.message}</p>}
          </div>
        )}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('visible')} />Afficher cette section sur le site public
        </label>
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button type="button" onClick={onCancel} disabled={busy} className="btn-secondary">Annuler</button>
          <button type="submit" disabled={busy} className="btn-primary">{busy ? 'Enregistrement…' : 'Sauvegarder'}</button>
        </div>
      </form>
    </div>
  )
}

export default SimpleEditor