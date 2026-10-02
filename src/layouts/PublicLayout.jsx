import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PublicLayout = () => {
  return (
    <div className="public-site min-h-screen">
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
