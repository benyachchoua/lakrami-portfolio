// Schemas describing how each section type is edited in /admin.
// Field kinds: text | textarea | select | stringList | objectList.

export const makeId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return String(Date.now()) + '-' + Math.random().toString(36).slice(2, 10)
}

const str = (value) => (typeof value === 'string' ? value : value == null ? '' : String(value))
const clone = (value) => (value === undefined ? value : JSON.parse(JSON.stringify(value)))
const firstFilled = (item, keys) => {
  for (const key of keys) {
    const value = str(item?.[key]).trim()
    if (value) return value
  }
  return ''
}
const shorten = (text, max = 90) => (text.length > max ? text.slice(0, max - 1) + '…' : text)

// Blank value for a field of the given kind.
export const blankValue = (field) => {
  if (field.kind === 'stringList' || field.kind === 'objectList') return []
  if (field.kind === 'select' && field.defaultValue !== undefined) return field.defaultValue
  return ''
}

export const blankObject = (fields) => {
  const item = {}
  fields.forEach((field) => { item[field.key] = blankValue(field) })
  return item
}

const YEAR_FIELD = { key: 'year', label: 'Année', kind: 'text', placeholder: 'ex. 2024' }

const FACTS_FIELD = {
  key: 'facts',
  label: 'Informations clés',
  help: 'Paires libellé / valeur affichées sous forme de fiche (ex. Financement : ANR).',
  kind: 'objectList',
  inline: true,
  itemLabel: 'information',
  fields: [
    { key: 'label', label: 'Libellé', kind: 'text' },
    { key: 'value', label: 'Valeur', kind: 'text' },
  ],
}

export const BLOCK_FIELDS = [
  { key: 'title', label: 'Titre du bloc', kind: 'text', required: true },
  { key: 'text', label: 'Texte', kind: 'textarea', rows: 4 },
  { key: 'items', label: 'Puces', kind: 'stringList', addLabel: 'Ajouter une puce', multiline: true },
]

export const BLOCKS_FIELD = {
  key: 'blocks',
  label: 'Blocs complémentaires',
  help: 'Blocs de texte affichés à la fin de la section.',
  kind: 'objectList',
  itemLabel: 'bloc',
  fields: BLOCK_FIELDS,
  itemTitle: (item) => firstFilled(item, ['title']) || 'Bloc sans titre',
}

const titleOf = (keys, fallback) => (item) => shorten(firstFilled(item, keys)) || fallback

