import { useState } from 'react'
import { sanitizeHtml } from '../../utils/sanitizeHtml'
import '../../styles/teaching.css'

const COURSE_LIMIT = 6
const INSTITUTIONS = [
  ['Faculté des Sciences', 'Faculté des Sciences d\'El Jadida'],
  ['ENSA', 'ENSA d\'El Jadida'],
  ['SUPEMIR', 'SUPEMIR'],
  ['ESEF', 'ESEF d\'El Jadida'],
  ['FLSH', 'FLSH d\'El Jadida'],
  ['EST', 'EST de Sidi Bennour']
]
const DIGITAL_ITEMS = ['Plateformes d\'apprentissage en ligne', 'Évaluation automatisée', 'Réalité virtuelle en éducation', 'Intelligence artificielle pédagogique']
const CONTINUING_ITEMS = ['Ateliers sur l\'IA en éducation', 'Formations en cybersécurité', 'Séminaires sur les réseaux', 'Conférences technologiques']

const matchInstitution = (text) => (INSTITUTIONS.find(([key]) => text.includes(key)) || [])[1]
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

const TeachingSection = ({ sections = [] }) => {
  const [expanded, setExpanded] = useState({})
  const teachingSection = sections.find(section => section.id === 'enseignement')

  if (!teachingSection || !teachingSection.visible) return null

  const coursesData = Array.isArray(teachingSection.content) ? teachingSection.content : []

  // Regrouper les cours par établissement (nom personnalisé conservé tel quel)
  const coursesByInstitution = coursesData.reduce((acc, course) => {
    const establishment = course.establishment
    const name = establishment
      ? matchInstitution(establishment) || establishment
      : matchInstitution(course.description || '') || 'Autres établissements'
    if (!acc[name]) acc[name] = { name, courses: [] }
    acc[name].courses.push(course)
    return acc
  }, {})
  const institutionsList = Object.values(coursesByInstitution)

  const hasRichIntro = typeof teachingSection.content === 'string' && teachingSection.content.trim()

  return (
    <section id="teaching" className="section-padding academic-section teaching-section" aria-labelledby="teaching-heading">
      <div className="container-max">
        <div className="section-heading heading-split">
          <div>
            <p className="eyebrow">06 / Enseignement</p>
            <h2 id="teaching-heading">Transmettre le savoir,<br /><em>former et innover.</em></h2>
          </div>
          {hasRichIntro
            ? <div className="teaching-intro" dangerouslySetInnerHTML={{ __html: sanitizeHtml(teachingSection.content) }} />
            : <p className="teaching-intro">Mon engagement dans la formation des futurs ingénieurs et chercheurs en technologies de l’information et de la communication.</p>}
        </div>

        {institutionsList.length > 0 ? (
          <ul className="institution-list">
            {institutionsList.map((institution, index) => {
              const listId = `teaching-courses-${index}`
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
            <h3>Aucun cours disponible</h3>
            <p>Les cours seront affichés ici une fois ajoutés depuis l’administration.</p>
          </div>
        )}

        <div className="teaching-pedagogy">
          <div>
            <h3>Pédagogie numérique</h3>
            <p>Développement et mise en œuvre de solutions d’enseignement à distance, intégration des nouvelles technologies dans les pratiques pédagogiques.</p>
            <ul>{DIGITAL_ITEMS.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <h3>Formation continue</h3>
            <p>Organisation de formations pour les professionnels et les enseignants sur les dernières avancées technologiques.</p>
            <ul>{CONTINUING_ITEMS.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeachingSection
