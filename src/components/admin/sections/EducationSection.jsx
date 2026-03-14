import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useLang } from '../../../contexts/LanguageContext'

const emptyForm = { degree_en: '', degree_ar: '', organization_en: '', organization_ar: '', start_date: '', end_date: '' }

export default function EducationSection() {
  const { t } = useLang()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [msg, setMsg] = useState(null)

  const load = () => supabase.from('education').select('*').order('display_order').then(({ data }) => { if (data) setItems(data) })
  useEffect(() => { load() }, [])

  const f = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const save = async () => {
    if (!form.degree_en) return
    let error
    if (editId) {
      ({ error } = await supabase.from('education').update(form).eq('id', editId))
    } else {
      ({ error } = await supabase.from('education').insert(form))
    }
    if (error) { setMsg(t('admin.error')); return }
    setMsg(editId ? t('admin.saved') : t('admin.added'))
    setForm(emptyForm); setEditId(null); load()
  }

  const startEdit = (item) => {
    setForm({ degree_en: item.degree_en, degree_ar: item.degree_ar || '', organization_en: item.organization_en || '', organization_ar: item.organization_ar || '', start_date: item.start_date || '', end_date: item.end_date || '' })
    setEditId(item.id)
  }

  const del = async (id) => {
    if (!window.confirm(t('admin.confirm'))) return
    await supabase.from('education').delete().eq('id', id)
    setMsg(t('admin.deleted')); load()
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">{t('admin.education')}</h3>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h4 className="font-semibold text-slate-600 dark:text-slate-300">{editId ? t('admin.editItem') : t('admin.addItem')}</h4>
        <div className="grid sm:grid-cols-2 gap-3">
          <input placeholder={t('admin.degreeEn')} value={form.degree_en} onChange={f('degree_en')} className="input-field" />
          <input placeholder={t('admin.degreeAr')} value={form.degree_ar} onChange={f('degree_ar')} className="input-field" dir="rtl" />
          <input placeholder={t('admin.orgEn')} value={form.organization_en} onChange={f('organization_en')} className="input-field" />
          <input placeholder={t('admin.orgAr')} value={form.organization_ar} onChange={f('organization_ar')} className="input-field" dir="rtl" />
          <input placeholder={t('admin.startDate')} value={form.start_date} onChange={f('start_date')} className="input-field" />
          <input placeholder={t('admin.endDate')} value={form.end_date} onChange={f('end_date')} className="input-field" />
        </div>
        <div className="flex gap-3">
          <button onClick={save} className="btn-primary">{editId ? t('admin.save') : t('admin.add')}</button>
          {editId && <button onClick={() => { setForm(emptyForm); setEditId(null) }} className="btn-ghost">{t('admin.cancel')}</button>}
        </div>
      </div>

      {msg && <p className="text-sm font-medium text-emerald-500">{msg}</p>}

      <div className="space-y-3">
        <AnimatePresence>
          {items.map(item => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
              className="glass rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">{item.degree_en}</p>
                <p className="text-sm text-slate-500">{item.organization_en} · {item.start_date} – {item.end_date}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(item)} className="text-primary-500 hover:text-primary-700 text-sm font-medium px-3 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">{t('admin.edit')}</button>
                <button onClick={() => del(item.id)} className="text-red-400 hover:text-red-600 text-sm font-medium px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">{t('admin.delete')}</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