export const SCHEMAS = {
  about: {
    label: 'À propos',
    description: 'Formations et langues. Affiliation et liens viennent du profil.',
    root: 'object',
    emptyContent: () => ({ formations: [], langues: [] }),
    fields: [
      {
        key: 'formations',
        label: 'Formations',
        kind: 'objectList',
        inline: true,
        itemLabel: 'formation',
        fields: [
          { ...YEAR_FIELD },
          { key: 'title', label: 'Diplôme / intitulé', kind: 'text', required: true },
          { key: 'institution', label: 'Établissement', kind: 'text' },
        ],
        itemTitle: titleOf(['title'], 'Nouvelle formation'),
      },
      { key: 'langues', label: 'Langues parlées', kind: 'stringList', addLabel: 'Ajouter une langue', placeholder: 'ex. Français' },
    ],
  },

  research: {
    label: 'Axes de recherche',
    description: 'Liste d’axes avec titre et description.',
    root: 'array',
    itemLabel: 'axe de recherche',
    hasId: false,
    fields: [
      { key: 'title', label: 'Titre', kind: 'text', required: true },
      { key: 'description', label: 'Description', kind: 'textarea', rows: 4 },
    ],
    itemTitle: titleOf(['title', 'description'], 'Nouvel axe'),
  },

  skills: {
    label: 'Compétences',
    description: 'Domaines de compétences avec listes et groupes.',
    root: 'array',
    itemLabel: 'domaine',
    hasId: true,
    fields: [
      { key: 'title', label: 'Titre du domaine', kind: 'text', required: true },
      { key: 'description', label: 'Description', kind: 'textarea', rows: 3 },
      { key: 'skills', label: 'Compétences', kind: 'stringList', addLabel: 'Ajouter une compétence' },
      {
        key: 'groups',
        label: 'Groupes d’éléments',
        help: 'Regroupements optionnels (ex. Langages : Python, R…).',
        kind: 'objectList',
        itemLabel: 'groupe',
        fields: [
          { key: 'label', label: 'Libellé du groupe', kind: 'text', required: true },
          { key: 'items', label: 'Éléments', kind: 'stringList', addLabel: 'Ajouter un élément' },
        ],
        itemTitle: titleOf(['label'], 'Nouveau groupe'),
      },
    ],
    itemTitle: titleOf(['title'], 'Nouveau domaine'),
  },

  publications: {
    label: 'Publications',
    description: 'Articles et communications.',
    root: 'array',
    itemLabel: 'publication',
    hasId: true,
    fields: [
      {
        key: 'kind',
        label: 'Nature',
        kind: 'select',
        defaultValue: 'article',
        options: [
          { value: 'article', label: 'Article' },
          { value: 'communication', label: 'Communication' },
        ],
      },
      { key: 'domain', label: 'Domaine', kind: 'text', suggest: true },
      { key: 'title', label: 'Titre', kind: 'textarea', rows: 2, required: true },
      { key: 'authors', label: 'Auteurs', kind: 'text' },
      { key: 'source', label: 'Revue / conférence', kind: 'text' },
      { key: 'pages', label: 'Pages / volume', kind: 'text' },
      { ...YEAR_FIELD, suggest: true },
      { key: 'type', label: 'Indexation / type', kind: 'text', suggest: true, placeholder: 'ex. SCOPUS' },
      { key: 'link', label: 'Lien (URL)', kind: 'text', inputType: 'url', placeholder: 'https://…' },
    ],
    itemTitle: (item) => {
      const title = shorten(firstFilled(item, ['title'])) || 'Nouvelle publication'
      const year = firstFilled(item, ['year'])
      return year ? year + ' · ' + title : title
    },
  },

  theses: {
    label: 'Thèses encadrées',
    description: 'Doctorants et thèses en cours ou soutenues.',
    root: 'array',
    itemLabel: 'thèse',
    hasId: true,
    fields: [
      { key: 'title', label: 'Titre de la thèse', kind: 'textarea', rows: 2, required: true },
      { key: 'candidate', label: 'Doctorant(e)', kind: 'text' },
      { key: 'domain', label: 'Domaine', kind: 'text', suggest: true },
      { ...YEAR_FIELD },
      {
        key: 'status',
        label: 'Statut',
        kind: 'select',
        defaultValue: 'En cours',
        options: ['En cours', 'Soutenue'],
      },
      { key: 'cotutelle', label: 'Cotutelle', kind: 'text', placeholder: 'ex. Université de Lyon' },
      { key: 'description', label: 'Description', kind: 'textarea', rows: 3 },
    ],
    itemTitle: (item) => {
      const title = shorten(firstFilled(item, ['title'])) || 'Nouvelle thèse'
      const who = firstFilled(item, ['candidate'])
      return who ? who + ' · ' + title : title
    },
  },

  teaching: {
    label: 'Enseignement',
    description: 'Cours (modifiés dans « Gérer mes cours ») et blocs pédagogiques.',
    root: 'external',
    emptyContent: () => [],
  },

  projects: {
    label: 'Projets',
    description: 'Projets de recherche avec objectifs et sous-projets.',
    root: 'array',
    itemLabel: 'projet',
    hasId: true,
    fields: [
      { key: 'title', label: 'Titre', kind: 'text', required: true },
      { key: 'category', label: 'Catégorie', kind: 'text', suggest: true },
      { ...YEAR_FIELD, placeholder: 'ex. 2023 – 2026' },
      { key: 'status', label: 'Statut', kind: 'text', suggest: true, placeholder: 'ex. En cours' },
      { key: 'description', label: 'Description', kind: 'textarea', rows: 4 },
      { ...FACTS_FIELD },
      { key: 'objectives', label: 'Objectifs', kind: 'stringList', addLabel: 'Ajouter un objectif', multiline: true },
      {
        key: 'subprojects',
        label: 'Sous-projets',
        kind: 'objectList',
        itemLabel: 'sous-projet',
        fields: [
          { key: 'title', label: 'Titre', kind: 'text', required: true },
          { key: 'description', label: 'Description', kind: 'textarea', rows: 3 },
        ],
        itemTitle: titleOf(['title'], 'Nouveau sous-projet'),
      },
    ],
    itemTitle: titleOf(['title'], 'Nouveau projet'),
  },

  responsibilities: {
    label: 'Responsabilités',
    description: 'Responsabilités administratives et scientifiques.',
    root: 'array',
    itemLabel: 'responsabilité',
    hasId: true,
    fields: [
      { key: 'title', label: 'Intitulé', kind: 'text', required: true },
      { key: 'organization', label: 'Organisation', kind: 'text' },
      { key: 'period', label: 'Période', kind: 'text', placeholder: 'ex. 2021 – aujourd’hui' },
      { key: 'status', label: 'Statut', kind: 'text', suggest: true, placeholder: 'ex. En cours' },
      { key: 'description', label: 'Description', kind: 'textarea', rows: 4 },
      { ...FACTS_FIELD },
      { key: 'missions', label: 'Missions', kind: 'stringList', addLabel: 'Ajouter une mission', multiline: true },
    ],
    itemTitle: titleOf(['title'], 'Nouvelle responsabilité'),
  },

  contact: {
    label: 'Contact',
    description: 'Coordonnées issues du profil.',
    root: 'none',
    emptyContent: () => null,
  },

  text: {
    label: 'Texte libre',
    description: 'Un bloc de texte (HTML simple accepté).',
    root: 'html',
    emptyContent: () => '',
  },

  list: {
    label: 'Liste simple',
    description: 'Une liste de lignes de texte.',
    root: 'stringArray',
    emptyContent: () => [],
  },

  cards: {
    label: 'Cartes',
    description: 'Cartes avec titre et description.',
    root: 'array',
    itemLabel: 'carte',
    hasId: false,
    fields: [
      { key: 'title', label: 'Titre', kind: 'text', required: true },
      { key: 'description', label: 'Description', kind: 'textarea', rows: 4 },
    ],
    itemTitle: titleOf(['title', 'description'], 'Nouvelle carte'),
  },
}

