import { asArray, getMeta, hasText, stringList } from '../../utils/sectionDisplay'
import '../../styles/section-blocks.css'

// Blocs complémentaires de la section (meta.blocks : { title, text, items })
const SectionBlocks = ({ section }) => {
  const blocks = asArray(getMeta(section).blocks)
    .filter(block => block && typeof block === 'object')
    .map(block => ({ title: block.title, text: block.text, items: stringList(block.items) }))
    .filter(block => hasText(block.title) || hasText(block.text) || block.items.length > 0)
  if (blocks.length === 0) return null

  return (
    <div className="section-blocks">
      {blocks.map((block, index) => (
        <div key={index}>
          {hasText(block.title) && <h3>{block.title}</h3>}
          {hasText(block.text) && <p>{block.text}</p>}
          {block.items.length > 0 && <ul>{block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>}
        </div>
      ))}
    </div>
  )
}

export default SectionBlocks
