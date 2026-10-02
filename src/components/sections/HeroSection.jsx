import { useEffect, useState } from 'react'
import { ArrowRightIcon, ArrowDownIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { getImageUrl } from '../../utils/imageUtils'
import { sanitizeHtml } from '../../utils/sanitizeHtml'

// `entries` : liste { section, anchor, number } des sections visibles (calculée par la page d'accueil)
const HeroSection = ({ profile = {}, entries = [] }) => {
  const [imageError, setImageError] = useState(false)
  const photo = getImageUrl(profile.photo)
  const publications = entries.find(entry => entry.section.type === 'publications')
  const contact = entries.find(entry => entry.section.type === 'contact')
  const firstEntry = entries[0]
  const initials = `${profile.prenom?.[0] || ''}${profile.nom?.[0] || ''}`
  const fullName = [profile.prenom, profile.nom].filter(Boolean).join(' ')
  const panelNote = profile.equipe || profile.laboratoire || profile.affiliation
  const bottomNote = panelNote === profile.laboratoire ? '' : profile.laboratoire
  useEffect(() => setImageError(false), [profile.photo])

  return (
    <section id="home" className="academic-hero" aria-labelledby="profile-heading">
      <div className="container-max hero-grid">
        <div className="hero-copy">
          {profile.tagline && <p className="eyebrow"><span aria-hidden="true" /> {profile.tagline}</p>}
          <h1 id="profile-heading"><span className="hero-given-name">{[profile.titre, profile.prenom].filter(Boolean).join(' ')}</span><br />{profile.nom}</h1>
          {profile.grade && <p className="hero-grade">{profile.grade}</p>}
          {profile.mission && <div className="hero-mission rich-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(profile.mission) }} />}
          {(publications || contact) && <div className="hero-actions">
            {publications && <a href={'#' + publications.anchor} className="btn-primary">Consulter les publications <ArrowRightIcon aria-hidden="true" /></a>}
            {contact && <a href={'#' + contact.anchor} className="btn-secondary">Prendre contact <ArrowRightIcon aria-hidden="true" /></a>}
          </div>}
          {profile.affiliation && <p className="hero-affiliation"><AcademicCapIcon aria-hidden="true" /><span>{profile.affiliation}</span></p>}
        </div>
        <div className="profile-panel">
          <div className="profile-portrait">
            {photo && !imageError ? <img src={photo} alt={fullName ? 'Portrait de ' + fullName : 'Portrait'} width="440" height="470" fetchpriority="high" onError={() => setImageError(true)} /> : <div className="portrait-placeholder">{initials && <span aria-hidden="true">{initials}</span>}<AcademicCapIcon aria-hidden="true" /></div>}
            {profile.fonction && <div className="portrait-caption"><strong>{profile.fonction}</strong></div>}
          </div>
          {panelNote && <div className="profile-panel-note"><span className="profile-note-rule" aria-hidden="true" /><p>{panelNote}</p></div>}
        </div>
      </div>
      {(firstEntry || bottomNote) && <div className="container-max hero-bottom">{firstEntry ? <a href={'#' + firstEntry.anchor}>Découvrir le parcours <ArrowDownIcon aria-hidden="true" /></a> : <span />}{bottomNote ? <span>{bottomNote}</span> : null}</div>}
    </section>
  )
}

export default HeroSection
