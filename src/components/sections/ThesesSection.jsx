import { useState } from 'react'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import '../../styles/publications-theses.css'

const ThesesSection = ({ sections = [] }) => {
  const [openThesis, setOpenThesis] = useState(null)
  const thesesSection = sections.find(section => section.id === 'theses-encadrees')

  if (!thesesSection || !thesesSection.visible || !thesesSection.content) return null

  const thesesData = thesesSection.content

  return (
    <section id="theses" className="section-padding theses-section" aria-labelledby="theses-heading">
      <div className="container-max">
        <div className="section-heading heading-split"><div><p className="eyebrow">05 / Encadrement</p><h2 id="theses-heading">Accompagner les doctorants,<br /><em>de la question à la thèse.</em></h2></div><p>Encadrement de recherches en réseaux informatiques, sécurité et intelligence artificielle appliquée à l’éducation.</p></div>

        {Object.entries(thesesData).map(([domain, domainTheses], domainIndex) => {
          const theses = Array.isArray(domainTheses) ? domainTheses : []
          return (
            <div className="thesis-domain" key={domain}>
              <h3 className="thesis-domain-heading" id={`thesis-domain-${domainIndex}`}>{domain}<span>{theses.length} thèse{theses.length > 1 ? 's' : ''}</span></h3>
              <ul className="theses-list" aria-labelledby={`thesis-domain-${domainIndex}`}>
                {theses.map((thesis, index) => {
                  const defended = thesis.statut === 'Soutenue'
                  const StatusIcon = defended ? CheckCircleIcon : ClockIcon
                  const entryId = `${domainIndex}-${String(thesis.id ?? index).replace(/\s+/g, '-')}`
                  const isOpen = openThesis === entryId
                  return (
                    <li className="thesis-entry" key={thesis.id ?? index}>
                      <div className="publication-meta"><span className={`tag thesis-status ${defended ? 'thesis-status-done' : 'thesis-status-ongoing'}`}><StatusIcon aria-hidden="true" />{thesis.statut}</span><span>{thesis.annee}</span></div>
                      <h4>{thesis.sujet}</h4>
                      <button type="button" className="text-button" aria-expanded={isOpen} aria-controls={`thesis-detail-${entryId}`} onClick={() => setOpenThesis(isOpen ? null : entryId)}>{isOpen ? 'Masquer le détail' : 'Voir le détail'}<span className="sr-only"> de cette thèse</span></button>
                      <p className="thesis-detail" id={`thesis-detail-${entryId}`} hidden={!isOpen}>
                        Cette thèse s’inscrit dans le cadre de mes recherches en {String(thesis.sujet || '').toLowerCase().includes('réseau') ? 'réseaux informatiques et sécurité' : 'e-learning et intelligence artificielle'}. L’encadrement doctoral permet d’approfondir les aspects théoriques et pratiques de cette problématique de recherche.
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ThesesSection
