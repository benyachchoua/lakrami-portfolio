import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { safeExternalUrl } from '../../utils/sanitizeHtml'
import { asArray } from '../../utils/sectionDisplay'
import SectionHeading from './SectionHeading'
import SectionBlocks from './SectionBlocks'

const AboutSection = ({ section, profile = {}, number, anchor }) => {
  const content = section.content && typeof section.content === 'object' && !Array.isArray(section.content) ? section.content : {}
  const formations = asArray(content.formations).filter(item => item && (item.title || item.institution || item.year))
  const languages = asArray(content.langues).map(item => (typeof item === 'string' ? item : item?.nom)).filter(Boolean)
  const networks = [['LinkedIn', profile.linkedin], ['ResearchGate', profile.researchgate], ['YouTube', profile.youtube]].filter(([, url]) => safeExternalUrl(url))
  const facts = [['Affiliation', profile.affiliation], ['Laboratoire', profile.laboratoire], ['Équipe de recherche', profile.equipe]].filter(([, value]) => value)

  return (
    <section id={anchor} className="section-padding academic-section" aria-labelledby={`${anchor}-heading`}>
      <div className="container-max">
        <div className="about-grid">
          <SectionHeading section={section} number={number} anchor={anchor} split={false}>
            {networks.length > 0 && <div className="academic-links">{networks.map(([label, url]) => <a key={label} href={safeExternalUrl(url)} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRightIcon aria-hidden="true" /><span className="sr-only"> (nouvel onglet)</span></a>)}</div>}
          </SectionHeading>
          <div>
            {facts.length > 0 && <dl className="academic-facts">
              {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>}
            {formations.length > 0 && <div className="education-block">
              <h3>Formation & diplômes</h3>
              <ol className="education-list">
                {formations.map((formation, index) => <li key={index}><span>{formation.year}</span><div><h4>{formation.title}</h4>{formation.institution && <p>{formation.institution}</p>}</div></li>)}
              </ol>
            </div>}
            {languages.length > 0 && <div className="languages"><span>Langues</span>{languages.map((language, index) => <span className="tag" key={index}>{language}</span>)}</div>}
          </div>
        </div>
        <SectionBlocks section={section} />
      </div>
    </section>
  )
}

export default AboutSection
