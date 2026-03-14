import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useLang } from '../../../contexts/LanguageContext'

const emptyForm = { name_en: '', name_ar: '', percentage: '', skill_type: 'technical' }

export default function SkillsSection() {
  const { t } = useLang()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [msg, setMsg] = useState(null)

  const load = () => supabase.from('skills').select('*').order('display_order').then(({ data }) => { if (data) setItems(data) })
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.name_en || !form.percentage) return
    const payload = { ...form, percentage: parseInt(form.percentage) }
    let error
    if (editId) {
      ({ error } = await supabase.from('skills').update(payload).eq('id', editId))
    } else {
      ({ error } = await supabase.from('skills').insert(payload))
    }
    if (error) { setMsg(t('admin.error')); return }
    setMsg(editId ? t('admin.saved') : t('admin.added'))
    setForm(emptyForm); setEditId(null); load()
  }

  const startEdit = (item) => {
    setForm({ name_en: item.name_en, name_ar: item.name_ar || '', percentage: String(item.percentage), skill_type: item.skill_type })
    setEditId(item.id)
  }

  const del = async (id) => {
    if (!window.confirm(t('admin.confirm'))) return
    await supabase.from('skills').delete().eq('id', id)
    setMsg(t('admin.deleted')); load()
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">{t('admin.skills')}</h3>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h4 className="font-semibold text-slate-600 dark:text-slate-300">{editId ? t('admin.editItem') : t('admin.addItem')}</h4>
        <div className="grid sm:grid-cols-2 gap-3">
          <input placeholder={t('admin.nameEn')} value={form.name_en} onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))} className="input-field" />
          <input placeholder={t('admin.nameAr')} value={form.name_ar} onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))} className="input-field" dir="rtl" />
          <input type="number" min="0" max="100" placeholder={t('admin.percentage')} value={form.percentage} onChange={e => setForm(f => ({ ...f, percentage: e.target.value }))} className="input-field" />
          <select value={form.skill_type} onChange={e => setForm(f => ({ ...f, skill_type: e.target.value }))} className="input-field">
            <option value="technical">{t('admin.technical')}</option>
            <option value="soft">{t('admin.soft')}</option>
          </select>
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
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{item.name_en}</span>
                  <span className="text-sm font-bold text-primary-500">{item.percentage}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full skill-bar-fill rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.skill_type === 'technical' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'}`}>
                    {item.skill_type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(item)} className="text-primary-500 hover:text-primary-700 text-sm font-medium px-3 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                  {t('admin.edit')}
                </button>
                <button onClick={() => del(item.id)} className="text-red-400 hover:text-red-600 text-sm font-medium px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  {t('admin.delete')}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
