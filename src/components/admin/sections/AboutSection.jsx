import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useLang } from '../../../contexts/LanguageContext'

export default function AboutSection() {
  const { t } = useLang()
  const [textEn, setTextEn] = useState('')
  const [textAr, setTextAr] = useState('')
  const [recordId, setRecordId] = useState(null)
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('about').select('*').single().then(({ data }) => {
      if (data) { setTextEn(data.text_en || ''); setTextAr(data.text_ar || ''); setRecordId(data.id) }
    })
  }, [])

  const save = async () => {
    setLoading(true); setMsg(null)
    let err
    if (recordId) {
      ({ error: err } = await supabase.from('about').update({ text_en: textEn, text_ar: textAr }).eq('id', recordId))
    } else {
      const res = await supabase.from('about').insert({ text_en: textEn, text_ar: textAr }).select().single()
      err = res.error; if (res.data) setRecordId(res.data.id)
    }
    setMsg(err ? t('admin.error') : t('admin.saved'))
    setLoading(false)
  }

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">{t('admin.about')}</h3>
      <div>
        <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">{t('admin.aboutEn')}</label>
        <textarea value={textEn} onChange={e => setTextEn(e.target.value)} rows={5} className="input-field resize-none" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">{t('admin.aboutAr')}</label>
        <textarea value={textAr} onChange={e => setTextAr(e.target.value)} rows={5} className="input-field resize-none" dir="rtl" />
      </div>
      <button onClick={save} disabled={loading} className="btn-primary">{loading ? t('admin.loading') : t('admin.save')}</button>
      {msg && <p className={`text-sm font-medium ${msg.includes('✅') || msg === t('admin.saved') ? 'text-emerald-500' : 'text-red-500'}`}>{msg}</p>}
    </div>
  )
}
