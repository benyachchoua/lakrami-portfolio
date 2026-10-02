import React, { useState } from 'react'
import { 
  DocumentTextIcon,
  AcademicCapIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ComputerDesktopIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

const PublicationsSection = ({ sections }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const publicationsSection = sections.find(section => section.id === 'publications')
  
  if (!publicationsSection || !publicationsSection.visible) return null

  // Données complètes des publications organisées par domaines
  const publicationsData = {
    reseauxSecurite: {
      title: "Réseaux et Sécurité",
      icon: ShieldCheckIcon,
      color: "from-red-500 to-pink-500",
      articles: [
        {
          id: 1,
          title: "A fuzzy logic-based trust system for detecting selfish nodes and encouraging cooperation in Optimized Link State Routing protocol",
          authors: "F. Lakrami et al.",
          journal: "The Art of Cyber Defense. CRC Press",
          pages: "190-210",
          year: "2024",
          type: "Book Chapter"
        },
        {
          id: 2,
          title: "A smart parking system combining IoT and AI to address improper parking",
          authors: "M. LAAOUAFY, F. LAKRAMI, O LABOUIDYA",
          journal: "International Journal on Information Technologies and Security (IJITS), Vol. 16, No 2",
          year: "2024",
          type: "Web Of Sciences"
        },
        {
          id: 3,
          title: "A fuzzy logic-based trust system for detecting selfish nodes and encouraging cooperation in Optimized Link State Routing Protocol",
          authors: "F. LAKRAMI, O. LABOUIDYA, N. EL KAMOUN ET AL",
          journal: "Book CHAPTER : The Art of Cyber Defense",
          year: "2024",
          type: "Book Chapter"
        },
        {
          id: 4,
          title: "Cooperative Trust Framework Based On Hy-Ids, Firewalls, And Mobile Agents to enhance security in a cloud environment",
          authors: "H. TOUMI, F. FAGROUD, K. ACHTAICH, F. LAKRAMI, M. TALEA",
          journal: "Journal of Theoretical and Applied Information Technology, Vol.101. No 10",
          year: "2023",
          type: "SCOPUS"
        },
        {
          id: 5,
          title: "A new indoor positioning system for WSN: application in smart parking",
          authors: "M. LAAOUAFY, F. LAKRAMI, N. EL KAMOUN, O LABOUIDYA",
          journal: "International Journal of Sensor Networks, 42(2), pp. 79–86",
          year: "2023",
          type: "SCOPUS"
        },
        {
          id: 6,
          title: "Distributed Denial Of Service attacks detection using Statistical Process Control In centralized Wireless Networks",
          authors: "H. SOUNNI, N. EL KAMOUN, F. LAKRAMI",
          journal: "Journal of Engineering Science and Technology, 17(2), pp. 1436–1446",
          year: "2022",
          type: "SCOPUS"
        },
        {
          id: 7,
          title: "An experimental evaluation of localization methods used in wireless sensor networks",
          authors: "M. LAAOUAFY, F. LAKRAMI, N. EL KAMOUN, O LABOUIDYA",
          journal: "Indonesian Journal of Electrical Engineering and Computer Science, 25(3), pp. 1518–1528",
          year: "2022",
          type: "SCOPUS"
        },
        {
          id: 8,
          title: "A technique for order of preference by similarity to ideal solution-based method for access point selection in a software-defined Wi-Fi network",
          authors: "H. SOUNNI, N. EL KAMOUN, F. LAKRAMI",
          journal: "International Journal on Communications Antenna and Propagation, 11(1), pp. 42–48",
          year: "2021",
          type: "SCOPUS"
        },
        {
          id: 9,
          title: "SPC-based Approach for DDoS Attack Detection Using X-MR Control Chart",
          authors: "H. SOUNNI, N. ELKAMOUN, F. LAKRAMI",
          journal: "International Journal on Information Technologies and Security, No.2 (vol. 13), pp. 117-128",
          year: "2021",
          type: "Thomson/Web of Sciences"
        },
        {
          id: 10,
          title: "The design of an experimental model for deploying Home Area Network in Smart Grid",
          authors: "F. LAKRAMI, N. EL KAMOUN, O. LABOUIDYA, H. SOUNNI, K. ZINE-DINE",
          journal: "Advances in Science, Technology and Engineering Systems Journal (ASTESJ), Vol. 5, No. 3, Pages: 419-431",
          year: "2020",
          type: "SCOPUS"
        },
        {
          id: 11,
          title: "Software Defined Network for QoS Enhancement in Mobile Wi-Fi Network",
          authors: "H. SOUNNI, N. EL KAMOUN, F. LAKRAMI",
          journal: "International Journal of Recent Technology and Engineering (IJRTE), Volume-8 Issue-3",
          year: "2019",
          type: "SCOPUS"
        },
        {
          id: 12,
          title: "Study of the impact of routing and the profoundness of GRE tunnels on the performance of the transmission of real time applications in IP networks",
          authors: "D. IDRISSI, N. ELKAMOUN, F. LAKRAMI, R. HILAL",
          journal: "International Journal of Computer Science and Network Security, vol. 18, no 7, p. 76-82",
          year: "2018",
          type: "Web of Science"
        },
        {
          id: 13,
          title: "Performance Evaluation of Wireless 802.11 n Using Level 2 and Level 3 Mobility",
          authors: "H. SOUNNI, N. ELKAMOUN, F. LAKRAMI",
          journal: "Indian Journal of Science and Technology, Volume 11, Issue 14",
          year: "2018",
          type: "Web of Science"
        },
        {
          id: 14,
          title: "Performance Comparison of Protocols Combination Based on EIGRP and OSPF for Real-time Applications in Enterprise Networks",
          authors: "D. IDRISSI, N. ELKAMOUN, F. LAKRAMI, R. HILAL",
          journal: "International Journal of Advanced Computer Science and Applications (IJACSA), vol. 8, no 5, p. p145-150",
          year: "2017",
          type: "SCOPUS & Web of Science"
        },
        {
          id: 15,
          title: "Performance comparison of Wireless IEEE 802.11 a, b, g and n used for Ad-Hoc Networks in an ELearning Classrooms Network",
          authors: "F. LAKRAMI, N. ELKAMOUN, and O. LAOUIDYA",
          journal: "International Journal of Computer Science and Information Security (IJCSIS)",
          year: "2017",
          type: "Article de journal"
        },
        {
          id: 16,
          title: "Performance Evaluation of 802.11 Access Methods with QoS Enhancement under Mobility Impact",
          authors: "H. SOUNNI, N. ELKAMOUN, F. LAKRAMI",
          journal: "International Journal of Computer Applications, Vol: 179(2):36-41",
          year: "2017",
          type: "Article de journal"
        },
        {
          id: 17,
          title: "Performance Evaluation of Routing Protocols in Manets Deployed for e-Learning Purpose",
          authors: "F. LAKRAMI, N. ELKAMOUN AND O. LAOUIDYA",
          journal: "International Journal of Computer Applications, vol 178, Issue 2, pages :41-47",
          year: "2017",
          type: "ESCI"
        },
        {
          id: 18,
          title: "Mobility and QOS Management in OLSR Routing Protocol",
          authors: "F. LAKRAMI, N. ELKAMOUN",
          journal: "International Journal of Computer Networking, Wireless and Mobile Communications (IJCNWMC)",
          year: "2013",
          type: "Article de journal"
        },
        {
          id: 19,
          title: "Study of a Multi-Layers Quality of Service Model for ADHOC networks",
          authors: "F. LAKRAMI, N. ELKAMOUN",
          journal: "International Journal of Computer Applications, Volume 48– No.14",
          year: "2013",
          type: "Article de journal"
        },
        {
          id: 20,
          title: "Energy and Mobility in OLSR routing protocol",
          authors: "F. LAKRAMI, N. ELKAMOUN",
          journal: "Cyber Journals: Multidisciplinary Journals in Science and Technology, Journal of Selected Areas in Telecommunications (JSAT)",
          year: "2012",
          type: "Article de journal"
        }
      ],
      communications: [
        {
          id: 1,
          title: "Examining the Effects of DDoS Attacks on SDN Architectures: Experimental Study",
          authors: "J. Zakariaa, F. LAKRAMI, H. SOUNNI, et al.",
          conference: "International Conference on Ubiquitous Networking (UNet). IEEE",
          year: "2024",
          pages: "p. 1-5"
        },
        {
          id: 2,
          title: "A secure based trust model for Optimized Link State Routing protocol (OLSR)",
          authors: "F. LAKRAMI, M. EL KAMILI, N. ELKAMOUN, H. SOUNNI, & O. LABOUIDYA",
          conference: "2023 10th International Conference on Wireless Networks and Mobile Communications (WINCOM), Istanbul, Turkey. IEEE",
          year: "2023"
        },
        {
          id: 3,
          title: "An enhanced centralized approach to improve localization in wireless sensor networks: application to smart parking",
          authors: "M. LAAOUAFY, F. LAKRAMI, O LABOUIDYA",
          conference: "EVF'2022 – 9th International Conference on Energy and City of the Future, El Jadida (Morocco)",
          year: "2022"
        },
        {
          id: 4,
          title: "A new Smart Parking system based on Artificial Intelligence",
          authors: "F. LAKRAMI, M. LAAOUAFY, N. EL KAMOUN, O LABOUIDYA",
          conference: "EVF'2022 – 9th International Conference on Energy and City of the Future, ENSA, El Jadida (Morocco)",
          year: "2022"
        }
      ]
    },
    elearningIA: {
      title: "E-learning et Intelligence Artificielle",
      icon: BeakerIcon,
      color: "from-blue-500 to-cyan-500",
      articles: [
        {
          id: 1,
          title: "Higher education and generative artificial intelligence: Applications, challenges, opportunities, and Ethics",
          authors: "M. KAOUNI, F. LAKRAMI, O. LAOUIDYA & Y. BADDI",
          journal: "Chapitre d'ouvrage",
          year: "2024",
          type: "Book Chapter"
        },
        {
          id: 2,
          title: "The Design of an Adaptive E-learning model based on artificial intelligence for enhancing online teaching",
          authors: "M. KAOUNI, F. LAKRAMI, O. LABOUIDYA",
          journal: "International Journal of Emerging Technologies in Learning (iJET)",
          year: "2023",
          type: "Article de journal"
        },
        {
          id: 3,
          title: "Analytic survey on the challenges of Moroccan students in higher education institutions face to distance learning",
          authors: "M. KAOUNI, F. LAKRAMI, O. LABOUIDYA",
          journal: "Indonesian Journal of Electrical Engineering and Computer Science Vol. 28, No. 1, pp. 284~296",
          year: "2022",
          type: "SCOPUS"
        },
        {
          id: 4,
          title: "Towards the development of a didactic approach using MOOCs in traditional classrooms to support teaching in higher education in MOROCCO",
          authors: "F. LAKRAMI, N. ELKAMOUN AND O. LAOUIDYA",
          journal: "International Journal of Information Science and Technology, vol. 3, no 2, p. 19-28",
          year: "2019",
          type: "Article de journal"
        },
        {
          id: 5,
          title: "Pédagogie universitaire et classe inversée : vers un apprentissage fructueux en travaux pratiques",
          authors: "F. LAKRAMI, N. ELKAMOUN AND O. LAOUIDYA",
          journal: "Revue internationale de pédagogie de l'enseignement supérieur (RIPES), 34(34-3)",
          year: "2018",
          type: "Article de journal"
        },
        {
          id: 6,
          title: "Apport des TIC dans la mise en place d'une pédagogie active en contexte universitaire : pistes de réflexion et propositions",
          authors: "O. LABOUDYA, N. ELKAMOUN, K. ELKHADIRI, M. BOUSMAH, F. LAKRAMI, R. HILAL",
          journal: "Revue scientifique Internationale de l'éducation et de la formation, volume II, N°3",
          year: "2017",
          type: "Article de journal"
        }
      ],
      communications: [
        {
          id: 1,
          title: "Personalizing Formative Feedback Through Generative Artificial Intelligence: An Experiment In Higher Education",
          authors: "H. Akhasbi, N. El Kamoun, F. Lakrami et al",
          conference: "17th International Conference on Education and New Learning Technologies held in Palma, Spain",
          year: "2025"
        },
        {
          id: 2,
          title: "L'intelligence artificielle générative : une opportunité pour améliorer l'évaluation formative dans un contexte universitaire massif",
          authors: "N. El Kamoun, H. Akhasbi, F. Lakrami, et al",
          conference: "36e Colloque de l'ADMEE-Europe, Belval, Luxembourg",
          year: "2025",
          link: "http://hdl.handle.net/20.500.12162/8096"
        },
        {
          id: 3,
          title: "Transformation digitale des territoires et organisations de l'ESS :opportunités, défis et perspectives au Maroc",
          authors: "M. ERRACHIQ, F. LAKRAMI, F. NAJI",
          conference: "Colloque International de la recherche Appliquée (IRA 2025), FSJES de kelaa des Seraghna",
          year: "2025"
        },
        {
          id: 4,
          title: "Intégration de l'IA dans le cycle CGQTS : Vers une génération automatisée de Quizz adaptatifs",
          authors: "F. LAKRAMI et al",
          conference: "2ème édition de International Meeting for Innovative Pedagogy (IMIP'24), université de Technologie de Compiègne (UTC), France",
          year: "2025"
        },
        {
          id: 5,
          title: "Vers une Pédagogie Réinventée: l'impact de l'IA générative",
          authors: "F. LAKRAMI et al",
          conference: "1ères Rencontres Internationales de l'Innovation Pédagogique, ESC Clement Business Scool, France",
          year: "2024"
        }
      ]
    }
  }

  const getYearStats = () => {
    const allPublications = [
      ...publicationsData.reseauxSecurite.articles,
      ...publicationsData.reseauxSecurite.communications,
      ...publicationsData.elearningIA.articles,
      ...publicationsData.elearningIA.communications
    ]
    
    const yearCounts = {}
    allPublications.forEach(pub => {
      yearCounts[pub.year] = (yearCounts[pub.year] || 0) + 1
    })
    
    return yearCounts
  }

  const yearStats = getYearStats()
  const totalPublications = Object.values(yearStats).reduce((sum, count) => sum + count, 0)

  return (
    <section id="publications" className="section-padding bg-gradient-to-b from-slate-50 to-white">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-6">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Contributions Académiques
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Production <span className="text-gradient">Scientifique</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Découvrez mes contributions à la recherche scientifique dans les domaines 
            des réseaux informatiques, de la sécurité et des technologies éducatives.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">{totalPublications}</div>
            <div className="text-slate-600 font-medium">Publications Totales</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {publicationsData.reseauxSecurite.articles.length + publicationsData.elearningIA.articles.length}
            </div>
            <div className="text-slate-600 font-medium">Articles de Revues</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {publicationsData.reseauxSecurite.communications.length + publicationsData.elearningIA.communications.length}
            </div>
            <div className="text-slate-600 font-medium">Communications</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {Math.max(...Object.keys(yearStats).map(Number)) - Math.min(...Object.keys(yearStats).map(Number)) + 1}
            </div>
            <div className="text-slate-600 font-medium">Années Actives</div>
          </div>
        </div>

        {/* Domain Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {Object.entries(publicationsData).map(([key, domain]) => {
            const IconComponent = domain.icon
            return (
              <div key={key} className="group card p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${domain.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${domain.color} rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {domain.title}
                      </h3>
                      <p className="text-slate-600">
                        {domain.articles.length} articles • {domain.communications.length} communications
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Articles indexés</span>
                      <span className="font-bold text-slate-900">{domain.articles.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Communications</span>
                      <span className="font-bold text-slate-900">{domain.communications.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Période</span>
                      <span className="font-bold text-slate-900">
                        {Math.min(...domain.articles.map(a => parseInt(a.year)))} - {Math.max(...domain.articles.map(a => parseInt(a.year)))}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full group-hover:w-24 transition-all duration-300"></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <DocumentTextIcon className="h-5 w-5 mr-3" />
            Voir Toutes les Publications
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Publications Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Popup Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <div className="flex items-center">
                  <SparklesIcon className="h-6 w-6 mr-3" />
                  <h2 className="text-2xl font-bold">Production Scientifique Complète</h2>
                </div>
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Popup Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                {Object.entries(publicationsData).map(([key, domain]) => {
                  const IconComponent = domain.icon
                  return (
                    <div key={key} className="p-6 border-b border-slate-100 last:border-b-0">
                      <div className="flex items-center mb-6">
                        <div className={`w-12 h-12 bg-gradient-to-br ${domain.color} rounded-xl flex items-center justify-center mr-4`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">{domain.title}</h3>
                      </div>

                      {/* Articles */}
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                          Articles publiés dans des revues indexées ({domain.articles.length})
                        </h4>
                        <div className="space-y-4">
                          {domain.articles.map((article, index) => (
                            <div key={article.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500">[{index + 1}]</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  article.type.includes('SCOPUS') ? 'bg-green-100 text-green-800' :
                                  article.type.includes('Web of Science') ? 'bg-blue-100 text-blue-800' :
                                  article.type.includes('IEEE') ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {article.type}
                                </span>
                              </div>
                              <h5 className="font-semibold text-slate-900 mb-2">{article.title}</h5>
                              <p className="text-slate-700 text-sm mb-1">{article.authors}</p>
                              <p className="text-slate-600 text-sm mb-1">
                                <em>{article.journal}</em>
                                {article.pages && `, ${article.pages}`}
                                {article.year && ` (${article.year})`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Communications */}
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <AcademicCapIcon className="h-5 w-5 mr-2 text-purple-600" />
                          Communications dans des manifestations nationales et internationales ({domain.communications.length})
                        </h4>
                        <div className="space-y-4">
                          {domain.communications.map((comm, index) => (
                            <div key={comm.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500">[{index + 1}]</span>
                                <span className="text-sm text-slate-500">{comm.year}</span>
                              </div>
                              <h5 className="font-semibold text-slate-900 mb-2">{comm.title}</h5>
                              <p className="text-slate-700 text-sm mb-1">{comm.authors}</p>
                              <p className="text-slate-600 text-sm">
                                <em>{comm.conference}</em>
                                {comm.pages && `, ${comm.pages}`}
                              </p>
                              {comm.link && (
                                <a 
                                  href={comm.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm mt-2"
                                >
                                  Voir la publication
                                  <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default PublicationsSection