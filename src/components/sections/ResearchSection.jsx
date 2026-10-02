import { sanitizeHtml } from '../../utils/sanitizeHtml'
import { asArray } from '../../utils/sectionDisplay'
import SectionHeading from './SectionHeading'
import SectionBlocks from './SectionBlocks'

const ResearchSection = ({ section, number, anchor }) => {
  const isHtml = typeof section.content === 'string'
  const items = asArray(section.content)
    .map(item => (typeof item === 'string' ? { title: item } : item))
    .filter(item => item && typeof item === 'object' && (item.title || item.name || item.description))

  return (
    <section id={anchor} className="section-padding research-section" aria-labelledby={`${anchor}-heading`}>
      <div className="container-max">
        <SectionHeading section={section} number={number} anchor={anchor} />
        {isHtml
          ? (section.content.trim() ? <div className="rich-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content) }} /> : <div className="empty-state"><p>Aucun contenu à afficher pour le moment.</p></div>)
          : items.length === 0
            ? <div className="empty-state"><p>Aucun contenu à afficher pour le moment.</p></div>
            : <ol className="research-list">{items.map((item, index) => <li key={index}><span className="research-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{(item.title || item.name) && <h3>{item.title || item.name}</h3>}{item.description && <p>{item.description}</p>}</li>)}</ol>}
        <SectionBlocks section={section} />
      </div>
    </section>
  )
}

export default ResearchSection
