import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import { updateFavicon, setDefaultFavicon } from '../utils/faviconUtils'
import { apiRequest, jsonRequest } from '../utils/api'

const PortfolioContext = createContext(null)
const emptyPortfolio = { profile: {}, sections: [] }

export const usePortfolio = () => {
  const context = useContext(PortfolioContext)
  if (!context) throw new Error('usePortfolio must be used within a PortfolioProvider')
  return context
}

export const PortfolioProvider = ({ children }) => {
  const { user, initialized } = useAuth()
  const [portfolioData, setPortfolioData] = useState(emptyPortfolio)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [loadedOwner, setLoadedOwner] = useState(null)
  const requestId = useRef(0)
  const owner = user?.id || 'public'
  const ready = loadedOwner === owner

  const loadPortfolioData = useCallback(async ({ signal } = {}) => {
    const currentRequest = ++requestId.current
    setLoading(true)
    setError(null)
    try {
      let data
      if (user?.id) {
        const [profile, sections] = await Promise.all([
          apiRequest('/api/profile/' + encodeURIComponent(user.id), { signal }),
          apiRequest('/api/sections/' + encodeURIComponent(user.id), { signal }),
        ])
        data = { profile, sections }
      } else {
        data = await apiRequest('/api/portfolio', { signal })
      }
      if (!data?.profile || !Array.isArray(data.sections)) throw new Error('Données du portfolio invalides.')
      if (signal?.aborted || currentRequest !== requestId.current) return { success: false }
      // The server is authoritative: deleted or hidden sections must never reappear from defaults.
      setPortfolioData({
        profile: data.profile,
        sections: data.sections.map(section => ({ ...section, order: section.order ?? section.order_index ?? 0 })),
      })
      setLoadedOwner(user?.id || 'public')
      return { success: true }
    } catch (failure) {
      if (failure.name !== 'AbortError' && currentRequest === requestId.current) setError(failure.message)
      // Keep previously loaded data on refresh failure; never replace editor data with defaults.
      return { success: false, error: failure.message }
    } finally {
      if (!signal?.aborted && currentRequest === requestId.current) setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (!initialized) return
    const controller = new AbortController()
    loadPortfolioData({ signal: controller.signal })
    return () => { controller.abort(); requestId.current += 1 }
  }, [initialized, loadPortfolioData])

  useEffect(() => {
    if (portfolioData.profile.photo) updateFavicon(portfolioData.profile.photo)
    else setDefaultFavicon()
  }, [portfolioData.profile.photo])

  const mutate = async (endpoint, options, update) => {
    if (!user?.id || !ready) return { success: false, error: 'Veuillez vous reconnecter et recharger les données.' }
    setSaving(true)
    try {
      const result = await apiRequest(endpoint, options)
      setPortfolioData(previous => update(previous, result))
      return { success: true }
    } catch (failure) {
      return { success: false, error: failure.message }
    } finally {
      setSaving(false)
    }
  }

  const userPath = encodeURIComponent(user?.id || '')
  const updateProfile = (profile) => mutate('/api/profile/' + userPath, jsonRequest('PUT', profile),
    previous => ({ ...previous, profile: { ...previous.profile, ...profile } }))

  const updateSection = (sectionId, sectionData) => mutate('/api/sections/' + userPath + '/' + encodeURIComponent(sectionId), jsonRequest('PUT', sectionData),
    previous => ({ ...previous, sections: previous.sections.map(section => section.id === sectionId ? { ...section, ...sectionData } : section) }))

  const addSection = (sectionData) => {
    const section = { ...sectionData, order: Math.max(0, ...portfolioData.sections.map(item => Number(item.order) || 0)) + 1, visible: sectionData.visible !== false }
    return mutate('/api/sections/' + userPath, jsonRequest('POST', section),
      (previous, result) => ({ ...previous, sections: [...previous.sections, { ...section, id: result.id }] }))
  }

  const deleteSection = (sectionId) => mutate('/api/sections/' + userPath + '/' + encodeURIComponent(sectionId), { method: 'DELETE' },
    previous => ({ ...previous, sections: previous.sections.filter(section => section.id !== sectionId) }))

  const reorderSections = (sections) => {
    const ordered = sections.map((section, index) => ({ ...section, order: index + 1 }))
    return mutate('/api/sections/reorder', jsonRequest('PUT', { sections: ordered.map(({ id, order }) => ({ id, order })) }),
      previous => ({ ...previous, sections: ordered }))
  }

  return <PortfolioContext.Provider value={{ portfolioData: ready ? portfolioData : emptyPortfolio, ready, loading: loading || saving, error, loadPortfolioData, updateProfile, updateSection, addSection, deleteSection, reorderSections }}>{children}</PortfolioContext.Provider>
}