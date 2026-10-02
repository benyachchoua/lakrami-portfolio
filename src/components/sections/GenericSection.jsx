import { sanitizeHtml } from '../../utils/sanitizeHtml'
import { asArray } from '../../utils/sectionDisplay'
import SectionHeading from './SectionHeading'
import SectionBlocks from './SectionBlocks'

// Sections libres : text (HTML), list ([chaînes]) et cards ([{ title, description }])
const GenericSection = ({ section, number, anchor }) => {
  const content = section.content
  const isHtml = typeof content === 'string'
  const items = asArray(content)
    .map(item => (typeof item === 'string' ? { title: item } : item))
    .filter(item => item && typeof item === 'object' && (item.title || item.name || item.description))
  const isEmpty = isHtml ? !content.trim() : items.length === 0

  return (
    <section id={anchor} className="section-padding academic-section" aria-labelledby={`${anchor}-heading`}>
      <div className="container-max">
        <SectionHeading section={section} number={number} anchor={anchor} />
        {isEmpty
          ? <div className="empty-state"><p>Aucun contenu à afficher pour le moment.</p></div>
          : isHtml
            ? <div className="rich-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
            : <ol className="research-list">{items.map((item, index) => <li key={index}><span className="research-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{(item.title || item.name) && <h3>{item.title || item.name}</h3>}{item.description && <p>{item.description}</p>}</li>)}</ol>}
        <SectionBlocks section={section} />
      </div>
    </section>
  )
}

export default GenericSection
