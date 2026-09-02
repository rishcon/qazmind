import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguageStore } from '../store/languageStore'
import { useThemeStore } from '../store/themeStore'
import SubjectIcon from '../components/SubjectIcon'
import api from '../utils/api'
import { playSound, vibrate } from '../utils/sounds'

function Icon({ children, className = 'h-5 w-5' }) { return <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">{children}</svg> }

export default function Flashcards() {
  const { language } = useLanguageStore()
  const { theme } = useThemeStore()
  const [subjects, setSubjects] = useState([])
  const [selected, setSelected] = useState(null)
  const [cards, setCards] = useState([])
  const [position, setPosition] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ today: 0, total: 0, mastered: 0 })
  const [reviewed, setReviewed] = useState(0)
  const ru = language === 'ru'
  const c = ru ? { eyebrow: 'УМНОЕ ПОВТОРЕНИЕ', title: 'Флеш‑карточки', subtitle: 'Повторяйте короткими сессиями — алгоритм вернёт материал в нужный момент.', choose: 'Выберите предмет', hint: 'Начните короткую сессию повторения', today: 'сегодня', total: 'всего', mastered: 'освоено', cards: 'карточек', all: 'Все', new: 'Новые', learning: 'В изучении', review: 'Повторение', load: 'Загружаем карточки…', done: 'Сессия завершена', doneText: 'Все карточки из этой подборки просмотрены.', back: 'К предметам', flip: 'Нажмите, чтобы увидеть ответ', learn: 'Учить', know: 'Знаю', progress: 'Прогресс', no: 'Карточек пока нет' } : { eyebrow: 'АҚЫЛДЫ ҚАЙТАЛАУ', title: 'Флеш‑карталар', subtitle: 'Қысқа сессиялармен қайталаңыз — алгоритм материалды керек сәтте қайта ұсынады.', choose: 'Пәнді таңдаңыз', hint: 'Қысқа қайталау сессиясын бастаңыз', today: 'бүгін', total: 'барлығы', mastered: 'меңгерілді', cards: 'карточка', all: 'Барлығы', new: 'Жаңа', learning: 'Оқуда', review: 'Қайталау', load: 'Карточкалар жүктелуде…', done: 'Сессия аяқталды', doneText: 'Осы жинақтағы барлық карточка қаралды.', back: 'Пәндерге', flip: 'Жауапты көру үшін басыңыз', learn: 'Үйренемін', know: 'Білемін', progress: 'Прогресс', no: 'Карточкалар әзір жоқ' }
  const shell = theme === 'dark' ? 'min-h-screen bg-slate-950 text-white' : 'min-h-screen bg-[#f7faf7] text-[#003f34]'
  const card = cards[position]

  useEffect(() => {
    api.get('/flashcards/subjects').then((r) => setSubjects(r.data)).catch((e) => console.error(e))
    api.get('/flashcards/stats').then((r) => setStats(r.data)).catch((e) => console.error(e))
  }, [])
  const start = async (subject, nextFilter = filter) => {
    setLoading(true); setSelected(subject)
    try { const r = await api.get('/flashcards/due/' + subject.id, { params: { language, filter_type: nextFilter } }); setCards(r.data); setPosition(0); setReviewed(0); setFlipped(false) }
    catch (e) { console.error(e); setCards([]) } finally { setLoading(false) }
  }
  const changeFilter = (value) => { setFilter(value); if (selected) start(selected, value) }
  const reviewCard = async (known) => {
    if (!card || !flipped) return
    try {
      await api.post('/flashcards/review', { card_id: card.id, quality: known ? 4 : 1 })
      playSound(known ? 'success' : 'learning'); vibrate(known ? [100, 50, 100] : [100]); setReviewed((v) => v + 1)
      if (position < cards.length - 1) { setPosition((v) => v + 1); setFlipped(false) } else { setCards([]); api.get('/flashcards/stats').then((r) => setStats(r.data)) }
    } catch (e) { console.error(e) }
  }

  if (!selected) return <div className={shell}>
    <section className="overflow-hidden border-b border-[#dce5df] bg-[#003f34] text-white dark:border-white/10"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#c9f53e]">{c.eyebrow}</p><h1 className="mt-4 text-4xl font-semibold tracking-[-.06em] sm:text-6xl">{c.title}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-white/65">{c.subtitle}</p></div><motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative min-h-44 border border-white/15 bg-white/[.06] p-5"><div className="absolute -right-5 -top-5 h-24 w-24 border border-[#c9f53e]/60" /><p className="relative text-[10px] font-bold uppercase tracking-[.18em] text-[#c9f53e]">{c.progress}</p><div className="relative mt-6 flex items-end gap-2">{["bg-white/25", "bg-white/45", "bg-[#c9f53e]"].map((tone, index) => <motion.span key={tone} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: .15 + index * .12 }} className={`block w-9 origin-bottom ${tone}`} style={{ height: `${48 + index * 28}px` }} />)}</div><p className="relative mt-4 text-sm text-white/65">{stats.today} {c.cards} {c.today}</p></motion.div></div></section>
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10"><div className="grid grid-cols-3 border-y border-[#dce5df] dark:border-white/10">{[[stats.today,c.today],[stats.total,c.total],[stats.mastered,c.mastered]].map(([value,label], i) => <div key={label} className={i ? 'border-l border-[#dce5df] py-5 pl-5 dark:border-white/10' : 'py-5'}><strong className="block text-3xl tracking-[-.05em]">{value}</strong><span className="text-xs text-[#7b8480] dark:text-white/50">{label}</span></div>)}</div>
    <div className="mt-10 flex items-end justify-between border-b border-[#b8c9c0] pb-4 dark:border-white/20"><h2 className="text-2xl font-semibold tracking-[-.05em]">{c.choose}</h2><p className="hidden text-sm text-[#5d6763] sm:block dark:text-white/55">{c.hint}</p></div>
    <div className="divide-y divide-[#dce5df] dark:divide-white/10">{subjects.map((subject, i) => <motion.button key={subject.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * .03, .2) }} onClick={() => start(subject)} className="group flex w-full items-center gap-4 py-5 text-left transition hover:px-3 hover:bg-[#eef5f0] dark:hover:bg-white/[.04]"><span className="flex h-11 w-11 items-center justify-center bg-[#eef5f0] text-[#00715c] dark:bg-white/10 dark:text-[#c9f53e]"><SubjectIcon name={subject.name_ru} /></span><span className="min-w-0 flex-1"><strong className="block text-base font-semibold">{ru ? subject.name_ru : subject.name_kz}</strong><small className="mt-1 block text-xs text-[#7b8480] dark:text-white/45">{subject.flashcards_count || 0} {c.cards}</small></span><Icon className="h-5 w-5 text-[#7b8480] group-hover:translate-x-1"><path d="M5 12h14m-6-6 6 6-6 6" /></Icon></motion.button>)}</div></div></div>

  if (loading) return <div className={shell + ' flex min-h-[65vh] items-center justify-center'}><div className="text-center"><span className="mx-auto mb-4 block h-8 w-8 animate-spin border-2 border-current border-t-transparent" /><p className="text-sm font-semibold">{c.load}</p></div></div>
  if (!card) return <div className={shell + ' flex min-h-[65vh] items-center justify-center px-5'}><div className="max-w-md text-center"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#7b8480] dark:text-white/45">{c.eyebrow}</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.06em]">{cards.length === 0 && reviewed === 0 ? c.no : c.done}</h1><p className="mt-4 text-[#5d6763] dark:text-white/60">{c.doneText}</p><button onClick={() => setSelected(null)} className="mt-7 bg-[#003f34] px-5 py-3 text-sm font-bold text-white dark:bg-[#c9f53e] dark:text-[#003f34]">{c.back}</button></div></div>

  const percent = Math.round((reviewed / cards.length) * 100)
  return <div className={shell}><div className="mx-auto max-w-4xl px-5 py-7 sm:px-8 sm:py-10"><header className="flex items-center justify-between border-b border-[#dce5df] pb-5 dark:border-white/10"><button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-sm font-bold text-[#00715c] dark:text-[#c9f53e]"><Icon className="h-4 w-4"><path d="m14 6-6 6 6 6" /></Icon>{c.back}</button><strong className="text-sm">{position + 1} / {cards.length}</strong></header>
  <div className="mt-6"><div className="flex justify-between text-[10px] font-bold uppercase tracking-[.16em] text-[#7b8480] dark:text-white/45"><span>{c.progress}</span><span>{percent}%</span></div><div className="mt-2 h-1 bg-[#dce5df] dark:bg-white/15"><motion.div className="h-full bg-[#c9f53e]" animate={{ width: percent + '%' }} /></div></div>
  {position === 0 && reviewed === 0 && <div className="mt-6 flex flex-wrap gap-2">{[['all',c.all],['new',c.new],['learning',c.learning],['review',c.review]].map(([value,label]) => <button key={value} onClick={() => changeFilter(value)} className={filter === value ? 'bg-[#003f34] px-3 py-2 text-xs font-bold text-white dark:bg-[#c9f53e] dark:text-[#003f34]' : 'border border-[#dce5df] px-3 py-2 text-xs font-bold dark:border-white/15'}>{label}</button>)}</div>}
  <div className="mx-auto mt-8 max-w-2xl"><AnimatePresence mode="wait"><motion.div key={card.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}><button onClick={() => { if (!flipped) { setFlipped(true); playSound('flip') } }} className="relative h-[410px] w-full cursor-pointer [perspective:1200px] sm:h-[460px]"><motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: 'spring', stiffness: 180, damping: 19 }} className="relative h-full w-full [transform-style:preserve-3d]"><div className="absolute inset-0 flex flex-col items-center justify-center border border-[#b8c9c0] bg-white p-8 text-center [backface-visibility:hidden] dark:border-white/15 dark:bg-slate-900"><span className="flex h-12 w-12 items-center justify-center bg-[#eef5f0] text-[#00715c] dark:bg-white/10 dark:text-[#c9f53e]"><SubjectIcon name={selected.name_ru} /></span><p className="mt-8 text-2xl font-semibold leading-tight tracking-[-.04em] sm:text-3xl">{card.front}</p><p className="mt-7 text-xs text-[#7b8480] dark:text-white/45">{c.flip}</p></div><div className="absolute inset-0 flex flex-col items-center justify-center bg-[#003f34] p-8 text-center text-white [backface-visibility:hidden] [transform:rotateY(180deg)]"><p className="text-2xl font-semibold leading-tight tracking-[-.04em] sm:text-3xl">{card.back}</p>{card.hint && <p className="mt-7 max-w-lg border-l-2 border-[#c9f53e] pl-4 text-left text-sm leading-6 text-white/65">{card.hint}</p>}</div></motion.div></button></motion.div></AnimatePresence></div>
  {flipped ? <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-6 flex max-w-2xl gap-3"><button onClick={() => reviewCard(false)} className="flex-1 border border-[#b8c9c0] py-4 text-sm font-bold text-[#5d6763] hover:border-[#aa3934] hover:text-[#aa3934] dark:border-white/20 dark:text-white/70">{c.learn}</button><button onClick={() => reviewCard(true)} className="flex-1 bg-[#c9f53e] py-4 text-sm font-bold text-[#003f34] hover:bg-[#d8ff58]">{c.know}</button></motion.div> : <p className="mt-6 text-center text-xs font-semibold text-[#7b8480] dark:text-white/45">← {c.learn} &nbsp;&nbsp; · &nbsp;&nbsp; {c.know} →</p>}
  </div></div>
}
