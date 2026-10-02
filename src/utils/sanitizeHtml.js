import DOMPurify from 'dompurify'

export const safeExternalUrl = (value) => {
  if (typeof value !== 'string') return undefined
  try {
    const url = new URL(value.trim())
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined
  } catch {
    return undefined
  }
}

// Keep academic rich text, but exclude executable markup, embeds and inline styles.
export const sanitizeHtml = (value) => DOMPurify.sanitize(typeof value === 'string' ? value : '', {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'h4', 'blockquote', 'div', 'span', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
  ALLOWED_ATTR: ['href', 'title', 'class', 'colspan', 'rowspan'],
  ALLOW_DATA_ATTR: false,
})
