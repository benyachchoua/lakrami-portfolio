import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { startServer } from './server/app.js'

export { createApp, startServer } from './server/app.js'

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) startServer()
