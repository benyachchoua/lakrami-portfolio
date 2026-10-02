import { useState } from 'react'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { asArray, hasText } from '../../utils/sectionDisplay'
import SectionHeading from './SectionHeading'
import SectionBlocks from './SectionBlocks'
import '../../styles/publications-theses.css'

const ThesesSection = ({ section, number, anchor }) => {
  const [openThesis, setOpenThesis] = useState(null)

  const theses = asArray(section.content).filter(item => item && typeof item === 'object')
  // Regroupement par domaine, dans l'ordre d'apparition
  const groups = []
  theses.forEach((thesis, index) => {
    const domain = String(thesis.domain ?? '').trim()
    let group = groups.find(item => item.domain === domain)
    if (!group) { group = { domain, items: [] }; groups.push(group) }
    group.items.push({ thesis, index })
  })

  return (
    <section id={anchor} className="section-padding theses-section" aria-labelledby={`${anchor}-heading`}>
      <div className="container-max">
        <SectionHeading section={section} number={number} anchor={anchor} />

        {groups.length === 0 && <div className="empty-state"><p>Aucun contenu à afficher pour le moment.</p></div>}

        {groups.map((group, groupIndex) => {
          const headingId = `${anchor}-domain-${groupIndex}`
          return (
            <div className="thesis-domain" key={group.domain || groupIndex}>
              {group.domain && <h3 className="thesis-domain-heading" id={headingId}>{group.domain}<span>{group.items.length} thèse{group.items.length > 1 ? 's' : ''}</span></h3>}
              <ul className="theses-list" aria-labelledby={group.domain ? headingId : undefined} aria-label={group.domain ? undefined : section.title || undefined}>
                {group.items.map(({ thesis, index }) => {
                  const defended = thesis.status === 'Soutenue'
                  const StatusIcon = defended ? CheckCircleIcon : ClockIcon
                  const entryId = `${anchor}-${index}`
                  const details = [
                    ['Doctorant(e)', thesis.candidate],
                    ['Année', thesis.year],
                    ['Cotutelle', thesis.cotutelle],
                  ].filter(([, value]) => hasText(String(value ?? '')))
                  const hasDetail = details.length > 0 || hasText(thesis.description)
                  const isOpen = openThesis === entryId
                  return (
                    <li className="thesis-entry" key={thesis.id ?? index}>
                      <div className="publication-meta">
                        {thesis.status && <span className={`tag thesis-status ${defended ? 'thesis-status-done' : 'thesis-status-ongoing'}`}><StatusIcon aria-hidden="true" />{thesis.status}</span>}
                        {thesis.year && <span>{thesis.year}</span>}
                      </div>
                      <h4>{thesis.title}</h4>
                      {hasDetail && <>
                        <button type="button" className="text-button" aria-expanded={isOpen} aria-controls={`thesis-detail-${entryId}`} onClick={() => setOpenThesis(isOpen ? null : entryId)}>{isOpen ? 'Masquer le détail' : 'Voir le détail'}<span className="sr-only"> de cette thèse</span></button>
                        <div className="thesis-detail" id={`thesis-detail-${entryId}`} hidden={!isOpen}>
                          {details.map(([label, value]) => <p key={label}><strong>{label} : </strong>{String(value)}</p>)}
                          {hasText(thesis.description) && <p>{thesis.description}</p>}
                        </div>
                      </>}
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
        <SectionBlocks section={section} />
      </div>
    </section>
  )
}

export default ThesesSection
