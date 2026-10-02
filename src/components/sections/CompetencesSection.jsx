import { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { asArray, hasText, stringList } from '../../utils/sectionDisplay'
import SectionHeading from './SectionHeading'
import SectionBlocks from './SectionBlocks'
import '../../styles/competences-projects-responsibilities.css'

const plural = (count, word) => `${count} ${word}${count > 1 ? 's' : ''}`
const skillsOf = (competence) => stringList(competence.skills)
const groupsOf = (competence) => asArray(competence.groups)
  .filter(group => group && typeof group === 'object')
  .map(group => ({ label: group.label, items: stringList(group.items) }))
  .filter(group => group.items.length > 0)

const CompetencesSection = ({ section, number, anchor }) => {
  const [selectedCompetence, setSelectedCompetence] = useState(null)
  const dialogRef = useRef(null)
  const dialogTitleId = `${anchor}-dialog-title`

  useEffect(() => {
    const node = dialogRef.current
    if (!selectedCompetence || !node || node.open) return
    if (typeof node.showModal === 'function') node.showModal()
    else node.setAttribute('open', '')
  }, [selectedCompetence])

  const competences = asArray(section.content).filter(item => item && typeof item === 'object')

  const closeDialog = () => dialogRef.current?.close()

  const renderDialog = (competence) => {
    const skills = skillsOf(competence)
    const groups = groupsOf(competence)
    const count = skills.length
    return (
      <dialog ref={dialogRef} className="cpr-dialog" aria-labelledby={dialogTitleId} onClose={() => setSelectedCompetence(null)} onClick={event => event.target === event.currentTarget && closeDialog()}>
        <div className="cpr-dialog-head">
          <div>
            {section.title && <p className="eyebrow">{section.title}</p>}
            <h2 id={dialogTitleId}>{competence.title}</h2>
            {count > 0 && <p className="cpr-dialog-sub">{plural(count, 'compétence')}</p>}
          </div>
          <button type="button" className="cpr-close" onClick={closeDialog} aria-label="Fermer la fenêtre de détail"><XMarkIcon aria-hidden="true" /></button>
        </div>
        <div className="cpr-dialog-body">
          {hasText(competence.description) && <div className="cpr-block"><h3>Description</h3><p className="cpr-text">{competence.description}</p></div>}
          {count > 0 && <div className="cpr-block"><h3>Compétences détaillées</h3><ul className="cpr-bullets">{skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul></div>}
          {groups.map((group, groupIndex) => (
            <div className="cpr-block" key={groupIndex}>
              {hasText(group.label) && <h3>{group.label}</h3>}
              <ul className="cpr-bullets">{group.items.map((item, index) => <li key={index}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </dialog>
    )
  }

  return (
    <section id={anchor} className="section-padding skills-section" aria-labelledby={`${anchor}-heading`}>
      <div className="container-max">
        <SectionHeading section={section} number={number} anchor={anchor} />
        {competences.length === 0 ? <div className="empty-state"><p>Aucun contenu à afficher pour le moment.</p></div> : <ol className="skills-list">
          {competences.map((competence, index) => {
            const count = skillsOf(competence).length
            const hasDetail = count > 0 || groupsOf(competence).length > 0
            return (
              <li key={competence.id ?? index} className="skills-item">
                <span className="skills-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{competence.title}</h3>
                  {hasText(competence.description) && <p className="skills-desc">{competence.description}</p>}
                  <div className="cpr-item-foot">
                    {count > 0 && <span className="cpr-count">{plural(count, 'compétence')}</span>}
                    {hasDetail && <button type="button" className="cpr-more" aria-haspopup="dialog" onClick={() => setSelectedCompetence(competence)}>Voir le détail<span className="sr-only"> de {competence.title}</span><ArrowRightIcon aria-hidden="true" /></button>}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>}
        {selectedCompetence && renderDialog(selectedCompetence)}
        <SectionBlocks section={section} />
      </div>
    </section>
  )
}

export default CompetencesSection
