import { useEffect, useState } from 'react'
import { ArrowRightIcon, ArrowDownIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { getImageUrl } from '../../utils/imageUtils'
import { sanitizeHtml } from '../../utils/sanitizeHtml'

const HeroSection = ({ profile = {}, sections = [] }) => {
  const [imageError, setImageError] = useState(false)
  const photo = getImageUrl(profile.photo)
  const hasResearch = sections.some(section => section.id === 'axes-recherche' && section.visible)
  const hasPublications = sections.some(section => section.id === 'publications' && section.visible)
  useEffect(() => setImageError(false), [profile.photo])

  return (
    <section id="home" className="academic-hero" aria-labelledby="profile-heading">
      <div className="container-max hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span aria-hidden="true" /> Recherche · Enseignement · Transmission</p>
          <h1 id="profile-heading"><span className="hero-given-name">Dr. {profile.prenom}</span><br />{profile.nom}</h1>
          <p className="hero-grade">{profile.grade}</p>
          {profile.mission && <div className="hero-mission rich-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(profile.mission) }} />}
          <div className="hero-actions">
            {hasPublications && <a href="#publications" className="btn-primary">Consulter les publications <ArrowRightIcon aria-hidden="true" /></a>}
            <a href="#contact" className="btn-secondary">Prendre contact <ArrowRightIcon aria-hidden="true" /></a>
          </div>
          {profile.affiliation && <p className="hero-affiliation"><AcademicCapIcon aria-hidden="true" /><span>{profile.affiliation}</span></p>}
        </div>
        <div className="profile-panel">
          <div className="profile-portrait">
            {photo && !imageError ? <img src={photo} alt={'Portrait de ' + profile.prenom + ' ' + profile.nom} width="440" height="470" fetchPriority="high" onError={() => setImageError(true)} /> : <div className="portrait-placeholder"><span aria-hidden="true">{profile.prenom?.[0] || 'F'}{profile.nom?.[0] || 'L'}</span><AcademicCapIcon aria-hidden="true" /></div>}
            <div className="portrait-caption"><span>Portfolio académique</span><strong>{profile.fonction}</strong></div>
          </div>
          <div className="profile-panel-note"><span className="profile-note-rule" aria-hidden="true" /><p>{profile.equipe || profile.laboratoire || profile.affiliation}</p></div>
        </div>
      </div>
      <div className="container-max hero-bottom"><a href="#about">Découvrir le parcours <ArrowDownIcon aria-hidden="true" /></a><span>{hasResearch ? 'Sciences & technologies de l’information' : 'Parcours académique & professionnel'}</span></div>
    </section>
  )
}

export default HeroSection

