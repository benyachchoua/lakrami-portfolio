import React from 'react'
import { usePortfolio } from '../contexts/PortfolioContext'
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

const Home = () => {
  const { portfolioData } = usePortfolio()

  return (
    <div className="animate-fade-in">
      <HeroSection profile={portfolioData.profile} />
      <AboutSection profile={portfolioData.profile} />
      <ResearchSection sections={portfolioData.sections} />
      <CompetencesSection sections={portfolioData.sections} />
      <PublicationsSection sections={portfolioData.sections} />
      <ThesesSection sections={portfolioData.sections} />
      <TeachingSection sections={portfolioData.sections} />
      <ProjectsSection sections={portfolioData.sections} />
      <ResponsibilitiesSection sections={portfolioData.sections} />
      <ContactSection profile={portfolioData.profile} />
    </div>
  )
}

export default Home