import { Link } from 'react-router-dom'
import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { usePortfolio } from '../contexts/PortfolioContext'

const Footer = () => {
  const { portfolioData } = usePortfolio()
  const profile = portfolioData?.profile || {}
  return <footer className="site-footer"><div className="container-max footer-inner"><p>© {new Date().getFullYear()} {profile.prenom} {profile.nom}<span> · Portfolio académique</span></p><div><Link to="/login">Administration</Link><a href="#home">Haut de page <ArrowUpIcon aria-hidden="true" /></a></div></div></footer>
}

export default Footer

