import { safeExternalUrl } from './sanitizeHtml'
import { getApiUrl } from './api'

export const getImageUrl = (photoUrl) => {
  if (typeof photoUrl !== 'string' || !photoUrl.trim()) return null
  const value = photoUrl.trim()
  if (value.startsWith('/uploads/') && !value.includes('\\')) return getApiUrl(value)
  if (/^data:image\/(?:jpeg|png|gif|webp);base64,[a-z0-9+/=]+$/i.test(value)) return value
  return safeExternalUrl(value) || null
}
