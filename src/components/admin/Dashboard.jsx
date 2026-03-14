import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import AboutSection from './sections/AboutSection'
import InterestsSection from './sections/InterestsSection'
import SkillsSection from './sections/SkillsSection'
import CertificatesSection from './sections/CertificatesSection'
import ProjectsSection from './sections/ProjectsSection'
import EducationSection from './sections/EducationSection'
import ContactSection from './sections/ContactSection'

const TABS = [
  { key: 'about', icon: '📝' },
  { key: 'interests', icon: '💡' },
  { key: 'skills', icon: '⚡' },
  { key: 'certificates', icon: '🏆' },
  { key: 'projects', icon: '🚀' },
  { key: 'education', icon: '🎓' },
  { key: 'contact', icon: '📞' },
]

const SECTIONS = {
  about: AboutSection,
  interests: InterestsSection,
  skills: SkillsSection,
  certificates: CertificatesSection,
  projects: ProjectsSection,
  education: EducationSection,
  contact: ContactSection,
}

export default function Dashboard() {
  const { t } = useLang()
  const [activeTab, setActiveTab] = useState('about')
  const ActiveSection = SECTIONS[activeTab]

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="container-max px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          <h1 className="text-3xl font-black gradient-text">{t('admin.dashboard')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t('admin.loginSub')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-1"
          >
            {TABS.map(({ key, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-primary-500 to-accent-violet text-white shadow-lg shadow-primary-500/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span className="text-lg">{icon}</span>
                {t(`admin.${key}`)}
              </button>
            ))}
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <ActiveSection />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
