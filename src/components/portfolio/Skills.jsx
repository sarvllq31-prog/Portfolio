import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import { supabase } from '../../lib/supabase'
import AnimatedSection, { StaggerContainer, StaggerItem } from '../ui/AnimatedSection'

function SkillBar({ skill, lang }) {
  const name = lang === 'en' ? skill.name_en : (skill.name_ar || skill.name_en)
  return (
    <StaggerItem>
      <div className="mb-5">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{name}</span>
          <span className="text-sm font-bold text-primary-500">{skill.percentage}%</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full skill-bar-fill"
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.percentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
          />
        </div>
      </div>
    </StaggerItem>
  )
}

export default function Skills() {
  const { t, lang } = useLang()
  const [technical, setTechnical] = useState([])
  const [soft, setSoft] = useState([])

  useEffect(() => {
    supabase.from('skills').select('*').order('display_order')
      .then(({ data }) => {
        if (data) {
          setTechnical(data.filter(s => s.skill_type === 'technical'))
          setSoft(data.filter(s => s.skill_type !== 'technical'))
        }
      })
  }, [])

  return (
    <section id="skills" className="section-padding bg-slate-50/50 dark:bg-black/10">
      <div className="container-max">
        <AnimatedSection>
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-16">
            <span className="gradient-text">{t('skills.title')}</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { title: t('skills.technical'), data: technical, icon: '⚡' },
            { title: t('skills.soft'), data: soft, icon: '💡' },
          ].map(({ title, data, icon }, idx) => (
            <AnimatedSection key={idx} delay={idx * 0.15}>
              <div className="glass rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-lg shadow-lg shadow-primary-500/30">
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
                </div>
                <StaggerContainer>
                  {data.length === 0
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="mb-5">
                          <div className="h-4 w-40 animate-pulse bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                          <div className="h-2 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-full" />
                        </div>
                      ))
                    : data.map(skill => <SkillBar key={skill.id} skill={skill} lang={lang} />)
                  }
                </StaggerContainer>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
