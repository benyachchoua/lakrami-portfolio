import React, { useState, useMemo, useRef, useEffect } from 'react'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'

const FALLBACK_ESTABLISHMENT = 'Autres établissements'
const LEVELS = ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat', 'Ingénieur', 'Formation Continue', 'Autre']
const ESTABLISHMENTS = ['Faculté des Sciences d\'El Jadida', 'ENSA d\'El Jadida', 'SUPEMIR', 'ESEF d\'El Jadida', 'FLSH d\'El Jadida', 'EST de Sidi Bennour', 'Autre']
const SEMESTERS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'Annuel']
const COURSE_TYPES = ['Cours magistral', 'Travaux dirigés', 'Travaux pratiques', 'Cours intégré', 'Projet', 'Stage']

const emptyCourse = () => ({ title: '', establishment: '', customEstablishment: '', level: '', customLevel: '', semester: '', hours: '', courseType: '', description: '', prerequisites: '', objectives: '', skills: '', evaluation: '' })
const text = (value) => String(value ?? '').trim()
const parseHours = (hours) => parseInt(String(hours ?? '').replace('h', '')) || 0
const toOptions = (values, current, labels = {}) => {
  const list = current && !values.includes(current) ? [...values, current] : values
  return list.map(value => ({ value, label: labels[value] ?? (value === 'Annuel' ? value : /^S\d$/.test(value) ? `Semestre ${value.slice(1)}` : value) }))
}
const courseMeta = (course) => [course.level, course.semester && (/^semestre/i.test(course.semester) ? course.semester : /^S\d$/.test(course.semester) ? `Semestre ${course.semester.slice(1)}` : course.semester), course.hours].filter(Boolean).join(' · ')

