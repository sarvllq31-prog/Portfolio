import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'

const navSections = ['home', 'about', 'skills', 'certificates', 'projects', 'education', 'contact']

export default function Navbar({ isAdmin = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')
  const { t, toggleLang, lang } = useLang()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (isAdmin) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    navSections.forEach(s => {
      const el = document.getElementById(s)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [isAdmin])

  const scrollTo = (id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleAdminClick = async () => {
    if (user) {
      navigate('/admin')
    } else {
      navigate('/admin/login')
    }
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'glass shadow-lg shadow-black/5' : 'bg-transparent'
      }`}
    >
      <div className="container-max px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => isAdmin ? navigate('/') : scrollTo('home')} className="font-bold text-lg gradient-text">
            Sarah Alqahtani
          </button>

          {/* Desktop Nav */}
          {!isAdmin && (
            <ul className="hidden lg:flex items-center gap-1">
              {navSections.map(s => (
                <li key={s}>
                  <button
                    onClick={() => scrollTo(s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      active === s
                        ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    {t(`nav.${s}`)}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark(d => !d)}
              className="w-9 h-9 glass rounded-full flex items-center justify-center text-lg hover:scale-110 transition-transform"
            >
              {dark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 glass rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:scale-105 transition-transform"
            >
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>
            {isAdmin ? (
              <button
                onClick={signOut}
                className="px-4 py-2 glass rounded-full text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                {t('admin.signOut')}
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdminClick}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-violet text-white rounded-full text-sm font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow"
              >
                ⚙️ {t('nav.admin')}
              </motion.button>
            )}

            {/* Mobile burger */}
            {!isAdmin && (
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="lg:hidden w-9 h-9 glass rounded-full flex items-center justify-center"
              >
                <span className="text-slate-700 dark:text-slate-200">{menuOpen ? '✕' : '☰'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && !isAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-strong border-t border-white/20 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navSections.map(s => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className={`w-full text-start px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active === s
                      ? 'bg-primary-500/10 text-primary-600'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t(`nav.${s}`)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
