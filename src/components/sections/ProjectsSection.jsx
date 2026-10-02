import { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import '../../styles/competences-projects-responsibilities.css'

const defaultProjects = [
  {
    id: 1,
    title: "Réinvention et valorisation du patrimoine d'El Jadida",
    category: "Recherche Territoriale",
    year: "2024",
    status: "Terminé",
    description: "Membre d'équipe de recherche du projet « Réinvention et valorisation du patrimoine d'El Jadida : Impact des dynamiques économiques et culturelles sur le développement territorial et les transformations sociales », retenu dans le cadre de l'appel à projet PROGRES Edition 2024",
    details: {
      type: "Projet de recherche",
      financement: "PROGRES Edition 2024",
      role: "Membre d'équipe de recherche",
      objectifs: [
        "Étudier l'impact des dynamiques économiques sur le patrimoine",
        "Analyser les transformations sociales liées au développement territorial",
        "Proposer des stratégies de valorisation du patrimoine"
      ]
    }
  },
  {
    id: 2,
    title: "Open2SUSTAIN - Erasmus+",
    category: "Éducation Durable",
    year: "2023",
    status: "Terminé",
    description: "Membre du projet Erasmus+ CBHE : « Developing SDG Literacy through innovative open Learning within Higher Education in the Euro Mediterranean Region - Open2SUSTAIN »",
    details: {
      type: "Projet Erasmus+ CBHE",
      financement: "Union Européenne - Programme Erasmus+",
      role: "Membre du projet",
      region: "Euro-Méditerranéenne",
      objectifs: [
        "Développer la littératie des ODD dans l'enseignement supérieur",
        "Créer des ressources d'apprentissage ouvert innovantes",
        "Renforcer la coopération euro-méditerranéenne"
      ]
    }
  },
  {
    id: 3,
    title: "CORETEV - Technologies en Évaluation",
    category: "Innovation Pédagogique",
    year: "2020-2024",
    status: "Terminé",
    description: "Membre du projet CORETEV (CO-construction Nord-Sud d'un Réseau d'Expertises pour l'utilisation des nouvelles Technologies en Evaluation des apprentissages et des enseignements) sur l'ingénierie de l'évaluation cofinancé par le programme ERASMUS+ de l'union européenne",
    details: {
      type: "Projet Erasmus+ de coopération",
      financement: "Union Européenne - Programme Erasmus+",
      role: "Membre du projet",
      durée: "2020-2024",
      objectifs: [
        "Co-construire un réseau d'expertises Nord-Sud",
        "Développer l'usage des nouvelles technologies en évaluation",
        "Former aux nouvelles méthodes d'évaluation des apprentissages"
      ]
    }
  },
  {
    id: 4,
    title: "MOOC SPOC prépa-TP",
    category: "Formation Numérique",
    year: "2019",
    status: "Terminé",
    description: "Coordinatrice d'un Projet MOOC « SPOC prépa-TP : Initiation aux mesures électriques », sélectionné par le ministère de l'éducation nationale dans le cadre de la mise en place de « MAROC Université Numérique »",
    details: {
      type: "MOOC/SPOC",
      financement: "Ministère de l'Éducation Nationale",
      role: "Coordinatrice",
      plateforme: "MAROC Université Numérique (www.mun.ma)",
      objectifs: [
        "Initier aux mesures électriques",
        "Préparer aux travaux pratiques",
        "Développer l'apprentissage numérique au Maroc"
      ]
    }
  },
  {
    id: 5,
    title: "Projets de Digitalisation Universitaire",
    category: "Transformation Digitale",
    year: "2022-2023",
    status: "Terminé",
    description: "Projets en tant que directrice du pôle de digitalisation de l'université Chouaib Doukkali",
    details: {
      type: "Projets institutionnels",
      role: "Directrice du pôle de digitalisation",
      établissements: "8 établissements de l'université",
      projets: [
        {
          nom: "Plateforme Moodle LMS",
          description: "Mise en œuvre d'un Learning Management System pour les 8 établissements"
        },
        {
          nom: "Plateforme de guichet unique",
          description: "Portail centralisé pour candidatures Licences & Masters"
        },
        {
          nom: "Gestion des visiteurs Datacenter",
          description: "Application de gestion centralisée des interventions"
        },
        {
          nom: "Récupération d'emails académiques",
          description: "Solution automatique de récupération de mots de passe"
        },
        {
          nom: "Configuration VPN",
          description: "Déploiement VPN site-to-site pour accès sécurisé Apogée"
        },
        {
          nom: "Google Workspace",
          description: "Gestion de plus de 30 000 comptes académiques"
        }
      ]
    }
  }
]

const statusClass = (status) => `projects-status${status === 'En cours' ? ' projects-status--current' : ''}`

const ProjectsSection = ({ sections }) => {
  const [selectedProject, setSelectedProject] = useState(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    const node = dialogRef.current
    if (!selectedProject || !node || node.open) return
    if (typeof node.showModal === 'function') node.showModal()
    else node.setAttribute('open', '')
  }, [selectedProject])

  const projectsSection = sections.find(section => section.id === 'projets')

  if (!projectsSection || !projectsSection.visible) return null

  // Contenu de la base de données ; données par défaut seulement si le contenu n'est pas une liste
  const projectsData = Array.isArray(projectsSection.content) ? projectsSection.content : defaultProjects

  const closeDialog = () => dialogRef.current?.close()

  const renderDialog = (project) => {
    const details = project.details || {}
    const facts = [
      ['Type de projet', details.type],
      ['Financement', details.financement],
      ['Mon rôle', details.role],
      ['Durée', details.durée],
      ['Établissements', details.établissements],
      ['Statut', project.status]
    ].filter(([, value]) => value)
    return (
      <dialog ref={dialogRef} className="cpr-dialog" aria-labelledby="projects-dialog-title" onClose={() => setSelectedProject(null)} onClick={event => event.target === event.currentTarget && closeDialog()}>
        <div className="cpr-dialog-head">
          <div>
            <p className="eyebrow">{project.category}</p>
            <h2 id="projects-dialog-title">{project.title}</h2>
            {project.year && <p className="cpr-dialog-sub">{project.year}</p>}
          </div>
          <button type="button" className="cpr-close" onClick={closeDialog} aria-label="Fermer la fenêtre de détail"><XMarkIcon aria-hidden="true" /></button>
        </div>
        <div className="cpr-dialog-body">
          <div className="cpr-block"><h3>Description</h3><p className="cpr-text">{project.description}</p></div>
          {facts.length > 0 && <div className="cpr-block"><dl className="cpr-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>}
          {Array.isArray(details.objectifs) && details.objectifs.length > 0 && <div className="cpr-block"><h3>Objectifs</h3><ul className="cpr-bullets">{details.objectifs.map((objectif, index) => <li key={index}>{objectif}</li>)}</ul></div>}
          {Array.isArray(details.projets) && details.projets.length > 0 && <div className="cpr-block"><h3>Projets réalisés</h3><ul className="cpr-entries">{details.projets.map((projet, index) => <li key={index}><h4>{projet.nom}</h4><p>{projet.description}</p></li>)}</ul></div>}
        </div>
      </dialog>
    )
  }

  return (
    <section id="projects" className="section-padding projects-section" aria-labelledby="projects-heading">
      <div className="container-max">
        <div className="section-heading heading-split"><div><p className="eyebrow">07 / Projets</p><h2 id="projects-heading">Projets de recherche,<br /><em>d’innovation et de coopération.</em></h2></div><p>Découvrez mes contributions à des projets de recherche, d'innovation pédagogique et de transformation digitale dans l'enseignement supérieur.</p></div>
        {projectsData.length === 0 ? <div className="empty-state"><h3>Aucun projet à afficher</h3><p>Le contenu de cette section sera disponible prochainement.</p></div> : <ol className="projects-list">
          {projectsData.map((project, index) => (
            <li key={project.id ?? index} className="projects-entry">
              <p className="projects-year">{project.year}</p>
              <div>
                <div className="projects-meta">
                  {project.category && <span>{project.category}</span>}
                  {project.status && <span className={statusClass(project.status)}>{project.status}</span>}
                </div>
                <h3>{project.title}</h3>
                <p className="projects-desc">{project.description}</p>
                <div className="cpr-item-foot">
                  <button type="button" className="cpr-more" aria-haspopup="dialog" onClick={() => setSelectedProject(project)}>Voir le détail<span className="sr-only"> du projet {project.title}</span><ArrowRightIcon aria-hidden="true" /></button>
                </div>
              </div>
            </li>
          ))}
        </ol>}
        {selectedProject && renderDialog(selectedProject)}
      </div>
    </section>
  )
}

export default ProjectsSection
