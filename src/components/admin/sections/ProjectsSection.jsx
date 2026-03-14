import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useLang } from '../../../contexts/LanguageContext'

const emptyForm = { title_en: '', title_ar: '', short_desc_en: '', short_desc_ar: '', full_desc_en: '', full_desc_ar: '', tools: '', github_url: '', demo_url: '' }

export default function ProjectsSection() {
  const { t } = useLang()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [images, setImages] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [expanded, setExpanded] = useState(null)

  const load = () => supabase.from('projects').select('*').order('display_order').then(({ data }) => { if (data) setItems(data) })
  useEffect(() => { load() }, [])

  const f = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const save = async () => {
    if (!form.title_en) return
    setUploading(true); setMsg(null)
    let imageUrls = []

    if (images && images.length > 0) {
      for (const file of Array.from(images)) {
        const fileName = `${Date.now()}_${file.name}`
        const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, file)
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(fileName)
          imageUrls.push(publicUrl)
        }
      }
    }

    const toolsArr = form.tools ? form.tools.split(',').map(t => t.trim()).filter(Boolean) : []
    const payload = {
      title_en: form.title_en, title_ar: form.title_ar,
      short_desc_en: form.short_desc_en, short_desc_ar: form.short_desc_ar,
      full_desc_en: form.full_desc_en, full_desc_ar: form.full_desc_ar,
      tools: toolsArr, github_url: form.github_url, demo_url: form.demo_url,
      ...(imageUrls.length > 0 ? { image_urls: imageUrls } : {})
    }

    let error
    if (editId) {
      ({ error } = await supabase.from('projects').update(payload).eq('id', editId))
    } else {
      ({ error } = await supabase.from('projects').insert(payload))
    }
    setUploading(false)
    if (error) { setMsg(t('admin.error')); return }
    setMsg(editId ? t('admin.saved') : t('admin.added'))
    setForm(emptyForm); setEditId(null); setImages(null); load()
  }

  const startEdit = (item) => {
    setForm({
      title_en: item.title_en, title_ar: item.title_ar || '',
      short_desc_en: item.short_desc_en || '', short_desc_ar: item.short_desc_ar || '',
      full_desc_en: item.full_desc_en || '', full_desc_ar: item.full_desc_ar || '',
      tools: Array.isArray(item.tools) ? item.tools.join(', ') : '',
      github_url: item.github_url || '', demo_url: item.demo_url || '',
    })
    setEditId(item.id); setExpanded('form')
  }

  const del = async (id) => {
    if (!window.confirm(t('admin.confirm'))) return
    await supabase.from('projects').delete().eq('id', id)
    setMsg(t('admin.deleted')); load()
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">{t('admin.projects')}</h3>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h4 className="font-semibold text-slate-600 dark:text-slate-300">{editId ? t('admin.editItem') : t('admin.addItem')}</h4>
        <div className="grid sm:grid-cols-2 gap-3">
          <input placeholder={t('admin.titleEn')} value={form.title_en} onChange={f('title_en')} className="input-field" />
          <input placeholder={t('admin.titleAr')} value={form.title_ar} onChange={f('title_ar')} className="input-field" dir="rtl" />
          <input placeholder={t('admin.shortDescEn')} value={form.short_desc_en} onChange={f('short_desc_en')} className="input-field" />
          <input placeholder={t('admin.shortDescAr')} value={form.short_desc_ar} onChange={f('short_desc_ar')} className="input-field" dir="rtl" />
        </div>
        <textarea placeholder={t('admin.fullDescEn')} value={form.full_desc_en} onChange={f('full_desc_en')} rows={3} className="input-field resize-none" />
        <textarea placeholder={t('admin.fullDescAr')} value={form.full_desc_ar} onChange={f('full_desc_ar')} rows={3} className="input-field resize-none" dir="rtl" />
        <div className="grid sm:grid-cols-2 gap-3">
          <input placeholder={t('admin.tools')} value={form.tools} onChange={f('tools')} className="input-field" />
          <input placeholder={t('admin.github')} value={form.github_url} onChange={f('github_url')} className="input-field" />
          <input placeholder={t('admin.demo')} value={form.demo_url} onChange={f('demo_url')} className="input-field" />
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">{t('admin.images')}</label>
            <input type="file" accept="image/*" multiple onChange={e => setImages(e.target.files)} className="text-sm text-slate-600 dark:text-slate-300" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={save} disabled={uploading} className="btn-primary">
            {uploading ? t('admin.loading') : editId ? t('admin.save') : t('admin.add')}
          </button>
          {editId && <button onClick={() => { setForm(emptyForm); setEditId(null) }} className="btn-ghost">{t('admin.cancel')}</button>}
        </div>
      </div>

      {msg && <p className="text-sm font-medium text-emerald-500">{msg}</p>}

      <div className="space-y-3">
        <AnimatePresence>
          {items.map(item => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
              className="glass rounded-xl overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {Array.isArray(item.image_urls) && item.image_urls[0] && (
                    <img src={item.image_urls[0]} alt={item.title_en} className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">{item.title_en}</p>
                    <p className="text-sm text-slate-400 line-clamp-1">{item.short_desc_en}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(item)} className="text-primary-500 hover:text-primary-700 text-sm font-medium px-3 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">{t('admin.edit')}</button>
                  <button onClick={() => del(item.id)} className="text-red-400 hover:text-red-600 text-sm font-medium px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">{t('admin.delete')}</button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
