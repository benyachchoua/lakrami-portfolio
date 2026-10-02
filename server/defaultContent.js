// Initial content copied from the former hard-coded components; the database is the source of truth after migration.
export const DEFAULT_CONTENT = {
  "skills": [
    {
      "id": "skill-1",
      "title": "Administration Réseaux & Systèmes",
      "description": "Expertise complète en administration des services réseaux et systèmes d'exploitation avec une maîtrise approfondie des technologies Microsoft et Linux",
      "skills": [
        "Administration des services réseaux (WEB, DNS, SMTP, DHCP, VOIP, WSUS, SMS, NTP, DFS, SAMBA, FTP, VNC, RDP)",
        "Administration des systèmes : Windows server (2012-2022), LINUX server (DEBIAN, FEDORA, KALI)",
        "Planification et maintenance des réseaux d'entreprise",
        "Architecture et infrastructure ACTIVE DIRECTORY (LDAP, réplication d'annuaire, politique de groupe, sécurité, changements de schéma, etc.)",
        "Administration des systèmes, documentation des systèmes, configuration des sauvegardes, surveillance des performances des systèmes, surveillance de la disponibilité des systèmes",
        "Supervision des réseaux (NAGIOS, PRTG, SOLARWINDS)"
      ],
      "groups": [
        {
          "label": "Certifications",
          "items": [
            "Microsoft Certified Systems Administrator",
            "Linux Professional Institute Certification",
            "Cisco Network Associate"
          ]
        },
        {
          "label": "Outils",
          "items": [
            "Windows Server 2012-2022",
            "Linux (Debian, Fedora, Kali)",
            "Active Directory",
            "Nagios, PRTG, SolarWinds"
          ]
        }
      ]
    },
    {
      "id": "skill-2",
      "title": "Cyber-sécurité",
      "description": "Expertise avancée en cybersécurité avec une approche complète de la protection des systèmes d'information et des infrastructures critiques",
      "skills": [
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
      "groups": [
        {
          "label": "Outils",
          "items": [
            "IDS/IPS (Snort, Suricata)",
            "Firewalls (pfSense, Fortinet)",
            "PKI et certificats",
            "VPN (OpenVPN, IPSec)"
          ]
        },
        {
          "label": "Domaines",
          "items": [
            "Audit et conformité sécuritaire",
            "Gestion des risques cyber",
            "Architecture de sécurité",
            "Cryptographie appliquée"
          ]
        }
      ]
    },
    {
      "id": "skill-3",
      "title": "Virtualisation & Cloud",
      "description": "Maîtrise complète des technologies de virtualisation et d'architecture cloud avec une expertise en transformation digitale",
      "skills": [
        "Virtualisation (Serveurs, Systèmes d'exploitation, Postes de travail, Applications, Stockage)",
        "Virtualisation des réseaux (NFV, SDN, SD-WAN)",
        "Conception et mise en place des réseaux sans fil avec et sans infrastructure",
        "Architecture cloud hybride et multi-cloud",
        "Conteneurisation et orchestration",
        "Infrastructure as Code (IaC)",
        "Migration vers le cloud et optimisation des coûts"
      ],
      "groups": [
        {
          "label": "Technologies",
          "items": [
            "VMware vSphere",
            "Microsoft Hyper-V",
            "Docker & Kubernetes",
            "AWS, Azure, Google Cloud"
          ]
        },
        {
          "label": "Spécialités",
          "items": [
            "NFV (Network Function Virtualization)",
            "SDN (Software Defined Networking)",
            "SD-WAN (Software Defined WAN)",
            "Infrastructure hyperconvergée"
          ]
        }
      ]
    },
    {
      "id": "skill-4",
      "title": "Analyse de Données",
      "description": "Expertise en science des données avec une approche complète du Big Data, de l'analyse prédictive et de l'intelligence d'affaires",
      "skills": [
        "Big Data : Architecture et traitement de données massives",
        "Data Warehouse : Conception et optimisation d'entrepôts de données",
        "Data Mining : Extraction de connaissances et patterns",
        "Analyse prédictive et modélisation statistique",
        "Visualisation de données et tableaux de bord",
        "ETL (Extract, Transform, Load) et pipelines de données",
        "Business Intelligence et aide à la décision"
      ],
      "groups": [
        {
          "label": "Outils",
          "items": [
            "Hadoop, Spark",
            "SQL Server, Oracle",
            "Python, R",
            "Tableau, Power BI"
          ]
        },
        {
          "label": "Méthodologies",
          "items": [
            "CRISP-DM",
            "Agile Analytics",
            "Data Governance",
            "Machine Learning"
          ]
        }
      ]
    },
    {
      "id": "skill-5",
      "title": "Formation Digitale",
      "description": "Expertise complète en ingénierie pédagogique numérique avec une spécialisation dans les technologies éducatives innovantes",
      "skills": [
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
      "groups": [
        {
          "label": "Méthodologies",
          "items": [
            "ADDIE Model",
            "Design Thinking",
            "Classe inversée",
            "Apprentissage adaptatif"
          ]
        },
        {
          "label": "Plateformes",
          "items": [
            "Moodle, 360 Learning",
            "Articulate Storyline",
            "Adobe Captivate",
            "H5P, Genially"
          ]
        }
      ]
    },
    {
      "id": "skill-6",
      "title": "Programmation & Développement",
      "description": "Compétences solides en développement logiciel avec une expertise en programmation web, réseaux et systèmes",
      "skills": [
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
      "groups": [
        {
          "label": "Langages",
          "items": [
            "Python, Java, C/C++",
            "HTML5, CSS3, JavaScript",
            "PHP, JSP",
            "SQL, MongoDB"
          ]
        },
        {
          "label": "Frameworks",
          "items": [
            "Spring Boot, Django",
            "React, Vue.js",
            "Bootstrap, Tailwind",
            "Node.js, Express"
          ]
        }
      ]
    },
    {
      "id": "skill-7",
      "title": "Intelligence Artificielle",
      "description": "Expertise avancée en intelligence artificielle avec une spécialisation dans l'apprentissage automatique et les applications éducatives",
      "skills": [
        "Machine Learning et apprentissage supervisé/non supervisé",
        "Deep Learning et réseaux de neurones",
        "Traitement du langage naturel (NLP)",
        "Vision par ordinateur et reconnaissance d'images",
        "Intelligence artificielle en éducation",
        "Systèmes de recommandation personnalisés",
        "Analyse prédictive et modélisation",
        "Éthique de l'IA et biais algorithmiques"
      ],
      "groups": [
        {
          "label": "Technologies",
          "items": [
            "TensorFlow, PyTorch",
            "Scikit-learn, Keras",
            "OpenCV, NLTK",
            "Jupyter, Google Colab"
          ]
        },
        {
          "label": "Applications",
          "items": [
            "IA pédagogique",
            "Systèmes adaptatifs",
            "Chatbots éducatifs",
            "Analyse d'apprentissage"
          ]
        }
      ]
    }
  ],
  "projects": [
    {
      "id": "project-1",
      "title": "Réinvention et valorisation du patrimoine d'El Jadida",
      "category": "Recherche Territoriale",
      "year": "2024",
      "status": "Terminé",
      "description": "Membre d'équipe de recherche du projet « Réinvention et valorisation du patrimoine d'El Jadida : Impact des dynamiques économiques et culturelles sur le développement territorial et les transformations sociales », retenu dans le cadre de l'appel à projet PROGRES Edition 2024",
      "facts": [
        {
          "label": "Type",
          "value": "Projet de recherche"
        },
        {
          "label": "Financement",
          "value": "PROGRES Edition 2024"
        },
        {
          "label": "Rôle",
          "value": "Membre d'équipe de recherche"
        }
      ],
      "objectives": [
        "Étudier l'impact des dynamiques économiques sur le patrimoine",
        "Analyser les transformations sociales liées au développement territorial",
        "Proposer des stratégies de valorisation du patrimoine"
      ],
      "subprojects": []
    },
    {
      "id": "project-2",
      "title": "Open2SUSTAIN - Erasmus+",
      "category": "Éducation Durable",
      "year": "2023",
      "status": "Terminé",
      "description": "Membre du projet Erasmus+ CBHE : « Developing SDG Literacy through innovative open Learning within Higher Education in the Euro Mediterranean Region - Open2SUSTAIN »",
      "facts": [
        {
          "label": "Type",
          "value": "Projet Erasmus+ CBHE"
        },
        {
          "label": "Financement",
          "value": "Union Européenne - Programme Erasmus+"
        },
        {
          "label": "Rôle",
          "value": "Membre du projet"
        },
        {
          "label": "Région",
          "value": "Euro-Méditerranéenne"
        }
      ],
      "objectives": [
        "Développer la littératie des ODD dans l'enseignement supérieur",
        "Créer des ressources d'apprentissage ouvert innovantes",
        "Renforcer la coopération euro-méditerranéenne"
      ],
      "subprojects": []
    },
    {
      "id": "project-3",
      "title": "CORETEV - Technologies en Évaluation",
      "category": "Innovation Pédagogique",
      "year": "2020-2024",
      "status": "Terminé",
      "description": "Membre du projet CORETEV (CO-construction Nord-Sud d'un Réseau d'Expertises pour l'utilisation des nouvelles Technologies en Evaluation des apprentissages et des enseignements) sur l'ingénierie de l'évaluation cofinancé par le programme ERASMUS+ de l'union européenne",
      "facts": [
        {
          "label": "Type",
          "value": "Projet Erasmus+ de coopération"
        },
        {
          "label": "Financement",
          "value": "Union Européenne - Programme Erasmus+"
        },
        {
          "label": "Rôle",
          "value": "Membre du projet"
        },
        {
          "label": "Durée",
          "value": "2020-2024"
        }
      ],
      "objectives": [
        "Co-construire un réseau d'expertises Nord-Sud",
        "Développer l'usage des nouvelles technologies en évaluation",
        "Former aux nouvelles méthodes d'évaluation des apprentissages"
      ],
      "subprojects": []
    },
    {
      "id": "project-4",
      "title": "MOOC SPOC prépa-TP",
      "category": "Formation Numérique",
      "year": "2019",
      "status": "Terminé",
      "description": "Coordinatrice d'un Projet MOOC « SPOC prépa-TP : Initiation aux mesures électriques », sélectionné par le ministère de l'éducation nationale dans le cadre de la mise en place de « MAROC Université Numérique »",
      "facts": [
        {
          "label": "Type",
          "value": "MOOC/SPOC"
        },
        {
          "label": "Financement",
          "value": "Ministère de l'Éducation Nationale"
        },
        {
          "label": "Rôle",
          "value": "Coordinatrice"
        },
        {
          "label": "Plateforme",
          "value": "MAROC Université Numérique (www.mun.ma)"
        }
      ],
      "objectives": [
        "Initier aux mesures électriques",
        "Préparer aux travaux pratiques",
        "Développer l'apprentissage numérique au Maroc"
      ],
      "subprojects": []
    },
    {
      "id": "project-5",
      "title": "Projets de Digitalisation Universitaire",
      "category": "Transformation Digitale",
      "year": "2022-2023",
      "status": "Terminé",
      "description": "Projets en tant que directrice du pôle de digitalisation de l'université Chouaib Doukkali",
      "facts": [
        {
          "label": "Type",
          "value": "Projets institutionnels"
        },
        {
          "label": "Rôle",
          "value": "Directrice du pôle de digitalisation"
        },
        {
          "label": "Établissements",
          "value": "8 établissements de l'université"
        }
      ],
      "objectives": [],
      "subprojects": [
        {
          "title": "Plateforme Moodle LMS",
          "description": "Mise en œuvre d'un Learning Management System pour les 8 établissements"
        },
        {
          "title": "Plateforme de guichet unique",
          "description": "Portail centralisé pour candidatures Licences & Masters"
        },
        {
          "title": "Gestion des visiteurs Datacenter",
          "description": "Application de gestion centralisée des interventions"
        },
        {
          "title": "Récupération d'emails académiques",
          "description": "Solution automatique de récupération de mots de passe"
        },
        {
          "title": "Configuration VPN",
          "description": "Déploiement VPN site-to-site pour accès sécurisé Apogée"
        },
        {
          "title": "Google Workspace",
          "description": "Gestion de plus de 30 000 comptes académiques"
        }
      ]
    }
  ],
  "responsibilities": [
    {
      "id": "duty-1",
      "title": "Directrice du pôle de digitalisation",
      "organization": "Université Chouaib Doukkali",
      "period": "2023-2024",
      "status": "Terminé",
      "description": "Direction stratégique de la transformation digitale de l'université avec 8 établissements et plus de 30 000 utilisateurs",
      "facts": [
        {
          "label": "Type",
          "value": "Direction stratégique"
        },
        {
          "label": "Périmètre",
          "value": "8 établissements universitaires"
        },
        {
          "label": "Utilisateurs",
          "value": "Plus de 30 000 comptes académiques"
        }
      ],
      "missions": [
        "Définir la stratégie de digitalisation de l'université",
        "Superviser la mise en œuvre des projets numériques",
        "Coordonner les équipes techniques et pédagogiques",
        "Assurer la formation aux outils numériques",
        "Gérer les infrastructures et plateformes digitales"
      ]
    },
    {
      "id": "duty-2",
      "title": "Responsable pédagogique Master SIGL",
      "organization": "Faculté des Sciences El Jadida",
      "period": "2020-2024",
      "status": "Actuel",
      "description": "Coordination pédagogique du Master Systèmes d'Information et Génie Logiciel avec supervision de 120 étudiants",
      "facts": [
        {
          "label": "Type",
          "value": "Responsabilité pédagogique"
        },
        {
          "label": "Effectifs",
          "value": "120 étudiants par promotion"
        },
        {
          "label": "Spécialité",
          "value": "Systèmes d'Information et Génie Logiciel"
        }
      ],
      "missions": [
        "Conception et mise à jour des programmes pédagogiques",
        "Coordination des équipes enseignantes",
        "Suivi académique et professionnel des étudiants",
        "Relations avec les entreprises partenaires",
        "Évaluation et amélioration continue des formations"
      ]
    },
    {
      "id": "duty-3",
      "title": "Coordinatrice des stages et projets",
      "organization": "Faculté des Sciences El Jadida",
      "period": "2019-2024",
      "status": "Actuel",
      "description": "Gestion des relations entreprises et coordination des stages professionnels pour plus de 200 étudiants annuellement",
      "facts": [
        {
          "label": "Type",
          "value": "Coordination professionnelle"
        },
        {
          "label": "Volume",
          "value": "200+ stages par an"
        },
        {
          "label": "Partenaires",
          "value": "50+ entreprises partenaires"
        }
      ],
      "missions": [
        "Développement du réseau d'entreprises partenaires",
        "Placement et suivi des stagiaires",
        "Évaluation des projets de fin d'études",
        "Organisation des soutenances",
        "Médiation entreprises-étudiants"
      ]
    },
    {
      "id": "duty-4",
      "title": "Membre du conseil pédagogique",
      "organization": "Faculté des Sciences El Jadida",
      "period": "2018-2024",
      "status": "Actuel",
      "description": "Participation aux décisions stratégiques de la faculté et contribution à l'évolution des programmes d'enseignement",
      "facts": [
        {
          "label": "Type",
          "value": "Gouvernance académique"
        },
        {
          "label": "Périmètre",
          "value": "Faculté des Sciences"
        },
        {
          "label": "Domaines",
          "value": "Informatique et Mathématiques"
        }
      ],
      "missions": [
        "Validation des programmes pédagogiques",
        "Évaluation des enseignements",
        "Politique de recrutement enseignant",
        "Stratégie de développement académique",
        "Relations internationales académiques"
      ]
    },
    {
      "id": "duty-5",
      "title": "Responsable qualité pédagogique",
      "organization": "Université Chouaib Doukkali",
      "period": "2017-2023",
      "status": "Terminé",
      "description": "Mise en place et supervision du système qualité pour l'amélioration continue des formations",
      "facts": [
        {
          "label": "Type",
          "value": "Assurance qualité"
        },
        {
          "label": "Périmètre",
          "value": "Formations informatiques"
        },
        {
          "label": "Certifications",
          "value": "ISO 9001, référentiels nationaux"
        }
      ],
      "missions": [
        "Audit et évaluation des formations",
        "Mise en place des procédures qualité",
        "Formation des équipes aux standards qualité",
        "Reporting et tableaux de bord qualité",
        "Préparation aux accréditations"
      ]
    }
  ],
  "publications": [
    {
      "id": "pub-1",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "A fuzzy logic-based trust system for detecting selfish nodes and encouraging cooperation in Optimized Link State Routing protocol",
      "authors": "F. Lakrami et al.",
      "source": "The Art of Cyber Defense. CRC Press",
      "pages": "190-210",
      "year": "2024",
      "type": "Book Chapter",
      "link": ""
    },
    {
      "id": "pub-2",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "A smart parking system combining IoT and AI to address improper parking",
      "authors": "M. LAAOUAFY, F. LAKRAMI, O LABOUIDYA",
      "source": "International Journal on Information Technologies and Security (IJITS), Vol. 16, No 2",
      "pages": "",
      "year": "2024",
      "type": "Web Of Sciences",
      "link": ""
    },
    {
      "id": "pub-3",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "A fuzzy logic-based trust system for detecting selfish nodes and encouraging cooperation in Optimized Link State Routing Protocol",
      "authors": "F. LAKRAMI, O. LABOUIDYA, N. EL KAMOUN ET AL",
      "source": "Book CHAPTER : The Art of Cyber Defense",
      "pages": "",
      "year": "2024",
      "type": "Book Chapter",
      "link": ""
    },
    {
      "id": "pub-4",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "Cooperative Trust Framework Based On Hy-Ids, Firewalls, And Mobile Agents to enhance security in a cloud environment",
      "authors": "H. TOUMI, F. FAGROUD, K. ACHTAICH, F. LAKRAMI, M. TALEA",
      "source": "Journal of Theoretical and Applied Information Technology, Vol.101. No 10",
      "pages": "",
      "year": "2023",
      "type": "SCOPUS",
      "link": ""
    },
    {
      "id": "pub-5",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "A new indoor positioning system for WSN: application in smart parking",
      "authors": "M. LAAOUAFY, F. LAKRAMI, N. EL KAMOUN, O LABOUIDYA",
      "source": "International Journal of Sensor Networks, 42(2), pp. 79–86",
      "pages": "",
      "year": "2023",
      "type": "SCOPUS",
      "link": ""
    },
    {
      "id": "pub-6",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "Distributed Denial Of Service attacks detection using Statistical Process Control In centralized Wireless Networks",
      "authors": "H. SOUNNI, N. EL KAMOUN, F. LAKRAMI",
      "source": "Journal of Engineering Science and Technology, 17(2), pp. 1436–1446",
      "pages": "",
      "year": "2022",
      "type": "SCOPUS",
      "link": ""
    },
    {
      "id": "pub-7",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "An experimental evaluation of localization methods used in wireless sensor networks",
      "authors": "M. LAAOUAFY, F. LAKRAMI, N. EL KAMOUN, O LABOUIDYA",
      "source": "Indonesian Journal of Electrical Engineering and Computer Science, 25(3), pp. 1518–1528",
      "pages": "",
      "year": "2022",
      "type": "SCOPUS",
      "link": ""
    },
    {
      "id": "pub-8",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "A technique for order of preference by similarity to ideal solution-based method for access point selection in a software-defined Wi-Fi network",
      "authors": "H. SOUNNI, N. EL KAMOUN, F. LAKRAMI",
      "source": "International Journal on Communications Antenna and Propagation, 11(1), pp. 42–48",
      "pages": "",
      "year": "2021",
      "type": "SCOPUS",
      "link": ""
    },
    {
      "id": "pub-9",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "SPC-based Approach for DDoS Attack Detection Using X-MR Control Chart",
      "authors": "H. SOUNNI, N. ELKAMOUN, F. LAKRAMI",
      "source": "International Journal on Information Technologies and Security, No.2 (vol. 13), pp. 117-128",
      "pages": "",
      "year": "2021",
      "type": "Thomson/Web of Sciences",
      "link": ""
    },
    {
      "id": "pub-10",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "The design of an experimental model for deploying Home Area Network in Smart Grid",
      "authors": "F. LAKRAMI, N. EL KAMOUN, O. LABOUIDYA, H. SOUNNI, K. ZINE-DINE",
      "source": "Advances in Science, Technology and Engineering Systems Journal (ASTESJ), Vol. 5, No. 3, Pages: 419-431",
      "pages": "",
      "year": "2020",
      "type": "SCOPUS",
      "link": ""
    },
    {
      "id": "pub-11",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "Software Defined Network for QoS Enhancement in Mobile Wi-Fi Network",
      "authors": "H. SOUNNI, N. EL KAMOUN, F. LAKRAMI",
      "source": "International Journal of Recent Technology and Engineering (IJRTE), Volume-8 Issue-3",
      "pages": "",
      "year": "2019",
      "type": "SCOPUS",
      "link": ""
    },
    {
      "id": "pub-12",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "Study of the impact of routing and the profoundness of GRE tunnels on the performance of the transmission of real time applications in IP networks",
      "authors": "D. IDRISSI, N. ELKAMOUN, F. LAKRAMI, R. HILAL",
      "source": "International Journal of Computer Science and Network Security, vol. 18, no 7, p. 76-82",
      "pages": "",
      "year": "2018",
      "type": "Web of Science",
      "link": ""
    },
    {
      "id": "pub-13",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "Performance Evaluation of Wireless 802.11 n Using Level 2 and Level 3 Mobility",
      "authors": "H. SOUNNI, N. ELKAMOUN, F. LAKRAMI",
      "source": "Indian Journal of Science and Technology, Volume 11, Issue 14",
      "pages": "",
      "year": "2018",
      "type": "Web of Science",
      "link": ""
    },
    {
      "id": "pub-14",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "Performance Comparison of Protocols Combination Based on EIGRP and OSPF for Real-time Applications in Enterprise Networks",
      "authors": "D. IDRISSI, N. ELKAMOUN, F. LAKRAMI, R. HILAL",
      "source": "International Journal of Advanced Computer Science and Applications (IJACSA), vol. 8, no 5, p. p145-150",
      "pages": "",
      "year": "2017",
      "type": "SCOPUS & Web of Science",
      "link": ""
    },
    {
      "id": "pub-15",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "Performance comparison of Wireless IEEE 802.11 a, b, g and n used for Ad-Hoc Networks in an ELearning Classrooms Network",
      "authors": "F. LAKRAMI, N. ELKAMOUN, and O. LAOUIDYA",
      "source": "International Journal of Computer Science and Information Security (IJCSIS)",
      "pages": "",
      "year": "2017",
      "type": "Article de journal",
      "link": ""
    },
    {
      "id": "pub-16",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "Performance Evaluation of 802.11 Access Methods with QoS Enhancement under Mobility Impact",
      "authors": "H. SOUNNI, N. ELKAMOUN, F. LAKRAMI",
      "source": "International Journal of Computer Applications, Vol: 179(2):36-41",
      "pages": "",
      "year": "2017",
      "type": "Article de journal",
      "link": ""
    },
    {
      "id": "pub-17",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "Performance Evaluation of Routing Protocols in Manets Deployed for e-Learning Purpose",
      "authors": "F. LAKRAMI, N. ELKAMOUN AND O. LAOUIDYA",
      "source": "International Journal of Computer Applications, vol 178, Issue 2, pages :41-47",
      "pages": "",
      "year": "2017",
      "type": "ESCI",
      "link": ""
    },
    {
      "id": "pub-18",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "Mobility and QOS Management in OLSR Routing Protocol",
      "authors": "F. LAKRAMI, N. ELKAMOUN",
      "source": "International Journal of Computer Networking, Wireless and Mobile Communications (IJCNWMC)",
      "pages": "",
      "year": "2013",
      "type": "Article de journal",
      "link": ""
    },
    {
      "id": "pub-19",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "Study of a Multi-Layers Quality of Service Model for ADHOC networks",
      "authors": "F. LAKRAMI, N. ELKAMOUN",
      "source": "International Journal of Computer Applications, Volume 48– No.14",
      "pages": "",
      "year": "2013",
      "type": "Article de journal",
      "link": ""
    },
    {
      "id": "pub-20",
      "kind": "article",
      "domain": "Réseaux et Sécurité",
      "title": "Energy and Mobility in OLSR routing protocol",
      "authors": "F. LAKRAMI, N. ELKAMOUN",
      "source": "Cyber Journals: Multidisciplinary Journals in Science and Technology, Journal of Selected Areas in Telecommunications (JSAT)",
      "pages": "",
      "year": "2012",
      "type": "Article de journal",
      "link": ""
    },
    {
      "id": "pub-21",
      "kind": "communication",
      "domain": "Réseaux et Sécurité",
      "title": "Examining the Effects of DDoS Attacks on SDN Architectures: Experimental Study",
      "authors": "J. Zakariaa, F. LAKRAMI, H. SOUNNI, et al.",
      "source": "International Conference on Ubiquitous Networking (UNet). IEEE",
      "pages": "p. 1-5",
      "year": "2024",
      "type": "",
      "link": ""
    },
    {
      "id": "pub-22",
      "kind": "communication",
      "domain": "Réseaux et Sécurité",
      "title": "A secure based trust model for Optimized Link State Routing protocol (OLSR)",
      "authors": "F. LAKRAMI, M. EL KAMILI, N. ELKAMOUN, H. SOUNNI, & O. LABOUIDYA",
      "source": "2023 10th International Conference on Wireless Networks and Mobile Communications (WINCOM), Istanbul, Turkey. IEEE",
      "pages": "",
      "year": "2023",
      "type": "",
      "link": ""
    },
    {
      "id": "pub-23",
      "kind": "communication",
      "domain": "Réseaux et Sécurité",
      "title": "An enhanced centralized approach to improve localization in wireless sensor networks: application to smart parking",
      "authors": "M. LAAOUAFY, F. LAKRAMI, O LABOUIDYA",
      "source": "EVF'2022 – 9th International Conference on Energy and City of the Future, El Jadida (Morocco)",
      "pages": "",
      "year": "2022",
      "type": "",
      "link": ""
    },
    {
      "id": "pub-24",
      "kind": "communication",
      "domain": "Réseaux et Sécurité",
      "title": "A new Smart Parking system based on Artificial Intelligence",
      "authors": "F. LAKRAMI, M. LAAOUAFY, N. EL KAMOUN, O LABOUIDYA",
      "source": "EVF'2022 – 9th International Conference on Energy and City of the Future, ENSA, El Jadida (Morocco)",
      "pages": "",
      "year": "2022",
      "type": "",
      "link": ""
    },
    {
      "id": "pub-25",
      "kind": "article",
      "domain": "E-learning et Intelligence Artificielle",
      "title": "Higher education and generative artificial intelligence: Applications, challenges, opportunities, and Ethics",
      "authors": "M. KAOUNI, F. LAKRAMI, O. LAOUIDYA & Y. BADDI",
      "source": "Chapitre d'ouvrage",
      "pages": "",
      "year": "2024",
      "type": "Book Chapter",
      "link": ""
    },
    {
      "id": "pub-26",
      "kind": "article",
      "domain": "E-learning et Intelligence Artificielle",
      "title": "The Design of an Adaptive E-learning model based on artificial intelligence for enhancing online teaching",
      "authors": "M. KAOUNI, F. LAKRAMI, O. LABOUIDYA",
      "source": "International Journal of Emerging Technologies in Learning (iJET)",
      "pages": "",
      "year": "2023",
      "type": "Article de journal",
      "link": ""
    },
    {
      "id": "pub-27",
      "kind": "article",
      "domain": "E-learning et Intelligence Artificielle",
      "title": "Analytic survey on the challenges of Moroccan students in higher education institutions face to distance learning",
      "authors": "M. KAOUNI, F. LAKRAMI, O. LABOUIDYA",
      "source": "Indonesian Journal of Electrical Engineering and Computer Science Vol. 28, No. 1, pp. 284~296",
      "pages": "",
      "year": "2022",
      "type": "SCOPUS",
      "link": ""
    },
    {
      "id": "pub-28",
      "kind": "article",
      "domain": "E-learning et Intelligence Artificielle",
      "title": "Towards the development of a didactic approach using MOOCs in traditional classrooms to support teaching in higher education in MOROCCO",
      "authors": "F. LAKRAMI, N. ELKAMOUN AND O. LAOUIDYA",
      "source": "International Journal of Information Science and Technology, vol. 3, no 2, p. 19-28",
      "pages": "",
      "year": "2019",
      "type": "Article de journal",
      "link": ""
    },
    {
      "id": "pub-29",
      "kind": "article",
      "domain": "E-learning et Intelligence Artificielle",
      "title": "Pédagogie universitaire et classe inversée : vers un apprentissage fructueux en travaux pratiques",
      "authors": "F. LAKRAMI, N. ELKAMOUN AND O. LAOUIDYA",
      "source": "Revue internationale de pédagogie de l'enseignement supérieur (RIPES), 34(34-3)",
      "pages": "",
      "year": "2018",
      "type": "Article de journal",
      "link": ""
    },
    {
      "id": "pub-30",
      "kind": "article",
      "domain": "E-learning et Intelligence Artificielle",
      "title": "Apport des TIC dans la mise en place d'une pédagogie active en contexte universitaire : pistes de réflexion et propositions",
      "authors": "O. LABOUDYA, N. ELKAMOUN, K. ELKHADIRI, M. BOUSMAH, F. LAKRAMI, R. HILAL",
      "source": "Revue scientifique Internationale de l'éducation et de la formation, volume II, N°3",
      "pages": "",
      "year": "2017",
      "type": "Article de journal",
      "link": ""
    },
    {
      "id": "pub-31",
      "kind": "communication",
      "domain": "E-learning et Intelligence Artificielle",
      "title": "Personalizing Formative Feedback Through Generative Artificial Intelligence: An Experiment In Higher Education",
      "authors": "H. Akhasbi, N. El Kamoun, F. Lakrami et al",
      "source": "17th International Conference on Education and New Learning Technologies held in Palma, Spain",
      "pages": "",
      "year": "2025",
      "type": "",
      "link": ""
    },
    {
      "id": "pub-32",
      "kind": "communication",
      "domain": "E-learning et Intelligence Artificielle",
      "title": "L'intelligence artificielle générative : une opportunité pour améliorer l'évaluation formative dans un contexte universitaire massif",
      "authors": "N. El Kamoun, H. Akhasbi, F. Lakrami, et al",
      "source": "36e Colloque de l'ADMEE-Europe, Belval, Luxembourg",
      "pages": "",
      "year": "2025",
      "type": "",
      "link": "http://hdl.handle.net/20.500.12162/8096"
    },
    {
      "id": "pub-33",
      "kind": "communication",
      "domain": "E-learning et Intelligence Artificielle",
      "title": "Transformation digitale des territoires et organisations de l'ESS :opportunités, défis et perspectives au Maroc",
      "authors": "M. ERRACHIQ, F. LAKRAMI, F. NAJI",
      "source": "Colloque International de la recherche Appliquée (IRA 2025), FSJES de kelaa des Seraghna",
      "pages": "",
      "year": "2025",
      "type": "",
      "link": ""
    },
    {
      "id": "pub-34",
      "kind": "communication",
      "domain": "E-learning et Intelligence Artificielle",
      "title": "Intégration de l'IA dans le cycle CGQTS : Vers une génération automatisée de Quizz adaptatifs",
      "authors": "F. LAKRAMI et al",
      "source": "2ème édition de International Meeting for Innovative Pedagogy (IMIP'24), université de Technologie de Compiègne (UTC), France",
      "pages": "",
      "year": "2025",
      "type": "",
      "link": ""
    },
    {
      "id": "pub-35",
      "kind": "communication",
      "domain": "E-learning et Intelligence Artificielle",
      "title": "Vers une Pédagogie Réinventée: l'impact de l'IA générative",
      "authors": "F. LAKRAMI et al",
      "source": "1ères Rencontres Internationales de l'Innovation Pédagogique, ESC Clement Business Scool, France",
      "pages": "",
      "year": "2024",
      "type": "",
      "link": ""
    }
  ],
  "about": {
    "formations": [
      {
        "year": "2020",
        "title": "Habilitation universitaire",
        "institution": "Faculté des Sciences d’El Jadida"
      },
      {
        "year": "2014",
        "title": "Doctorat en Réseaux Informatiques et Télécoms",
        "institution": "Faculté des Sciences d’El Jadida · Laboratoire STIC"
      }
    ],
    "langues": [
      "Arabe",
      "Français",
      "Anglais",
      "Espagnol"
    ]
  }
}
