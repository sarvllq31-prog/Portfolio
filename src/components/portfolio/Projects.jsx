import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import { supabase } from '../../lib/supabase'
import AnimatedSection, { StaggerContainer, StaggerItem } from '../ui/AnimatedSection'
import Modal from '../ui/Modal'

export default function Projects() {
  const { t, lang } = useLang()
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState(null)
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    supabase.from('projects').select('*').order('display_order')
      .then(({ data }) => { if (data) setProjects(data) })
  }, [])

  const openProject = (p) => { setSelected(p); setImgIdx(0) }

  return (
    <section id="projects" className="section-padding bg-slate-50/50 dark:bg-black/10">
      <div className="container-max">
        <AnimatedSection>
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-16">
            <span className="gradient-text">{t('projects.title')}</span>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.1}>
          {projects.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <StaggerItem key={i}>
                  <div className="glass rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-slate-200 dark:bg-slate-700" />
                    <div className="p-5">
                      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-2" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                    </div>
                  </div>
                </StaggerItem>
              ))
            : projects.map(p => {
                const imgs = Array.isArray(p.image_urls) ? p.image_urls : []
                return (
                  <StaggerItem key={p.id}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      onClick={() => openProject(p)}
                      className="glass rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-primary-500/10 transition-shadow group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        {imgs[0]
                          ? <img src={imgs[0]} alt={p.title_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          : (
                            <div className="w-full h-full gradient-bg flex items-center justify-center text-4xl opacity-60">
                              🚀
                            </div>
                          )
                        }
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="glass px-3 py-1 rounded-full text-xs font-bold text-white">View Details</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-1">
                          {lang === 'en' ? p.title_en : p.title_ar || p.title_en}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                          {lang === 'en' ? p.short_desc_en : p.short_desc_ar || p.short_desc_en}
                        </p>
                        {Array.isArray(p.tools) && p.tools.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {p.tools.slice(0, 3).map(tool => (
                              <span key={tool} className="px-2 py-0.5 bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full">
                                {tool}
                              </span>
                            ))}
                            {p.tools.length > 3 && (
                              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs rounded-full">
                                +{p.tools.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </StaggerItem>
                )
              })
          }
        </StaggerContainer>
      </div>

      {/* Project Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} size="lg">
        {selected && (
          <div className="p-6 sm:p-8">
            {/* Image Carousel */}
            {Array.isArray(selected.image_urls) && selected.image_urls.length > 0 && (
              <div className="relative mb-6 rounded-2xl overflow-hidden">
                <img
                  src={selected.image_urls[imgIdx]}
                  alt={selected.title_en}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                {selected.image_urls.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-3">
                    <button onClick={() => setImgIdx(i => (i - 1 + selected.image_urls.length) % selected.image_urls.length)}
                      className="w-9 h-9 glass rounded-full flex items-center justify-center text-white font-bold">‹</button>
                    <button onClick={() => setImgIdx(i => (i + 1) % selected.image_urls.length)}
                      className="w-9 h-9 glass rounded-full flex items-center justify-center text-white font-bold">›</button>
                  </div>
                )}
                {selected.image_urls.length > 1 && (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {selected.image_urls.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white scale-125' : 'bg-white/50'}`} />
                    ))}
                  </div>
                )}
              </div>
            )}

            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3 pr-8">
              {lang === 'en' ? selected.title_en : selected.title_ar || selected.title_en}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
              {lang === 'en' ? selected.full_desc_en : selected.full_desc_ar || selected.full_desc_en}
            </p>

            {Array.isArray(selected.tools) && selected.tools.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {t('projects.tools')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selected.tools.map(tool => (
                    <span key={tool} className="px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-semibold rounded-full">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {selected.github_url && (
                <a href={selected.github_url} target="_blank" rel="noopener noreferrer"
                  className="btn-primary text-sm">
                  💻 {t('projects.viewGithub')}
                </a>
              )}
              {selected.demo_url && (
                <a href={selected.demo_url} target="_blank" rel="noopener noreferrer"
                  className="btn-ghost text-sm">
                  🌐 {t('projects.viewDemo')}
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
