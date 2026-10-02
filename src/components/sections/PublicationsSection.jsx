import { useMemo, useState } from 'react'
import { ArrowUpRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { safeExternalUrl } from '../../utils/sanitizeHtml'
import { asArray } from '../../utils/sectionDisplay'
import SectionHeading from './SectionHeading'
import SectionBlocks from './SectionBlocks'
import '../../styles/publications-theses.css'

const PAGE_SIZE = 10

const normalize = (value) => String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const plural = (count, word) => `${count} ${word}${count > 1 ? 's' : ''}`
const KIND_LABELS = { article: 'Article de revue', communication: 'Communication' }

// Liste à plat issue du contenu, triée par année décroissante (tri stable)
const buildEntries = (content) => asArray(content)
  .filter(item => item && typeof item === 'object')
  .map((item, index) => {
    const kind = item.kind === 'communication' ? 'communication' : 'article'
    const entry = {
      key: `${item.id ?? 'publication'}-${index}`,
      kind,
      kindLabel: KIND_LABELS[kind],
      domain: String(item.domain ?? '').trim(),
      title: item.title,
      authors: item.authors,
      source: item.source,
      pages: item.pages,
      year: String(item.year ?? '').trim(),
      type: item.type,
      link: safeExternalUrl(item.link),
    }
    return { ...entry, haystack: normalize([entry.title, entry.authors, entry.source, entry.year, entry.type, entry.domain, entry.kindLabel].join(' ')), index }
  })
  .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0) || a.index - b.index)

const PublicationsSection = ({ section, number, anchor }) => {
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState('all')
  const [kind, setKind] = useState('all')
  const [year, setYear] = useState('all')
  const [expanded, setExpanded] = useState(false)

  const allEntries = useMemo(() => buildEntries(section.content), [section.content])
  const domains = useMemo(() => [...new Set(allEntries.map(entry => entry.domain).filter(Boolean))], [allEntries])
  const years = useMemo(() => [...new Set(allEntries.map(entry => entry.year).filter(Boolean))], [allEntries])
  const numericYears = years.map(Number).filter(Number.isFinite)
  const articlesCount = allEntries.filter(entry => entry.kind === 'article').length
  const communicationsCount = allEntries.length - articlesCount
  const figures = [
    ['Publications', allEntries.length],
    ['Articles de revues', articlesCount],
    ['Communications', communicationsCount],
    ['Années d’activité', numericYears.length > 0 ? Math.max(...numericYears) - Math.min(...numericYears) + 1 : 0],
  ].filter(([, value]) => value > 0)

  const listId = `${anchor}-list`
  const terms = normalize(query).trim()
  const filtered = allEntries.filter(entry => (domain === 'all' || entry.domain === domain) && (kind === 'all' || entry.kind === kind) && (year === 'all' || entry.year === year) && (!terms || entry.haystack.includes(terms)))
  const visible = expanded ? filtered : filtered.slice(0, PAGE_SIZE)
  const hasFilters = Boolean(terms) || domain !== 'all' || kind !== 'all' || year !== 'all'
  const resetFilters = () => { setQuery(''); setDomain('all'); setKind('all'); setYear('all') }

  return (
    <section id={anchor} className="section-padding academic-section publications-section" aria-labelledby={`${anchor}-heading`}>
      <div className="container-max">
        <SectionHeading section={section} number={number} anchor={anchor} />

        {allEntries.length === 0 ? <div className="empty-state"><p>Aucun contenu à afficher pour le moment.</p></div> : <>
          {figures.length > 0 && <dl className="catalogue-figures" aria-label="Chiffres clés">{figures.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}

          <div className="catalogue-toolbar" role="search" aria-label="Rechercher dans les publications">
            <div>
              <label htmlFor={`${anchor}-search`}>Rechercher une publication</label>
              <div className="search-input"><MagnifyingGlassIcon aria-hidden="true" /><input id={`${anchor}-search`} type="search" className="input-field" value={query} onChange={event => setQuery(event.target.value)} placeholder="Titre, auteur, revue, mot-clé…" autoComplete="off" /></div>
            </div>
            <div>
              <label htmlFor={`${anchor}-domain`}>Domaine</label>
              <select id={`${anchor}-domain`} className="input-field" value={domain} onChange={event => setDomain(event.target.value)}>
                <option value="all">Tous les domaines</option>
                {domains.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`${anchor}-kind`}>Type</label>
              <select id={`${anchor}-kind`} className="input-field" value={kind} onChange={event => setKind(event.target.value)}>
                <option value="all">Tous les types</option>
                {articlesCount > 0 && <option value="article">Articles de revues</option>}
                {communicationsCount > 0 && <option value="communication">Communications</option>}
              </select>
            </div>
            <div>
              <label htmlFor={`${anchor}-year`}>Année</label>
              <select id={`${anchor}-year`} className="input-field" value={year} onChange={event => setYear(event.target.value)}>
                <option value="all">Toutes</option>
                {years.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>

          <div className="catalogue-status">
            <p aria-live="polite" aria-atomic="true">{plural(filtered.length, 'résultat')} sur {allEntries.length}{visible.length < filtered.length ? ` · ${visible.length} affiché${visible.length > 1 ? 's' : ''}` : ''}</p>
            {hasFilters && <button type="button" className="text-button" onClick={resetFilters}>Réinitialiser les filtres</button>}
          </div>

          {visible.length > 0 ? (
            <ul className="publication-list" id={listId}>
              {visible.map(entry => (
                <li className="publication-entry" key={entry.key}>
                  <span className="publication-year">{entry.year}</span>
                  <div>
                    <div className="publication-meta"><span className="tag">{entry.type || entry.kindLabel}</span>{entry.type && <span>{entry.kindLabel}</span>}{entry.domain && <span>{entry.domain}</span>}</div>
                    <h3>{entry.title}</h3>
                    {entry.authors && <p>{entry.authors}</p>}
                    {(entry.source || entry.pages) && <p className="publication-source">{entry.source && <em>{entry.source}</em>}{entry.pages && `${entry.source ? ', ' : ''}${entry.pages}`}</p>}
                    {entry.link && <a href={entry.link} target="_blank" rel="noopener noreferrer">Voir la publication<ArrowUpRightIcon aria-hidden="true" /><span className="sr-only"> (nouvel onglet)</span></a>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state"><h3>Aucune publication trouvée</h3><p>Aucun résultat ne correspond à ces critères. Modifiez votre recherche ou réinitialisez les filtres.</p></div>
          )}

          {filtered.length > PAGE_SIZE && (
            <div className="catalogue-footer">
              <button type="button" className="btn-secondary" aria-expanded={expanded} aria-controls={listId} onClick={() => setExpanded(value => !value)}>{expanded ? 'Réduire la liste' : `Afficher toutes les publications (${filtered.length})`}</button>
            </div>
          )}
        </>}
        <SectionBlocks section={section} />
      </div>
    </section>
  )
}

export default PublicationsSection
