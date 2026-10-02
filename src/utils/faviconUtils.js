import { getImageUrl } from './imageUtils'

export const updateFavicon = (photoUrl) => {
  const favicon = document.getElementById('favicon')
  const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]')
  
  if (photoUrl && favicon) {
    const imageUrl = getImageUrl(photoUrl)
    if (imageUrl) {
      favicon.href = imageUrl
      if (appleTouchIcon) {
        appleTouchIcon.href = imageUrl
      }
    }
  }
}

export const setDefaultFavicon = () => {
  const favicon = document.getElementById('favicon')
  const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]')
  
  // Utiliser la dernière image de profil disponible comme fallback
  const defaultImage = '/uploads/profile-1755865090790-712343735.png'
  
  if (favicon) {
    favicon.href = defaultImage
  }
  if (appleTouchIcon) {
    appleTouchIcon.href = defaultImage
  }
}