// Sécurité globale pour éviter les erreurs ReferenceError
// Définition directe des données par défaut pour éviter l'import circulaire
const defaultPortfolioData = {
  profile: {
    nom: 'LAKRAMI',
    prenom: 'Fatima',
    nationalite: 'Marocaine',
    gsm: '+212 6 90 99 92 46',
    grade: 'Maitre de conférence Habilité à la Faculté des Sciences d\'El Jadida',
    fonction: 'Enseignant Chercheur',
    email: 'lakrami.f@ucd.ac.ma',
    affiliation: 'Département de Physique, Faculté des Sciences, Université Chouaib Doukkali',
    laboratoire: 'Vice directrice du Laboratoire des Sciences et Technologies de l\'information et de la communication STIC, faculté des sciences, université Chouaib Doukkali',
    equipe: 'Responsable d\'équipe de recherche : Technologies de l\'Information et de la Communication pour l\'Education et la Formation (TICEF)',
    youtube: 'https://www.youtube.com/results?search_query=stic+laboratory',
    linkedin: 'https://www.linkedin.com/in/fatima-lakrami-96ab23155/',
    researchgate: 'https://www.researchgate.net/profile/Fatima-Lakrami-3',
    photo: null,
    mission: 'Contribuer à l\'avancement des technologies de l\'information et de la communication dans l\'éducation, en développant des solutions innovantes pour l\'enseignement et la formation à l\'ère numérique.',
    langues: [
      { nom: 'Arabe', color: 'from-blue-500 to-cyan-500' },
      { nom: 'Français', color: 'from-green-500 to-teal-500' },
      { nom: 'Anglais', color: 'from-purple-500 to-pink-500' }
    ]
  },
  sections: []
}

// Export global de portfolioData pour éviter les références non définies
if (typeof window !== 'undefined') {
  window.portfolioData = defaultPortfolioData
  window.defaultPortfolioData = defaultPortfolioData
}

// Vérification de sécurité globale
if (typeof portfolioData === 'undefined') {
  if (typeof window !== 'undefined') {
    window.portfolioData = defaultPortfolioData
  }
}

// Export pour les modules
export { defaultPortfolioData as portfolioData }
export default defaultPortfolioData

// Log de sécurité
console.log('Portfolio safety initialized:', {
  hasDefaultData: !!defaultPortfolioData,
  sectionsCount: defaultPortfolioData?.sections?.length || 0
})