import React from 'react'
import { Link } from 'react-router-dom'
import { AcademicCapIcon, ArrowTopRightOnSquareIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { typeLabel } from '../../components/admin/structured/schemas'

const PROFILE_FIELDS = ['nom', 'prenom', 'grade', 'fonction', 'affiliation', 'laboratoire', 'equipe', 'email', 'gsm', 'photo', 'mission', 'tagline']

const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`
const count = (value) => (Array.isArray(value) ? value.length : 0)

// Résumé lisible du contenu d'une section, selon son type.
const summarize = ({ type, content }) => {
  if (type === 'contact') return 'Coordonnées du profil'
  if (type === 'about') return `${plural(count(content?.formations), 'formation')} · ${plural(count(content?.langues), 'langue')}`
  if (Array.isArray(content)) return content.length ? plural(content.length, 'élément') : 'Aucun élément'
  if (type === 'text' || typeof content === 'string') return String(content ?? '').trim() ? 'Texte' : 'Texte vide'
  return 'Aucun contenu'
}

const Dashboard = () => {
  const { portfolioData } = usePortfolio()
  const profile = portfolioData.profile || {}
  const sections = portfolioData.sections || []
  const orderedSections = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const visibleCount = sections.filter(s => s.visible).length
  const hiddenCount = sections.length - visibleCount
  const filledCount = PROFILE_FIELDS.filter(field => String(profile[field] ?? '').trim()).length
  const emptyCount = PROFILE_FIELDS.length - filledCount
  const contentCount = type => count(sections.find(s => s.type === type)?.content)
  const fullName = [profile.titre, profile.prenom, profile.nom].filter(Boolean).join(' ')

  const stats = [
    { label: 'Sections visibles', value: `${visibleCount} / ${sections.length}`, note: hiddenCount ? plural(hiddenCount, 'masquée') : 'Toutes visibles' },
    { label: 'Profil complété', value: `${Math.round(filledCount / PROFILE_FIELDS.length * 100)} %`, note: emptyCount ? `${plural(emptyCount, 'champ')} à renseigner` : 'Complet' },
    { label: 'Publications', value: contentCount('publications'), note: 'Articles et communications' },
    { label: 'Cours', value: contentCount('teaching'), note: 'Enseignements' }
  ]

  const profileRows = [
    ['Nom complet', fullName],
    ['Grade', profile.grade],
    ['Fonction', profile.fonction],
    ['Email', profile.email],
    ['Téléphone', profile.gsm]
  ]

  const quickLinks = [
    { title: 'Modifier le profil', description: 'Identité, coordonnées et présentation', to: '/admin/profile', icon: UserIcon },
    { title: 'Gérer les sections', description: 'Contenu, ordre et visibilité', to: '/admin/sections', icon: DocumentTextIcon },
    { title: 'Gérer mes cours', description: 'Ajouter ou modifier vos enseignements', to: '/admin/courses', icon: AcademicCapIcon },
    { title: 'Voir le site', description: 'Consulter le portfolio public', to: '/', icon: ArrowTopRightOnSquareIcon, external: true }
  ]

  return (
    <div className="admin-container">
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Bonjour{profile.prenom ? ` ${profile.prenom}` : ''}, <em>tableau de bord.</em></h1>
          <p>Vue d’ensemble de votre portfolio : sections publiées, profil et accès rapides.</p>
        </div>
      </header>

      <ul className="admin-stats" aria-label="Chiffres clés">
        {stats.map(stat => (
          <li key={stat.label} className="admin-stat">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <small>{stat.note}</small>
          </li>
        ))}
      </ul>

      <div className="admin-grid-main">
        <section className="admin-panel" aria-labelledby="dash-sections">
          <div className="admin-panel-header">
            <h2 id="dash-sections">État des sections</h2>
          </div>
          <div className="admin-panel-body">
            {orderedSections.length > 0 ? (
              <ul className="admin-list">
                {orderedSections.map(section => (
                  <li key={section.id}>
                    <div>
                      <h3>{section.title}</h3>
                      <p>{typeLabel(section.type)} · {summarize(section)}</p>
                    </div>
                    <span className={`admin-status${section.visible ? '' : ' is-muted'}`}>{section.visible ? 'Visible' : 'Masquée'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Aucune section pour le moment.</p>
            )}
            <div className="mt-6">
              <Link to="/admin/sections" className="btn-secondary">Gérer les sections</Link>
            </div>
          </div>
        </section>

        <div>
          <section className="admin-panel" aria-labelledby="dash-profile">
            <div className="admin-panel-header">
              <h2 id="dash-profile">Profil</h2>
              {!String(profile.photo ?? '').trim() && <span className="admin-status is-warning">Photo de profil manquante</span>}
            </div>
            <div className="admin-panel-body">
              <dl className="admin-dl">
                {profileRows.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value || '—'}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6">
                <Link to="/admin/profile" className="btn-secondary">Modifier le profil</Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="admin-panel" style={{ marginTop: 24 }} aria-labelledby="dash-links">
        <div className="admin-panel-header">
          <h2 id="dash-links">Accès rapides</h2>
        </div>
        <div className="admin-panel-body">
          <nav className="admin-links" aria-label="Accès rapides">
            {quickLinks.map(({ title, description, to, icon: Icon, external }) => (
              external ? (
                <a key={title} href={to} target="_blank" rel="noopener noreferrer">
                  <Icon aria-hidden="true" />
                  <span><strong>{title}</strong><span className="sr-only"> (nouvel onglet)</span><small>{description}</small></span>
                </a>
              ) : (
                <Link key={title} to={to}>
                  <Icon aria-hidden="true" />
                  <span><strong>{title}</strong><small>{description}</small></span>
                </Link>
              )
            ))}
          </nav>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
