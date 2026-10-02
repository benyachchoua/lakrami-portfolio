import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'
import '../styles/admin.css'

const AdminLayout = () => (
  <div className="admin-shell">
    <a href="#admin-main" className="skip-link">Aller au contenu</a>
    <AdminHeader />
    <div className="admin-body">
      <AdminSidebar />
      <main id="admin-main" className="admin-main" tabIndex={-1}>
        <div className="admin-container"><Outlet /></div>
      </main>
    </div>
  </div>
)

export default AdminLayout
