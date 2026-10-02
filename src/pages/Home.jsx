import { useEffect } from 'react'
import { usePortfolio } from '../contexts/PortfolioContext'
import { buildSectionEntries } from '../utils/sectionDisplay'
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import ResearchSection from '../components/sections/ResearchSection'
import PublicationsSection from '../components/sections/PublicationsSection'
import ThesesSection from '../components/sections/ThesesSection'
import TeachingSection from '../components/sections/TeachingSection'
import ProjectsSection from '../components/sections/ProjectsSection'
import ResponsibilitiesSection from '../components/sections/ResponsibilitiesSection'
import CompetencesSection from '../components/sections/CompetencesSection'
import ContactSection from '../components/sections/ContactSection'
import GenericSection from '../components/sections/GenericSection'

const SECTION_COMPONENTS = {
  about: AboutSection,
  research: ResearchSection,
  skills: CompetencesSection,
  publications: PublicationsSection,
  theses: ThesesSection,
  teaching: TeachingSection,
  projects: ProjectsSection,
  responsibilities: ResponsibilitiesSection,
  contact: ContactSection,
}

const Home = () => {
  const { portfolioData, ready, error, loadPortfolioData } = usePortfolio()

  // Sections render only after the API responds, so the browser's own jump to /#anchor happens too early.
  useEffect(() => {
    if (!ready || !window.location.hash) return
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
    target?.scrollIntoView()
  }, [ready])

  if (!ready) return (
    <section className="page-feedback" aria-live="polite">
      {error ? <>
        <h1>Le portfolio est momentanément indisponible</h1>
        <p>{error}</p>
        <div><button type="button" className="btn-primary" onClick={() => loadPortfolioData()}>Réessayer</button></div>
      </> : <p role="status">Chargement du portfolio…</p>}
    </section>
  )

  const profile = portfolioData.profile || {}
  const entries = buildSectionEntries(portfolioData.sections)

  return (
    <div className="animate-fade-in">
      <HeroSection profile={profile} entries={entries} />
      {entries.map(({ section, anchor, number }) => {
        const Component = SECTION_COMPONENTS[section.type] || GenericSection
        return <Component key={section.id} section={section} profile={profile} number={number} anchor={anchor} />
      })}
    </div>
  )
}

export default Home
