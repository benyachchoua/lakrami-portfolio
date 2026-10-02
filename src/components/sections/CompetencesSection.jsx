import { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import '../../styles/competences-projects-responsibilities.css'

const defaultCompetences = [
  {
    id: 1,
    title: "Administration Réseaux & Systèmes",
    description: "Expertise complète en administration des services réseaux et systèmes d'exploitation avec une maîtrise approfondie des technologies Microsoft et Linux",
    skills: [
      "Administration des services réseaux (WEB, DNS, SMTP, DHCP, VOIP, WSUS, SMS, NTP, DFS, SAMBA, FTP, VNC, RDP)",
      "Administration des systèmes : Windows server (2012-2022), LINUX server (DEBIAN, FEDORA, KALI)",
      "Planification et maintenance des réseaux d'entreprise",
      "Architecture et infrastructure ACTIVE DIRECTORY (LDAP, réplication d'annuaire, politique de groupe, sécurité, changements de schéma, etc.)",
      "Administration des systèmes, documentation des systèmes, configuration des sauvegardes, surveillance des performances des systèmes, surveillance de la disponibilité des systèmes",
      "Supervision des réseaux (NAGIOS, PRTG, SOLARWINDS)"
    ],
    certifications: [
      "Microsoft Certified Systems Administrator",
      "Linux Professional Institute Certification",
      "Cisco Network Associate"
    ],
    outils: [
      "Windows Server 2012-2022",
      "Linux (Debian, Fedora, Kali)",
      "Active Directory",
      "Nagios, PRTG, SolarWinds"
    ]
  },
  {
    id: 2,
    title: "Cyber-sécurité",
    description: "Expertise avancée en cybersécurité avec une approche complète de la protection des systèmes d'information et des infrastructures critiques",
    skills: [
      "Élaboration des rapports d'audit de sécurité",
      "Conduite d'analyses de risque et évaluations de vulnérabilités",
      "Mise en place des politiques de sécurité organisationnelles",
      "Systèmes de détection et prévention d'intrusion (IDS, IPS)",
      "Authentification RADIUS et gestion des identités",
      "Cryptographie et infrastructure à clés publiques (PKI)",
      "Configuration des Access-List et contrôles d'accès",
      "Implémentation 802.1X et sécurité des réseaux sans fil",
      "VACL (VLAN Access Control Lists)",
      "Filtrage URL et solutions de Firewalling avancées",
      "Déploiement et gestion de VPN (SSH, SSL, TLS, IPSEC)"
    ],
    domaines: [
      "Audit et conformité sécuritaire",
      "Gestion des risques cyber",
      "Architecture de sécurité",
      "Cryptographie appliquée"
    ],
    outils: [
      "IDS/IPS (Snort, Suricata)",
      "Firewalls (pfSense, Fortinet)",
      "PKI et certificats",
      "VPN (OpenVPN, IPSec)"
    ]
  },
  {
    id: 3,
    title: "Virtualisation & Cloud",
    description: "Maîtrise complète des technologies de virtualisation et d'architecture cloud avec une expertise en transformation digitale",
    skills: [
      "Virtualisation (Serveurs, Systèmes d'exploitation, Postes de travail, Applications, Stockage)",
      "Virtualisation des réseaux (NFV, SDN, SD-WAN)",
      "Conception et mise en place des réseaux sans fil avec et sans infrastructure",
      "Architecture cloud hybride et multi-cloud",
      "Conteneurisation et orchestration",
      "Infrastructure as Code (IaC)",
      "Migration vers le cloud et optimisation des coûts"
    ],
    technologies: [
      "VMware vSphere",
      "Microsoft Hyper-V",
      "Docker & Kubernetes",
      "AWS, Azure, Google Cloud"
    ],
    specialites: [
      "NFV (Network Function Virtualization)",
      "SDN (Software Defined Networking)",
      "SD-WAN (Software Defined WAN)",
      "Infrastructure hyperconvergée"
    ]
  },
  {
    id: 4,
    title: "Analyse de Données",
    description: "Expertise en science des données avec une approche complète du Big Data, de l'analyse prédictive et de l'intelligence d'affaires",
    skills: [
      "Big Data : Architecture et traitement de données massives",
      "Data Warehouse : Conception et optimisation d'entrepôts de données",
      "Data Mining : Extraction de connaissances et patterns",
      "Analyse prédictive et modélisation statistique",
      "Visualisation de données et tableaux de bord",
      "ETL (Extract, Transform, Load) et pipelines de données",
      "Business Intelligence et aide à la décision"
    ],
    outils: [
      "Hadoop, Spark",
      "SQL Server, Oracle",
      "Python, R",
      "Tableau, Power BI"
    ],
    methodologies: [
      "CRISP-DM",
      "Agile Analytics",
      "Data Governance",
      "Machine Learning"
    ]
  },
  {
    id: 5,
    title: "Formation Digitale",
    description: "Expertise complète en ingénierie pédagogique numérique avec une spécialisation dans les technologies éducatives innovantes",
    skills: [
      "Conception pédagogique de dispositifs de formation digitaux",
      "Maîtrise des LMS (360 Learning, Moodle, Blackboard)",
      "Conception et gestion des SPOC/MOOC",
      "Logiciels de conception de Digital Learning : Articulate, Rise, Vyond, Geniall",
      "Conception pédagogique et développement technique des solutions d'apprentissage en ligne et du micro-apprentissage innovantes et créatives",
      "Logiciels d'enregistrement et de traitement multimédia",
      "Numérisation des systèmes et processus de production / Documentaliste",
      "Enseignement à distance et classes virtuelles",
      "Gamification et serious games",
      "Réalité virtuelle et augmentée en éducation",
      "Intelligence artificielle pédagogique"
    ],
    plateformes: [
      "Moodle, 360 Learning",
      "Articulate Storyline",
      "Adobe Captivate",
      "H5P, Genially"
    ],
    methodologies: [
      "ADDIE Model",
      "Design Thinking",
      "Classe inversée",
      "Apprentissage adaptatif"
    ]
  },
  {
    id: 6,
    title: "Programmation & Développement",
    description: "Compétences solides en développement logiciel avec une expertise en programmation web, réseaux et systèmes",
    skills: [
      "Programmation : HTML, CSS, PYTHON, C/C++, JAVA, J2EE",
      "Programmation des réseaux : Sockets, JSP",
      "Expertise en CMS de gestion de contenu (JOOMLA, WORDPRESS, DRUPAL)",
      "Développement d'applications web responsives",
      "Programmation orientée objet et design patterns",
      "Développement d'APIs REST et services web",
      "Bases de données relationnelles et NoSQL",
      "Frameworks JavaScript modernes",
      "DevOps et intégration continue"
    ],
    langages: [
      "Python, Java, C/C++",
      "HTML5, CSS3, JavaScript",
      "PHP, JSP",
      "SQL, MongoDB"
    ],
    frameworks: [
      "Spring Boot, Django",
      "React, Vue.js",
      "Bootstrap, Tailwind",
      "Node.js, Express"
    ]
  },
  {
    id: 7,
    title: "Intelligence Artificielle",
    description: "Expertise avancée en intelligence artificielle avec une spécialisation dans l'apprentissage automatique et les applications éducatives",
    skills: [
      "Machine Learning et apprentissage supervisé/non supervisé",
      "Deep Learning et réseaux de neurones",
      "Traitement du langage naturel (NLP)",
      "Vision par ordinateur et reconnaissance d'images",
      "Intelligence artificielle en éducation",
      "Systèmes de recommandation personnalisés",
      "Analyse prédictive et modélisation",
      "Éthique de l'IA et biais algorithmiques"
    ],
    technologies: [
      "TensorFlow, PyTorch",
      "Scikit-learn, Keras",
      "OpenCV, NLTK",
      "Jupyter, Google Colab"
    ],
    applications: [
      "IA pédagogique",
      "Systèmes adaptatifs",
      "Chatbots éducatifs",
      "Analyse d'apprentissage"
    ]
  }
]

const skillCount = (competence) => (Array.isArray(competence.skills) ? competence.skills.length : 0)
const plural = (count, word) => `${count} ${word}${count > 1 ? 's' : ''}`

const CompetencesSection = ({ sections }) => {
  const [selectedCompetence, setSelectedCompetence] = useState(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    const node = dialogRef.current
    if (!selectedCompetence || !node || node.open) return
    if (typeof node.showModal === 'function') node.showModal()
    else node.setAttribute('open', '')
  }, [selectedCompetence])

  const competencesSection = sections.find(section => section.id === 'competences')

  if (!competencesSection || !competencesSection.visible) return null

  // Contenu de la base de données ; données par défaut seulement si le contenu n'est pas une liste
  const competencesData = Array.isArray(competencesSection.content) ? competencesSection.content : defaultCompetences

  const closeDialog = () => dialogRef.current?.close()

  const renderDialog = (competence) => {
    const count = skillCount(competence)
    const groups = [
      [competence.outils ? 'Outils maîtrisés' : competence.technologies ? 'Technologies' : 'Langages', competence.outils || competence.technologies || competence.langages, 'chips'],
      [competence.specialites ? 'Spécialités' : competence.domaines ? "Domaines d'expertise" : competence.frameworks ? 'Frameworks' : 'Plateformes', competence.specialites || competence.domaines || competence.frameworks || competence.plateformes, 'list'],
      [competence.methodologies ? 'Méthodologies' : competence.applications ? 'Applications' : 'Certifications', competence.methodologies || competence.applications || competence.certifications, 'list']
    ].filter(([, items]) => Array.isArray(items) && items.length > 0)
    return (
      <dialog ref={dialogRef} className="cpr-dialog" aria-labelledby="skills-dialog-title" onClose={() => setSelectedCompetence(null)} onClick={event => event.target === event.currentTarget && closeDialog()}>
        <div className="cpr-dialog-head">
          <div>
            <p className="eyebrow">Compétences</p>
            <h2 id="skills-dialog-title">{competence.title}</h2>
            <p className="cpr-dialog-sub">{plural(count, 'compétence')} {count > 1 ? 'techniques' : 'technique'}</p>
          </div>
          <button type="button" className="cpr-close" onClick={closeDialog} aria-label="Fermer la fenêtre de détail"><XMarkIcon aria-hidden="true" /></button>
        </div>
        <div className="cpr-dialog-body">
          <div className="cpr-block"><h3>Description</h3><p className="cpr-text">{competence.description}</p></div>
          {count > 0 && <div className="cpr-block"><h3>Compétences détaillées</h3><ul className="cpr-bullets">{competence.skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul></div>}
          {groups.map(([label, items, kind]) => (
            <div className="cpr-block" key={label}>
              <h3>{label}</h3>
              <ul className={kind === 'chips' ? 'cpr-chips' : 'cpr-bullets'}>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>
            </div>
          ))}
          <div className="cpr-block">
            <h3>Points clés</h3>
            <ul className="cpr-bullets">
              <li>Expertise professionnelle</li>
              <li>{count}+ compétences maîtrisées</li>
              <li>Formation continue</li>
              <li>Projets réalisés</li>
              <li>Veille technologique</li>
            </ul>
          </div>
        </div>
      </dialog>
    )
  }

  return (
    <section id="competences" className="section-padding skills-section" aria-labelledby="competences-heading">
      <div className="container-max">
        <div className="section-heading heading-split"><div><p className="eyebrow">03 / Compétences</p><h2 id="competences-heading">Expertise technique,<br /><em>de l’infrastructure à l’IA.</em></h2></div><p>Une expertise technique approfondie dans les technologies de pointe, de l'administration système à l'intelligence artificielle.</p></div>
        {competencesData.length === 0 ? <div className="empty-state"><h3>Aucune compétence à afficher</h3><p>Le contenu de cette section sera disponible prochainement.</p></div> : <ol className="skills-list">
          {competencesData.map((competence, index) => (
            <li key={competence.id ?? index} className="skills-item">
              <span className="skills-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{competence.title}</h3>
                <p className="skills-desc">{competence.description}</p>
                <div className="cpr-item-foot">
                  <span className="cpr-count">{plural(skillCount(competence), 'compétence')}</span>
                  <button type="button" className="cpr-more" aria-haspopup="dialog" onClick={() => setSelectedCompetence(competence)}>Voir le détail<span className="sr-only"> de {competence.title}</span><ArrowRightIcon aria-hidden="true" /></button>
                </div>
              </div>
            </li>
          ))}
        </ol>}
        {selectedCompetence && renderDialog(selectedCompetence)}
      </div>
    </section>
  )
}

export default CompetencesSection
