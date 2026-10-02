import { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { asArray, hasText, stringList } from '../../utils/sectionDisplay'
import SectionHeading from './SectionHeading'
import SectionBlocks from './SectionBlocks'
import '../../styles/competences-projects-responsibilities.css'

const statusClass = (status) => `projects-status${status === 'En cours' ? ' projects-status--current' : ''}`
const factsOf = (item) => asArray(item.facts).filter(fact => fact && hasText(fact.label) && hasText(String(fact.value ?? '')))
const subprojectsOf = (item) => asArray(item.subprojects).filter(sub => sub && (hasText(sub.title) || hasText(sub.description)))

const ProjectsSection = ({ section, number, anchor }) => {
  const [selectedProject, setSelectedProject] = useState(null)
  const dialogRef = useRef(null)
  const dialogTitleId = `${anchor}-dialog-title`

  useEffect(() => {
    const node = dialogRef.current
    if (!selectedProject || !node || node.open) return
    if (typeof node.showModal === 'function') node.showModal()
    else node.setAttribute('open', '')
  }, [selectedProject])

  const projects = asArray(section.content).filter(item => item && typeof item === 'object')

  const closeDialog = () => dialogRef.current?.close()

  const renderDialog = (project) => {
    const facts = factsOf(project)
    const objectives = stringList(project.objectives)
    const subprojects = subprojectsOf(project)
    return (
      <dialog ref={dialogRef} className="cpr-dialog" aria-labelledby={dialogTitleId} onClose={() => setSelectedProject(null)} onClick={event => event.target === event.currentTarget && closeDialog()}>
        <div className="cpr-dialog-head">
          <div>
            {project.category && <p className="eyebrow">{project.category}</p>}
            <h2 id={dialogTitleId}>{project.title}</h2>
            {project.year && <p className="cpr-dialog-sub">{project.year}</p>}
          </div>
          <button type="button" className="cpr-close" onClick={closeDialog} aria-label="Fermer la fenêtre de détail"><XMarkIcon aria-hidden="true" /></button>
        </div>
        <div className="cpr-dialog-body">
          {hasText(project.description) && <div className="cpr-block"><h3>Description</h3><p className="cpr-text">{project.description}</p></div>}
          {facts.length > 0 && <div className="cpr-block"><dl className="cpr-facts">{facts.map((fact, index) => <div key={index}><dt>{fact.label}</dt><dd>{String(fact.value)}</dd></div>)}</dl></div>}
          {objectives.length > 0 && <div className="cpr-block"><h3>Objectifs</h3><ul className="cpr-bullets">{objectives.map((objective, index) => <li key={index}>{objective}</li>)}</ul></div>}
          {subprojects.length > 0 && <div className="cpr-block"><h3>Réalisations</h3><ul className="cpr-entries">{subprojects.map((subproject, index) => <li key={index}>{hasText(subproject.title) && <h4>{subproject.title}</h4>}{hasText(subproject.description) && <p>{subproject.description}</p>}</li>)}</ul></div>}
        </div>
      </dialog>
    )
  }

  return (
    <section id={anchor} className="section-padding projects-section" aria-labelledby={`${anchor}-heading`}>
      <div className="container-max">
        <SectionHeading section={section} number={number} anchor={anchor} />
        {projects.length === 0 ? <div className="empty-state"><p>Aucun contenu à afficher pour le moment.</p></div> : <ol className="projects-list">
          {projects.map((project, index) => {
            const hasDetail = hasText(project.description) || factsOf(project).length > 0 || stringList(project.objectives).length > 0 || subprojectsOf(project).length > 0
            return (
              <li key={project.id ?? index} className="projects-entry">
                <p className="projects-year">{project.year}</p>
                <div>
                  <div className="projects-meta">
                    {project.category && <span>{project.category}</span>}
                    {project.status && <span className={statusClass(project.status)}>{project.status}</span>}
                  </div>
                  <h3>{project.title}</h3>
                  {hasText(project.description) && <p className="projects-desc">{project.description}</p>}
                  {hasDetail && <div className="cpr-item-foot">
                    <button type="button" className="cpr-more" aria-haspopup="dialog" onClick={() => setSelectedProject(project)}>Voir le détail<span className="sr-only"> du projet {project.title}</span><ArrowRightIcon aria-hidden="true" /></button>
                  </div>}
                </div>
              </li>
            )
          })}
        </ol>}
        {selectedProject && renderDialog(selectedProject)}
        <SectionBlocks section={section} />
      </div>
    </section>
  )
}

export default ProjectsSection
