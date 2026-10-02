import React from 'react'
import { FieldInput } from './FieldEditors'
import { BLOCKS_FIELD } from './schemas'

const TEXT_FIELDS = [
  { key: 'eyebrow', label: 'Sur-titre (eyebrow)', kind: 'text', help: 'Petit libellé en capitales au-dessus du titre. Par défaut : le nom de la section.' },
  { key: 'heading', label: 'Titre principal', kind: 'text', help: 'Titre affiché en grand dans la section. Par défaut : le nom de la section.' },
  { key: 'accent', label: 'Fin de titre en italique', kind: 'text', help: 'Optionnel : affiché sur la ligne suivante, en italique.' },
  { key: 'intro', label: 'Introduction', kind: 'textarea', rows: 3, help: 'Court paragraphe à côté du titre (texte brut).' },
]

// Header fields of a section: nav label, eyebrow, heading, accent, intro and complementary blocks.
const MetaEditor = ({ title, onTitleChange, meta, onMetaChange, idBase = 'meta' }) => {
  const setField = (key, value) => onMetaChange({ ...meta, [key]: value })

  return (
    <div className="space-y-6">
      <FieldInput
        field={{ key: 'title', label: 'Titre (libellé du menu)', kind: 'text', required: true, help: 'Nom court affiché dans la navigation du site et dans cette liste.' }}
        id={idBase + '-title'}
        value={title}
        onChange={onTitleChange}
      />
      {TEXT_FIELDS.map((field) => (
        <FieldInput
          key={field.key}
          field={field}
          id={idBase + '-' + field.key}
          value={meta[field.key]}
          onChange={(value) => setField(field.key, value)}
        />
      ))}
      <FieldInput
        field={BLOCKS_FIELD}
        id={idBase + '-blocks'}
        value={meta.blocks}
        onChange={(value) => setField('blocks', value)}
      />
    </div>
  )
}

export default MetaEditor