const CoursesEditor = () => {
  const { portfolioData, updateSection, loading } = usePortfolio()
  const [isEditing, setIsEditing] = useState(false)
  const [editingCourseIndex, setEditingCourseIndex] = useState(null)
  const headingRef = useRef(null)
  const wasEditing = useRef(false)

  const coursesSection = useMemo(() =>
    portfolioData.sections.find(section => section.id === 'enseignement'),
    [portfolioData.sections]
  )

  const existingCourses = useMemo(() =>
    Array.isArray(coursesSection?.content) ? coursesSection.content : [],
    [coursesSection]
  )

  const { register, control, handleSubmit, reset, watch, setFocus, formState: { errors } } = useForm({
    defaultValues: { courses: existingCourses.length > 0 ? existingCourses : [emptyCourse()] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'courses' })
  const watched = watch('courses') ?? []

  // Déplace le focus sur le titre de la page quand on entre dans / quitte le mode édition
  useEffect(() => {
    if (wasEditing.current !== isEditing) {
      wasEditing.current = isEditing
      headingRef.current?.focus()
    }
  }, [isEditing])

  // Établissements regroupés (index d'origine conservé pour modifier / supprimer)
  const groups = useMemo(() => {
    const byName = {}
    existingCourses.forEach((course, index) => {
      if (!course || typeof course !== 'object') return
      const name = text(course.establishment) || FALLBACK_ESTABLISHMENT
      if (!byName[name]) byName[name] = { name, items: [] }
      byName[name].items.push({ course, index })
    })
    return Object.values(byName)
  }, [existingCourses])

  const totalHours = existingCourses.reduce((total, course) => total + parseHours(course?.hours), 0)
  const levelCount = new Set(existingCourses.map(course => text(course?.level)).filter(Boolean)).size

  const saveSection = (content) => updateSection('enseignement', {
    title: coursesSection?.title ?? 'Enseignement',
    type: coursesSection?.type ?? 'teaching',
    meta: coursesSection?.meta ?? null,
    content,
    visible: coursesSection?.visible !== false,
    order: coursesSection?.order ?? 12
  })

  const handleDeleteSingleCourse = async (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      const currentCourses = portfolioData.sections.find(s => s.id === 'enseignement')?.content || []
      const result = await saveSection(currentCourses.filter((_, i) => i !== index))
      if (result.success) {
        toast.success('Cours supprimé avec succès!')
      } else {
        toast.error(result.error || 'Erreur lors de la suppression')
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      const validCourses = data.courses
        .filter(course => text(course.title) && text(course.level) && text(course.establishment))
        .map((course, index) => ({
          ...course,
          id: course.id || `course-${Date.now()}-${index}`,
          level: course.level === 'Autre' ? course.customLevel : course.level,
          establishment: course.establishment === 'Autre' ? course.customEstablishment : course.establishment
        }))

      if (validCourses.length === 0) {
        toast.error('Veuillez ajouter au moins un cours valide')
        return
      }

      const result = await saveSection(validCourses)

      if (result.success) {
        toast.success(`${validCourses.length} cours sauvegardé${validCourses.length > 1 ? 's' : ''} avec succès!`)
        setIsEditing(false)
        setEditingCourseIndex(null)
      } else {
        toast.error(result.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue')
    }
  }

  // Modifier tous les cours
  const handleEdit = () => {
    setIsEditing(true)
    setEditingCourseIndex(null)
    reset({ courses: existingCourses.length > 0 ? existingCourses : [emptyCourse()] })
  }

  // Modifier un seul cours
  const handleEditSingleCourse = (index) => {
    setEditingCourseIndex(index)
    setIsEditing(true)
    reset({ courses: existingCourses })
  }

  // Ajouter un seul nouveau cours depuis la liste
  const handleAddCourse = () => {
    setEditingCourseIndex(existingCourses.length)
    setIsEditing(true)
    reset({ courses: [...existingCourses, emptyCourse()] })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingCourseIndex(null)
    reset()
  }

  const removeCourse = (index) => {
    remove(index)
    setTimeout(() => setFocus(`courses.${Math.max(0, index - 1)}.title`), 0)
  }

  // Champ de formulaire : id unique par index, label lié, erreur liée via aria-describedby
  const renderField = (index, name, label, { kind = 'text', required, rules, wide, placeholder, rows, options, empty } = {}) => {
    const id = `course-${index}-${name}`
    const error = errors.courses?.[index]?.[name]?.message
    const props = {
      id,
      className: 'input-field',
      'aria-invalid': error ? 'true' : undefined,
      'aria-describedby': error ? `${id}-error` : undefined,
      'aria-required': required ? 'true' : undefined,
      ...register(`courses.${index}.${name}`, rules)
    }
    return (
      // !mt-0 : annule la marge `.admin-field + .admin-field`, l'espacement est géré par la grille
      <div className={`admin-field !mt-0${wide ? ' md:col-span-2' : ''}`}>
        <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
        {kind === 'select' ? (
          <select {...props}>
            <option value="">{empty}</option>
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        ) : kind === 'textarea' ? (
          <textarea {...props} rows={rows} placeholder={placeholder} />
        ) : (
          <input {...props} type="text" placeholder={placeholder} autoComplete="off" />
        )}
        {error && <p id={`${id}-error`} role="alert" className="form-error">{error}</p>}
      </div>
    )
  }

  const isSingle = editingCourseIndex !== null
  const isNewSingle = isSingle && editingCourseIndex >= existingCourses.length

  const header = (
    <header className="admin-page-header">
      <div>
        <div className="eyebrow">Enseignement</div>
        <h1 ref={headingRef} tabIndex={-1}>
          {!isEditing ? <>Mes <em>cours.</em></> : isNewSingle ? <>Nouveau <em>cours.</em></> : isSingle ? <>Modifier le <em>cours.</em></> : <>Modifier mes <em>cours.</em></>}
        </h1>
        <p>{isEditing ? 'Les champs marqués d’un astérisque (*) sont obligatoires.' : 'Les cours apparaissent sur le site, groupés par établissement.'}</p>
      </div>
      {!isEditing && (
        <div className="admin-actions">
          <button type="button" className="btn-primary" onClick={handleAddCourse}>
            <PlusIcon aria-hidden="true" />Ajouter un cours
          </button>
          {existingCourses.length > 0 && (
            <button type="button" className="btn-secondary" onClick={handleEdit}>Modifier tous les cours</button>
          )}
        </div>
      )}
      {isEditing && !isSingle && (
        <div className="admin-actions">
          <button type="button" className="btn-secondary" onClick={() => append(emptyCourse())}>
            <PlusIcon aria-hidden="true" />Ajouter un cours
          </button>
        </div>
      )}
    </header>
  )

  if (!isEditing) {
    return (
      <div>
        {header}

        {groups.length > 0 ? (
          <>
            <section className="admin-stats" aria-label="Chiffres clés">
              <div className="admin-stat"><strong>{existingCourses.length}</strong><span>Cours</span></div>
              <div className="admin-stat"><strong>{groups.length}</strong><span>{groups.length > 1 ? 'Établissements' : 'Établissement'}</span></div>
              <div className="admin-stat"><strong>{totalHours > 0 ? `${totalHours} h` : '—'}</strong><span>Volume horaire</span></div>
              <div className="admin-stat"><strong>{levelCount || '—'}</strong><span>{levelCount > 1 ? 'Niveaux' : 'Niveau'}</span></div>
            </section>

            {groups.map((group, groupIndex) => {
              const hours = group.items.reduce((total, { course }) => total + parseHours(course.hours), 0)
              const headingId = `courses-group-${groupIndex}`
              return (
                <section key={group.name} className="admin-panel" aria-labelledby={headingId}>
                  <div className="admin-panel-header flex-wrap">
                    <h2 id={headingId} className="min-w-0 break-words">{group.name}</h2>
                    <span className="tag">{group.items.length} cours{hours > 0 ? ` · ${hours} h` : ''}</span>
                  </div>
                  <div className="admin-panel-body">
                    <ul className="admin-list">
                      {group.items.map(({ course, index }) => {
                        const title = text(course.title) || 'Cours sans titre'
                        const meta = courseMeta(course)
                        return (
                          <li key={course.id || index}>
                            <div className="min-w-0">
                              <h3 className="break-words">{title}</h3>
                              {meta && <p>{meta}</p>}
                            </div>
                            <div className="flex shrink-0">
                              <button type="button" className="btn-icon" aria-label={`Modifier ${title}`} onClick={() => handleEditSingleCourse(index)}>
                                <PencilIcon aria-hidden="true" />
                              </button>
                              <button type="button" className="btn-icon" aria-label={`Supprimer ${title}`} disabled={loading} onClick={() => handleDeleteSingleCourse(index)}>
                                <TrashIcon aria-hidden="true" />
                              </button>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </section>
              )
            })}
          </>
        ) : (
          <div className="empty-state">
            <h3>Aucun cours enregistré</h3>
            <p className="mb-5">Ajoutez votre premier cours pour qu’il apparaisse sur le site.</p>
            <button type="button" className="btn-primary" onClick={handleEdit}>Ajouter mon premier cours</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {header}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {fields.map((field, index) => {
          // Si on modifie un cours spécifique, n'afficher que celui-ci
          if (isSingle && index !== editingCourseIndex) return null

          const establishment = watched[index]?.establishment
          const level = watched[index]?.level
          const savedTitle = text(existingCourses[index]?.title) || 'Nouveau cours'

          return (
            <section key={field.id} className="admin-panel" aria-labelledby={`course-${index}-heading`}>
              <div className="admin-panel-header flex-wrap">
                <h2 id={`course-${index}-heading`} className="min-w-0 break-words">
                  {isSingle ? savedTitle : `Cours ${index + 1}${text(existingCourses[index]?.title) ? ` — ${existingCourses[index].title}` : ''}`}
                </h2>
                {fields.length > 1 && !isSingle && (
                  <button type="button" className="btn-danger" onClick={() => removeCourse(index)} aria-label={`Supprimer le cours ${index + 1}`}>
                    <TrashIcon aria-hidden="true" width="18" height="18" />Supprimer
                  </button>
                )}
              </div>

              <div className="admin-panel-body admin-grid-2">
                {renderField(index, 'title', 'Nom du cours', { required: true, wide: true, rules: { required: 'Le nom du cours est requis' }, placeholder: 'Ex : Réseaux informatiques, Intelligence artificielle…' })}

                {renderField(index, 'establishment', 'Établissement', { kind: 'select', required: true, rules: { required: 'L’établissement est requis' }, empty: 'Choisir un établissement', options: toOptions(ESTABLISHMENTS, establishment, { Autre: 'Autre établissement' }) })}
                {establishment === 'Autre' && renderField(index, 'customEstablishment', 'Nom de l’établissement', { required: true, rules: { required: 'Veuillez préciser le nom de l’établissement' }, placeholder: 'Ex : École Supérieure de Commerce…' })}

                {renderField(index, 'level', 'Niveau', { kind: 'select', required: true, rules: { required: 'Le niveau est requis' }, empty: 'Choisir un niveau', options: toOptions(LEVELS, level) })}
                {level === 'Autre' && renderField(index, 'customLevel', 'Précisez le niveau', { required: true, rules: { required: 'Veuillez préciser le niveau' }, placeholder: 'Ex : Cycle préparatoire…' })}

                {renderField(index, 'semester', 'Semestre', { kind: 'select', empty: 'Choisir un semestre', options: toOptions(SEMESTERS, watched[index]?.semester) })}
                {renderField(index, 'hours', 'Nombre d’heures', { placeholder: 'Ex : 40h' })}
                {renderField(index, 'courseType', 'Type de cours', { kind: 'select', empty: 'Choisir un type', options: toOptions(COURSE_TYPES, watched[index]?.courseType) })}

                {renderField(index, 'description', 'Description du cours', { kind: 'textarea', rows: 4, wide: true, placeholder: 'Contenu du cours, programme…' })}
                {renderField(index, 'objectives', 'Objectifs pédagogiques', { kind: 'textarea', rows: 3, wide: true, placeholder: 'Ex : Maîtriser les concepts fondamentaux…' })}
                {renderField(index, 'skills', 'Compétences développées', { kind: 'textarea', rows: 3, wide: true, placeholder: 'Ex : Analyse technique, travail en équipe…' })}
                {renderField(index, 'prerequisites', 'Prérequis', { kind: 'textarea', rows: 3, placeholder: 'Ex : Mathématiques de base…' })}
                {renderField(index, 'evaluation', 'Méthodes d’évaluation', { kind: 'textarea', rows: 3, placeholder: 'Ex : Contrôle continu, examen final…' })}
              </div>
            </section>
          )
        })}

        <div className="admin-form-footer">
          <button type="button" className="btn-secondary" onClick={handleCancel}>Annuler</button>
          <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading || undefined}>
            {loading ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CoursesEditor
