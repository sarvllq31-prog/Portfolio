import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import { supabase } from '../../lib/supabase'
import AnimatedSection from '../ui/AnimatedSection'

export default function Education() {
  const { t, lang } = useLang()
  const [edu, setEdu] = useState([])

  useEffect(() => {
    supabase.from('education').select('*').order('display_order')
      .then(({ data }) => { if (data) setEdu(data) })
  }, [])

  return (
    <section id="education" className="section-padding relative overflow-hidden">
      <div className="container-max relative">
        <AnimatedSection>
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-16">
            <span className="gradient-text">{t('education.title')}</span>
          </h2>
        </AnimatedSection>

        <div className="relative max-w-2xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 to-accent-violet opacity-30" style={{ [lang === 'ar' ? 'right' : 'left']: '24px', left: 'auto' }} />
          <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 to-accent-violet opacity-30" style={{ [lang === 'ar' ? 'right' : 'left']: '24px' }} />

          {edu.length === 0
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-6 mb-8">
                  <div className="w-12 h-12 rounded-full animate-pulse bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                  <div className="glass rounded-2xl p-6 flex-1 animate-pulse">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                </div>
              ))
            : edu.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: lang === 'ar' ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="flex gap-6 mb-8"
                >
                  {/* Dot */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-xl shadow-lg shadow-primary-500/30">
                      🎓
                    </div>
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ x: lang === 'ar' ? -4 : 4 }}
                    className="glass rounded-2xl p-6 flex-1 hover:shadow-lg hover:shadow-primary-500/10 transition-shadow"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <h3 className="font-bold text-slate-800 dark:text-white">
                        {lang === 'en' ? item.degree_en : item.degree_ar || item.degree_en}
                      </h3>
                      <span className="text-xs font-semibold text-primary-500 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">
                        {item.start_date} – {item.end_date}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">
                      {lang === 'en' ? item.organization_en : item.organization_ar || item.organization_en}
                    </p>
                  </motion.div>
                </motion.div>
              ))
          }
        </div>
      </div>
    </section>
  )
}
