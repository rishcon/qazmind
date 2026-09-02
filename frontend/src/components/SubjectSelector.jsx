import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import api from '../utils/api'
import { useAuthStore } from '../store/authStore'
import { useLanguageStore } from '../store/languageStore'
import SubjectIcon from './SubjectIcon'

const requiredSubjects = ['История Казахстана', 'Математическая грамотность', 'Грамотность чтения']

const Icon = ({ children, className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)

function SubjectGlyph({ name }) {
  const subject = (name || '').toLowerCase()
  let paths = <><path d="M5 5.5h14v13H5z" /><path d="M8 9h8M8 13h5" /></>
  if (subject.includes('математическ')) paths = <><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h3m2 0h3M8 16h8" /></>
  else if (subject.includes('математика')) paths = <><path d="M5 18 18 5" /><path d="M6 6h12v12" /><circle cx="6" cy="18" r="1.5" /></>
  else if (subject.includes('чтения') || subject.includes('литератур')) paths = <><path d="M4 5.5C7 4.2 9.7 4.7 12 7v12c-2.3-2.3-5-2.8-8-1.5zM20 5.5C17 4.2 14.3 4.7 12 7v12c2.3-2.3 5-2.8 8-1.5z" /></>
  else if (subject.includes('физика')) paths = <><ellipse cx="12" cy="12" rx="8" ry="3.5" /><ellipse cx="12" cy="12" rx="8" ry="3.5" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="8" ry="3.5" transform="rotate(120 12 12)" /><circle cx="12" cy="12" r="1.3" fill="currentColor" /></>
  else if (subject.includes('биология')) paths = <><path d="M19 5C11 5 6 8.5 6 15c0 2.2 1.8 4 4 4 6.5 0 9-6 9-14Z" /><path d="M5 20c3.5-4.5 6.5-7 11-9" /></>
  else if (subject.includes('химия')) paths = <><path d="M9 4h6M10 4v6l-4.2 7.2A2 2 0 0 0 7.5 20h9a2 2 0 0 0 1.7-2.8L14 10V4" /><path d="M8.5 15h7" /></>
  else if (subject.includes('англий')) paths = <><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16" /></>
  else if (subject.includes('всемир')) paths = <><circle cx="12" cy="12" r="8" /><path d="M4.7 9h14.6M4.7 15h14.6M12 4c2 2.1 3 4.8 3 8s-1 5.9-3 8c-2-2.1-3-4.8-3-8s1-5.9 3-8Z" /></>
  else if (subject.includes('географ')) paths = <><path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2z" /><path d="M9 4v14M15 6v14" /></>
  else if (subject.includes('казах')) paths = <><path d="M5 5h14v10H9l-4 4z" /><path d="M9 9h6M9 12h4" /></>
  else if (subject.includes('история')) paths = <><path d="M5 5.5h14v13H5z" /><path d="M8 9h8M8 13h5" /><path d="M8 18.5h8" /></>
  return <Icon className="h-5 w-5">{paths}</Icon>
}

function SubjectOption({ subject, selected, onToggle, language, compact = false }) {
  const name = language === 'kz' ? subject.name_kz : subject.name_ru
  return (
    <button
      type="button"
      onClick={() => onToggle(subject.id)}
      className={`group flex w-full items-center gap-3 border-b border-[#dce5df] py-4 text-left transition last:border-b-0 dark:border-white/10 ${selected ? 'text-[#003f34] dark:text-white' : 'text-[#5d6763] dark:text-white/65'} ${compact ? 'md:min-h-[78px]' : ''}`}
      aria-pressed={selected}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center transition ${selected ? 'bg-[#c9f53e] text-[#003f34]' : 'bg-[#eef5f0] text-[#00715c] dark:bg-white/10 dark:text-[#c9f53e]'}`}><SubjectIcon name={subject.name_ru} /></span>
      <span className="min-w-0 flex-1"><strong className="block truncate text-sm font-semibold">{name}</strong><small className="mt-1 block text-xs text-[#7b8480] dark:text-white/45">{subject.questions_count || 0} {language === 'kz' ? 'сұрақ' : 'вопросов'}</small></span>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${selected ? 'border-[#003f34] bg-[#003f34] text-white dark:border-[#c9f53e] dark:bg-[#c9f53e] dark:text-[#003f34]' : 'border-[#b8c9c0] dark:border-white/25'}`}>
        {selected && <Icon className="h-3 w-3"><path d="m5 12 4 4L19 6" /></Icon>}
      </span>
    </button>
  )
}

