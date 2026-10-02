import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { safeExternalUrl } from '../../utils/sanitizeHtml'

const AboutSection = ({ profile = {} }) => {
  const networks = [['LinkedIn', profile.linkedin], ['ResearchGate', profile.researchgate], ['YouTube STIC', profile.youtube]].filter(([, url]) => safeExternalUrl(url))
  return (
    <section id="about" className="section-padding academic-section" aria-labelledby="about-heading">
      <div className="container-max about-grid">
        <div className="section-heading">
          <p className="eyebrow">01 / Parcours académique</p>
          <h2 id="about-heading">La recherche,<br /><em>en partage.</em></h2>
          <p>Un parcours consacré aux technologies de l’information, à l’enseignement et à la formation.</p>
          {networks.length > 0 && <div className="academic-links">{networks.map(([label, url]) => <a key={label} href={safeExternalUrl(url)} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRightIcon aria-hidden="true" /><span className="sr-only"> (nouvel onglet)</span></a>)}</div>}
        </div>
        <div>
          <dl className="academic-facts">
            {[["Affiliation", profile.affiliation], ["Laboratoire", profile.laboratoire], ["Équipe de recherche", profile.equipe]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          <div className="education-block">
            <h3>Formation & diplômes</h3>
            <ol className="education-list">
              <li><span>2020</span><div><h4>Habilitation universitaire</h4><p>Faculté des Sciences d’El Jadida</p></div></li>
              <li><span>2014</span><div><h4>Doctorat en Réseaux Informatiques et Télécoms</h4><p>Faculté des Sciences d’El Jadida · Laboratoire STIC</p></div></li>
            </ol>
          </div>
          {Array.isArray(profile.langues) && profile.langues.length > 0 && <div className="languages"><span>Langues</span>{profile.langues.map((language, index) => <span className="tag" key={language.nom || index}>{typeof language === 'string' ? language : language.nom}</span>)}</div>}
        </div>
      </div>
    </section>
  )
}

export default AboutSection

