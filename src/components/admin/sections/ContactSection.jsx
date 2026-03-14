import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useLang } from '../../../contexts/LanguageContext'

export default function ContactSection() {
  const { t } = useLang()
  const [form, setForm] = useState({ email: '', phone: '', github_url: '', linkedin_url: '' })
  const [recordId, setRecordId] = useState(null)
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('contact').select('*').single().then(({ data }) => {
      if (data) {
        setForm({ email: data.email || '', phone: data.phone || '', github_url: data.github_url || '', linkedin_url: data.linkedin_url || '' })
        setRecordId(data.id)
      }
    })
  }, [])

  const f = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const save = async () => {
    setLoading(true); setMsg(null)
    let error
    if (recordId) {
      ({ error } = await supabase.from('contact').update(form).eq('id', recordId))
    } else {
      const res = await supabase.from('contact').insert(form).select().single()
      error = res.error; if (res.data) setRecordId(res.data.id)
    }
    setLoading(false)
    setMsg(error ? t('admin.error') : t('admin.saved'))
  }

  const fields = [
    { key: 'email', label: t('admin.emailField'), type: 'email', placeholder: 'email@example.com' },
    { key: 'phone', label: t('admin.phone'), type: 'text', placeholder: '+966 5x xxx xxxx' },
    { key: 'github_url', label: t('admin.github'), type: 'url', placeholder: 'https://github.com/...' },
    { key: 'linkedin_url', label: t('admin.linkedin'), type: 'url', placeholder: 'https://linkedin.com/in/...' },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">{t('admin.contact')}</h3>
      <div className="glass rounded-2xl p-5 space-y-4">
        {fields.map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">{label}</label>
            <input type={type} placeholder={placeholder} value={form[key]} onChange={f(key)} className="input-field" />
          </div>
        ))}
        <button onClick={save} disabled={loading} className="btn-primary">
          {loading ? t('admin.loading') : t('admin.save')}
        </button>
        {msg && <p className={`text-sm font-medium ${msg === t('admin.saved') ? 'text-emerald-500' : 'text-red-500'}`}>{msg}</p>}
      </div>
    </div>
  )
}
