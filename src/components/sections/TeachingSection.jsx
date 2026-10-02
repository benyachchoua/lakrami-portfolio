import { useState } from 'react'
import { asArray } from '../../utils/sectionDisplay'
import SectionHeading from './SectionHeading'
import SectionBlocks from './SectionBlocks'
import '../../styles/teaching.css'

const COURSE_LIMIT = 6
const FALLBACK_INSTITUTION = 'Autres établissements'

const hasValue = (value) => Array.isArray(value) ? value.length > 0 : Boolean(value && String(value).trim())
const courseMeta = (course) => [course.level, course.semester && (/^semestre/i.test(course.semester) ? course.semester : `Semestre ${course.semester}`), course.hours].filter(Boolean).join(' · ')
const courseDetails = (course) => [
  ['Description', course.description],
  ['Prérequis', course.prerequisites],
  ['Objectifs pédagogiques', course.objectives],
  ['Compétences développées', course.skills],
  ['Type de cours', course.courseType],
  ['Méthodes d’évaluation', course.evaluation]
].filter(([, value]) => hasValue(value))

const TeachingSection = ({ section, number, anchor }) => {
  const [expanded, setExpanded] = useState({})

  const coursesData = asArray(section.content).filter(course => course && typeof course === 'object')

  // Regrouper les cours par établissement (nom conservé tel quel)
  const coursesByInstitution = coursesData.reduce((acc, course) => {
    const name = String(course.establishment ?? '').trim() || FALLBACK_INSTITUTION
    if (!acc[name]) acc[name] = { name, courses: [] }
    acc[name].courses.push(course)
    return acc
  }, {})
  const institutionsList = Object.values(coursesByInstitution)

  return (
    <section id={anchor} className="section-padding academic-section teaching-section" aria-labelledby={`${anchor}-heading`}>
      <div className="container-max">
        <SectionHeading section={section} number={number} anchor={anchor} introClassName="teaching-intro" />

        {institutionsList.length > 0 ? (
          <ul className="institution-list">
            {institutionsList.map((institution, index) => {
              const listId = `${anchor}-courses-${index}`
              const isLong = institution.courses.length > COURSE_LIMIT
              const isOpen = Boolean(expanded[institution.name])
              const visibleCourses = isLong && !isOpen ? institution.courses.slice(0, COURSE_LIMIT) : institution.courses
              const totalHours = institution.courses.reduce((total, course) => total + (parseInt(String(course.hours ?? '').replace('h', '')) || 0), 0)
              return (
                <li key={institution.name}>
                  <h3 className="institution-heading">
                    {institution.name}
                    <span className="tag">{institution.courses.length} cours{totalHours > 0 ? ` · ${totalHours} h` : ''}</span>
                  </h3>
                  <ul className="course-list" id={listId}>
                    {visibleCourses.map((course, courseIndex) => {
                      const meta = courseMeta(course)
                      const details = courseDetails(course)
                      return (
                        <li key={course.id || courseIndex}>
                          {details.length > 0 ? (
                            <details className="course-detail">
                              <summary>{course.title}{meta && <span>{meta}</span>}</summary>
                              <div className="disclosure-body">
                                {details.map(([label, value]) => (
                                  <div key={label}>
                                    <h4>{label}</h4>
                                    {Array.isArray(value) ? <ul>{value.map((item, itemIndex) => <li key={itemIndex}>{String(item)}</li>)}</ul> : <p>{value}</p>}
                                  </div>
                                ))}
                              </div>
                            </details>
                          ) : (
                            <div className="course-row">{course.title}{meta && <span>{meta}</span>}</div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                  {isLong && (
                    <div className="course-more">
                      <button type="button" className="text-button" aria-expanded={isOpen} aria-controls={listId} onClick={() => setExpanded(prev => ({ ...prev, [institution.name]: !isOpen }))}>
                        {isOpen ? `Réduire la liste (${COURSE_LIMIT} premiers cours)` : `Afficher tous les cours (${institution.courses.length})`}
                        <span className="sr-only"> — {institution.name}</span>
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="empty-state teaching-empty">
            <p>Aucun contenu à afficher pour le moment.</p>
          </div>
        )}

        <SectionBlocks section={section} />
      </div>
    </section>
  )
}

export default TeachingSection
