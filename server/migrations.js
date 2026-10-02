import { randomUUID } from 'node:crypto'
import { DEFAULT_CONTENT } from './defaultContent.js'

// Headings formerly hard-coded in the public components, now editable per section.
export const DEFAULT_META = {
  about: { eyebrow: 'Parcours académique', heading: 'La recherche,', accent: 'en partage.', intro: 'Un parcours consacré aux technologies de l’information, à l’enseignement et à la formation.' },
  research: { eyebrow: 'Recherche', heading: 'Explorer. Comprendre.', accent: 'Faire progresser.', intro: 'Réseaux, sécurité et technologies éducatives : des domaines complémentaires au service de la recherche et de l’innovation.' },
  skills: { eyebrow: 'Compétences', heading: 'Expertise technique,', accent: 'de l’infrastructure à l’IA.', intro: 'Une expertise technique approfondie dans les technologies de pointe, de l’administration système à l’intelligence artificielle.' },
  publications: { eyebrow: 'Publications', heading: 'Production scientifique,', accent: 'référencée.', intro: 'Mes contributions à la recherche dans les domaines des réseaux informatiques, de la sécurité et des technologies éducatives.' },
  theses: { eyebrow: 'Encadrement', heading: 'Accompagner les doctorants,', accent: 'de la question à la thèse.', intro: 'Encadrement de recherches en réseaux informatiques, sécurité et intelligence artificielle appliquée à l’éducation.' },
  teaching: {
    eyebrow: 'Enseignement', heading: 'Transmettre le savoir,', accent: 'former et innover.', intro: 'Mon engagement dans la formation des futurs ingénieurs et chercheurs en technologies de l’information et de la communication.',
    blocks: [
      { title: 'Pédagogie numérique', text: 'Développement et mise en œuvre de solutions d’enseignement à distance, intégration des nouvelles technologies dans les pratiques pédagogiques.', items: ['Plateformes d’apprentissage en ligne', 'Évaluation automatisée', 'Réalité virtuelle en éducation', 'Intelligence artificielle pédagogique'] },
      { title: 'Formation continue', text: 'Organisation de formations pour les professionnels et les enseignants sur les dernières avancées technologiques.', items: ['Ateliers sur l’IA en éducation', 'Formations en cybersécurité', 'Séminaires sur les réseaux', 'Conférences technologiques'] },
    ],
  },
  projects: { eyebrow: 'Projets', heading: 'Projets de recherche,', accent: 'd’innovation et de coopération.', intro: 'Découvrez mes contributions à des projets de recherche, d’innovation pédagogique et de transformation digitale dans l’enseignement supérieur.' },
  responsibilities: { eyebrow: 'Responsabilités', heading: 'Responsabilités,', accent: 'direction et gouvernance.', intro: 'Mes fonctions de direction et de gouvernance dans l’enseignement supérieur et la recherche scientifique.' },
  contact: { eyebrow: 'Échangeons', heading: 'Une question,', accent: 'une collaboration ?', intro: 'Pour un échange académique, un projet de recherche ou une demande d’encadrement, vous pouvez me joindre directement.' },
}

const NEW_SECTIONS = {
  about: { id: 'about', title: 'À propos', content: DEFAULT_CONTENT.about, visible: 1 },
  theses: { id: 'theses-encadrees', title: 'Encadrement', content: [], visible: 0 },
  contact: { id: 'contact', title: 'Contact', content: null, visible: 1 },
}
const ARRAY_DEFAULTS = { skills: DEFAULT_CONTENT.skills, publications: DEFAULT_CONTENT.publications, projects: DEFAULT_CONTENT.projects, responsibilities: DEFAULT_CONTENT.responsibilities }
const MIGRATION = 'v1-editable-content'

function parse(value) {
  try { return value ? JSON.parse(value) : null } catch { return null }
}

// Section ids are global, so a second account gets suffixed ids instead of colliding.
function freeId(db, id) {
  return db.prepare('SELECT id FROM sections WHERE id = ?').get(id) ? `${id}-${randomUUID().slice(0, 8)}` : id
}

function migrateUser(db, userId) {
  // Hero texts formerly hard-coded in HeroSection.
  db.prepare("UPDATE profiles SET tagline = COALESCE(tagline, ?), titre = COALESCE(titre, 'Dr.') WHERE user_id = ?").run('Recherche · Enseignement · Transmission', userId)
  const sections = db.prepare('SELECT * FROM sections WHERE user_id = ? ORDER BY section_order, id').all(userId)
  const update = db.prepare('UPDATE sections SET title = ?, content = ?, meta = ?, section_order = ? WHERE id = ?')
  const rows = sections.map(section => {
    let content = parse(section.content)
    // Empty `{}` placeholders meant "use the component defaults"; store those defaults instead.
    if (ARRAY_DEFAULTS[section.type] && !Array.isArray(content)) content = ARRAY_DEFAULTS[section.type]
    if (section.type === 'research' && Array.isArray(content)) content = content.map(item => typeof item === 'string' ? { title: item, description: '' } : item)
    const title = section.type === 'research' && section.title === 'Axes de Recherche' ? 'Recherche' : section.title
    return { ...section, title, content, meta: parse(section.meta) || DEFAULT_META[section.type] || null }
  })
  const has = type => rows.some(row => row.type === type)
  const create = type => ({ ...NEW_SECTIONS[type], id: freeId(db, NEW_SECTIONS[type].id), type, meta: DEFAULT_META[type], created: true })
  if (!has('about')) rows.unshift(create('about'))
  if (!has('theses')) {
    const after = rows.findIndex(row => row.type === 'publications')
    rows.splice(after === -1 ? rows.length : after + 1, 0, create('theses'))
  }
  if (!has('contact')) rows.push(create('contact'))
  const insert = db.prepare('INSERT INTO sections (id, user_id, title, type, content, meta, visible, section_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
  rows.forEach((row, index) => {
    const order = index + 1
    const content = JSON.stringify(row.content)
    const meta = row.meta ? JSON.stringify(row.meta) : null
    if (row.created) insert.run(row.id, userId, row.title, row.type, content, meta, row.visible, order)
    else update.run(row.title, content, meta, order, row.id)
  })
}

export function migrateDatabase(db) {
  const columns = table => db.prepare(`PRAGMA table_info(${table})`).all().map(column => column.name)
  if (!columns('sections').includes('meta')) db.exec('ALTER TABLE sections ADD COLUMN meta TEXT')
  if (!columns('profiles').includes('tagline')) db.exec('ALTER TABLE profiles ADD COLUMN tagline TEXT')
  if (!columns('profiles').includes('titre')) db.exec('ALTER TABLE profiles ADD COLUMN titre TEXT')
  db.exec('CREATE TABLE IF NOT EXISTS content_migrations (user_id INTEGER NOT NULL, name TEXT NOT NULL, PRIMARY KEY (user_id, name))')
  // Runs once per account, so sections the owner deletes later are never recreated.
  const pending = db.prepare('SELECT user_id FROM profiles WHERE user_id NOT IN (SELECT user_id FROM content_migrations WHERE name = ?)').all(MIGRATION)
  const done = db.prepare('INSERT INTO content_migrations (user_id, name) VALUES (?, ?)')
  for (const { user_id: userId } of pending) {
    db.transaction(() => {
      migrateUser(db, userId)
      done.run(userId, MIGRATION)
    })()
  }
}
