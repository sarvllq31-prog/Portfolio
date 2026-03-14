import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useLang } from '../../contexts/LanguageContext'

const ORBS = [
  { size: 500, x: '-5%', y: '-10%', color: 'from-primary-500/20 to-accent-violet/10' },
  { size: 350, x: '60%', y: '50%', color: 'from-accent-pink/15 to-primary-400/10' },
]

export default function Login() {
  const { t, toggleLang, lang } = useLang()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (err) {
      setError(t('admin.loginError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg" />
      {ORBS.map((orb, i) => (
        <motion.div key={i}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl pointer-events-none`}
          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
          animate={{ x: [0, 20, -15, 0], y: [0, -15, 20, 0] }}
          transition={{ duration: 10 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={toggleLang} className="px-3 py-1.5 glass rounded-full text-xs font-bold text-slate-700 dark:text-slate-200">
          {lang === 'en' ? 'عربي' : 'EN'}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md mx-4 glass-strong rounded-3xl p-8 shadow-2xl shadow-black/10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl shadow-primary-500/30">
            ⚙️
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">{t('admin.login')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('admin.loginSub')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              {t('admin.email')}
            </label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required autoComplete="email"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              {t('admin.password')}
            </label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required autoComplete="current-password"
              className="input-field"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 py-2 px-4 rounded-xl"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit" disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full btn-primary py-4 text-base mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('admin.loading')}
              </span>
            ) : t('admin.signIn')}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
            {t('admin.backToPortfolio')}
          </a>
        </div>
      </motion.div>
    </div>
  )
}