export default function SubjectSelector({ isOpen, onClose, onComplete }) {
  const { language } = useLanguageStore()
  const { token } = useAuthStore()
  const reduceMotion = useReducedMotion()
  const [subjects, setSubjects] = useState([])
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const copy = language === 'kz' ? {
    eyebrow: 'Оқу бағыты', title: 'Пәндеріңді таңда', description: '3 міндетті және кемінде 2 бейінді пәнді таңда. Жоспарды саған бейімдейміз.', chosen: 'таңдалды', required: 'Міндетті пәндер', requiredNote: 'ҰБТ базасы', profile: 'Бейінді пәндер', profileNote: 'Өзіңе керек пәндерді қос', cancel: 'Бас тарту', save: 'Жоспарды сақтау', saving: 'Сақталуда...', minimum: 'Кемінде 5 пән таңдаңыз: 3 міндетті және 2 бейінді.', loadError: 'Пәндерді жүктеу мүмкін болмады. Қайталап көріңіз.', saveError: 'Өзгерістерді сақтау мүмкін болмады.', close: 'Жабу',
  } : {
    eyebrow: 'Учебный маршрут', title: 'Выберите предметы', description: 'Добавьте 3 обязательных и минимум 2 профильных предмета. Мы настроим план под вас.', chosen: 'выбрано', required: 'Обязательные предметы', requiredNote: 'База ЕНТ', profile: 'Профильные предметы', profileNote: 'Добавьте нужные вам направления', cancel: 'Отмена', save: 'Сохранить план', saving: 'Сохраняем...', minimum: 'Выберите минимум 5 предметов: 3 обязательных и 2 профильных.', loadError: 'Не удалось загрузить предметы. Попробуйте ещё раз.', saveError: 'Не удалось сохранить изменения.', close: 'Закрыть',
  }

  useEffect(() => {
    if (!isOpen || !token) return
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [subjectsResponse, profileResponse] = await Promise.all([api.get('/subjects/'), api.get('/profile/me')])
        if (!active) return
        setSubjects(subjectsResponse.data)
        setSelectedSubjects(profileResponse.data.selected_subjects || [])
      } catch (requestError) {
        if (active) setError(copy.loadError)
        console.error('Unable to load subjects:', requestError)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [isOpen, token])

  const toggleSubject = (id) => setSelectedSubjects((current) => current.includes(id) ? current.filter((subjectId) => subjectId !== id) : [...current, id])
  const isRequired = (subject) => requiredSubjects.some((name) => subject.name_ru.includes(name))
  const coreSubjects = subjects.filter(isRequired)
  const profileSubjects = subjects.filter((subject) => !isRequired(subject))
  const isComplete = selectedSubjects.length >= 5

  const handleSave = async () => {
    if (!isComplete) {
      setError(copy.minimum)
      return
    }
    setSaving(true)
    setError('')
    try {
      await api.put('/profile/me', { selected_subjects: selectedSubjects })
      onComplete()
    } catch (requestError) {
      setError(copy.saveError)
      console.error('Unable to save subjects:', requestError)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && <motion.div className="fixed inset-0 z-[60] flex items-end bg-[#003f34]/55 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose() }}>
        <motion.section className="flex max-h-[calc(100vh-12px)] w-full max-w-3xl flex-col overflow-hidden bg-[#f7faf7] shadow-2xl dark:bg-slate-950 sm:max-h-[88vh]" initial={reduceMotion ? false : { opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: 20 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} role="dialog" aria-modal="true" aria-labelledby="subjects-title">
          <header className="relative shrink-0 overflow-hidden bg-[#003f34] px-6 py-5 text-white sm:px-9 sm:py-6">
            <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-[#c9f53e]/15 blur-2xl" />
            <div className="relative flex items-start justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c9f53e]">{copy.eyebrow}</p><h2 id="subjects-title" className="mt-2 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">{copy.title}</h2><p className="mt-2 hidden max-w-xl text-sm leading-6 text-white/70 sm:block">{copy.description}</p></div><button type="button" onClick={onClose} disabled={saving} className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/20 text-white transition hover:bg-white/10 disabled:opacity-40" aria-label={copy.close}><Icon className="h-4 w-4"><path d="m6 6 12 12M18 6 6 18" /></Icon></button></div>
            <div className="relative mt-4 flex items-center gap-3"><span className="text-2xl font-semibold tracking-[-0.06em]">{selectedSubjects.length}</span><span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/65">{copy.chosen} / 5</span><div className="ml-auto h-1 w-20 overflow-hidden bg-white/20"><motion.div className="h-full bg-[#c9f53e]" animate={{ width: `${Math.min((selectedSubjects.length / 5) * 100, 100)}%` }} /></div></div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-9 sm:py-7">
            {loading ? <div className="space-y-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-16 animate-pulse bg-[#e7eee9] dark:bg-white/5" />)}</div> : <>
              <section><div className="flex items-baseline justify-between border-b border-[#b8c9c0] pb-3 dark:border-white/20"><h3 className="text-base font-semibold tracking-[-0.025em]">{copy.required}</h3><span className="text-xs text-[#5d6763] dark:text-white/50">{copy.requiredNote}</span></div><div>{coreSubjects.map((subject) => <SubjectOption key={subject.id} subject={subject} selected={selectedSubjects.includes(subject.id)} onToggle={toggleSubject} language={language} />)}</div></section>
              <section className="mt-8"><div className="flex items-baseline justify-between border-b border-[#b8c9c0] pb-3 dark:border-white/20"><h3 className="text-base font-semibold tracking-[-0.025em]">{copy.profile}</h3><span className="text-xs text-[#5d6763] dark:text-white/50">{copy.profileNote}</span></div><div className="md:grid md:grid-cols-2 md:gap-x-8">{profileSubjects.map((subject) => <SubjectOption key={subject.id} subject={subject} selected={selectedSubjects.includes(subject.id)} onToggle={toggleSubject} language={language} compact />)}</div></section>
              {error && <p role="alert" className="mt-6 border-l-2 border-[#c9f53e] bg-[#eef5f0] px-4 py-3 text-sm leading-6 text-[#003f34] dark:bg-white/10 dark:text-white">{error}</p>}
            </>}
          </div>

          <footer className="shrink-0 flex flex-col-reverse gap-3 border-t border-[#dce5df] bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-9 dark:border-white/10 dark:bg-slate-950"><button type="button" onClick={onClose} disabled={saving} className="min-h-11 px-5 text-sm font-bold text-[#5d6763] transition hover:text-[#003f34] disabled:opacity-40 dark:text-white/55 dark:hover:text-white">{copy.cancel}</button><button type="button" onClick={handleSave} disabled={!isComplete || saving || loading} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#c9f53e] px-5 text-sm font-bold text-[#003f34] transition hover:bg-[#d6ff53] disabled:cursor-not-allowed disabled:bg-[#dce5df] disabled:text-[#7b8480]">{saving ? copy.saving : copy.save}<Icon className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6" /></Icon></button></footer>
        </motion.section>
      </motion.div>}
    </AnimatePresence>
  )
}
