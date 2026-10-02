import { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { asArray, hasText, stringList } from '../../utils/sectionDisplay'
import SectionHeading from './SectionHeading'
import SectionBlocks from './SectionBlocks'
import '../../styles/competences-projects-responsibilities.css'

const statusClass = (status) => `duties-status${status === 'Actuel' ? ' duties-status--current' : ''}`
const factsOf = (item) => asArray(item.facts).filter(fact => fact && hasText(fact.label) && hasText(String(fact.value ?? '')))

const ResponsibilitiesSection = ({ section, number, anchor }) => {
  const [selectedResponsibility, setSelectedResponsibility] = useState(null)
  const dialogRef = useRef(null)
  const dialogTitleId = `${anchor}-dialog-title`

  useEffect(() => {
    const node = dialogRef.current
    if (!selectedResponsibility || !node || node.open) return
    if (typeof node.showModal === 'function') node.showModal()
    else node.setAttribute('open', '')
  }, [selectedResponsibility])

  const responsibilities = asArray(section.content).filter(item => item && typeof item === 'object')

  const closeDialog = () => dialogRef.current?.close()

  const renderDialog = (responsibility) => {
    const facts = factsOf(responsibility)
    const missions = stringList(responsibility.missions)
    return (
      <dialog ref={dialogRef} className="cpr-dialog" aria-labelledby={dialogTitleId} onClose={() => setSelectedResponsibility(null)} onClick={event => event.target === event.currentTarget && closeDialog()}>
        <div className="cpr-dialog-head">
          <div>
            {responsibility.organization && <p className="eyebrow">{responsibility.organization}</p>}
            <h2 id={dialogTitleId}>{responsibility.title}</h2>
            {responsibility.period && <p className="cpr-dialog-sub">{responsibility.period}</p>}
          </div>
          <button type="button" className="cpr-close" onClick={closeDialog} aria-label="Fermer la fenêtre de détail"><XMarkIcon aria-hidden="true" /></button>
        </div>
        <div className="cpr-dialog-body">
          {hasText(responsibility.description) && <div className="cpr-block"><h3>Description</h3><p className="cpr-text">{responsibility.description}</p></div>}
          {facts.length > 0 && <div className="cpr-block"><dl className="cpr-facts">{facts.map((fact, index) => <div key={index}><dt>{fact.label}</dt><dd>{String(fact.value)}</dd></div>)}</dl></div>}
          {missions.length > 0 && <div className="cpr-block"><h3>Missions principales</h3><ul className="cpr-bullets">{missions.map((mission, index) => <li key={index}>{mission}</li>)}</ul></div>}
        </div>
      </dialog>
    )
  }

  return (
    <section id={anchor} className="section-padding duties-section" aria-labelledby={`${anchor}-heading`}>
      <div className="container-max">
        <SectionHeading section={section} number={number} anchor={anchor} />
        {responsibilities.length === 0 ? <div className="empty-state"><p>Aucun contenu à afficher pour le moment.</p></div> : <ol className="duties-list">
          {responsibilities.map((responsibility, index) => {
            const hasDetail = hasText(responsibility.description) || factsOf(responsibility).length > 0 || stringList(responsibility.missions).length > 0
            return (
              <li key={responsibility.id ?? index} className="duties-entry">
                <div className="duties-when">
                  {responsibility.period && <p className="duties-period"><span className="sr-only">Période : </span>{responsibility.period}</p>}
                  {responsibility.status && <span className={statusClass(responsibility.status)}>{responsibility.status}</span>}
                </div>
                <div>
                  {responsibility.organization && <p className="duties-org">{responsibility.organization}</p>}
                  <h3>{responsibility.title}</h3>
                  {hasText(responsibility.description) && <p className="duties-desc">{responsibility.description}</p>}
                  {hasDetail && <div className="cpr-item-foot">
                    <button type="button" className="cpr-more" aria-haspopup="dialog" onClick={() => setSelectedResponsibility(responsibility)}>Voir le détail<span className="sr-only"> de la responsabilité {responsibility.title}</span><ArrowRightIcon aria-hidden="true" /></button>
                  </div>}
                </div>
              </li>
            )
          })}
        </ol>}
        {selectedResponsibility && renderDialog(selectedResponsibility)}
        <SectionBlocks section={section} />
      </div>
    </section>
  )
}

export default ResponsibilitiesSection
