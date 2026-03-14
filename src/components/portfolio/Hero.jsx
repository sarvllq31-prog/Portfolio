import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import { supabase } from '../../lib/supabase'

const ORBS = [
  { size: 600, x: '-10%', y: '-20%', color: 'from-primary-500/20 to-accent-violet/10' },
  { size: 400, x: '70%', y: '30%', color: 'from-accent-pink/15 to-primary-400/10' },
  { size: 300, x: '20%', y: '60%', color: 'from-accent-violet/15 to-accent-cyan/10' },
]

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
}))

export default function Hero() {
  const { t, lang } = useLang()
  const [contact, setContact] = useState(null)

  useEffect(() => {
    supabase.from('contact').select('*').single()
      .then(({ data }) => { if (data) setContact(data) })
  }, [])

  const contactItems = [
    { id: 'email', icon: '📧', label: 'Email', href: contact ? `mailto:${contact.email}` : '#', value: contact?.email },
    { id: 'phone', icon: '📱', label: 'Phone', href: contact ? `tel:${contact.phone}` : '#', value: contact?.phone },
    { id: 'github', icon: '💻', label: 'GitHub', href: contact?.github_url || '#', value: 'GitHub' },
    { id: 'linkedin', icon: '💼', label: 'LinkedIn', href: contact?.linkedin_url || '#', value: 'LinkedIn' },
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 mesh-bg dark:opacity-40" />

      {/* Floating Orbs */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl pointer-events-none`}
          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 30, -10, 0],
            scale: [1, 1.05, 0.97, 1.03, 1],
          }}
          transition={{ duration: 12 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Particles */}
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary-400/30 dark:bg-primary-300/20 pointer-events-none"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Content */}
      <div className="container-max px-4 sm:px-6 w-full pt-20">
        <div className="flex flex-col items-center text-center">
          {/* Contact pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {contactItems.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.08, y: -2 }}
                className="flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:shadow-lg hover:shadow-primary-500/10 transition-shadow"
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.value || item.label}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Name Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm font-semibold text-primary-600 dark:text-primary-400 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Sarah Ali Alqahtani
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 max-w-4xl"
          >
            <span className="gradient-text">{t('hero.welcome')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-base px-8 py-4"
            >
              {t('hero.viewProjects')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-ghost text-base px-8 py-4"
            >
              {t('hero.contactMe')}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 glass rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-primary-400 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
