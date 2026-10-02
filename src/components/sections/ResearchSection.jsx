import { sanitizeHtml } from '../../utils/sanitizeHtml'

const ResearchSection = ({ sections = [] }) => {
  const section = sections.find(item => item.id === 'axes-recherche')
  if (!section?.visible) return null
  const content = Array.isArray(section.content) ? section.content : []
  return (
    <section id="research" className="section-padding research-section" aria-labelledby="research-heading">
      <div className="container-max">
        <div className="section-heading heading-split"><div><p className="eyebrow">02 / Recherche</p><h2 id="research-heading">Explorer. Comprendre.<br /><em>Faire progresser.</em></h2></div><p>Réseaux, sécurité et technologies éducatives : des domaines complémentaires au service de la recherche et de l’innovation.</p></div>
        {typeof section.content === 'string' ? <div className="rich-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content) }} /> : <ol className="research-list">{content.map((item, index) => <li key={index}><span className="research-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{typeof item === 'string' ? item : item.title || item.name}</h3>{typeof item === 'object' && item.description && <p>{item.description}</p>}</li>)}</ol>}
      </div>
    </section>
  )
}

export default ResearchSection

