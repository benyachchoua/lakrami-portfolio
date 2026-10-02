import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import multer from 'multer'
import fs from 'node:fs'
import { initDatabase } from './database.js'
import {
  RequestError, allowFields, createRateLimiter, createSessions, detectImage,
  requireSession, requireOwner, validEmail, validPassword, validSectionId,
  validUserId, validateProfile, validateSection,
} from './security.js'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// Explicit paths let integration tests use disposable databases and upload folders.
export function createApp({ env = process.env, dbPath = env.DB_PATH || path.join(rootDir, 'portfolio.db'), uploadDir = env.UPLOAD_DIR || path.join(rootDir, 'uploads') } = {}) {
  const app = express()
  const db = new Database(dbPath)
  const production = env.NODE_ENV === 'production'
  db.pragma('foreign_keys = ON')
  initDatabase(db, env)
  const sessions = createSessions(db, { production })
  const dummyPasswordHash = bcrypt.hashSync(randomUUID(), 12)
  const origins = new Set((env.CORS_ORIGINS || (production ? '' : 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001')).split(',').map(origin => origin.trim()).filter(Boolean))
  const originAllowed = (req, origin) => origins.has(origin) || origin === `${req.protocol}://${req.get('host')}`

  app.disable('x-powered-by')
  app.use((req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    })
    if (production) {
      res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
      // Rich-text content uses inline presentation styles; scripts remain self-only.
      res.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http:; font-src 'self'; connect-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'")
    }
    next()
  })
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    const origin = req.get('origin')
    if (origin && !originAllowed(req, origin)) return res.status(403).json({ success: false, error: 'Origine non autorisée' })
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.get('sec-fetch-site') === 'cross-site') return res.status(403).json({ success: false, error: 'Origine non autorisée' })
    next()
  })
  app.use(cors((req, callback) => callback(null, {
    origin: req.get('origin') && originAllowed(req, req.get('origin')) ? req.get('origin') : false,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })))
  app.use('/api', createRateLimiter({ limit: 600, windowMs: 60_000 }))
  app.use(express.json({ limit: '2mb', strict: true }))
  app.use('/api', sessions.load)
  app.param('userId', (req, res, next, value) => validUserId(value) ? next() : res.status(400).json({ success: false, error: 'Identifiant invalide' }))
  app.param('sectionId', (req, res, next, value) => validSectionId(value) ? next() : res.status(400).json({ success: false, error: 'Identifiant de section invalide' }))

  app.post('/api/auth/signin', createRateLimiter({ limit: 10, windowMs: 15 * 60_000 }), async (req, res, next) => {
    try {
      allowFields(req.body, ['email', 'password'])
      const { email, password } = req.body
      if (!validEmail(email) || !validPassword(password)) throw new RequestError('Email ou mot de passe invalide')
      const user = db.prepare('SELECT id, email, password_hash FROM users WHERE email = ? COLLATE NOCASE').get(email.trim())
      const valid = await bcrypt.compare(password, user?.password_hash || dummyPasswordHash)
      if (!user || !valid) return res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect' })
      sessions.issue(req, res, user.id)
      res.json({ success: true, user: { id: user.id, email: user.email } })
    } catch (error) { next(error) }
  })
  app.get('/api/auth/session', (req, res) => res.json({ success: true, user: req.user }))
  app.post('/api/auth/signout', (req, res) => {
    sessions.clear(req, res)
    res.json({ success: true })
  })

  function readProfile(userId) {
    return db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId) || null
  }
  function formatSection(section) {
    let content = null
    try { content = section.content ? JSON.parse(section.content) : null } catch { /* Retain legacy invalid JSON without exposing internal errors. */ }
    return { ...section, content, visible: Boolean(section.visible), order: section.section_order }
  }
  function readSections(userId, owner = false) {
    return db.prepare(`SELECT * FROM sections WHERE user_id = ? ${owner ? '' : 'AND visible = 1'} ORDER BY section_order, id`).all(userId).map(formatSection)
  }
  app.get('/api/portfolio', (req, res) => {
    const userId = validUserId(env.PUBLIC_USER_ID) ? Number(env.PUBLIC_USER_ID) : db.prepare('SELECT user_id FROM profiles ORDER BY user_id LIMIT 1').get()?.user_id
    res.json({ profile: userId ? readProfile(userId) : null, sections: userId ? readSections(userId) : [] })
  })
  app.get('/api/profile/:userId', (req, res) => {
    const profile = readProfile(req.params.userId)
    if (!profile) return res.status(404).json({ success: false, error: 'Profil introuvable' })
    res.json(profile)
  })
  app.put('/api/profile/:userId', requireSession, requireOwner, (req, res) => {
    const changes = validateProfile(req.body)
    const fields = Object.keys(changes)
    const exists = readProfile(req.user.id)
    // Column names come exclusively from validateProfile's allowlist.
    if (exists) db.prepare(`UPDATE profiles SET ${fields.map(field => `${field} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`).run(...fields.map(field => changes[field]), req.user.id)
    else db.prepare(`INSERT INTO profiles (user_id, ${fields.join(', ')}) VALUES (?, ${fields.map(() => '?').join(', ')})`).run(req.user.id, ...fields.map(field => changes[field]))
    res.json({ success: true, changes: 1, ...(!exists && { created: true }) })
  })
  app.get('/api/sections/:userId', (req, res) => res.json(readSections(req.params.userId, req.user?.id === Number(req.params.userId))))

  app.put('/api/sections/reorder', requireSession, (req, res) => {
    allowFields(req.body, ['sections'])
    const { sections } = req.body
    if (!Array.isArray(sections) || !sections.length || sections.length > 500) throw new RequestError('Liste de sections invalide')
    const ids = new Set()
    for (const section of sections) {
      allowFields(section, ['id', 'order'])
      if (!validSectionId(section.id) || !Number.isSafeInteger(section.order) || section.order < 0 || section.order > 100_000 || ids.has(section.id)) throw new RequestError('Ordre de sections invalide')
      ids.add(section.id)
      if (!db.prepare('SELECT id FROM sections WHERE id = ? AND user_id = ?').get(section.id, req.user.id)) throw new RequestError('Section introuvable', 404)
    }
    const update = db.prepare('UPDATE sections SET section_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?')
    db.transaction(() => {
      for (const section of sections) update.run(section.order, section.id, req.user.id)
    })()
    res.json({ success: true })
  })
  app.put('/api/sections/:userId/:sectionId', requireSession, requireOwner, (req, res) => {
    const { sectionId } = req.params
    const existing = db.prepare('SELECT * FROM sections WHERE id = ? AND user_id = ?').get(sectionId, req.user.id)
    const section = validateSection(req.body, existing ? formatSection(existing) : null)
    if (existing) db.prepare('UPDATE sections SET title = ?, type = ?, content = ?, visible = ?, section_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?').run(section.title, section.type, JSON.stringify(section.content), section.visible ? 1 : 0, section.order, sectionId, req.user.id)
    else {
      if (db.prepare('SELECT id FROM sections WHERE id = ?').get(sectionId)) throw new RequestError('Identifiant de section indisponible', 409)
      db.prepare('INSERT INTO sections (id, user_id, title, type, content, visible, section_order) VALUES (?, ?, ?, ?, ?, ?, ?)').run(sectionId, req.user.id, section.title, section.type, JSON.stringify(section.content), section.visible ? 1 : 0, section.order)
    }
    res.json({ success: true, changes: 1 })
  })
  app.post('/api/sections/:userId', requireSession, requireOwner, (req, res) => {
    const section = validateSection(req.body)
    const id = `section-${randomUUID()}`
    db.prepare('INSERT INTO sections (id, user_id, title, type, content, visible, section_order) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, req.user.id, section.title, section.type, JSON.stringify(section.content), section.visible ? 1 : 0, section.order)
    res.status(201).json({ success: true, id })
  })
  app.delete('/api/sections/:userId/:sectionId', requireSession, requireOwner, (req, res) => {
    const result = db.prepare('DELETE FROM sections WHERE id = ? AND user_id = ?').run(req.params.sectionId, req.user.id)
    if (!result.changes) throw new RequestError('Section introuvable', 404)
    res.json({ success: true, changes: result.changes })
  })

  app.post('/api/change-password', requireSession, createRateLimiter({ limit: 5, windowMs: 15 * 60_000, key: req => req.user.id }), async (req, res, next) => {
    try {
      allowFields(req.body, ['currentPassword', 'newPassword'])
      const { currentPassword, newPassword } = req.body
      if (!validPassword(currentPassword) || !validPassword(newPassword, 12)) throw new RequestError('Le nouveau mot de passe doit contenir au moins 12 caractères (72 octets maximum)')
      if (newPassword === currentPassword) throw new RequestError('Choisissez un mot de passe différent')
      const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id)
      if (!await bcrypt.compare(currentPassword, user.password_hash)) throw new RequestError('Mot de passe actuel incorrect')
      const passwordHash = await bcrypt.hash(newPassword, 12)
      db.transaction(() => {
        db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(passwordHash, req.user.id)
        sessions.revokeAll(req.user.id)
      })()
      sessions.issue(req, res, req.user.id)
      res.json({ success: true, message: 'Mot de passe modifié avec succès' })
    } catch (error) { next(error) }
  })

  const upload = multer({
    storage: multer.memoryStorage(),
    // Busboy rejects the first part when `parts: 1`, so files/fields bound the request instead.
    limits: { fileSize: 2 * 1024 * 1024, files: 1, fields: 0 },
    fileFilter(req, file, callback) {
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)) return callback(new RequestError('Formats autorisés : JPEG, PNG, GIF et WebP'))
      callback(null, true)
    },
  })
  app.post('/api/upload/photo', requireSession, createRateLimiter({ limit: 20, windowMs: 60 * 60_000, key: req => req.user.id }), upload.single('photo'), (req, res) => {
    if (!req.file) throw new RequestError('Aucun fichier fourni')
    const image = detectImage(req.file.buffer)
    if (!image || image.mime !== req.file.mimetype) throw new RequestError('Le contenu du fichier ne correspond pas à une image autorisée')
    const filename = `profile-${randomUUID()}.${image.extension}`
    fs.mkdirSync(uploadDir, { recursive: true })
    fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer, { flag: 'wx' })
    res.status(201).json({ success: true, url: `/uploads/${filename}`, filename })
  })
  app.get('/api/check-image/:filename', (req, res) => {
    const { filename } = req.params
    if (!/^[a-zA-Z0-9_-]+\.(?:png|jpe?g|gif|webp)$/i.test(filename)) throw new RequestError('Nom de fichier invalide')
    const exists = fs.existsSync(path.join(uploadDir, filename))
    res.json({ exists, ...(exists && { url: `/uploads/${filename}` }) })
  })
  app.use('/uploads', (req, res, next) => {
    // Prevent legacy SVG/HTML uploads from executing on this origin.
    if (!/^\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|gif|webp)$/i.test(req.path)) return res.sendStatus(404)
    res.set('Content-Security-Policy', "default-src 'none'; sandbox")
    next()
  }, express.static(uploadDir, { dotfiles: 'deny', index: false, fallthrough: false }))
  app.use('/api', (req, res) => res.status(404).json({ success: false, error: 'Route API introuvable' }))
  if (production) {
    app.use(express.static(path.join(rootDir, 'dist')))
    app.get('*', (req, res) => res.sendFile(path.join(rootDir, 'dist', 'index.html')))
  }
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error)
    const invalidJson = error.type === 'entity.parse.failed'
    const oversized = error.type === 'entity.too.large' || error.code === 'LIMIT_FILE_SIZE'
    const status = error instanceof RequestError ? error.status : oversized ? 413 : invalidJson || error instanceof multer.MulterError ? 400 : error.status === 404 ? 404 : 500
    if (status === 500) console.error('Erreur serveur:', error.message)
    res.status(status).json({ success: false, error: error instanceof RequestError ? error.message : oversized ? 'Fichier ou contenu trop volumineux' : status === 400 ? 'Requête invalide' : status === 404 ? 'Ressource introuvable' : 'Erreur serveur' })
  })
  return { app, db, close: () => db.close() }
}

export function startServer() {
  const { app, close } = createApp()
  const port = Number(process.env.PORT) || 3001
  const server = app.listen(port, () => console.log(`Serveur démarré sur le port ${port} (${process.env.NODE_ENV || 'development'})`))
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close(() => { close(); process.exit(0) }))
  return server
}
