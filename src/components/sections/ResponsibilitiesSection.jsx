import { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import '../../styles/competences-projects-responsibilities.css'

const defaultResponsibilities = [
  {
    id: 1,
    title: "Directrice du pôle de digitalisation",
    organization: "Université Chouaib Doukkali",
    period: "2023-2024",
    status: "Terminé",
    description: "Direction stratégique de la transformation digitale de l'université avec 8 établissements et plus de 30 000 utilisateurs",
    details: {
      type: "Direction stratégique",
      périmètre: "8 établissements universitaires",
      utilisateurs: "Plus de 30 000 comptes académiques",
      missions: [
        "Définir la stratégie de digitalisation de l'université",
        "Superviser la mise en œuvre des projets numériques",
        "Coordonner les équipes techniques et pédagogiques",
        "Assurer la formation aux outils numériques",
        "Gérer les infrastructures et plateformes digitales"
      ]
    }
  },
  {
    id: 2,
    title: "Responsable pédagogique Master SIGL",
    organization: "Faculté des Sciences El Jadida",
    period: "2020-2024",
    status: "Actuel",
    description: "Coordination pédagogique du Master Systèmes d'Information et Génie Logiciel avec supervision de 120 étudiants",
    details: {
      type: "Responsabilité pédagogique",
      effectifs: "120 étudiants par promotion",
      spécialité: "Systèmes d'Information et Génie Logiciel",
      missions: [
        "Conception et mise à jour des programmes pédagogiques",
        "Coordination des équipes enseignantes",
        "Suivi académique et professionnel des étudiants",
        "Relations avec les entreprises partenaires",
        "Évaluation et amélioration continue des formations"
      ]
    }
  },
  {
    id: 3,
    title: "Coordinatrice des stages et projets",
    organization: "Faculté des Sciences El Jadida",
    period: "2019-2024",
    status: "Actuel",
    description: "Gestion des relations entreprises et coordination des stages professionnels pour plus de 200 étudiants annuellement",
    details: {
      type: "Coordination professionnelle",
      volume: "200+ stages par an",
      partenaires: "50+ entreprises partenaires",
      missions: [
        "Développement du réseau d'entreprises partenaires",
        "Placement et suivi des stagiaires",
        "Évaluation des projets de fin d'études",
        "Organisation des soutenances",
        "Médiation entreprises-étudiants"
      ]
    }
  },
  {
    id: 4,
    title: "Membre du conseil pédagogique",
    organization: "Faculté des Sciences El Jadida",
    period: "2018-2024",
    status: "Actuel",
    description: "Participation aux décisions stratégiques de la faculté et contribution à l'évolution des programmes d'enseignement",
    details: {
      type: "Gouvernance académique",
      périmètre: "Faculté des Sciences",
      domaines: "Informatique et Mathématiques",
      missions: [
        "Validation des programmes pédagogiques",
        "Évaluation des enseignements",
        "Politique de recrutement enseignant",
        "Stratégie de développement académique",
        "Relations internationales académiques"
      ]
    }
  },
  {
    id: 5,
    title: "Responsable qualité pédagogique",
    organization: "Université Chouaib Doukkali",
    period: "2017-2023",
    status: "Terminé",
    description: "Mise en place et supervision du système qualité pour l'amélioration continue des formations",
    details: {
      type: "Assurance qualité",
      périmètre: "Formations informatiques",
      certifications: "ISO 9001, référentiels nationaux",
      missions: [
        "Audit et évaluation des formations",
        "Mise en place des procédures qualité",
        "Formation des équipes aux standards qualité",
        "Reporting et tableaux de bord qualité",
        "Préparation aux accréditations"
      ]
    }
  }
]

const statusClass = (status) => `duties-status${status === 'Actuel' ? ' duties-status--current' : ''}`
const asList = (value) => (Array.isArray(value) ? value : value ? [value] : [])

const ResponsibilitiesSection = ({ sections }) => {
  const [selectedResponsibility, setSelectedResponsibility] = useState(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    const node = dialogRef.current
    if (!selectedResponsibility || !node || node.open) return
    if (typeof node.showModal === 'function') node.showModal()
    else node.setAttribute('open', '')
  }, [selectedResponsibility])

  const responsibilitiesSection = sections.find(section => section.id === 'responsabilites')

  if (!responsibilitiesSection || !responsibilitiesSection.visible) return null

  // Contenu de la base de données ; données par défaut seulement si le contenu n'est pas une liste
  const responsibilitiesData = Array.isArray(responsibilitiesSection.content) ? responsibilitiesSection.content : defaultResponsibilities

  const closeDialog = () => dialogRef.current?.close()

  const renderDialog = (responsibility) => {
    const details = responsibility.details || {}
    const facts = [
      ['Type de responsabilité', details.type],
      ['Période', responsibility.period],
      ['Statut', responsibility.status],
      ['Périmètre', details.périmètre],
      ['Utilisateurs', details.utilisateurs]
    ].filter(([, value]) => value)
    const topics = asList(details.domaines || details.thématiques)
    const missions = asList(details.missions)
    const achievements = asList(details.réalisations)
    return (
      <dialog ref={dialogRef} className="cpr-dialog" aria-labelledby="duties-dialog-title" onClose={() => setSelectedResponsibility(null)} onClick={event => event.target === event.currentTarget && closeDialog()}>
        <div className="cpr-dialog-head">
          <div>
            <p className="eyebrow">{responsibility.organization}</p>
            <h2 id="duties-dialog-title">{responsibility.title}</h2>
            {responsibility.period && <p className="cpr-dialog-sub">{responsibility.period}</p>}
          </div>
          <button type="button" className="cpr-close" onClick={closeDialog} aria-label="Fermer la fenêtre de détail"><XMarkIcon aria-hidden="true" /></button>
        </div>
        <div className="cpr-dialog-body">
          <div className="cpr-block"><h3>Description</h3><p className="cpr-text">{responsibility.description}</p></div>
          {facts.length > 0 && <div className="cpr-block"><dl className="cpr-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>}
          {missions.length > 0 && <div className="cpr-block"><h3>Missions principales</h3><ul className="cpr-bullets">{missions.map((mission, index) => <li key={index}>{mission}</li>)}</ul></div>}
          {achievements.length > 0 && <div className="cpr-block"><h3>Principales réalisations</h3><ul className="cpr-bullets">{achievements.map((achievement, index) => <li key={index}>{achievement}</li>)}</ul></div>}
          {topics.length > 0 && <div className="cpr-block"><h3>{details.domaines ? 'Domaines de recherche' : 'Thématiques de recherche'}</h3><ul className="cpr-chips">{topics.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}
        </div>
      </dialog>
    )
  }

  return (
    <section id="responsibilities" className="section-padding duties-section" aria-labelledby="responsibilities-heading">
      <div className="container-max">
        <div className="section-heading heading-split"><div><p className="eyebrow">08 / Responsabilités</p><h2 id="responsibilities-heading">Responsabilités,<br /><em>direction et gouvernance.</em></h2></div><p>Mes fonctions de direction et de gouvernance dans l'enseignement supérieur et la recherche scientifique.</p></div>
        {responsibilitiesData.length === 0 ? <div className="empty-state"><h3>Aucune responsabilité à afficher</h3><p>Le contenu de cette section sera disponible prochainement.</p></div> : <ol className="duties-list">
          {responsibilitiesData.map((responsibility, index) => (
            <li key={responsibility.id ?? index} className="duties-entry">
              <div className="duties-when">
                <p className="duties-period"><span className="sr-only">Période : </span>{responsibility.period}</p>
                {responsibility.status && <span className={statusClass(responsibility.status)}>{responsibility.status}</span>}
              </div>
              <div>
                {responsibility.organization && <p className="duties-org">{responsibility.organization}</p>}
                <h3>{responsibility.title}</h3>
                <p className="duties-desc">{responsibility.description}</p>
                <div className="cpr-item-foot">
                  <button type="button" className="cpr-more" aria-haspopup="dialog" onClick={() => setSelectedResponsibility(responsibility)}>Voir le détail<span className="sr-only"> de la responsabilité {responsibility.title}</span><ArrowRightIcon aria-hidden="true" /></button>
                </div>
              </div>
            </li>
          ))}
        </ol>}
        {selectedResponsibility && renderDialog(selectedResponsibility)}
      </div>
    </section>
  )
}

export default ResponsibilitiesSection
