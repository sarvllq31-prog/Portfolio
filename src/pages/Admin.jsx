import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/layout/Navbar'
import Login from '../components/admin/Login'
import Dashboard from '../components/admin/Dashboard'

export default function Admin({ page }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (page === 'login' && user) navigate('/admin')
  }, [user, page, navigate])

  if (page === 'login') {
    return (
      <div className="min-h-screen">
        <Login />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar isAdmin />
      <Dashboard />
    </div>
  )
}
