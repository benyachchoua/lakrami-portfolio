import React, { useState } from 'react'
import { 
  ComputerDesktopIcon,
  ShieldCheckIcon,
  CloudIcon,
  ChartBarIcon,
  BookOpenIcon,
  CodeBracketIcon,
  SparklesIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'

const CompetencesSection = ({ sections }) => {
  const [selectedCompetence, setSelectedCompetence] = useState(null)
  const competencesSection = sections.find(section => section.id === 'competences')
  
  if (!competencesSection || !competencesSection.visible) return null

  // Icon mapping function to handle both string names and component references
  const getIconComponent = (icon) => {
    if (typeof icon === 'string') {
      const iconMap = {
        'ComputerDesktopIcon': ComputerDesktopIcon,
        'ShieldCheckIcon': ShieldCheckIcon,
        'CloudIcon': CloudIcon,
        'ChartBarIcon': ChartBarIcon,
        'BookOpenIcon': BookOpenIcon,
        'CodeBracketIcon': CodeBracketIcon,
        'SparklesIcon': SparklesIcon
      }
      return iconMap[icon] || ComputerDesktopIcon
    }
    return icon
  }

  // Utiliser le contenu de la base de données au lieu des données codées en dur
  const competencesData = competencesSection.content && competencesSection.content.length > 0 
    ? competencesSection.content.map(item => ({
        ...item,
        icon: getIconComponent(item.icon)
      }))
    : [
        // Données par défaut si la base de données est vide
        {
          id: 1,
          title: "Administration Réseaux & Systèmes",
          icon: ComputerDesktopIcon,
          color: "from-blue-500 to-cyan-500",
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
          icon: ShieldCheckIcon,
          color: "from-red-500 to-pink-500",
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
          icon: CloudIcon,
          color: "from-purple-500 to-indigo-500",
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
          icon: ChartBarIcon,
          color: "from-green-500 to-teal-500",
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
          icon: BookOpenIcon,
          color: "from-orange-500 to-red-500",
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
          icon: CodeBracketIcon,
          color: "from-indigo-500 to-purple-500",
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
          icon: SparklesIcon,
          color: "from-pink-500 to-rose-500",
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

  return (
    <section id="competences" className="section-padding bg-gradient-to-b from-white to-slate-50">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold mb-6">
            <CpuChipIcon className="h-4 w-4 mr-2" />
            Expertise Technique
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Domaines de <span className="text-gradient">Compétences</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Une expertise technique approfondie dans les technologies de pointe, 
            de l'administration système à l'intelligence artificielle.
          </p>
        </div>

        {/* Competences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {competencesData.map((competence) => {
            const IconComponent = competence.icon
            return (
              <div 
                key={competence.id}
                className="group card p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedCompetence(competence)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${competence.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${competence.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {competence.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {competence.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className={`w-16 h-1 bg-gradient-to-r ${competence.color} rounded-full group-hover:w-24 transition-all duration-300`}></div>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  
                  <div className="mt-4 text-xs text-slate-500">
                    {competence.skills.length} compétence{competence.skills.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Competence Detail Popup */}
        {selectedCompetence && (() => {
          const IconComponent = selectedCompetence.icon;
          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Popup Header */}
                <div className={`flex items-center justify-between p-6 bg-gradient-to-r ${selectedCompetence.color} text-white`}>
                  <div className="flex items-center">
                    <IconComponent className="h-8 w-8 mr-4" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedCompetence.title}</h2>
                      <p className="text-blue-100">{selectedCompetence.skills.length} compétence{selectedCompetence.skills.length > 1 ? 's' : ''} technique{selectedCompetence.skills.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCompetence(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Popup Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Description</h3>
                      <p className="text-slate-700 leading-relaxed">{selectedCompetence.description}</p>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Compétences détaillées</h3>
                      <div className="space-y-4">
                        {selectedCompetence.skills.map((skill, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                            <div className={`w-2 h-2 bg-gradient-to-r ${selectedCompetence.color} rounded-full mt-2 flex-shrink-0`}></div>
                            <p className="text-slate-700 leading-relaxed">{skill}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Outils et Technologies */}
                    {(selectedCompetence.outils || selectedCompetence.technologies || selectedCompetence.langages) && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">
                          {selectedCompetence.outils ? 'Outils maîtrisés' : 
                           selectedCompetence.technologies ? 'Technologies' : 'Langages'}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(selectedCompetence.outils || selectedCompetence.technologies || selectedCompetence.langages || []).map((item, index) => (
                            <span key={index} className={`px-3 py-1 bg-gradient-to-r ${selectedCompetence.color} text-white rounded-full text-sm font-medium`}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Spécialités/Domaines/Frameworks */}
                    {(selectedCompetence.specialites || selectedCompetence.domaines || selectedCompetence.frameworks || selectedCompetence.plateformes) && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">
                          {selectedCompetence.specialites ? 'Spécialités' : 
                           selectedCompetence.domaines ? 'Domaines d\'expertise' :
                           selectedCompetence.frameworks ? 'Frameworks' : 'Plateformes'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(selectedCompetence.specialites || selectedCompetence.domaines || selectedCompetence.frameworks || selectedCompetence.plateformes || []).map((item, index) => (
                            <div key={index} className="p-3 bg-slate-50 rounded-lg border-l-4 border-gradient-to-b" style={{borderLeftColor: selectedCompetence.color.includes('blue') ? '#3b82f6' : selectedCompetence.color.includes('red') ? '#ef4444' : selectedCompetence.color.includes('green') ? '#10b981' : '#8b5cf6'}}>
                              <p className="text-sm text-slate-700 font-medium">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Méthodologies/Applications/Certifications */}
                    {(selectedCompetence.methodologies || selectedCompetence.applications || selectedCompetence.certifications) && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">
                          {selectedCompetence.methodologies ? 'Méthodologies' : 
                           selectedCompetence.applications ? 'Applications' : 'Certifications'}
                        </h3>
                        <ul className="space-y-2">
                          {(selectedCompetence.methodologies || selectedCompetence.applications || selectedCompetence.certifications || []).map((item, index) => (
                            <li key={index} className="flex items-center">
                              <div className={`w-2 h-2 bg-gradient-to-r ${selectedCompetence.color} rounded-full mr-3`}></div>
                              <span className="text-slate-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-3">💡 Points clés</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 bg-gradient-to-r ${selectedCompetence.color} rounded-full mr-3`}></div>
                          Expertise professionnelle
                        </div>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 bg-gradient-to-r ${selectedCompetence.color} rounded-full mr-3`}></div>
                          {selectedCompetence.skills.length}+ compétences maîtrisées
                        </div>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 bg-gradient-to-r ${selectedCompetence.color} rounded-full mr-3`}></div>
                          Formation continue
                        </div>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 bg-gradient-to-r ${selectedCompetence.color} rounded-full mr-3`}></div>
                          Projets réalisés
                        </div>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 bg-gradient-to-r ${selectedCompetence.color} rounded-full mr-3`}></div>
                          Veille technologique
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  )
}

export default CompetencesSection