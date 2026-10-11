// The frontend and API share the browser's origin, including session cookies.
const backendValue = process.env.BACKEND_URL?.trim()
if (!backendValue) {
  throw new Error('Set BACKEND_URL in Vercel to the HTTPS origin of the persistent Express server before deploying.')
}
const backend = new URL(backendValue)
if (backend.protocol !== 'https:' || backend.username || backend.password || backend.pathname !== '/' || backend.search || backend.hash) {
  throw new Error('BACKEND_URL must be an HTTPS origin without credentials, a path, query parameters or a fragment.')
}

export const config = {
  framework: 'vite',
  installCommand: 'npm ci',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  rewrites: [
    { source: '/api/:path*', destination: `${backend.origin}/api/:path*` },
    { source: '/uploads/:path*', destination: `${backend.origin}/uploads/:path*` },
    { source: '/(.*)', destination: '/index.html' },
  ],
  headers: [
    { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
  ],
}
