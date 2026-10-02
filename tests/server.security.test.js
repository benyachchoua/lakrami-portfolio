import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { once } from 'node:events'
import { createHash } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { createApp } from '../server.js'

const PASSWORD = 'Fixture-password-29!'

async function fixture(t, env = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-security-'))
  const application = createApp({ env, dbPath: path.join(directory, 'test.db'), uploadDir: path.join(directory, 'uploads') })
  const server = application.app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(async () => {
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
    application.close()
    const resolved = path.resolve(directory)
    assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()))
    assert.match(path.basename(resolved), /^portfolio-security-/)
    fs.rmSync(resolved, { recursive: true, force: true })
  })
  const url = `http://127.0.0.1:${server.address().port}`
  const request = (route, { method = 'GET', cookie, body, headers = {} } = {}) => fetch(`${url}${route}`, {
    method,
    headers: { ...(body !== undefined && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}), ...headers },
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  })
  const signIn = async () => {
    const response = await request('/api/auth/signin', { method: 'POST', body: { email: 'owner@example.test', password: PASSWORD } })
    assert.equal(response.status, 200)
    return response.headers.get('set-cookie').split(';')[0]
  }
  return { ...application, directory, request, signIn }
}

function seed(db) {
  const hash = bcrypt.hashSync(PASSWORD, 4)
  db.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').run(17, 'owner@example.test', hash)
  db.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').run(42, 'other@example.test', hash)
  db.prepare('INSERT INTO profiles (user_id, nom, prenom) VALUES (?, ?, ?)').run(17, 'Original', 'Owner')
  db.prepare('INSERT INTO profiles (user_id, nom) VALUES (?, ?)').run(42, 'Other')
  const insert = db.prepare('INSERT INTO sections (id, user_id, title, type, content, visible, section_order) VALUES (?, ?, ?, ?, ?, ?, ?)')
  insert.run('public-section', 17, 'Public', 'cards', '[]', 1, 2)
  insert.run('private-section', 17, 'Draft', 'text', '"Confidential draft"', 0, 3)
  insert.run('other-section', 42, 'Other draft', 'text', '"Other content"', 0, 1)
}

test('new databases have no default administrator credentials', async t => {
  const { db, request } = await fixture(t)
  assert.equal(db.prepare('SELECT count(*) AS count FROM users').get().count, 0)
  assert.deepEqual(await (await request('/api/portfolio')).json(), { profile: null, sections: [] })
})

