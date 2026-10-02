import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { once } from 'node:events'
import bcrypt from 'bcryptjs'
import { createApp } from '../server.js'

const PASSWORD = 'Fixture-password-29!'

const openApps = new Set()

function tempDirectory(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-content-'))
  // Windows cannot delete an open SQLite file, so close every database before removing the folder.
  t.after(() => {
    for (const application of openApps) application.close()
    openApps.clear()
    fs.rmSync(directory, { recursive: true, force: true })
  })
  return directory
}

// Builds a database shaped like the pre-migration production one: placeholder `{}` contents, no about/theses/contact.
function legacyDatabase(directory) {
  const dbPath = path.join(directory, 'legacy.db')
  const { db, close } = createApp({ env: {}, dbPath, uploadDir: path.join(directory, 'uploads') })
  db.prepare('INSERT INTO users (id, email, password_hash) VALUES (1, ?, ?)').run('owner@example.test', bcrypt.hashSync(PASSWORD, 4))
  db.prepare('INSERT INTO profiles (user_id, nom, prenom) VALUES (1, ?, ?)').run('Owner', 'Test')
  const insert = db.prepare('INSERT INTO sections (id, user_id, title, type, content, visible, section_order) VALUES (?, 1, ?, ?, ?, 1, ?)')
  insert.run('axes-recherche', 'Axes de Recherche', 'research', JSON.stringify(['Réseaux', 'Blockchain']), 1)
  insert.run('competences', 'Compétences', 'skills', '{}', 2)
  insert.run('publications', 'Publications', 'publications', '{}', 3)
  insert.run('enseignement', 'Enseignement', 'teaching', JSON.stringify([{ id: 4, title: 'Réseaux', level: 'Licence 3' }]), 4)
  insert.run('projets', 'Projets', 'projects', '{}', 5)
  insert.run('responsabilites', 'Responsabilités', 'responsibilities', '{}', 6)
  close()
  return dbPath
}

async function serve(t, dbPath, directory) {
  const application = createApp({ env: {}, dbPath, uploadDir: path.join(directory, 'uploads') })
  openApps.add(application)
  const server = application.app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(async () => {
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
    application.close()
  })
  const url = `http://127.0.0.1:${server.address().port}`
  const request = (route, { method = 'GET', cookie, body } = {}) => fetch(url + route, {
    method,
    headers: { ...(body !== undefined && { 'Content-Type': 'application/json' }), ...(cookie && { Cookie: cookie }) },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  return { ...application, request }
}

test('migration moves hard-coded content into the database once', async t => {
  const directory = tempDirectory(t)
  const dbPath = legacyDatabase(directory)
  const first = await serve(t, dbPath, directory)
  const sections = first.db.prepare('SELECT id, type, title, content, meta, visible, section_order FROM sections ORDER BY section_order').all()
  assert.deepEqual(sections.map(section => section.type), ['about', 'research', 'skills', 'publications', 'theses', 'teaching', 'projects', 'responsibilities', 'contact'])
  assert.deepEqual(sections.map(section => section.section_order), [1, 2, 3, 4, 5, 6, 7, 8, 9])
  const byType = Object.fromEntries(sections.map(section => [section.type, { ...section, content: JSON.parse(section.content), meta: JSON.parse(section.meta) }]))
  for (const type of ['skills', 'publications', 'projects', 'responsibilities']) assert.ok(byType[type].content.length > 0, `${type} filled`)
  assert.equal(byType.publications.content.length, 35)
  assert.deepEqual(byType.research.content, [{ title: 'Réseaux', description: '' }, { title: 'Blockchain', description: '' }])
  assert.equal(byType.research.title, 'Recherche')
  assert.equal(byType.teaching.content[0].title, 'Réseaux', 'teaching courses are kept')
  assert.equal(byType.teaching.meta.blocks.length, 2)
  assert.equal(byType.theses.visible, 0, 'empty theses section starts hidden')
  assert.ok(sections.every(section => JSON.parse(section.meta)?.heading), 'every section has an editable heading')
  assert.deepEqual({ ...first.db.prepare('SELECT tagline, titre FROM profiles').get() }, { tagline: 'Recherche · Enseignement · Transmission', titre: 'Dr.' })

  // Owner deletes the contact section: a restart must not bring it back.
  first.db.prepare("DELETE FROM sections WHERE type = 'contact'").run()
  const second = await serve(t, dbPath, directory)
  assert.equal(second.db.prepare("SELECT count(*) AS count FROM sections WHERE type = 'contact'").get().count, 0)
})

test('section headings round-trip and are validated', async t => {
  const directory = tempDirectory(t)
  const { request } = await serve(t, legacyDatabase(directory), directory)
  const signin = await request('/api/auth/signin', { method: 'POST', body: { email: 'owner@example.test', password: PASSWORD } })
  const cookie = signin.headers.get('set-cookie').split(';')[0]
  const meta = { eyebrow: 'Recherche', heading: 'Nouveau titre,', accent: 'mis à jour.', intro: 'Intro', blocks: [{ title: 'Bloc', text: 'Texte', items: ['Un'] }] }
  assert.equal((await request('/api/sections/1/axes-recherche', { method: 'PUT', cookie, body: { meta } })).status, 200)
  const portfolio = await (await request('/api/portfolio')).json()
  assert.deepEqual(portfolio.sections.find(section => section.id === 'axes-recherche').meta, meta)
  assert.equal(portfolio.sections.find(section => section.id === 'axes-recherche').content.length, 2, 'meta-only update keeps content')
  assert.equal((await request('/api/sections/1/axes-recherche', { method: 'PUT', cookie, body: { meta: { heading: 'x', script: 'y' } } })).status, 400)
  assert.equal((await request('/api/sections/1/axes-recherche', { method: 'PUT', cookie, body: { meta: { intro: 'x'.repeat(3_001) } } })).status, 400)
  assert.equal((await request('/api/sections/1/axes-recherche', { method: 'PUT', cookie, body: { meta: { blocks: [{ title: 'a', items: [42] }] } } })).status, 400)
  assert.equal((await request('/api/profile/1', { method: 'PUT', cookie, body: { tagline: 'Recherche · Innovation' } })).status, 200)
  assert.equal((await (await request('/api/portfolio')).json()).profile.tagline, 'Recherche · Innovation')
})
