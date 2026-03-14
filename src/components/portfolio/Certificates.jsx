import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LanguageContext'
import { supabase } from '../../lib/supabase'
import AnimatedSection, { StaggerContainer, StaggerItem } from '../ui/AnimatedSection'
import Modal from '../ui/Modal'

export default function Certificates() {
  const { t, lang } = useLang()
  const [certs, setCerts] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    supabase.from('certificates').select('*').order('display_order')
      .then(({ data }) => { if (data) setCerts(data) })
  }, [])

  return (
    <section id="certificates" className="section-padding relative overflow-hidden">
      <div className="container-max relative">
        <AnimatedSection>
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-16">
            <span className="gradient-text">{t('certificates.title')}</span>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.1}>
          {certs.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <StaggerItem key={i}>
                  <div className="glass rounded-2xl p-6 animate-pulse">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                </StaggerItem>
              ))
            : certs.map(cert => (
                <StaggerItem key={cert.id}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    onClick={() => cert.file_url && setSelected(cert)}
                    className={`glass rounded-2xl p-6 ${cert.file_url ? 'cursor-pointer hover:shadow-xl hover:shadow-primary-500/10' : ''} transition-shadow`}
                  >
                    <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-xl mb-4 shadow-md shadow-primary-500/20">
                      🏆
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1">
                      {lang === 'en' ? cert.title_en : cert.title_ar || cert.title_en}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {lang === 'en' ? cert.organization_en : cert.organization_ar || cert.organization_en}
                    </p>
                    {cert.file_url && (
                      <p className="text-xs text-primary-500 mt-3 font-medium">{t('certificates.clickToView')} →</p>
                    )}
                  </motion.div>
                </StaggerItem>
              ))
          }
        </StaggerContainer>
      </div>

      {/* Certificate Viewer Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} size="lg">
        {selected && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 pr-8 text-slate-800 dark:text-white">
              {lang === 'en' ? selected.title_en : selected.title_ar || selected.title_en}
            </h2>
            {selected.file_url?.toLowerCase().endsWith('.pdf') ? (
              <iframe src={selected.file_url} className="w-full rounded-xl" style={{ height: '70vh' }} title="Certificate" />
            ) : (
              <img src={selected.file_url} alt="Certificate" className="w-full rounded-xl object-contain max-h-[70vh]" />
            )}
          </div>
        )}
      </Modal>
    </section>
  )
}
