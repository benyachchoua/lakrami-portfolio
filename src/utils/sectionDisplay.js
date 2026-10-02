// Helpers d'affichage des sections publiques (ancres, numérotation, ordre).
// Le contrat de données est décrit dans la documentation du portfolio : tout le contenu vient de la base.

const TYPE_ANCHORS = {
  about: 'about',
  research: 'research',
  skills: 'competences',
  publications: 'publications',
  theses: 'theses',
  teaching: 'teaching',
  projects: 'projects',
  responsibilities: 'responsibilities',
  contact: 'contact',
}

// Ancres réservées (le héros est toujours "home")
const RESERVED_ANCHORS = ['home']

const isVisible = (section) => Boolean(section) && section.visible !== false && section.visible !== 0

// Sections visibles, triées par `order` (tri stable en cas d'égalité)
export const visibleSections = (sections) => (Array.isArray(sections) ? sections : [])
  .filter(isVisible)
  .map((section, index) => ({ section, index }))
  .sort((a, b) => (Number(a.section.order) || 0) - (Number(b.section.order) || 0) || a.index - b.index)
  .map(({ section }) => section)

// Les sections numérotées sont toutes les sections visibles sauf le contact
export const isNumberedSection = (section) => section?.type !== 'contact'

export const numberedSections = (sections) => visibleSections(sections).filter(isNumberedSection)

// Calcule l'ancre de chaque section visible (la 2e section d'un même type reçoit `<ancre>-<id>`)
const computeAnchors = (ordered) => {
  const used = new Set(RESERVED_ANCHORS)
  const anchors = new Map()
  ordered.forEach(section => {
    const base = TYPE_ANCHORS[section.type] || String(section.id)
    const anchor = used.has(base) ? `${base}-${section.id}` : base
    used.add(anchor)
    anchors.set(section.id, anchor)
  })
  return anchors
}

// Ancre (id de l'élément <section>) d'une section, calculée par rapport à l'ensemble des sections
export const sectionAnchor = (section, sections) => {
  const ordered = visibleSections(sections)
  if (!ordered.some(item => item.id === section?.id)) ordered.push(section)
  return computeAnchors(ordered).get(section?.id)
}

// Liste ordonnée { section, anchor, number } des sections visibles (number = null pour le contact)
export const buildSectionEntries = (sections) => {
  const ordered = visibleSections(sections)
  const anchors = computeAnchors(ordered)
  let counter = 0
  return ordered.map(section => ({
    section,
    anchor: anchors.get(section.id),
    number: isNumberedSection(section) ? ++counter : null,
  }))
}

export const formatNumber = (number) => String(number).padStart(2, '0')

export const getMeta = (section) => (section && section.meta && typeof section.meta === 'object' ? section.meta : {})

// Tableau garanti (contenus null / non conformes => [])
export const asArray = (value) => (Array.isArray(value) ? value : [])

// Chaîne non vide
export const hasText = (value) => typeof value === 'string' && value.trim().length > 0

// Tableau de chaînes non vides
export const stringList = (value) => asArray(value).map(item => (typeof item === 'string' ? item : item == null ? '' : String(item))).filter(item => item.trim())
