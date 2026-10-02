export const getApiUrl = (endpoint) => {
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
  return `${baseUrl}/${endpoint.replace(/^\/+/, '')}`
}

export const apiRequest = async (endpoint, options = {}) => {
  let response
  try {
    response = await fetch(getApiUrl(endpoint), { ...options, credentials: 'include' })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Le serveur est inaccessible. Réessayez dans quelques instants.', { cause: error })
  }

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const result = isJson ? await response.json() : null
  if (response.status === 401 && !endpoint.startsWith('/api/auth/')) {
    window.dispatchEvent(new Event('portfolio:session-expired'))
  }
  if (!response.ok || result?.success === false) {
    throw new Error(typeof result?.error === 'string' ? result.error : `La requête a échoué (${response.status}).`)
  }
  if (!isJson) throw new Error('Réponse inattendue du serveur. Veuillez réessayer.')
  return result
}

export const jsonRequest = (method, data) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})
