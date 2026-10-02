import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import WysiwygEditor from './WysiwygEditor'
import MetaEditor from './structured/MetaEditor'
import StructuredEditor from './structured/StructuredEditor'
import {
  SCHEMAS,
  SECTION_TYPES,
  UNIQUE_TYPES,
  cleanContent,
  cleanMeta,
  emptyContent,
  isStructured,
  normalizeContent,
  normalizeMeta,
  typeLabel,
  validateContent,
} from './structured/schemas'

const TABS = [
  { id: 'meta', label: 'En-tête' },
  { id: 'content', label: 'Contenu' },
]

const NOTE = 'rounded-md border px-4 py-4 text-sm'

// Editor for one section (create or edit): header tab, content tab and visibility.
const SimpleEditor = ({ section, onSave, onCancel, loading, existingTypes = [], onDirtyChange }) => {
  const isNew = !section
  const availableTypes = useMemo(
    () => SECTION_TYPES.filter((type) => !(UNIQUE_TYPES.includes(type.value) && existingTypes.includes(type.value))),
    [existingTypes],
  )

  const [type, setType] = useState(section?.type || availableTypes.find((t) => t.value === 'text')?.value || availableTypes[0]?.value || 'text')
  const [title, setTitle] = useState(section?.title || '')
  const [visible, setVisible] = useState(section ? section.visible !== false : true)
  const [meta, setMeta] = useState(() => normalizeMeta(section?.meta))
  const [content, setContent] = useState(() => (section ? normalizeContent(section.type, section.content) : normalizeContent(type, emptyContent(type))))
  const [contentKey, setContentKey] = useState(0)
  const [tab, setTab] = useState('meta')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState([])
  const tabRefs = useRef({})

  const snapshot = (values) => JSON.stringify(values)
  const initial = useRef(snapshot({ title, visible, meta, content, type }))
  const dirty = snapshot({ title, visible, meta, content, type }) !== initial.current

  useEffect(() => { onDirtyChange?.(dirty) }, [dirty, onDirtyChange])
  useEffect(() => {
    if (!dirty) return undefined
    const warn = (event) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const schema = SCHEMAS[type]
  const busy = loading || saving

  const changeType = (next) => {
    if (next === type) return
    const hasContent = JSON.stringify(content) !== JSON.stringify(normalizeContent(type, emptyContent(type)))
    if (hasContent && !window.confirm('Changer de type remplacera le contenu saisi. Continuer ?')) return
    setType(next)
    setContent(normalizeContent(next, emptyContent(next)))
    setContentKey((key) => key + 1)
    setErrors([])
  }

  const onTabKeyDown = (event) => {
    const index = TABS.findIndex((item) => item.id === tab)
    let next = null
    if (event.key === 'ArrowRight') next = TABS[(index + 1) % TABS.length]
    else if (event.key === 'ArrowLeft') next = TABS[(index - 1 + TABS.length) % TABS.length]
    if (!next) return
    event.preventDefault()
    setTab(next.id)
    tabRefs.current[next.id]?.focus()
  }

  const confirmLeave = (event) => {
    if (dirty && !window.confirm('Vous avez des modifications non enregistrées. Quitter quand même ?')) event.preventDefault()
  }

  // Enter inside a text field must not submit the whole section.
  const blockEnterSubmit = (event) => {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT' && event.target.type !== 'checkbox') event.preventDefault()
  }

  const submit = async (event) => {
    event.preventDefault()
    if (busy) return
    const problems = []
    if (!title.trim()) problems.push('Le titre (libellé du menu) est requis.')
    let finalContent
    if (isStructured(type)) {
      finalContent = cleanContent(type, content)
      problems.push(...validateContent(type, finalContent))
    } else if (type === 'text') {
      finalContent = typeof content === 'string' ? content : ''
    } else {
      // teaching, contact: content is managed elsewhere, keep what is stored.
      finalContent = isNew ? emptyContent(type) : section.content ?? emptyContent(type)
    }
    setErrors(problems)
    if (problems.length) {
      setTab(!title.trim() ? 'meta' : 'content')
      toast.error(problems[0])
      return
    }
    const cleanedMeta = cleanMeta(meta)
    if (isNew && !cleanedMeta.heading) cleanedMeta.heading = title.trim()
    const payload = { title: title.trim(), type, visible, meta: cleanedMeta, content: finalContent }
    if (!isNew) payload.order = section.order
    setSaving(true)
    try {
      await onSave(payload)
    } finally {
      setSaving(false)
    }
  }

  const renderContent = () => {
    if (isStructured(type)) {
      return (
        <StructuredEditor key={type + '-' + contentKey} type={type} value={content} onChange={setContent} idBase="content" />
      )
    }
    if (type === 'text') {
      return (
        <div>
          <label htmlFor="section-content" className="mb-1.5 block text-sm font-semibold">Contenu</label>
          <p className="mb-2 text-xs text-secondary-600">Les balises HTML simples (p, strong, em, ul, li, a…) sont acceptées.</p>
          <WysiwygEditor id="section-content" value={typeof content === 'string' ? content : ''} onChange={setContent} placeholder="Saisissez votre texte." />
        </div>
      )
    }
    if (type === 'teaching') {
      return (
        <div className={NOTE} style={{ borderColor: 'var(--line)', background: '#f6f7f2' }}>
          <p className="mb-3">
            Les cours (intitulé, niveau, volume horaire, objectifs…) se gèrent dans l’éditeur dédié. Les blocs
            pédagogiques affichés en fin de section se règlent dans l’onglet « En-tête ».
          </p>
          <Link to="/admin/courses" onClick={confirmLeave} className="btn-primary">Gérer mes cours</Link>
        </div>
      )
    }
    return (
      <div className={NOTE} style={{ borderColor: 'var(--line)', background: '#f6f7f2' }}>
        <p className="mb-3">
          La section Contact n’a pas de contenu propre : l’e-mail, le téléphone et l’affiliation proviennent du profil.
        </p>
        <Link to="/admin/profile" onClick={confirmLeave} className="btn-primary">Modifier le profil</Link>
      </div>
    )
  }

  return (
    <form onSubmit={submit} onKeyDown={blockEnterSubmit} noValidate className="flex max-h-[90vh] w-full flex-col rounded-lg bg-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4" style={{ borderColor: 'var(--line)' }}>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold text-secondary-900">{isNew ? 'Nouvelle section' : 'Modifier : ' + section.title}</h2>
          <p className="text-sm text-secondary-600">Type : {typeLabel(type)}</p>
        </div>
        <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm font-medium">
          <input type="checkbox" checked={visible} onChange={(event) => setVisible(event.target.checked)} className="h-5 w-5" />
          Afficher sur le site public
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {isNew && (
          <div className="mb-6">
            <label htmlFor="section-type" className="mb-1.5 block text-sm font-semibold">Type de section</label>
            <select id="section-type" value={type} onChange={(event) => changeType(event.target.value)} className="input-field" aria-describedby="section-type-help">
              {availableTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <p id="section-type-help" className="mt-1.5 text-xs text-secondary-600">{schema?.description}</p>
          </div>
        )}

        <div role="tablist" aria-label="Parties de la section" className="mb-5 flex gap-1 border-b" style={{ borderColor: 'var(--line)' }} onKeyDown={onTabKeyDown}>
          {TABS.map((item) => (
            <button
              key={item.id}
              ref={(node) => { tabRefs.current[item.id] = node }}
              type="button"
              role="tab"
              id={'tab-' + item.id}
              aria-selected={tab === item.id}
              aria-controls={'panel-' + item.id}
              tabIndex={tab === item.id ? 0 : -1}
              onClick={() => setTab(item.id)}
              className={'-mb-px min-h-[44px] border-b-2 px-5 text-sm font-semibold transition-colors ' + (tab === item.id ? 'border-[color:var(--teal)] text-[color:var(--teal)]' : 'border-transparent text-secondary-600 hover:text-[color:var(--ink)]')}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id="panel-meta" aria-labelledby="tab-meta" hidden={tab !== 'meta'}>
          <MetaEditor title={title} onTitleChange={setTitle} meta={meta} onMetaChange={setMeta} />
        </div>
        <div role="tabpanel" id="panel-content" aria-labelledby="tab-content" hidden={tab !== 'content'}>
          {renderContent()}
        </div>
      </div>

      <div className="border-t px-6 py-4" style={{ borderColor: 'var(--line)' }}>
        {errors.length > 0 && (
          <ul role="alert" className="mb-3 list-disc space-y-1 pl-5 text-sm text-red-700">
            {errors.slice(0, 5).map((message) => <li key={message}>{message}</li>)}
            {errors.length > 5 && <li>… et {errors.length - 5} autre(s) champ(s) requis.</li>}
          </ul>
        )}
        <div className="flex flex-wrap items-center justify-end gap-3">
          {dirty && <span className="mr-auto text-sm text-secondary-600" role="status">Modifications non enregistrées</span>}
          <button type="button" onClick={onCancel} disabled={saving} className="btn-secondary">Annuler</button>
          <button type="submit" disabled={busy} className="btn-primary">{saving ? 'Enregistrement…' : 'Sauvegarder'}</button>
        </div>
      </div>
    </form>
  )
}

export default SimpleEditor
