import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PortfolioProvider } from './contexts/PortfolioContext'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'
import ProfileEditor from './pages/admin/ProfileEditor'
import SectionsEditor from './pages/admin/SectionsEditor'
import CoursesEditor from './pages/admin/CoursesEditor'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
          </Route>
          
          {/* Route de connexion */}
          <Route path="/login" element={<Login />} />
          
          {/* Routes admin protégées */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfileEditor />} />
            <Route path="sections" element={<SectionsEditor />} />
            <Route path="courses" element={<CoursesEditor />} />
          </Route>
        </Routes>
      </PortfolioProvider>
    </AuthProvider>
  )
}

export default App