import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import { supabase } from '../../lib/supabase'
import AnimatedSection from '../ui/AnimatedSection'

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

export default function Contact() {
  const { t } = useLang()
  const [contact, setContact] = useState(null)

  useEffect(() => {
    supabase.from('contact').select('*').single()
      .then(({ data }) => { if (data) setContact(data) })
  }, [])

  const items = [
    { id: 'email',    Icon: EmailIcon,    href: contact ? `mailto:${contact.email}` : '#',    label: 'Email' },
    { id: 'phone',    Icon: PhoneIcon,    href: contact ? `tel:${contact.phone}` : '#',        label: 'Phone' },
    { id: 'github',   Icon: GitHubIcon,   href: contact?.github_url || '#',                    label: 'GitHub' },
    { id: 'linkedin', Icon: LinkedInIcon, href: contact?.linkedin_url || '#',                  label: 'LinkedIn' },
  ]

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="container-max relative text-center">
        <AnimatedSection>
          <div className="max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-semibold text-primary-600 dark:text-primary-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {t('contact.subtitle')}
            </div>

            <h2 className="text-4xl sm:text-5xl font-black mb-10">
              <span className="gradient-text">{t('contact.title')}</span>
            </h2>

            <div className="flex flex-wrap justify-center gap-5">
              {items.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.15, y: -6 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 hover:shadow-xl hover:shadow-primary-500/20 transition-colors duration-200"
                >
                  <item.Icon />
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