test('authentication, ownership, CSRF, visibility, validation and revocation', async t => {
  const { db, request, signIn } = await fixture(t)
  seed(db)
  const original = db.prepare('SELECT * FROM profiles WHERE user_id = 17').get()

  await t.test('forged identity cannot write or upload', async () => {
    for (const [route, method, body] of [
      ['/api/profile/17', 'PUT', { nom: 'Overwritten' }],
      ['/api/sections/17', 'POST', { title: 'Injected', type: 'text' }],
      ['/api/sections/17/public-section', 'PUT', { visible: false }],
      ['/api/sections/17/public-section', 'DELETE'],
      ['/api/sections/reorder', 'PUT', { sections: [{ id: 'public-section', order: 0 }] }],
      ['/api/upload/photo', 'POST'],
      ['/api/change-password', 'POST', { currentPassword: PASSWORD, newPassword: 'Changed-password-29!' }],
    ]) {
      const response = await request(route, { method, body, headers: { 'x-user-id': '17' } })
      assert.equal(response.status, 401, route)
    }
    assert.deepEqual(db.prepare('SELECT * FROM profiles WHERE user_id = 17').get(), original)
  })

  await t.test('anonymous visitors see published content only and stable owner selection', async () => {
    const response = await request('/api/portfolio')
    const data = await response.json()
    assert.equal(data.profile.user_id, 17)
    assert.deepEqual(data.sections.map(section => section.id), ['public-section'])
    assert.deepEqual(data.sections[0].content, [])
    assert.equal(data.sections[0].order, 2)
    assert.deepEqual((await (await request('/api/sections/17')).json()).map(section => section.id), ['public-section'])
  })

  let cookie
  await t.test('server issues an opaque protected cookie and stores only its hash', async () => {
    const response = await request('/api/auth/signin', { method: 'POST', body: { email: 'owner@example.test', password: PASSWORD } })
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { success: true, user: { id: 17, email: 'owner@example.test' } })
    const header = response.headers.get('set-cookie')
    assert.match(header, /HttpOnly/)
    assert.match(header, /SameSite=Strict/)
    assert.match(header, /Max-Age=28800/)
    assert.match(header, /Path=\/api/)
    cookie = header.split(';')[0]
    const token = cookie.split('=')[1]
    assert.match(token, /^[a-f0-9]{64}$/)
    assert.equal(db.prepare('SELECT token_hash FROM sessions').get().token_hash, createHash('sha256').update(token).digest('hex'))
    assert.equal((await (await request('/api/auth/session', { cookie })).json()).user.id, 17)
    assert.equal((await (await request('/api/auth/session', { cookie: 'portfolio_session=forged' })).json()).user, null)
    assert.equal((await (await request('/api/sections/17', { cookie })).json()).length, 2)
    assert.equal((await (await request('/api/portfolio', { cookie })).json()).sections.length, 1)
  })

  await t.test('cross-origin requests and cross-owner mutations are denied atomically', async () => {
    assert.equal((await request('/api/profile/17', { method: 'PUT', cookie, headers: { Origin: 'https://attacker.example' }, body: { nom: 'Bad' } })).status, 403)
    assert.equal((await request('/api/profile/17', { method: 'PUT', cookie, headers: { 'Sec-Fetch-Site': 'cross-site' }, body: { nom: 'Bad' } })).status, 403)
    const allowed = await request('/api/auth/session', { cookie, headers: { Origin: 'http://localhost:3000' } })
    assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:3000')
    assert.equal(allowed.headers.get('access-control-allow-credentials'), 'true')
    assert.equal((await request('/api/profile/42', { method: 'PUT', cookie, body: { nom: 'Bad' } })).status, 403)
    assert.equal((await request('/api/sections/42/other-section', { method: 'DELETE', cookie })).status, 403)
    assert.equal((await request('/api/sections/17/other-section', { method: 'PUT', cookie, body: { title: 'Bad' } })).status, 409)
    assert.equal((await request('/api/sections/reorder', { method: 'PUT', cookie, body: { sections: [{ id: 'public-section', order: 8 }, { id: 'other-section', order: 9 }] } })).status, 404)
    assert.equal(db.prepare('SELECT section_order FROM sections WHERE id = ?').get('public-section').section_order, 2)
    assert.equal((await (await request('/api/sections/42', { cookie })).json()).length, 0)
  })

  await t.test('partial updates preserve content, reject unsafe inputs and retain explicit empty arrays', async () => {
    assert.equal((await request('/api/profile/17', { method: 'PUT', cookie, body: { nom: 'Updated' } })).status, 200)
    assert.equal(db.prepare('SELECT prenom FROM profiles WHERE user_id = 17').get().prenom, 'Owner')
    for (const body of [{ linkedin: 'javascript:alert(1)' }, { photo: 'data:image/svg+xml;base64,AAAA' }, { password_hash: 'bad' }, { nom: { invalid: true } }]) {
      assert.equal((await request('/api/profile/17', { method: 'PUT', cookie, body })).status, 400)
    }
    assert.equal((await request('/api/sections/17/public-section', { method: 'PUT', cookie, body: { visible: false } })).status, 200)
    const section = db.prepare('SELECT * FROM sections WHERE id = ?').get('public-section')
    assert.equal(section.title, 'Public')
    assert.equal(section.content, '[]')
    assert.equal(section.section_order, 2)
    assert.equal((await request('/api/sections/17/public-section', { method: 'PUT', cookie, body: { visible: 'false' } })).status, 400)
    assert.equal((await request('/api/sections/17/public-section', { method: 'PUT', cookie, body: { content: [] } })).status, 200)
    assert.equal((await request('/api/sections/17/public-section', { method: 'PUT', cookie, body: JSON.parse('{"content":{"__proto__":{"polluted":true}}}') })).status, 400)
    assert.equal((await request('/api/sections/17/enseignement', { method: 'PUT', cookie, body: { title: 'Teaching', type: 'cards', content: [] } })).status, 200)
  })

  await t.test('password change revokes all prior sessions and rotates the current one', async () => {
    const otherSession = await signIn()
    assert.equal((await request('/api/change-password', { method: 'POST', cookie, body: { currentPassword: PASSWORD, newPassword: 'short' } })).status, 400)
    const response = await request('/api/change-password', { method: 'POST', cookie, body: { currentPassword: PASSWORD, newPassword: 'Changed-password-29!' } })
    assert.equal(response.status, 200)
    const rotatedCookie = response.headers.get('set-cookie').split(';')[0]
    assert.notEqual(rotatedCookie, cookie)
    assert.equal((await (await request('/api/auth/session', { cookie })).json()).user, null)
    assert.equal((await (await request('/api/auth/session', { cookie: otherSession })).json()).user, null)
    assert.equal((await (await request('/api/auth/session', { cookie: rotatedCookie })).json()).user.id, 17)
    assert.equal((await request('/api/auth/signout', { method: 'POST', cookie: rotatedCookie })).status, 200)
    assert.equal((await (await request('/api/auth/session', { cookie: rotatedCookie })).json()).user, null)
  })
})

