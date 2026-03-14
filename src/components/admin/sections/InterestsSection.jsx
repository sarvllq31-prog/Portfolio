import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useLang } from '../../../contexts/LanguageContext'

export default function InterestsSection() {
  const { t } = useLang()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title_en: '', title_ar: '', icon: '' })
  const [msg, setMsg] = useState(null)

  const load = () => supabase.from('interests').select('*').order('display_order').then(({ data }) => { if (data) setItems(data) })
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!form.title_en) return
    const { error } = await supabase.from('interests').insert(form)
    if (error) { setMsg(t('admin.error')); return }
    setMsg(t('admin.added')); setForm({ title_en: '', title_ar: '', icon: '' }); load()
  }

  const del = async (id) => {
    if (!window.confirm(t('admin.confirm'))) return
    await supabase.from('interests').delete().eq('id', id)
    setMsg(t('admin.deleted')); load()
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">{t('admin.interests')}</h3>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h4 className="font-semibold text-slate-600 dark:text-slate-300">{t('admin.addItem')}</h4>
        <div className="grid sm:grid-cols-3 gap-3">
          <input placeholder={t('admin.titleEn')} value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} className="input-field" />
          <input placeholder={t('admin.titleAr')} value={form.title_ar} onChange={e => setForm(f => ({ ...f, title_ar: e.target.value }))} className="input-field" dir="rtl" />
          <input placeholder={t('admin.icon')} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="input-field" />
        </div>
        <button onClick={add} className="btn-primary">{t('admin.add')}</button>
      </div>

      {msg && <p className="text-sm font-medium text-emerald-500">{msg}</p>}

      <div className="space-y-3">
        <AnimatePresence>
          {items.map(item => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
              className="glass rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">{item.title_en}</p>
                  <p className="text-sm text-slate-400">{item.title_ar}</p>
                </div>
              </div>
              <button onClick={() => del(item.id)} className="text-red-400 hover:text-red-600 text-sm font-medium px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                {t('admin.delete')}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
