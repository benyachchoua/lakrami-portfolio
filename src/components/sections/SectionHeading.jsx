import { formatNumber, getMeta, hasText } from '../../utils/sectionDisplay'

// En-tête commun : surtitre « NN / eyebrow », titre h2 (+ accent en italique) et introduction.
// split=true : mise en page « heading-split » (titre à gauche, introduction à droite).
const SectionHeading = ({ section, number, anchor, split = true, introClassName, children }) => {
  const meta = getMeta(section)
  const label = hasText(meta.eyebrow) ? meta.eyebrow : section?.title
  const eyebrow = [number ? formatNumber(number) : '', label].filter(Boolean).join(' / ')
  const heading = hasText(meta.heading) ? meta.heading : section?.title
  const id = `${anchor}-heading`

  const title = (
    <h2 id={id}>
      {heading}
      {hasText(meta.accent) && <><br /><em>{meta.accent}</em></>}
    </h2>
  )
  const intro = hasText(meta.intro) ? <p className={introClassName}>{meta.intro}</p> : null

  if (split) {
    return (
      <div className="section-heading heading-split">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title}
        </div>
        {intro}
        {children}
      </div>
    )
  }

  return (
    <div className="section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {title}
      {intro}
      {children}
    </div>
  )
}

export default SectionHeading
