import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePortfolio } from '../contexts/PortfolioContext'

const links = [
  ['about', 'À propos'], ['research', 'Recherche', 'axes-recherche'],
  ['publications', 'Publications', 'publications'], ['teaching', 'Enseignement', 'enseignement'],
  ['theses', 'Encadrement', 'theses-encadrees'], ['contact', 'Contact'],
]

const Header = () => {
  const { portfolioData } = usePortfolio()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const menuButton = useRef(null)
  const profile = portfolioData?.profile || {}
  const navigation = links.filter(([, , sectionId]) => !sectionId || portfolioData?.sections?.some(section => section.id === sectionId && section.visible))

  useEffect(() => {
    const handleScroll = () => {
      const current = ['home', ...links.map(([id]) => id)].find(id => {
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
  }, [])

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
          <span className="brand-monogram" aria-hidden="true">{profile.prenom?.[0] || 'F'}{profile.nom?.[0] || 'L'}</span>
          <span><strong>{profile.prenom} {profile.nom}</strong><span className="brand-subtitle">{profile.fonction || 'Portfolio académique'}</span></span>
        </Link>
        <div className="desktop-navigation">
          {navigation.map(([id, label]) => <a key={id} href={'/#' + id} aria-current={activeSection === id ? 'location' : undefined}>{label}</a>)}
        </div>
        <button ref={menuButton} type="button" className="menu-toggle" aria-expanded={isMenuOpen} aria-controls={isMenuOpen ? 'mobile-navigation' : undefined} aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <XMarkIcon aria-hidden="true" /> : <Bars3Icon aria-hidden="true" />}
        </button>
      </nav>
      {isMenuOpen && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Navigation mobile">
        {navigation.map(([id, label]) => <a key={id} href={'/#' + id} onClick={() => setIsMenuOpen(false)} aria-current={activeSection === id ? 'location' : undefined}>{label}</a>)}
      </nav>}
    </header>
  )
}

export default Header

