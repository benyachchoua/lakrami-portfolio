import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePortfolio } from '../contexts/PortfolioContext'
import { buildSectionEntries } from '../utils/sectionDisplay'
import '../styles/header-nav.css'

const Header = () => {
  const { portfolioData } = usePortfolio()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const menuButton = useRef(null)
  const profile = portfolioData?.profile || {}
  const sections = portfolioData?.sections
  // Liens de navigation : une entrée par section visible (libellé = titre, ancre selon le contrat)
  const navigation = useMemo(() => buildSectionEntries(sections).map(({ section, anchor }) => ({ anchor, label: section.title })).filter(item => item.label), [sections])
  const anchorKey = navigation.map(item => item.anchor).join('|')
  const initials = `${profile.prenom?.[0] || ''}${profile.nom?.[0] || ''}`

  useEffect(() => {
    const ids = ['home', ...(anchorKey ? anchorKey.split('|') : [])]
    const handleScroll = () => {
      const current = ids.find(id => {
        const element = document.getElementById(id)
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return rect.top <= 160 && rect.bottom > 160
      })
      if (current) setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [anchorKey])

  useEffect(() => {
    if (!isMenuOpen) return
    const closeOnEscape = event => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 1100px)')
    const closeOnDesktop = event => { if (event.matches) setIsMenuOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [isMenuOpen])

  return (
    <header className="site-header">
      <nav className="container-max header-inner" aria-label="Navigation principale">
        <Link to="/#home" className="site-brand" onClick={() => setIsMenuOpen(false)}>
          {initials && <span className="brand-monogram" aria-hidden="true">{initials}</span>}
          <span><strong>{[profile.prenom, profile.nom].filter(Boolean).join(' ')}</strong>{profile.fonction && <span className="brand-subtitle">{profile.fonction}</span>}</span>
        </Link>
        <div className="desktop-navigation">
          {navigation.map(({ anchor, label }) => <a key={anchor} href={'/#' + anchor} aria-current={activeSection === anchor ? 'location' : undefined}>{label}</a>)}
        </div>
        <button ref={menuButton} type="button" className="menu-toggle" aria-expanded={isMenuOpen} aria-controls={isMenuOpen ? 'mobile-navigation' : undefined} aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <XMarkIcon aria-hidden="true" /> : <Bars3Icon aria-hidden="true" />}
        </button>
      </nav>
      {isMenuOpen && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Navigation mobile">
        {navigation.map(({ anchor, label }) => <a key={anchor} href={'/#' + anchor} onClick={() => setIsMenuOpen(false)} aria-current={activeSection === anchor ? 'location' : undefined}>{label}</a>)}
      </nav>}
    </header>
  )
}

export default Header
