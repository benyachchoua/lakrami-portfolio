import React, { useState } from 'react'
import { FieldGrid, ObjectListEditor, StringListEditor } from './FieldEditors'
import { SCHEMAS, itemTitle, newItem } from './schemas'

const cloneDeep = (value) => (value === undefined ? value : JSON.parse(JSON.stringify(value)))

// Schema-driven editor for the content of structured section types.
// `value` must already be normalised (see normalizeContent); it is copied once into local state.
const StructuredEditor = ({ type, value, onChange, idBase = 'content' }) => {
  const schema = SCHEMAS[type]
  const [content, setContent] = useState(() => cloneDeep(value))

  const update = (next) => {
    setContent(next)
    onChange(next)
  }

  if (!schema) {
    return <p className="text-sm text-secondary-600">Ce type de section n’a pas d’éditeur structuré.</p>
  }

  if (schema.root === 'object') {
    return (
      <div className="space-y-8">
        {schema.fields.map((field) => (
          <FieldGrid
            key={field.key}
            fields={[{ ...field }]}
            value={content}
            idBase={idBase}
            depth={-1}
            onChange={update}
          />
        ))}
      </div>
    )
  }

  if (schema.root === 'stringArray') {
    return (
      <StringListEditor
        id={idBase}
        label="Éléments de la liste"
        value={content}
        onChange={update}
        addLabel="Ajouter un élément"
        multiline
      />
    )
  }

  return (
    <ObjectListEditor
      idBase={idBase}
      label={schema.label}
      hideLabel
      fields={schema.fields}
      value={content}
      onChange={update}
      itemTitle={(item) => itemTitle(type, item)}
      newItem={() => newItem(type)}
      itemLabel={schema.itemLabel}
      hasId={schema.hasId}
    />
  )
}

export default StructuredEditor
