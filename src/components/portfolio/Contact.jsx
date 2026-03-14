import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import { supabase } from '../../lib/supabase'
import AnimatedSection from '../ui/AnimatedSection'

export default function Contact() {
  const { t } = useLang()
  const [contact, setContact] = useState(null)

  useEffect(() => {
    supabase.from('contact').select('*').single()
      .then(({ data }) => { if (data) setContact(data) })
  }, [])

  const items = [
    { icon: '📧', label: 'Email', href: contact ? `mailto:${contact.email}` : '#', value: contact?.email },
    { icon: '📱', label: 'Phone', href: contact ? `tel:${contact.phone}` : '#', value: contact?.phone },
    { icon: '💻', label: 'GitHub', href: contact?.github_url || '#', value: 'GitHub' },
    { icon: '💼', label: 'LinkedIn', href: contact?.linkedin_url || '#', value: 'LinkedIn' },
  ]

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-30 dark:opacity-20 pointer-events-none" />
      <div className="container-max relative text-center">
        <AnimatedSection>
          <div className="max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-semibold text-primary-600 dark:text-primary-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {t('contact.subtitle')}
            </div>

            <h2 className="text-4xl sm:text-5xl font-black mb-8">
              <span className="gradient-text">{t('contact.title')}</span>
            </h2>

            <div className="flex flex-wrap justify-center gap-4">
              {items.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.08, y: -4 }}
                  className="flex items-center gap-3 glass px-6 py-4 rounded-2xl hover:shadow-xl hover:shadow-primary-500/10 transition-shadow group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <div className="text-start">
                    <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{item.label}</div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.value || '—'}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-slate-200/50 dark:border-white/5 text-center">
        <p className="text-sm text-slate-400 dark:text-slate-600">
          © {new Date().getFullYear()} Sarah Ali Alqahtani. All rights reserved.
        </p>
      </div>
    </section>
  )
}
