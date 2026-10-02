import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-1 min-w-0 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout