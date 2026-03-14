import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Portfolio from './pages/Portfolio'
import Admin from './pages/Admin'
import { useLang } from './contexts/LanguageContext'

function ThemeWrapper({ children }) {
  const { isRTL } = useLang()
  return <div dir={isRTL ? 'rtl' : 'ltr'}>{children}</div>
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f0e17]">
      <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
    </div>
  )
  return user ? children : <Navigate to="/admin/login" replace />
}

function AppRoutes() {
  return (
    <ThemeWrapper>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin/login" element={<Admin page="login" />} />
        <Route path="/admin" element={
          <ProtectedRoute><Admin page="dashboard" /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeWrapper>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
