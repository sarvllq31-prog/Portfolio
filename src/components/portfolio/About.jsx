import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import { supabase } from '../../lib/supabase'
import AnimatedSection, { StaggerContainer, StaggerItem } from '../ui/AnimatedSection'

export default function About() {
  const { t, lang } = useLang()
  const [about, setAbout] = useState(null)
  const [interests, setInterests] = useState([])

  useEffect(() => {
    supabase.from('about').select('*').single()
      .then(({ data }) => { if (data) setAbout(data) })
    supabase.from('interests').select('*').order('display_order')
      .then(({ data }) => { if (data) setInterests(data) })
  }, [])

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="container-max relative">
        <AnimatedSection>
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-16">
            <span className="gradient-text">{t('about.title')}</span>
          </h2>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* About Text */}
          <AnimatedSection delay={0.1}>
            <div className="glass rounded-3xl p-8">
              <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-accent-violet rounded-full mb-6" />
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {about
                  ? (lang === 'en' ? about.text_en : about.text_ar) || about.text_en
                  : (
                    <span className="inline-block h-5 w-full animate-pulse bg-slate-200 dark:bg-slate-700 rounded" />
                  )
                }
              </p>
            </div>
          </AnimatedSection>

          {/* Interests - floating animated pills */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                {t('about.interestedIn')}
              </h3>
              {interests.length === 0 ? (
                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-12 w-32 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-full" />
                  ))}
                </div>
              ) : (
                <StaggerContainer className="flex flex-wrap gap-3" stagger={0.07}>
                  {interests.map((item, i) => (
                    <StaggerItem key={item.id}>
                      <motion.div
                        whileHover={{ scale: 1.08, y: -4 }}
                        animate={{
                          y: [0, -6, 0],
                          rotate: [0, i % 2 === 0 ? 1 : -1, 0],
                        }}
                        transition={{
                          y: { duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
                          rotate: { duration: 4 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 },
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 glass rounded-full shadow-sm hover:shadow-lg hover:shadow-primary-500/10 cursor-default transition-shadow"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {lang === 'en' ? item.title_en : item.title_ar || item.title_en}
                        </span>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
