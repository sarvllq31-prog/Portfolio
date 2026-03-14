import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    nav: {
      home: 'Home', about: 'About', skills: 'Skills',
      certificates: 'Certificates', projects: 'Projects',
      education: 'Education', contact: 'Contact', admin: 'Admin'
    },
    hero: {
      welcome: 'Welcome to my Portfolio',
      subtitle: 'Software Engineering student passionate about AI and Data Analysis',
      viewProjects: 'View Projects',
      contactMe: 'Contact Me',
    },
    about: { title: 'About Me', interestedIn: 'Interested In' },
    skills: { title: 'Skills', technical: 'Technical Skills', soft: 'Soft Skills' },
    certificates: { title: 'Certificates', clickToView: 'Click to view certificate' },
    projects: {
      title: 'Projects', viewGithub: 'View on GitHub',
      viewDemo: 'Live Demo', tools: 'Tools Used',
    },
    education: { title: 'Education' },
    contact: {
      title: 'Get In Touch',
      subtitle: 'Feel free to reach out anytime',
    },
    admin: {
      login: 'Admin Login',
      loginSub: 'Sign in to manage your portfolio',
      email: 'Email', password: 'Password',
      signIn: 'Sign In', signOut: 'Sign Out',
      loginError: 'Invalid credentials. Please try again.',
      dashboard: 'Dashboard',
      about: 'About', interests: 'Interests', skills: 'Skills',
      certificates: 'Certificates', projects: 'Projects',
      education: 'Education', contact: 'Contact',
      add: 'Add', save: 'Save', edit: 'Edit', delete: 'Delete',
      cancel: 'Cancel', confirm: 'Are you sure?',
      saved: 'Saved successfully!', added: 'Added successfully!',
      deleted: 'Deleted successfully!', error: 'An error occurred.',
      nameEn: 'Name (English)', nameAr: 'Name (Arabic)',
      titleEn: 'Title (English)', titleAr: 'Title (Arabic)',
      orgEn: 'Organization (English)', orgAr: 'Organization (Arabic)',
      degreeEn: 'Degree (English)', degreeAr: 'Degree (Arabic)',
      descEn: 'Description (English)', descAr: 'Description (Arabic)',
      shortDescEn: 'Short Description (English)', shortDescAr: 'Short Description (Arabic)',
      fullDescEn: 'Full Description (English)', fullDescAr: 'Full Description (Arabic)',
      aboutEn: 'About Text (English)', aboutAr: 'About Text (Arabic)',
      percentage: 'Percentage (%)', type: 'Type',
      technical: 'Technical', soft: 'Soft',
      icon: 'Icon (emoji)', file: 'File (PDF or Image)',
      images: 'Images', github: 'GitHub Link', demo: 'Demo Link',
      tools: 'Tools (comma separated)',
      startDate: 'Start Date', endDate: 'End Date',
      phone: 'Phone', linkedin: 'LinkedIn URL',
      emailField: 'Email Address',
      uploadFile: 'Upload File', loading: 'Loading...',
      editItem: 'Edit Item', addItem: 'Add New Item',
      backToPortfolio: '← Back to Portfolio',
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية', about: 'نبذة', skills: 'المهارات',
      certificates: 'الشهادات', projects: 'المشاريع',
      education: 'التعليم', contact: 'تواصل', admin: 'لوحة التحكم'
    },
    hero: {
      welcome: 'مرحباً بك في معرض أعمالي',
      subtitle: 'طالبة هندسة برمجيات شغوفة بالذكاء الاصطناعي وتحليل البيانات',
      viewProjects: 'عرض المشاريع',
      contactMe: 'تواصل معي',
    },
    about: { title: 'نبذة عني', interestedIn: 'مهتمة بـ' },
    skills: { title: 'المهارات', technical: 'المهارات التقنية', soft: 'المهارات الشخصية' },
    certificates: { title: 'الشهادات', clickToView: 'اضغط لعرض الشهادة' },
    projects: {
      title: 'المشاريع', viewGithub: 'عرض في GitHub',
      viewDemo: 'عرض مباشر', tools: 'الأدوات المستخدمة',
    },
    education: { title: 'التعليم' },
    contact: {
      title: 'تواصل معي',
      subtitle: 'لا تترددي في التواصل في أي وقت',
    },
    admin: {
      login: 'دخول المشرف',
      loginSub: 'سجّلي الدخول لإدارة محتوى البورتفوليو',
      email: 'البريد الإلكتروني', password: 'كلمة المرور',
      signIn: 'دخول', signOut: 'تسجيل خروج',
      loginError: 'بيانات الدخول غير صحيحة. حاولي مرة أخرى.',
      dashboard: 'لوحة التحكم',
      about: 'نبذة', interests: 'الاهتمامات', skills: 'المهارات',
      certificates: 'الشهادات', projects: 'المشاريع',
      education: 'التعليم', contact: 'التواصل',
      add: 'إضافة', save: 'حفظ', edit: 'تعديل', delete: 'حذف',
      cancel: 'إلغاء', confirm: 'هل أنتِ متأكدة؟',
      saved: 'تم الحفظ بنجاح!', added: 'تمت الإضافة بنجاح!',
      deleted: 'تم الحذف بنجاح!', error: 'حدث خطأ.',
      nameEn: 'الاسم (إنجليزي)', nameAr: 'الاسم (عربي)',
      titleEn: 'العنوان (إنجليزي)', titleAr: 'العنوان (عربي)',
      orgEn: 'المؤسسة (إنجليزي)', orgAr: 'المؤسسة (عربي)',
      degreeEn: 'الدرجة العلمية (إنجليزي)', degreeAr: 'الدرجة العلمية (عربي)',
      descEn: 'الوصف (إنجليزي)', descAr: 'الوصف (عربي)',
      shortDescEn: 'وصف قصير (إنجليزي)', shortDescAr: 'وصف قصير (عربي)',
      fullDescEn: 'وصف كامل (إنجليزي)', fullDescAr: 'وصف كامل (عربي)',
      aboutEn: 'نص النبذة (إنجليزي)', aboutAr: 'نص النبذة (عربي)',
      percentage: 'النسبة (%)', type: 'النوع',
      technical: 'تقنية', soft: 'شخصية',
      icon: 'أيقونة (إيموجي)', file: 'ملف (PDF أو صورة)',
      images: 'الصور', github: 'رابط GitHub', demo: 'رابط العرض',
      tools: 'الأدوات (مفصولة بفاصلة)',
      startDate: 'تاريخ البداية', endDate: 'تاريخ النهاية',
      phone: 'رقم الجوال', linkedin: 'رابط LinkedIn',
      emailField: 'البريد الإلكتروني',
      uploadFile: 'رفع ملف', loading: 'جاري التحميل...',
      editItem: 'تعديل العنصر', addItem: 'إضافة عنصر جديد',
      backToPortfolio: '→ العودة للبورتفوليو',
    }
  }
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.body.style.fontFamily = lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"
  }, [lang])

  const t = (path) => {
    const keys = path.split('.')
    let val = translations[lang]
    for (const k of keys) val = val?.[k]
    return val || path
  }

  const toggleLang = () => setLang(l => l === 'en' ? 'ar' : 'en')

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isRTL: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