// Types in the order proposed in the "add a section" form.
export const SECTION_TYPES = Object.keys(SCHEMAS).map((value) => ({
  value,
  label: SCHEMAS[value].label,
  description: SCHEMAS[value].description,
}))

export const UNIQUE_TYPES = ['about', 'contact']

export const typeLabel = (type) => SCHEMAS[type]?.label || type

export const isStructured = (type) => ['array', 'object', 'stringArray'].includes(SCHEMAS[type]?.root)

// Item title for the collapsed row. Falls back to a generic label.
export const itemTitle = (type, item) => {
  const schema = SCHEMAS[type]
  if (!schema || !schema.itemTitle) return 'Élément'
  return schema.itemTitle(item || {})
}

// New array item for the given type (ids via crypto.randomUUID when the type uses ids).
export const newItem = (type) => {
  const schema = SCHEMAS[type]
  if (!schema || !schema.fields) return {}
  const item = blankObject(schema.fields)
  return schema.hasId ? { id: makeId(), ...item } : item
}

export const emptyContent = (type) => (SCHEMAS[type]?.emptyContent ? SCHEMAS[type].emptyContent() : [])

// Copy of an item with fresh ids at the root, for "Dupliquer".
export const duplicateItem = (item, hasId) => {
  const copy = clone(item)
  if (hasId && copy && typeof copy === 'object') copy.id = makeId()
  return copy
}

const asObjectItem = (raw, schema) => {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) return clone(raw)
  const base = blankObject(schema.fields)
  const text = str(raw)
  if (text) base[schema.fields[0].key] = text
  return base
}

const fillFields = (item, fields) => {
  fields.forEach((field) => {
    const value = item[field.key]
    if (field.kind === 'stringList') {
      item[field.key] = Array.isArray(value) ? value.map(str) : []
    } else if (field.kind === 'objectList') {
      item[field.key] = Array.isArray(value)
        ? value.map((entry) => fillFields(entry && typeof entry === 'object' ? { ...entry } : { [field.fields[0].key]: str(entry) }, field.fields))
        : []
    } else if (value === undefined || value === null) {
      item[field.key] = blankValue(field)
    } else if (typeof value !== 'string') {
      item[field.key] = str(value)
    }
  })
  return item
}

