import { useState } from 'react'
import { ArrowUpRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { safeExternalUrl } from '../../utils/sanitizeHtml'
import '../../styles/publications-theses.css'

const PAGE_SIZE = 10

// Données complètes des publications organisées par domaines
const publicationsData = {
  reseauxSecurite: {
    title: "Réseaux et Sécurité",
    articles: [
      { id: 1, title: "A fuzzy logic-based trust system for detecting selfish nodes and encouraging cooperation in Optimized Link State Routing protocol", authors: "F. Lakrami et al.", journal: "The Art of Cyber Defense. CRC Press", pages: "190-210", year: "2024", type: "Book Chapter" },
      { id: 2, title: "A smart parking system combining IoT and AI to address improper parking", authors: "M. LAAOUAFY, F. LAKRAMI, O LABOUIDYA", journal: "International Journal on Information Technologies and Security (IJITS), Vol. 16, No 2", year: "2024", type: "Web Of Sciences" },
      { id: 3, title: "A fuzzy logic-based trust system for detecting selfish nodes and encouraging cooperation in Optimized Link State Routing Protocol", authors: "F. LAKRAMI, O. LABOUIDYA, N. EL KAMOUN ET AL", journal: "Book CHAPTER : The Art of Cyber Defense", year: "2024", type: "Book Chapter" },
      { id: 4, title: "Cooperative Trust Framework Based On Hy-Ids, Firewalls, And Mobile Agents to enhance security in a cloud environment", authors: "H. TOUMI, F. FAGROUD, K. ACHTAICH, F. LAKRAMI, M. TALEA", journal: "Journal of Theoretical and Applied Information Technology, Vol.101. No 10", year: "2023", type: "SCOPUS" },
      { id: 5, title: "A new indoor positioning system for WSN: application in smart parking", authors: "M. LAAOUAFY, F. LAKRAMI, N. EL KAMOUN, O LABOUIDYA", journal: "International Journal of Sensor Networks, 42(2), pp. 79–86", year: "2023", type: "SCOPUS" },
      { id: 6, title: "Distributed Denial Of Service attacks detection using Statistical Process Control In centralized Wireless Networks", authors: "H. SOUNNI, N. EL KAMOUN, F. LAKRAMI", journal: "Journal of Engineering Science and Technology, 17(2), pp. 1436–1446", year: "2022", type: "SCOPUS" },
      { id: 7, title: "An experimental evaluation of localization methods used in wireless sensor networks", authors: "M. LAAOUAFY, F. LAKRAMI, N. EL KAMOUN, O LABOUIDYA", journal: "Indonesian Journal of Electrical Engineering and Computer Science, 25(3), pp. 1518–1528", year: "2022", type: "SCOPUS" },
      { id: 8, title: "A technique for order of preference by similarity to ideal solution-based method for access point selection in a software-defined Wi-Fi network", authors: "H. SOUNNI, N. EL KAMOUN, F. LAKRAMI", journal: "International Journal on Communications Antenna and Propagation, 11(1), pp. 42–48", year: "2021", type: "SCOPUS" },
      { id: 9, title: "SPC-based Approach for DDoS Attack Detection Using X-MR Control Chart", authors: "H. SOUNNI, N. ELKAMOUN, F. LAKRAMI", journal: "International Journal on Information Technologies and Security, No.2 (vol. 13), pp. 117-128", year: "2021", type: "Thomson/Web of Sciences" },
      { id: 10, title: "The design of an experimental model for deploying Home Area Network in Smart Grid", authors: "F. LAKRAMI, N. EL KAMOUN, O. LABOUIDYA, H. SOUNNI, K. ZINE-DINE", journal: "Advances in Science, Technology and Engineering Systems Journal (ASTESJ), Vol. 5, No. 3, Pages: 419-431", year: "2020", type: "SCOPUS" },
      { id: 11, title: "Software Defined Network for QoS Enhancement in Mobile Wi-Fi Network", authors: "H. SOUNNI, N. EL KAMOUN, F. LAKRAMI", journal: "International Journal of Recent Technology and Engineering (IJRTE), Volume-8 Issue-3", year: "2019", type: "SCOPUS" },
      { id: 12, title: "Study of the impact of routing and the profoundness of GRE tunnels on the performance of the transmission of real time applications in IP networks", authors: "D. IDRISSI, N. ELKAMOUN, F. LAKRAMI, R. HILAL", journal: "International Journal of Computer Science and Network Security, vol. 18, no 7, p. 76-82", year: "2018", type: "Web of Science" },
      { id: 13, title: "Performance Evaluation of Wireless 802.11 n Using Level 2 and Level 3 Mobility", authors: "H. SOUNNI, N. ELKAMOUN, F. LAKRAMI", journal: "Indian Journal of Science and Technology, Volume 11, Issue 14", year: "2018", type: "Web of Science" },
      { id: 14, title: "Performance Comparison of Protocols Combination Based on EIGRP and OSPF for Real-time Applications in Enterprise Networks", authors: "D. IDRISSI, N. ELKAMOUN, F. LAKRAMI, R. HILAL", journal: "International Journal of Advanced Computer Science and Applications (IJACSA), vol. 8, no 5, p. p145-150", year: "2017", type: "SCOPUS & Web of Science" },
      { id: 15, title: "Performance comparison of Wireless IEEE 802.11 a, b, g and n used for Ad-Hoc Networks in an ELearning Classrooms Network", authors: "F. LAKRAMI, N. ELKAMOUN, and O. LAOUIDYA", journal: "International Journal of Computer Science and Information Security (IJCSIS)", year: "2017", type: "Article de journal" },
      { id: 16, title: "Performance Evaluation of 802.11 Access Methods with QoS Enhancement under Mobility Impact", authors: "H. SOUNNI, N. ELKAMOUN, F. LAKRAMI", journal: "International Journal of Computer Applications, Vol: 179(2):36-41", year: "2017", type: "Article de journal" },
      { id: 17, title: "Performance Evaluation of Routing Protocols in Manets Deployed for e-Learning Purpose", authors: "F. LAKRAMI, N. ELKAMOUN AND O. LAOUIDYA", journal: "International Journal of Computer Applications, vol 178, Issue 2, pages :41-47", year: "2017", type: "ESCI" },
      { id: 18, title: "Mobility and QOS Management in OLSR Routing Protocol", authors: "F. LAKRAMI, N. ELKAMOUN", journal: "International Journal of Computer Networking, Wireless and Mobile Communications (IJCNWMC)", year: "2013", type: "Article de journal" },
      { id: 19, title: "Study of a Multi-Layers Quality of Service Model for ADHOC networks", authors: "F. LAKRAMI, N. ELKAMOUN", journal: "International Journal of Computer Applications, Volume 48– No.14", year: "2013", type: "Article de journal" },
      { id: 20, title: "Energy and Mobility in OLSR routing protocol", authors: "F. LAKRAMI, N. ELKAMOUN", journal: "Cyber Journals: Multidisciplinary Journals in Science and Technology, Journal of Selected Areas in Telecommunications (JSAT)", year: "2012", type: "Article de journal" }
    ],
    communications: [
      { id: 1, title: "Examining the Effects of DDoS Attacks on SDN Architectures: Experimental Study", authors: "J. Zakariaa, F. LAKRAMI, H. SOUNNI, et al.", conference: "International Conference on Ubiquitous Networking (UNet). IEEE", year: "2024", pages: "p. 1-5" },
      { id: 2, title: "A secure based trust model for Optimized Link State Routing protocol (OLSR)", authors: "F. LAKRAMI, M. EL KAMILI, N. ELKAMOUN, H. SOUNNI, & O. LABOUIDYA", conference: "2023 10th International Conference on Wireless Networks and Mobile Communications (WINCOM), Istanbul, Turkey. IEEE", year: "2023" },
      { id: 3, title: "An enhanced centralized approach to improve localization in wireless sensor networks: application to smart parking", authors: "M. LAAOUAFY, F. LAKRAMI, O LABOUIDYA", conference: "EVF'2022 – 9th International Conference on Energy and City of the Future, El Jadida (Morocco)", year: "2022" },
      { id: 4, title: "A new Smart Parking system based on Artificial Intelligence", authors: "F. LAKRAMI, M. LAAOUAFY, N. EL KAMOUN, O LABOUIDYA", conference: "EVF'2022 – 9th International Conference on Energy and City of the Future, ENSA, El Jadida (Morocco)", year: "2022" }
    ]
  },
  elearningIA: {
    title: "E-learning et Intelligence Artificielle",
    articles: [
      { id: 1, title: "Higher education and generative artificial intelligence: Applications, challenges, opportunities, and Ethics", authors: "M. KAOUNI, F. LAKRAMI, O. LAOUIDYA & Y. BADDI", journal: "Chapitre d'ouvrage", year: "2024", type: "Book Chapter" },
      { id: 2, title: "The Design of an Adaptive E-learning model based on artificial intelligence for enhancing online teaching", authors: "M. KAOUNI, F. LAKRAMI, O. LABOUIDYA", journal: "International Journal of Emerging Technologies in Learning (iJET)", year: "2023", type: "Article de journal" },
      { id: 3, title: "Analytic survey on the challenges of Moroccan students in higher education institutions face to distance learning", authors: "M. KAOUNI, F. LAKRAMI, O. LABOUIDYA", journal: "Indonesian Journal of Electrical Engineering and Computer Science Vol. 28, No. 1, pp. 284~296", year: "2022", type: "SCOPUS" },
      { id: 4, title: "Towards the development of a didactic approach using MOOCs in traditional classrooms to support teaching in higher education in MOROCCO", authors: "F. LAKRAMI, N. ELKAMOUN AND O. LAOUIDYA", journal: "International Journal of Information Science and Technology, vol. 3, no 2, p. 19-28", year: "2019", type: "Article de journal" },
      { id: 5, title: "Pédagogie universitaire et classe inversée : vers un apprentissage fructueux en travaux pratiques", authors: "F. LAKRAMI, N. ELKAMOUN AND O. LAOUIDYA", journal: "Revue internationale de pédagogie de l'enseignement supérieur (RIPES), 34(34-3)", year: "2018", type: "Article de journal" },
      { id: 6, title: "Apport des TIC dans la mise en place d'une pédagogie active en contexte universitaire : pistes de réflexion et propositions", authors: "O. LABOUDYA, N. ELKAMOUN, K. ELKHADIRI, M. BOUSMAH, F. LAKRAMI, R. HILAL", journal: "Revue scientifique Internationale de l'éducation et de la formation, volume II, N°3", year: "2017", type: "Article de journal" }
    ],
    communications: [
      { id: 1, title: "Personalizing Formative Feedback Through Generative Artificial Intelligence: An Experiment In Higher Education", authors: "H. Akhasbi, N. El Kamoun, F. Lakrami et al", conference: "17th International Conference on Education and New Learning Technologies held in Palma, Spain", year: "2025" },
      { id: 2, title: "L'intelligence artificielle générative : une opportunité pour améliorer l'évaluation formative dans un contexte universitaire massif", authors: "N. El Kamoun, H. Akhasbi, F. Lakrami, et al", conference: "36e Colloque de l'ADMEE-Europe, Belval, Luxembourg", year: "2025", link: "http://hdl.handle.net/20.500.12162/8096" },
      { id: 3, title: "Transformation digitale des territoires et organisations de l'ESS :opportunités, défis et perspectives au Maroc", authors: "M. ERRACHIQ, F. LAKRAMI, F. NAJI", conference: "Colloque International de la recherche Appliquée (IRA 2025), FSJES de kelaa des Seraghna", year: "2025" },
      { id: 4, title: "Intégration de l'IA dans le cycle CGQTS : Vers une génération automatisée de Quizz adaptatifs", authors: "F. LAKRAMI et al", conference: "2ème édition de International Meeting for Innovative Pedagogy (IMIP'24), université de Technologie de Compiègne (UTC), France", year: "2025" },
      { id: 5, title: "Vers une Pédagogie Réinventée: l'impact de l'IA générative", authors: "F. LAKRAMI et al", conference: "1ères Rencontres Internationales de l'Innovation Pédagogique, ESC Clement Business Scool, France", year: "2024" }
    ]
  }
}

const normalize = (value) => String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const plural = (count, word) => `${count} ${word}${count > 1 ? 's' : ''}`

// Liste à plat (articles + communications), triée par année décroissante.
const allEntries = Object.entries(publicationsData).flatMap(([domainKey, domain]) => [
  ...domain.articles.map(item => ({ key: `${domainKey}-a-${item.id}`, domainKey, domain: domain.title, kind: 'article', kindLabel: 'Article de revue', title: item.title, authors: item.authors, source: item.journal, pages: item.pages, year: item.year, type: item.type, link: safeExternalUrl(item.link) })),
  ...domain.communications.map(item => ({ key: `${domainKey}-c-${item.id}`, domainKey, domain: domain.title, kind: 'communication', kindLabel: 'Communication', title: item.title, authors: item.authors, source: item.conference, pages: item.pages, year: item.year, link: safeExternalUrl(item.link) })),
]).map(entry => ({ ...entry, haystack: normalize([entry.title, entry.authors, entry.source, entry.year, entry.type, entry.domain, entry.kindLabel].join(' ')) }))
  .sort((a, b) => Number(b.year) - Number(a.year))

const years = [...new Set(allEntries.map(entry => entry.year))]
const articlesCount = allEntries.filter(entry => entry.kind === 'article').length
const figures = [
  ['Publications', allEntries.length],
  ['Articles de revues', articlesCount],
  ['Communications', allEntries.length - articlesCount],
  ['Années d’activité', Number(years[0]) - Number(years[years.length - 1]) + 1],
]

const PublicationsSection = ({ sections = [] }) => {
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState('all')
  const [kind, setKind] = useState('all')
  const [year, setYear] = useState('all')
  const [expanded, setExpanded] = useState(false)
  const publicationsSection = sections.find(section => section.id === 'publications')

  if (!publicationsSection || !publicationsSection.visible) return null

  const terms = normalize(query).trim()
  const filtered = allEntries.filter(entry => (domain === 'all' || entry.domainKey === domain) && (kind === 'all' || entry.kind === kind) && (year === 'all' || entry.year === year) && (!terms || entry.haystack.includes(terms)))
  const visible = expanded ? filtered : filtered.slice(0, PAGE_SIZE)
  const hasFilters = Boolean(terms) || domain !== 'all' || kind !== 'all' || year !== 'all'
  const resetFilters = () => { setQuery(''); setDomain('all'); setKind('all'); setYear('all') }

  return (
    <section id="publications" className="section-padding academic-section publications-section" aria-labelledby="publications-heading">
      <div className="container-max">
        <div className="section-heading heading-split"><div><p className="eyebrow">04 / Publications</p><h2 id="publications-heading">Production scientifique,<br /><em>référencée.</em></h2></div><p>Mes contributions à la recherche dans les domaines des réseaux informatiques, de la sécurité et des technologies éducatives.</p></div>

        <dl className="catalogue-figures" aria-label="Chiffres clés">{figures.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>

        <div className="catalogue-toolbar" role="search" aria-label="Rechercher dans les publications">
          <div>
            <label htmlFor="publication-search">Rechercher une publication</label>
            <div className="search-input"><MagnifyingGlassIcon aria-hidden="true" /><input id="publication-search" type="search" className="input-field" value={query} onChange={event => setQuery(event.target.value)} placeholder="Titre, auteur, revue, mot-clé…" autoComplete="off" /></div>
          </div>
          <div>
            <label htmlFor="publication-domain">Domaine</label>
            <select id="publication-domain" className="input-field" value={domain} onChange={event => setDomain(event.target.value)}>
              <option value="all">Tous les domaines</option>
              {Object.entries(publicationsData).map(([key, item]) => <option key={key} value={key}>{item.title}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="publication-kind">Type</label>
            <select id="publication-kind" className="input-field" value={kind} onChange={event => setKind(event.target.value)}>
              <option value="all">Tous les types</option>
              <option value="article">Articles de revues</option>
              <option value="communication">Communications</option>
            </select>
          </div>
          <div>
            <label htmlFor="publication-year">Année</label>
            <select id="publication-year" className="input-field" value={year} onChange={event => setYear(event.target.value)}>
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
          <ul className="publication-list" id="publication-list">
            {visible.map(entry => {
              const url = entry.link
              return (
                <li className="publication-entry" key={entry.key}>
                  <span className="publication-year">{entry.year}</span>
                  <div>
                    <div className="publication-meta"><span className="tag">{entry.type || entry.kindLabel}</span>{entry.type && <span>{entry.kindLabel}</span>}<span>{entry.domain}</span></div>
                    <h3>{entry.title}</h3>
                    <p>{entry.authors}</p>
                    <p className="publication-source"><em>{entry.source}</em>{entry.pages && `, ${entry.pages}`}</p>
                    {url && <a href={url} target="_blank" rel="noopener noreferrer">Voir la publication<ArrowUpRightIcon aria-hidden="true" /><span className="sr-only"> (nouvel onglet)</span></a>}
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="empty-state"><h3>Aucune publication trouvée</h3><p>Aucun résultat ne correspond à ces critères. Modifiez votre recherche ou réinitialisez les filtres.</p></div>
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="catalogue-footer">
            <button type="button" className="btn-secondary" aria-expanded={expanded} aria-controls="publication-list" onClick={() => setExpanded(value => !value)}>{expanded ? 'Réduire la liste' : `Afficher toutes les publications (${filtered.length})`}</button>
          </div>
        )}
      </div>
    </section>
  )
}

export default PublicationsSection
