import { createHash, randomBytes } from 'node:crypto'

export const SESSION_COOKIE = 'portfolio_session'
const SESSION_TTL = 8 * 60 * 60 * 1000
const PROFILE_FIELDS = ['nom', 'prenom', 'nationalite', 'gsm', 'grade', 'fonction', 'email', 'affiliation', 'laboratoire', 'equipe', 'mission', 'photo', 'linkedin', 'researchgate', 'youtube']
const METADATA_FIELDS = ['id', 'user_id', 'created_at', 'updated_at']
const SECTION_TYPES = new Set(['text', 'list', 'cards', 'research', 'skills', 'publications', 'teaching', 'projects', 'responsibilities', 'theses'])

export class RequestError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
  }
}

export function assertObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new RequestError('Données invalides')
}

export function allowFields(value, fields) {
  assertObject(value)
  if (Object.keys(value).some(key => !fields.includes(key))) throw new RequestError('Champ non autorisé')
}

export function validUserId(value) {
  return /^\d+$/.test(String(value)) && Number.isSafeInteger(Number(value)) && Number(value) > 0
}

export function validSectionId(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value)
}

export function validPassword(value, minimum = 1) {
  return typeof value === 'string' && value.length >= minimum && Buffer.byteLength(value, 'utf8') <= 72
}

export function validEmail(value) {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function safeUrl(value, photo = false) {
  if (!value) return true
  if (photo && /^\/uploads\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|gif|webp)$/i.test(value)) return true
  if (photo && /^data:image\/(?:png|jpeg|gif|webp);base64,[a-zA-Z0-9+/]+={0,2}$/.test(value)) return value.length <= 1_000_000
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password
  } catch {
    return false
  }
}

export function validateProfile(input) {
  allowFields(input, [...PROFILE_FIELDS, ...METADATA_FIELDS])
  const profile = {}
  for (const field of PROFILE_FIELDS) {
    if (!(field in input)) continue
    const value = input[field] ?? ''
    const maximum = field === 'photo' ? 1_000_000 : field === 'mission' ? 100_000 : 5_000
    if (typeof value !== 'string' || value.length > maximum) throw new RequestError(`Valeur invalide pour ${field}`)
    if (['photo', 'linkedin', 'researchgate', 'youtube'].includes(field) && !safeUrl(value, field === 'photo')) throw new RequestError(`Lien invalide pour ${field}`)
    if (field === 'email' && value && !validEmail(value)) throw new RequestError('Adresse email invalide')
    profile[field] = value
  }
  if (!Object.keys(profile).length) throw new RequestError('Aucune modification fournie')
  return profile
}

function validateContent(value, depth = 0) {
  if (depth > 20) throw new RequestError('Contenu trop imbriqué')
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return
  if (typeof value !== 'object') throw new RequestError('Contenu invalide')
  for (const [key, child] of Object.entries(value)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new RequestError('Clé de contenu non autorisée')
    validateContent(child, depth + 1)
  }
}

export function validateSection(input, existing = null) {
  allowFields(input, ['title', 'type', 'content', 'visible', 'order', 'section_order', ...METADATA_FIELDS])
  if (!['title', 'type', 'content', 'visible', 'order', 'section_order'].some(field => field in input)) throw new RequestError('Aucune modification fournie')
  const section = { title: '', type: 'text', content: '', visible: true, order: 0, ...existing, ...input }
  section.order = input.order ?? input.section_order ?? existing?.order ?? 0
  if (typeof section.title !== 'string' || !section.title.trim() || section.title.length > 200) throw new RequestError('Titre requis (200 caractères maximum)')
  if (!SECTION_TYPES.has(section.type)) throw new RequestError('Type de section invalide')
  if (![true, false, 0, 1].includes(section.visible)) throw new RequestError('Visibilité invalide')
  if (!Number.isSafeInteger(section.order) || section.order < 0 || section.order > 100_000) throw new RequestError('Ordre de section invalide')
  validateContent(section.content)
  if (JSON.stringify(section.content).length > 1_000_000) throw new RequestError('Contenu trop volumineux', 413)
  return section
}

export function createRateLimiter({ limit, windowMs, key = req => req.ip }) {
  const requests = new Map()
  return (req, res, next) => {
    const now = Date.now()
    const requestKey = key(req)
    if (requests.size >= 10_000) {
      for (const [id, entry] of requests) if (entry.expires <= now) requests.delete(id)
      if (requests.size >= 10_000 && !requests.has(requestKey)) return res.status(429).json({ success: false, error: 'Trop de requêtes. Réessayez plus tard.' })
    }
    let entry = requests.get(requestKey)
    if (!entry || entry.expires <= now) {
      entry = { count: 0, expires: now + windowMs }
      requests.set(requestKey, entry)
    }
    entry.count += 1
    if (entry.count > limit) {
      res.set('Retry-After', String(Math.ceil((entry.expires - now) / 1000)))
      return res.status(429).json({ success: false, error: 'Trop de tentatives. Réessayez plus tard.' })
    }
    next()
  }
}

export function createSessions(db, { production = false } = {}) {
  db.exec(`CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  ); CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at)`)
  const cookieOptions = { httpOnly: true, sameSite: 'strict', secure: production, path: '/api' }
  const hash = token => createHash('sha256').update(token).digest('hex')
  const readToken = req => {
    const cookie = req.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith(`${SESSION_COOKIE}=`))
    const token = cookie?.slice(SESSION_COOKIE.length + 1)
    return token && /^[a-f0-9]{64}$/.test(token) ? token : null
  }
  function revoke(req) {
    const token = readToken(req)
    if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hash(token))
  }
  return {
    load(req, res, next) {
      const token = readToken(req)
      req.user = token ? db.prepare(`SELECT users.id, users.email FROM sessions JOIN users ON users.id = sessions.user_id
        WHERE token_hash = ? AND expires_at > ?`).get(hash(token), Date.now()) ?? null : null
      if (req.user) res.set('Cache-Control', 'private, no-store')
      next()
    },
    issue(req, res, userId) {
      revoke(req)
      db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now())
      const token = randomBytes(32).toString('hex')
      db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(hash(token), userId, Date.now() + SESSION_TTL)
      res.cookie(SESSION_COOKIE, token, { ...cookieOptions, maxAge: SESSION_TTL })
    },
    clear(req, res) {
      revoke(req)
      res.clearCookie(SESSION_COOKIE, cookieOptions)
    },
    revokeAll(userId) {
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId)
    }
  }
}

export function requireSession(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, error: 'Connexion requise' })
  next()
}

export function requireOwner(req, res, next) {
  if (!validUserId(req.params.userId)) return res.status(400).json({ success: false, error: 'Identifiant invalide' })
  if (Number(req.params.userId) !== req.user.id) return res.status(403).json({ success: false, error: 'Accès refusé' })
  next()
}

export function detectImage(buffer) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return { mime: 'image/png', extension: 'png' }
  if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return { mime: 'image/jpeg', extension: 'jpg' }
  if (buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6))) return { mime: 'image/gif', extension: 'gif' }
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return { mime: 'image/webp', extension: 'webp' }
  return null
}