test('upload checks file signatures, bounds size and serves safe filenames', async t => {
  const { db, request, signIn, directory } = await fixture(t)
  seed(db)
  const cookie = await signIn()
  const upload = (data, type, filename) => {
    const body = new FormData()
    body.append('photo', new Blob([data], { type }), filename)
    return request('/api/upload/photo', { method: 'POST', cookie, body })
  }
  assert.equal((await upload('<svg onload="alert(1)"></svg>', 'image/svg+xml', 'photo.svg')).status, 400)
  assert.equal((await upload('<script>alert(1)</script>', 'image/png', 'photo.png')).status, 400)
  assert.equal((await upload(Buffer.alloc(2 * 1024 * 1024 + 1), 'image/png', 'photo.png')).status, 413)
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=', 'base64')
  const response = await upload(png, 'image/png', '../../malicious.html')
  assert.equal(response.status, 201)
  const file = await response.json()
  assert.match(file.filename, /^profile-[a-f0-9-]+\.png$/)
  assert.equal(fs.readdirSync(path.join(directory, 'uploads')).length, 1)
  const image = await request(file.url)
  assert.equal(image.status, 200)
  assert.equal(image.headers.get('x-content-type-options'), 'nosniff')
  assert.match(image.headers.get('content-type'), /image\/png/)
  assert.equal((await request('/uploads/anything.svg')).status, 404)
  assert.equal((await request('/api/check-image/..%5Cportfolio.db')).status, 400)
})

test('login throttles attempts, sessions expire and production cookies are secure', async t => {
  const { db, request, signIn } = await fixture(t, { NODE_ENV: 'production' })
  seed(db)
  const cookie = await signIn()
  const response = await request('/api/auth/signin', { method: 'POST', body: { email: 'owner@example.test', password: PASSWORD } })
  assert.match(response.headers.get('set-cookie'), /; Secure;/)
  assert.match(response.headers.get('content-security-policy'), /script-src 'self'/)
  assert.equal(response.headers.get('x-powered-by'), null)
  db.prepare('UPDATE sessions SET expires_at = ?').run(Date.now() - 1)
  assert.equal((await (await request('/api/auth/session', { cookie })).json()).user, null)
  assert.equal((await request('/api/profile/17', { method: 'PUT', cookie, body: { nom: 'Bad' } })).status, 401)
  const wrongPassword = await request('/api/auth/signin', { method: 'POST', body: { email: 'owner@example.test', password: 'wrong-password' } })
  const wrongEmail = await request('/api/auth/signin', { method: 'POST', body: { email: 'missing@example.test', password: 'wrong-password' } })
  assert.equal(wrongPassword.status, 401)
  assert.deepEqual(await wrongPassword.json(), await wrongEmail.json())
  for (let attempt = 0; attempt < 6; attempt++) await request('/api/auth/signin', { method: 'POST', body: { email: 'owner@example.test', password: 'wrong' } })
  const limited = await request('/api/auth/signin', { method: 'POST', body: { email: 'owner@example.test', password: PASSWORD } })
  assert.equal(limited.status, 429)
  assert.ok(Number(limited.headers.get('retry-after')) > 0)
})