// Normalise stored content (legacy shapes included) into the shape the editor expects.
export const normalizeContent = (type, content) => {
  const schema = SCHEMAS[type]
  if (!schema) return clone(content)
  if (schema.root === 'object') {
    const source = content && typeof content === 'object' && !Array.isArray(content) ? clone(content) : {}
    return fillFields(source, schema.fields)
  }
  if (schema.root === 'array') {
    let list = []
    if (Array.isArray(content)) list = content
    else if (typeof content === 'string' && content.trim()) list = [{ [schema.fields[0].key === 'title' && schema.fields[1] ? schema.fields[1].key : schema.fields[0].key]: content }]
    return list.map((raw) => {
      const item = fillFields(asObjectItem(raw, schema), schema.fields)
      if (schema.hasId && !item.id) item.id = makeId()
      return item
    })
  }
  if (schema.root === 'stringArray') return Array.isArray(content) ? content.map(str) : []
  if (schema.root === 'html') return typeof content === 'string' ? content : ''
  return clone(content)
}

const isBlank = (value) => (Array.isArray(value) ? value.length === 0 : !str(value).trim())

const cleanFields = (item, fields) => {
  const next = { ...item }
  fields.forEach((field) => {
    if (field.kind === 'stringList') {
      next[field.key] = (next[field.key] || []).map((entry) => str(entry).trim()).filter(Boolean)
    } else if (field.kind === 'objectList') {
      next[field.key] = (next[field.key] || [])
        .map((entry) => cleanFields(entry, field.fields))
        .filter((entry) => !field.fields.every((sub) => isBlank(entry[sub.key])))
    } else if (typeof next[field.key] === 'string') {
      next[field.key] = next[field.key].trim()
    }
  })
  return next
}

// Trim strings and drop empty list entries before saving.
export const cleanContent = (type, content) => {
  const schema = SCHEMAS[type]
  if (!schema) return content
  if (schema.root === 'object') return cleanFields(content || {}, schema.fields)
  if (schema.root === 'array') return (content || []).map((item) => cleanFields(item, schema.fields))
  if (schema.root === 'stringArray') return (content || []).map((entry) => str(entry).trim()).filter(Boolean)
  return content
}

const requiredErrors = (value, fields, where, errors) => {
  fields.forEach((field) => {
    if (field.required && isBlank(value?.[field.key])) errors.push(where + ' : « ' + field.label + ' » est requis.')
    if (field.kind === 'objectList') {
      (value?.[field.key] || []).forEach((entry, index) => {
        requiredErrors(entry, field.fields, where + ' › ' + field.label + ' ' + (index + 1), errors)
      })
    }
  })
}

// Returns a list of human-readable problems (empty when valid).
export const validateContent = (type, content) => {
  const schema = SCHEMAS[type]
  const errors = []
  if (!schema) return errors
  if (schema.root === 'object') requiredErrors(content, schema.fields, schema.label, errors)
  if (schema.root === 'array') {
    ;(content || []).forEach((item, index) => requiredErrors(item, schema.fields, schema.label + ' #' + (index + 1), errors))
  }
  return errors
}

export const cleanMeta = (meta) => {
  const source = meta && typeof meta === 'object' ? meta : {}
  const result = {}
  ;['eyebrow', 'heading', 'accent', 'intro'].forEach((key) => {
    const value = str(source[key]).trim()
    if (value) result[key] = value
  })
  const blocks = cleanFields({ blocks: Array.isArray(source.blocks) ? source.blocks : [] }, [BLOCKS_FIELD]).blocks
    .filter((block) => str(block.title).trim() || str(block.text).trim() || block.items.length)
  if (blocks.length) result.blocks = blocks
  return result
}

export const normalizeMeta = (meta, fallbackHeading = '') => {
  const source = meta && typeof meta === 'object' ? meta : {}
  return {
    eyebrow: str(source.eyebrow),
    heading: str(source.heading) || fallbackHeading,
    accent: str(source.accent),
    intro: str(source.intro),
    blocks: fillFields({ blocks: Array.isArray(source.blocks) ? clone(source.blocks) : [] }, [BLOCKS_FIELD]).blocks,
  }
}
