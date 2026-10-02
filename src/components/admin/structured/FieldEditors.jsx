import React, { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { blankObject, duplicateItem, makeId } from './schemas'

const labelClass = 'block text-sm font-semibold mb-1.5'
const iconButton =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-transparent text-secondary-600 transition-colors hover:border-[#b8c2bc] hover:bg-[#eaece6] hover:text-[color:var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--teal)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-transparent disabled:hover:bg-transparent'
const addButton =
  'inline-flex min-h-[44px] items-center gap-2 rounded-md border border-dashed border-[#a5b0b2] px-4 text-sm font-semibold text-[color:var(--teal)] transition-colors hover:border-[color:var(--teal)] hover:bg-[#eaece6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--teal)]'

// Rows with stable React keys, kept in local state and mirrored upward on every change.
const useKeyedList = (value, onChange) => {
  const [rows, setRows] = useState(() => (Array.isArray(value) ? value : []).map((v) => ({ k: makeId(), v })))
  const commit = (next) => {
    setRows(next)
    onChange(next.map((row) => row.v))
  }
  return { rows, commit }
}

const move = (rows, index, direction) => {
  const target = index + direction
  if (target < 0 || target >= rows.length) return rows
  const next = [...rows]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

// Renders one field according to its kind.
export const FieldInput = ({ field, value, onChange, id, suggestionsId, depth = 0 }) => {
  const label = (
    <label htmlFor={id} className={labelClass}>
      {field.label}
      {field.required && <span aria-hidden="true" className="ml-1 text-red-700">*</span>}
    </label>
  )
  const help = field.help ? <p id={id + '-help'} className="mb-2 text-xs text-secondary-600">{field.help}</p> : null
  const describedBy = field.help ? id + '-help' : undefined

  if (field.kind === 'textarea') {
    return (
      <div>
        {label}
        {help}
        <textarea
          id={id}
          rows={field.rows || 3}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          required={field.required}
          aria-describedby={describedBy}
          placeholder={field.placeholder}
          className="input-field resize-y"
        />
      </div>
    )
  }

  if (field.kind === 'select') {
    const options = (field.options || []).map((option) => (typeof option === 'string' ? { value: option, label: option } : option))
    const known = options.some((option) => option.value === value)
    return (
      <div>
        {label}
        {help}
        <select id={id} value={value ?? ''} onChange={(event) => onChange(event.target.value)} aria-describedby={describedBy} className="input-field">
          {!field.required && !known && value === '' && <option value="">—</option>}
          {!known && value !== '' && <option value={value}>{value}</option>}
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
    )
  }

  if (field.kind === 'stringList') {
    return (
      <StringListEditor
        id={id}
        label={field.label}
        help={field.help}
        value={value}
        onChange={onChange}
        addLabel={field.addLabel}
        placeholder={field.placeholder}
        multiline={field.multiline}
      />
    )
  }

  if (field.kind === 'objectList') {
    return (
      <ObjectListEditor
        idBase={id}
        label={field.label}
        help={field.help}
        fields={field.fields}
        value={value}
        onChange={onChange}
        itemTitle={field.itemTitle}
        itemLabel={field.itemLabel}
        inline={field.inline}
        depth={depth + 1}
      />
    )
  }

  return (
    <div>
      {label}
      {help}
      <input
        id={id}
        type={field.inputType || 'text'}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        aria-describedby={describedBy}
        placeholder={field.placeholder}
        list={suggestionsId}
        className="input-field"
      />
    </div>
  )
}

// Editable list of plain strings: add, remove, reorder.
export const StringListEditor = ({ id, label, help, value, onChange, addLabel = 'Ajouter', placeholder, multiline }) => {
  const { rows, commit } = useKeyedList(value, onChange)
  const [focusKey, setFocusKey] = useState(null)

  useEffect(() => {
    if (!focusKey) return
    document.getElementById(id + '-' + focusKey)?.focus()
    setFocusKey(null)
  }, [focusKey, id])

  const insertAfter = (index) => {
    const row = { k: makeId(), v: '' }
    const next = [...rows]
    next.splice(index + 1, 0, row)
    commit(next)
    setFocusKey(row.k)
  }

  return (
    <fieldset className="min-w-0">
      <legend className={labelClass}>{label}</legend>
      {help && <p className="mb-2 text-xs text-secondary-600">{help}</p>}
      {rows.length === 0 && <p className="mb-2 text-sm italic text-secondary-500">Aucun élément pour l’instant.</p>}
      <ul className="space-y-2">
        {rows.map((row, index) => {
          const inputId = id + '-' + row.k
          const common = {
            id: inputId,
            value: row.v,
            placeholder,
            onChange: (event) => commit(rows.map((item, i) => (i === index ? { ...item, v: event.target.value } : item))),
            className: 'input-field flex-1',
          }
          return (
            <li key={row.k} className="flex items-start gap-1">
              <label htmlFor={inputId} className="sr-only">{label + ' ' + (index + 1)}</label>
              {multiline ? (
                <textarea rows={2} {...common} className="input-field flex-1 resize-y" />
              ) : (
                <input
                  type="text"
                  {...common}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      insertAfter(index)
                    }
                  }}
                />
              )}
              <button type="button" className={iconButton} aria-label={'Monter : ' + label + ' ' + (index + 1)} disabled={index === 0} onClick={() => commit(move(rows, index, -1))}>
                <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" className={iconButton} aria-label={'Descendre : ' + label + ' ' + (index + 1)} disabled={index === rows.length - 1} onClick={() => commit(move(rows, index, 1))}>
                <ArrowDownIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" className={iconButton + ' hover:!text-red-700'} aria-label={'Supprimer : ' + label + ' ' + (index + 1)} onClick={() => commit(rows.filter((_, i) => i !== index))}>
                <TrashIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ul>
      <button type="button" className={addButton + ' mt-3'} onClick={() => insertAfter(rows.length - 1)}>
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
        {addLabel}
      </button>
    </fieldset>
  )
}

// Fields of one object (an item, or the root of an object-shaped content).
export const FieldGrid = ({ fields, value, onChange, idBase, suggestions, datalistBase, depth = 0 }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    {fields.map((field) => {
      const wide = field.kind !== 'text' && field.kind !== 'select'
      return (
        <div key={field.key} className={wide ? 'md:col-span-2' : ''}>
          <FieldInput
            field={field}
            id={idBase + '-' + field.key}
            value={value[field.key]}
            depth={depth}
            suggestionsId={suggestions?.[field.key] ? datalistBase + '-dl-' + field.key : undefined}
            onChange={(next) => onChange({ ...value, [field.key]: next })}
          />
        </div>
      )
    })}
  </div>
)

const searchText = (item) => JSON.stringify(item).toLowerCase()

// Collapsible list of objects with reorder / duplicate / delete / add / search.
export const ObjectListEditor = ({
  idBase,
  label,
  help,
  fields,
  value,
  onChange,
  itemTitle,
  newItem,
  itemLabel = 'élément',
  hasId = false,
  inline = false,
  searchThreshold = 10,
  hideLabel = false,
  depth = 0,
}) => {
  const { rows, commit } = useKeyedList(value, onChange)
  const [expanded, setExpanded] = useState(() => new Set())
  const [query, setQuery] = useState('')
  const [focusKey, setFocusKey] = useState(null)

  const titleOf = (item, index) => (itemTitle ? itemTitle(item, index) : 'Élément ' + (index + 1))
  const create = () => (newItem ? newItem() : blankObject(fields))

  const suggestionKeys = useMemo(() => fields.filter((field) => field.suggest).map((field) => field.key), [fields])
  const suggestions = useMemo(() => {
    const result = {}
    suggestionKeys.forEach((key) => {
      result[key] = [...new Set(rows.map((row) => String(row.v[key] ?? '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'))
    })
    return result
  }, [rows, suggestionKeys])

  useEffect(() => {
    if (!focusKey) return
    const first = fields[0]
    document.getElementById(idBase + '-row-' + focusKey + '-' + first.key)?.focus()
    setFocusKey(null)
  }, [focusKey, fields, idBase])

  const toggle = (key) => setExpanded((previous) => {
    const next = new Set(previous)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    return next
  })

  const expand = (key) => setExpanded((previous) => new Set(previous).add(key))

  const add = () => {
    const row = { k: makeId(), v: create() }
    commit([...rows, row])
    expand(row.k)
    setFocusKey(row.k)
  }

  const duplicate = (index) => {
    const row = { k: makeId(), v: duplicateItem(rows[index].v, hasId) }
    const next = [...rows]
    next.splice(index + 1, 0, row)
    commit(next)
    expand(row.k)
  }

  const remove = (index) => {
    const title = titleOf(rows[index].v, index)
    if (!window.confirm('Supprimer « ' + title + ' » ? Cette action sera appliquée à l’enregistrement.')) return
    commit(rows.filter((_, i) => i !== index))
  }

  const normalizedQuery = query.trim().toLowerCase()
  const visibleRows = rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => !normalizedQuery || searchText(row.v).includes(normalizedQuery))
  const showSearch = rows.length > searchThreshold
  const filtering = showSearch && normalizedQuery !== ''

  return (
    <div className="min-w-0">
      {label && (
        <div className={hideLabel ? 'sr-only' : 'mb-2'}>
          {depth === 0 ? (
            <h3 className="text-base font-semibold">{label} <span className="font-normal text-secondary-500">({rows.length})</span></h3>
          ) : (
            <p className={labelClass.replace('mb-1.5', 'mb-0')}>{label} <span className="font-normal text-secondary-500">({rows.length})</span></p>
          )}
          {help && <p className="mt-1 text-xs text-secondary-600">{help}</p>}
        </div>
      )}

      {showSearch && (
        <div className="relative mb-3">
          <label htmlFor={idBase + '-search'} className="sr-only">Rechercher dans la liste ({rows.length} éléments)</label>
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-500" aria-hidden="true" />
          <input
            id={idBase + '-search'}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher par titre, auteur, année…"
            className="input-field pl-10"
          />
        </div>
      )}
      {filtering && (
        <p role="status" className="mb-3 text-sm text-secondary-600">
          {visibleRows.length} résultat{visibleRows.length > 1 ? 's' : ''} sur {rows.length}. Le réordonnancement est désactivé pendant une recherche.
        </p>
      )}

      {suggestionKeys.map((key) => (
        <datalist key={key} id={idBase + '-dl-' + key}>
          {suggestions[key].map((entry) => <option key={entry} value={entry} />)}
        </datalist>
      ))}

      {rows.length === 0 && (
        <p className="mb-3 rounded-md border border-dashed border-[#a5b0b2] px-4 py-5 text-sm italic text-secondary-600">
          Aucun {itemLabel} pour l’instant. Utilisez le bouton ci-dessous pour en ajouter un.
        </p>
      )}

      <ul className="space-y-2">
        {visibleRows.map(({ row, index }) => {
          const rowId = idBase + '-row-' + row.k
          const open = inline || expanded.has(row.k)
          const update = (next) => commit(rows.map((entry, i) => (i === index ? { ...entry, v: next } : entry)))
          const actions = (
            <div className="flex shrink-0 items-center">
              <button type="button" className={iconButton} disabled={filtering || index === 0} aria-label={'Monter : ' + titleOf(row.v, index)} onClick={() => commit(move(rows, index, -1))}>
                <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" className={iconButton} disabled={filtering || index === rows.length - 1} aria-label={'Descendre : ' + titleOf(row.v, index)} onClick={() => commit(move(rows, index, 1))}>
                <ArrowDownIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" className={iconButton} aria-label={'Dupliquer : ' + titleOf(row.v, index)} onClick={() => duplicate(index)}>
                <DocumentDuplicateIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" className={iconButton + ' hover:!text-red-700'} aria-label={'Supprimer : ' + titleOf(row.v, index)} onClick={() => remove(index)}>
                <TrashIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )

          if (inline) {
            return (
              <li key={row.k} className="rounded-md border bg-white p-3" style={{ borderColor: 'var(--line)' }}>
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <FieldGrid
                      fields={fields}
                      value={row.v}
                      onChange={update}
                      idBase={rowId}
                      suggestions={suggestions}
                      datalistBase={idBase}
                      depth={depth}
                    />
                  </div>
                  <div className="flex shrink-0 flex-col sm:flex-row">{actions}</div>
                </div>
              </li>
            )
          }

          return (
            <li key={row.k} className="rounded-md border bg-white" style={{ borderColor: 'var(--line)' }}>
              <div className="flex flex-wrap items-center gap-x-1 pl-1 pr-1">
                <button
                  type="button"
                  className="flex min-h-[44px] min-w-0 flex-1 basis-56 items-center gap-3 rounded-md px-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--teal)]"
                  aria-expanded={open}
                  aria-controls={rowId + '-panel'}
                  onClick={() => toggle(row.k)}
                >
                  <ChevronDownIcon className={'h-5 w-5 shrink-0 transition-transform ' + (open ? 'rotate-180' : '')} aria-hidden="true" />
                  <span className="w-7 shrink-0 text-xs tabular-nums text-secondary-500">{index + 1}</span>
                  <span className="truncate text-sm font-medium">{titleOf(row.v, index)}</span>
                </button>
                {actions}
              </div>
              {open && (
                <div id={rowId + '-panel'} className="border-t px-4 py-4" style={{ borderColor: 'var(--line)' }}>
                  <FieldGrid
                    fields={fields}
                    value={row.v}
                    onChange={update}
                    idBase={rowId}
                    suggestions={suggestions}
                    datalistBase={idBase}
                    depth={depth}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {filtering && visibleRows.length === 0 && (
        <p className="mt-2 text-sm italic text-secondary-600">Aucun résultat pour « {query} ».</p>
      )}

      <button type="button" className={addButton + ' mt-3'} onClick={add}>
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
        Ajouter un élément
      </button>
    </div>
  )
}
