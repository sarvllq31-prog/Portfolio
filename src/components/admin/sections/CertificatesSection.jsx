import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useLang } from '../../../contexts/LanguageContext'

const emptyForm = { title_en: '', title_ar: '', organization_en: '', organization_ar: '' }

export default function CertificatesSection() {
  const { t } = useLang()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState(null)

  const load = () => supabase.from('certificates').select('*').order('display_order').then(({ data }) => { if (data) setItems(data) })
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.title_en) return
    setUploading(true); setMsg(null)
    let file_url = null

    if (file) {
      const fileName = `${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage.from('certificates').upload(fileName, file)
      if (uploadError) { setMsg(t('admin.error') + ': ' + uploadError.message); setUploading(false); return }
      const { data: { publicUrl } } = supabase.storage.from('certificates').getPublicUrl(fileName)
      file_url = publicUrl
    }

    const payload = { ...form, ...(file_url ? { file_url } : {}) }
    let error
    if (editId) {
      ({ error } = await supabase.from('certificates').update(payload).eq('id', editId))
    } else {
      ({ error } = await supabase.from('certificates').insert(payload))
    }
    setUploading(false)
    if (error) { setMsg(t('admin.error')); return }
    setMsg(editId ? t('admin.saved') : t('admin.added'))
    setForm(emptyForm); setEditId(null); setFile(null); load()
  }

  const startEdit = (item) => {
    setForm({ title_en: item.title_en, title_ar: item.title_ar || '', organization_en: item.organization_en || '', organization_ar: item.organization_ar || '' })
    setEditId(item.id)
  }

  const del = async (id) => {
    if (!window.confirm(t('admin.confirm'))) return
    await supabase.from('certificates').delete().eq('id', id)
    setMsg(t('admin.deleted')); load()
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">{t('admin.certificates')}</h3>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h4 className="font-semibold text-slate-600 dark:text-slate-300">{editId ? t('admin.editItem') : t('admin.addItem')}</h4>
        <div className="grid sm:grid-cols-2 gap-3">
          <input placeholder={t('admin.titleEn')} value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} className="input-field" />
          <input placeholder={t('admin.titleAr')} value={form.title_ar} onChange={e => setForm(f => ({ ...f, title_ar: e.target.value }))} className="input-field" dir="rtl" />
          <input placeholder={t('admin.orgEn')} value={form.organization_en} onChange={e => setForm(f => ({ ...f, organization_en: e.target.value }))} className="input-field" />
          <input placeholder={t('admin.orgAr')} value={form.organization_ar} onChange={e => setForm(f => ({ ...f, organization_ar: e.target.value }))} className="input-field" dir="rtl" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">{t('admin.file')}</label>
          <input type="file" accept=".pdf,image/*" onChange={e => setFile(e.target.files[0])} className="text-sm text-slate-600 dark:text-slate-300" />
        </div>
        <div className="flex gap-3">
          <button onClick={save} disabled={uploading} className="btn-primary">
            {uploading ? t('admin.loading') : editId ? t('admin.save') : t('admin.add')}
          </button>
          {editId && <button onClick={() => { setForm(emptyForm); setEditId(null); setFile(null) }} className="btn-ghost">{t('admin.cancel')}</button>}
        </div>
      </div>

      {msg && <p className="text-sm font-medium text-emerald-500">{msg}</p>}

      <div className="space-y-3">
        <AnimatePresence>
          {items.map(item => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
              className="glass rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">{item.title_en}</p>
                <p className="text-sm text-slate-400">{item.organization_en}</p>
                {item.file_url && <a href={item.file_url} target="_blank" rel="noreferrer" className="text-xs text-primary-500 hover:underline">View file →</a>}
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
