import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useLanguageStore } from '../store/languageStore'
import api from '../utils/api'

function LandingIcon({ name, className = 'h-6 w-6', strokeWidth = 2 }) {
  const icons = {
    arrow: <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />,
    atom: (
      <>
        <circle cx="12" cy="12" r="1.8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.2 5.8c2.2 2.2 2.8 5.2 1.3 6.7s-4.5.9-6.7-1.3-2.8-5.2-1.3-6.7 4.5-.9 6.7 1.3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.2 18.2c-2.2 2.2-5.2 2.8-6.7 1.3s-.9-4.5 1.3-6.7 5.2-2.8 6.7-1.3.9 4.5-1.3 6.7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.8 18.2c-2.2-2.2-2.8-5.2-1.3-6.7s4.5-.9 6.7 1.3 2.8 5.2 1.3 6.7-4.5.9-6.7-1.3z" />
      </>
    ),
    bolt: <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 2.5L6.2 13.2h4.4L9.2 21.5l8-11.2h-4.5l.8-7.8z" />,
    book: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.2A8.5 8.5 0 006 4c-1.1 0-2.1.2-3 .6v14A8.8 8.8 0 016 18c2.3 0 4.4.9 6 2.3m0-14.1A8.5 8.5 0 0118 4c1.1 0 2.1.2 3 .6v14a8.8 8.8 0 00-3-.6c-2.3 0-4.4.9-6 2.3m0-14.1v14.1" />
    ),
    bot: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4h6M12 4v3m-6 3h12a2.2 2.2 0 012.2 2.2v4.6A2.2 2.2 0 0118 19H6a2.2 2.2 0 01-2.2-2.2v-4.6A2.2 2.2 0 016 10z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14h.01M15 14h.01M8 19v1.5M16 19v1.5" />
      </>
    ),
    calculator: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M12 6v6M8.2 15h.01M12 15h.01M15.8 15h.01" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
      </>
    ),
    cards: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7.5h9.3a2 2 0 012 2V18a2 2 0 01-2 2H8a2 2 0 01-2-2V9.5a2 2 0 012-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7.5V6a2 2 0 00-2-2H5.8a2 2 0 00-2 2v8.2a2 2 0 002 2H6" />
      </>
    ),
    chart: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15V9.7M12 15V6.8M16.5 15v-3.8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15" />
      </>
    ),
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.8l4.3 4.3L19.5 6.8" />,
    flask: <path strokeLinecap="round" strokeLinejoin="round" d="M9.8 3v4.6l-4.7 8.3A2.2 2.2 0 007 19.5h10a2.2 2.2 0 001.9-3.6l-4.7-8.3V3M9 3h6" />,
    headphones: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0115 0v5.2a2.2 2.2 0 01-2.2 2.3h-.8v-6h.8a2.2 2.2 0 012.2 2.2M4.5 15.7a2.2 2.2 0 012.2-2.2h.8v6h-.8a2.2 2.2 0 01-2.2-2.3v-1.5z" />
      </>
    ),
    history: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.2M15.8 21v-8.2M8.2 21v-8.2M3 9l9-6 9 6m-1.5 12V10.4A45.2 45.2 0 0012 9.8c-2.6 0-5.1.2-7.5.6V21M3 21h18" />,
    mic: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5V12a7.5 7.5 0 01-15 0v-1.5M12 19.5v2.2M8.2 21.8h7.6" />
      </>
    ),
    play: <path strokeLinecap="round" strokeLinejoin="round" d="M8 6.8v10.4l8.8-5.2L8 6.8z" />,
    rocket: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.6 14.4a6 6 0 00-8.5-8.5l-4.3 4.3a2 2 0 000 2.8L7 17.3a2 2 0 002.8 0l4.4-4.3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 15.5l-1 4 4-1M14 10h.01" />
      </>
    ),
    shield: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5l7 3v5.2c0 4.3-2.9 7.7-7 8.8-4.1-1.1-7-4.5-7-8.8V6.5l7-3z" />,
    sparkles: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 4l.6 1.4L21 6l-1.4.6L19 8l-.6-1.4L17 6l1.4-.6L19 4zM5 16l.9 2.1L8 19l-2.1.9L5 22l-.9-2.1L2 19l2.1-.9L5 16z" />
      </>
    ),
    target: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.8a8.2 8.2 0 108.2 8.2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.8 8.2h4.5V3.8m0 0L13.5 10.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.2a3.8 3.8 0 103.8 3.8" />
      </>
    ),
    trophy: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.2 4.5h7.6v2.2a3.8 3.8 0 01-7.6 0V4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.8H4.5A1.5 1.5 0 003 8.2V9a3.8 3.8 0 003.8 3.8M18 6.8h1.5A1.5 1.5 0 0121 8.2V9a3.8 3.8 0 01-3.8 3.8M12 10.5V15M9 21h6" />
      </>
    ),
  }

  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

function getSubjectVisual(subject) {
  const name = `${subject?.name_ru || ''} ${subject?.name_kz || ''}`.toLowerCase()
  if (name.includes('история') || name.includes('тарих')) return { icon: 'history', accent: 'from-rose-500 to-fuchsia-600', glow: 'shadow-rose-500/20' }
  if (name.includes('математ')) return { icon: 'calculator', accent: 'from-sky-400 to-violet-600', glow: 'shadow-sky-500/20' }
  if (name.includes('грамот') || name.includes('оқу')) return { icon: 'book', accent: 'from-emerald-400 to-blue-600', glow: 'shadow-emerald-500/20' }
  if (name.includes('физик')) return { icon: 'atom', accent: 'from-fuchsia-500 to-purple-700', glow: 'shadow-fuchsia-500/20' }
  if (name.includes('биолог')) return { icon: 'sparkles', accent: 'from-emerald-500 to-cyan-600', glow: 'shadow-emerald-500/20' }
  if (name.includes('хими')) return { icon: 'flask', accent: 'from-cyan-400 to-indigo-600', glow: 'shadow-cyan-500/20' }
  return { icon: 'book', accent: 'from-violet-500 to-pink-600', glow: 'shadow-violet-500/20' }
}

function Badge({ icon = 'sparkles', children, tone = 'cyan' }) {
  const tones = {
    cyan: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200',
    pink: 'border-pink-300/20 bg-pink-400/10 text-pink-200',
    violet: 'border-violet-300/20 bg-violet-400/10 text-violet-100',
    orange: 'border-orange-300/20 bg-orange-400/10 text-orange-200',
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${tones[tone]}`}>
      <LandingIcon name={icon} className="h-4 w-4" />
      {children}
    </div>
  )
}

function OrbitalBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="landing-orbit absolute -left-24 top-24 h-64 w-64 rounded-full border border-fuchsia-400/30"></div>
      <div className="landing-orbit landing-orbit-slow absolute -right-28 top-32 h-80 w-80 rounded-full border border-violet-400/30"></div>
      <div className="absolute left-[7%] top-[20%] h-28 w-28 rounded-full bg-fuchsia-500/30 blur-3xl"></div>
      <div className="absolute right-[8%] top-[10%] h-40 w-40 rounded-full bg-violet-500/25 blur-3xl"></div>
      <div className="absolute bottom-[12%] left-[18%] h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl"></div>
      <div className="absolute left-[3%] top-[46%] h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.9)]"></div>
      <div className="absolute right-[18%] top-[31%] h-1.5 w-1.5 rounded-full bg-fuchsia-200 shadow-[0_0_18px_rgba(232,121,249,0.9)]"></div>
      <div className="absolute right-[9%] bottom-[19%] h-2 w-2 rounded-full bg-violet-200 shadow-[0_0_18px_rgba(196,181,253,0.9)]"></div>
    </div>
  )
}

function HeroPanel({ language }) {
  return (
    <div className="relative mx-auto max-w-xl lg:ml-auto">
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-cyan-400/20 via-violet-500/20 to-pink-500/25 blur-3xl"></div>
      <div className="landing-float relative rotate-0 rounded-[2rem] border border-white/20 bg-white/[0.07] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:rotate-[-3deg]">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent"></div>
        <div className="flex items-start justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200/70">QazMind System</p>
            <h3 className="mt-2 text-2xl font-black text-white [letter-spacing:0]">
              {language === 'kz' ? 'AI дайындық панелі' : 'AI панель подготовки'}
            </h3>
          </div>
          <div className="rounded-2xl border border-violet-300/20 bg-violet-400/10 px-5 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-100/60">{language === 'kz' ? 'Өсу' : 'Рост'}</p>
            <p className="text-2xl font-black text-white">+28%</p>
          </div>
        </div>

        <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/[0.14] to-white/[0.06] p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-200">
                <LandingIcon name="book" className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">{language === 'kz' ? 'Ағымдағы сценарий' : 'Текущий сценарий'}</p>
                <p className="text-xl font-black text-white">{language === 'kz' ? 'Сынақ №1' : 'Тест №1'}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/90 px-4 py-2 text-sm font-black text-slate-950">
              <LandingIcon name="check" className="h-4 w-4" />
              {language === 'kz' ? 'Өте жақсы' : 'Отлично'}
            </span>
          </div>
          <div className="mt-5 flex items-center justify-between text-sm font-semibold text-white/70">
            <span>{language === 'kz' ? 'Прогресс' : 'Прогресс'}</span>
            <span className="text-cyan-200">80%</span>
          </div>
          <div className="mt-2 h-3 rounded-full bg-white/10">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-pink-400 shadow-[0_0_18px_rgba(217,70,239,0.45)]"></div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            ['book', '28', language === 'kz' ? 'сабақ' : 'уроков', 'cyan'],
            ['target', '156', language === 'kz' ? 'ұпай' : 'очков', 'violet'],
            ['chart', '85%', language === 'kz' ? 'орташа' : 'средний', 'pink'],
          ].map(([icon, value, label, tone]) => (
            <div key={value} className={`rounded-[1.4rem] border border-${tone === 'cyan' ? 'cyan' : tone === 'violet' ? 'violet' : 'pink'}-300/20 bg-white/[0.05] p-4`}>
              <LandingIcon name={icon} className="h-7 w-7 text-cyan-200" />
              <p className="mt-4 text-2xl font-black text-white">{value}</p>
              <p className="text-sm text-white/50">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-violet-600 shadow-[0_0_32px_rgba(34,211,238,0.3)]">
              <div className="h-10 w-10 rounded-full bg-slate-950">
                <div className="mx-auto mt-3 flex w-6 justify-between">
                  <span className="h-2 w-2 rounded-full bg-cyan-200"></span>
                  <span className="h-2 w-2 rounded-full bg-cyan-200"></span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">AI-ментор</p>
              <p className="text-xl font-black text-white">{language === 'kz' ? 'Үздік оқушы режимі' : 'Режим лучшего ученика'}</p>
              <p className="text-sm text-white/50">{language === 'kz' ? 'Осы қарқынды сақтаңыз' : 'Продолжайте в том же духе'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, points, accent, onClick }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.055] p-7 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.075]">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 blur-2xl transition duration-300 group-hover:opacity-20`}></div>
      <div className="relative">
        <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-white shadow-[0_0_34px_rgba(168,85,247,0.36)]`}>
          <LandingIcon name={icon} className="h-9 w-9" />
        </div>
        <h3 className="text-2xl font-black text-white [letter-spacing:0]">{title}</h3>
        <p className="mt-3 min-h-[3.5rem] text-white/60">{description}</p>
        <div className="mt-6 space-y-3">
          {points.map((point) => (
            <div key={point} className="flex items-center gap-3 text-sm font-semibold text-white/75">
              <LandingIcon name="check" className="h-4 w-4 text-cyan-200" />
              {point}
            </div>
          ))}
        </div>
        <button
          onClick={onClick}
          className={`mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r ${accent} px-6 py-3 text-sm font-black text-white shadow-[0_16px_36px_rgba(168,85,247,0.25)] transition group-hover:scale-[1.02]`}
        >
          Узнать больше
          <LandingIcon name="arrow" className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}

function SubjectCard({ subject, language, onStart, compact = false }) {
  const visual = getSubjectVisual(subject)
  const title = language === 'kz' ? subject.name_kz : subject.name_ru

  return (
    <article className={`group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.075] ${visual.glow} hover:shadow-2xl`}>
      <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${visual.accent} opacity-15 blur-2xl`}></div>
      <div className="relative">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${visual.accent} text-white shadow-lg`}>
          <LandingIcon name={visual.icon} className="h-7 w-7" />
        </div>
        <h3 className="mt-5 min-h-[3rem] text-lg font-black text-white [letter-spacing:0]">{title}</h3>
        <p className="text-sm font-semibold text-white/50">
          {subject.questions_count || 0} {language === 'kz' ? 'сұрақ' : 'вопросов'}
        </p>
        <button
          onClick={() => onStart(subject.id)}
          className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${visual.accent} px-4 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(168,85,247,0.2)] transition hover:scale-[1.01]`}
        >
          {language === 'kz' ? 'Тест бастау' : 'Начать тест'}
          <LandingIcon name="arrow" className="h-4 w-4" />
        </button>
        {compact && <div className="mt-3 h-1 rounded-full bg-white/10"><div className={`h-full w-2/3 rounded-full bg-gradient-to-r ${visual.accent}`}></div></div>}
      </div>
    </article>
  )
}

function SkeletonSubject() {
  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="h-12 w-12 animate-pulse rounded-2xl bg-white/10"></div>
      <div className="mt-5 h-5 w-2/3 animate-pulse rounded bg-white/10"></div>
      <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-white/10"></div>
      <div className="mt-5 h-11 animate-pulse rounded-xl bg-white/10"></div>
    </div>
  )
}

export default function Landing() {
  const { language } = useLanguageStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const [showAllProfile, setShowAllProfile] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadSubjects = async () => {
      try {
        const response = await api.get('/subjects/')
        if (!cancelled) {
          setSubjects(Array.isArray(response.data) ? response.data : [])
        }
      } catch (error) {
        console.error('Error loading subjects:', error)
        if (!cancelled) {
          setSubjects([])
        }
      } finally {
        if (!cancelled) {
          setLoadingSubjects(false)
        }
      }
    }

    loadSubjects()

    return () => {
      cancelled = true
    }
  }, [])

  const text = {
    kz: {
      heroTitle: 'ҰБТ-ға дайындық',
      heroAccent: 'AI-ментормен',
      heroDesc: 'Жасанды интеллект қателеріңізді талдайды, түсіндіреді және сізге жеке оқу бағытын ұсынады.',
      demo: 'Демо тест',
      register: 'Тегін тіркелу',
      featuresTitle: 'Неліктен QazMind?',
      featuresSubtitle: 'Заманауи технологиялар мен AI арқылы тиімді дайындық',
      subjectsTitle: 'Қолжетімді пәндер',
      required: 'Міндетті пәндер',
      profile: 'Бейінді пәндер',
      tutorTitle: 'AI-репетитор по теме',
      tutorDesc: 'Тақырыпты таңда, мини-сабақ ал, өз сөзіңмен жауап жаз және AI тексерісін ал.',
      podcastsTitle: 'Аудио-лекциялар AI-экспертпен',
      podcastsDesc: 'Қысқа әрі түсінікті подкастар күрделі тақырыптарды жеңіл меңгеруге көмектеседі.',
      flashcardsTitle: 'Флеш-карточки',
      flashcardsDesc: 'Spaced Repetition алгоритмі материалды дәл уақытында қайталауға көмектеседі.',
      ctaTitle: 'Бүгін бастаңыз!',
      ctaDesc: 'Тіркелу тегін. AI-менторға және QazMind мүмкіндіктеріне қол жеткізіңіз.',
    },
    ru: {
      heroTitle: 'Подготовка к ЕНТ',
      heroAccent: 'с AI-ментором',
      heroDesc: 'Искусственный интеллект анализирует ошибки, объясняет сложные темы и помогает выстроить личный маршрут подготовки.',
      demo: 'Демо тест',
      register: 'Зарегистрироваться',
      featuresTitle: 'Почему QazMind?',
      featuresSubtitle: 'Эффективное обучение с помощью современных технологий и AI',
      subjectsTitle: 'Доступные предметы',
      required: 'Обязательные предметы',
      profile: 'Профильные предметы',
      tutorTitle: 'AI-репетитор по теме',
      tutorDesc: 'Выбери тему, получи мини-урок, напиши ответ своими словами и дай AI проверить понимание.',
      podcastsTitle: 'Аудио-лекции с AI-экспертом',
      podcastsDesc: 'Короткие и понятные подкасты помогают усвоить сложные темы легко и эффективно.',
      flashcardsTitle: 'Флеш-карточки',
      flashcardsDesc: 'Алгоритм Spaced Repetition подбирает лучшее время для повторения материала.',
      ctaTitle: 'Начните сегодня!',
      ctaDesc: 'Регистрация бесплатна. Получите доступ к AI-ментору и всем возможностям QazMind.',
    },
  }[language]

  const requiredSubjects = useMemo(() => {
    const requiredNames = ['Математика', 'Математическая грамотность', 'Грамотность чтения', 'История Казахстана']
    return subjects.filter((subject) => requiredNames.some((name) => subject.name_ru?.includes(name) || subject.name_kz?.includes(name))).slice(0, 4)
  }, [subjects])

  const profileSubjects = useMemo(() => {
    const requiredIds = new Set(requiredSubjects.map((subject) => subject.id))
    return subjects.filter((subject) => !requiredIds.has(subject.id))
  }, [requiredSubjects, subjects])

  const defaultSubject = useMemo(() => {
    return subjects.find((subject) => (subject.name_ru || '').includes('Информатика')) || subjects.find((subject) => (subject.questions_count || 0) > 0) || subjects[0]
  }, [subjects])

  const handleStartTest = (subjectId = defaultSubject?.id || 1) => {
    navigate(isAuthenticated ? `/test/${subjectId}` : '/register')
  }

  const handleStartTutor = () => {
    if (!defaultSubject?.id) {
      navigate(isAuthenticated ? '/dashboard' : '/register')
      return
    }
    navigate(isAuthenticated ? `/tutor/${defaultSubject.id}` : '/register')
  }

  return (
    <main className="landing-page-bg min-h-screen overflow-hidden text-white">
      <section className="relative min-h-screen overflow-hidden">
        <OrbitalBackdrop />
        <div className="container relative z-10 mx-auto px-4 pb-20 pt-40 sm:px-6 sm:pt-44 lg:px-8 lg:pb-24 lg:pt-48">
          <div className="grid min-h-[620px] items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="max-w-3xl">
              <Badge>{language === 'kz' ? 'Қазіргі және түсінікті дайындық' : 'Современная и понятная подготовка к ЕНТ'}</Badge>
              <h1 className="mt-8 text-6xl font-black leading-none text-white [letter-spacing:0] sm:text-7xl lg:text-8xl">
                {text.heroTitle}
                <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-400 bg-clip-text text-transparent">
                  {text.heroAccent}
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-white/70 sm:text-xl">{text.heroDesc}</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button onClick={() => handleStartTest()} className="landing-primary-button">
                  {isAuthenticated ? (language === 'kz' ? 'Оқуды бастау' : 'Начать обучение') : text.demo}
                  <LandingIcon name="arrow" className="h-5 w-5" />
                </button>
                <Link to={isAuthenticated ? '/dashboard' : '/register'} className="landing-secondary-button">
                  {isAuthenticated ? (language === 'kz' ? 'Дашборд' : 'Панель управления') : text.register}
                  <LandingIcon name="arrow" className="h-5 w-5" />
                </Link>
              </div>
              <div className="mt-9 grid max-w-xl grid-cols-3 gap-4">
                {[
                  ['14+', language === 'kz' ? 'Пән' : 'Предметов', 'cyan'],
                  ['1000+', language === 'kz' ? 'Сұрақ' : 'Вопросов', 'violet'],
                  ['AI', language === 'kz' ? 'Жеке тәсіл' : 'Персональный подход', 'pink'],
                ].map(([value, label, tone]) => (
                  <div key={value} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
                    <p className={`text-3xl font-black ${tone === 'cyan' ? 'text-cyan-300' : tone === 'violet' ? 'text-violet-300' : 'text-pink-300'}`}>{value}</p>
                    <p className="mt-1 text-sm text-white/50">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <HeroPanel language={language} />
          </div>
        </div>
      </section>

      <section id="features" className="relative overflow-hidden py-24">
        <OrbitalBackdrop />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge tone="violet">{language === 'kz' ? 'Біздің артықшылықтар' : 'Наши преимущества'}</Badge>
            <h2 className="mt-6 text-5xl font-black text-white [letter-spacing:0] md:text-7xl">
              {text.featuresTitle.split(' ')[0]} <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">QazMind?</span>
            </h2>
            <p className="mt-5 text-lg text-white/60">{text.featuresSubtitle}</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon="bot"
              title={language === 'kz' ? 'AI түсіндіру' : 'AI объяснения'}
              description={language === 'kz' ? 'Әр қателікке жеке және түсінікті түсіндірме.' : 'Персонализированные объяснения каждой вашей ошибки.'}
              points={language === 'kz' ? ['Қарапайым түсінік', 'Нақты аналогиялар', 'Жеке тәсіл'] : ['Понятные объяснения', 'Примеры и аналогии', 'Индивидуальный подход']}
              accent="from-cyan-400 to-blue-600"
              onClick={() => handleStartTest()}
            />
            <FeatureCard
              icon="book"
              title={language === 'kz' ? 'Бейімделген оқу' : 'Адаптивное обучение'}
              description={language === 'kz' ? 'Тесттер сіздің қателеріңізге және деңгейіңізге бейімделеді.' : 'Тесты подстраиваются под ваши ошибки и уровень знаний.'}
              points={language === 'kz' ? ['Ақылды таңдау', 'Әлсіз тұстар', 'Үздіксіз даму'] : ['Умный подбор заданий', 'Фокус на слабых местах', 'Постоянное улучшение']}
              accent="from-violet-500 to-fuchsia-600"
              onClick={() => handleStartTest()}
            />
            <FeatureCard
              icon="chart"
              title={language === 'kz' ? 'Прогресс бақылауы' : 'Отслеживание прогресса'}
              description={language === 'kz' ? 'Нәтижелерді көріп, мақсатқа жақындағаныңызды бақылаңыз.' : 'Следите за результатами и двигайтесь к цели понятным маршрутом.'}
              points={language === 'kz' ? ['Толық статистика', 'Динамика', 'Мақсаттар'] : ['Детальная статистика', 'Графики и динамика', 'Цели и достижения']}
              accent="from-orange-400 to-rose-600"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            />
          </div>
          <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl md:grid-cols-4">
            {[
              ['14+', language === 'kz' ? 'Пәндер' : 'Предметов', 'book'],
              ['1000+', language === 'kz' ? 'Пайдаланушы' : 'Пользователей', 'trophy'],
              ['AI', language === 'kz' ? 'Технология' : 'Технологии', 'bolt'],
              ['98%', language === 'kz' ? 'Түсіндіру дәлдігі' : 'Точность объяснений', 'shield'],
            ].map(([value, label, icon]) => (
              <div key={value} className="flex items-center justify-center gap-4 border-white/10 py-3 md:border-r md:last:border-r-0">
                <LandingIcon name={icon} className="h-8 w-8 text-fuchsia-300" />
                <div>
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="text-sm text-white/50">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="subjects" className="relative overflow-hidden py-24">
        <OrbitalBackdrop />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <Badge icon="book">{language === 'kz' ? '14 пән дайындық үшін' : '14 предметов для подготовки'}</Badge>
              <h2 className="mt-6 text-5xl font-black text-white [letter-spacing:0] md:text-7xl">
                {text.subjectsTitle.split(' ')[0]} <span className="bg-gradient-to-r from-violet-300 to-pink-400 bg-clip-text text-transparent">{text.subjectsTitle.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="mt-4 text-lg text-white/60">{language === 'kz' ? '1000+ сұрақ, AI ұсыныстары және толық түсіндірмелер' : '1000+ вопросов, AI рекомендации и полные объяснения'}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl">
              {[
                ['book', '1000+', language === 'kz' ? 'сұрақ' : 'вопросов'],
                ['bot', 'AI', language === 'kz' ? 'ұсыныстар' : 'рекомендации'],
                ['chart', '100%', language === 'kz' ? 'талдау' : 'разбор'],
              ].map(([icon, value, label]) => (
                <div key={value}>
                  <LandingIcon name={icon} className="h-8 w-8 text-cyan-200" />
                  <p className="mt-3 text-2xl font-black text-white">{value}</p>
                  <p className="text-sm text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-3 text-2xl font-black text-white [letter-spacing:0]">
                <LandingIcon name="sparkles" className="h-6 w-6 text-violet-300" />
                {text.required}
              </h3>
              <span className="rounded-full bg-pink-500/10 px-4 py-2 text-sm font-black text-pink-300">{language === 'kz' ? 'Міндетті' : 'Обязательно'}</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {loadingSubjects ? Array.from({ length: 4 }).map((_, index) => <SkeletonSubject key={index} />) : requiredSubjects.map((subject) => <SubjectCard key={subject.id} subject={subject} language={language} onStart={handleStartTest} />)}
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-3 text-2xl font-black text-white [letter-spacing:0]">
                <LandingIcon name="target" className="h-6 w-6 text-fuchsia-300" />
                {text.profile}
              </h3>
              <span className="rounded-full bg-violet-500/10 px-4 py-2 text-sm font-black text-violet-300">{language === 'kz' ? 'Таңдау бойынша' : 'На выбор'}</span>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {loadingSubjects ? Array.from({ length: 3 }).map((_, index) => <SkeletonSubject key={index} />) : profileSubjects.slice(0, 3).map((subject) => <SubjectCard key={subject.id} compact subject={subject} language={language} onStart={handleStartTest} />)}
            </div>
            {!loadingSubjects && profileSubjects.length > 3 && (
              <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${showAllProfile ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className={`grid gap-5 pt-5 transition duration-500 ease-out md:grid-cols-3 ${showAllProfile ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}`}>
                    {profileSubjects.slice(3).map((subject) => (
                      <SubjectCard
                        key={subject.id}
                        compact
                        subject={subject}
                        language={language}
                        onStart={handleStartTest}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {!loadingSubjects && profileSubjects.length > 3 && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllProfile((value) => !value)}
                  className="inline-flex items-center gap-3 rounded-full border border-violet-300/20 bg-gradient-to-r from-violet-600/70 to-fuchsia-600/70 px-8 py-4 text-sm font-black text-white shadow-[0_18px_42px_rgba(168,85,247,0.24)] transition hover:scale-[1.02] hover:border-violet-200/40"
                >
                  {showAllProfile
                    ? (language === 'kz' ? 'Жасыру' : 'Скрыть')
                    : (language === 'kz' ? `Барлық пәндерді көрсету (${profileSubjects.length})` : `Показать все предметы (${profileSubjects.length})`)}
                  <svg
                    className={`h-4 w-4 transition-transform ${showAllProfile ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
            )}
            {!loadingSubjects && subjects.length === 0 && (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-8 text-center text-white/60">
                {language === 'kz' ? 'Пәндер қазір жүктелмеді. Кейінірек қайталап көріңіз.' : 'Предметы сейчас не загрузились. Попробуйте позже.'}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="tutor" className="relative overflow-hidden py-24">
        <OrbitalBackdrop />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge tone="cyan" icon="sparkles">{language === 'kz' ? 'Жаңа AI-режим' : 'Новый AI-режим'}</Badge>
              <h2 className="mt-6 text-5xl font-black text-white [letter-spacing:0] md:text-7xl">
                <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">AI-репетитор</span>
                <span className="block">по теме</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">{text.tutorDesc}</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[language === 'kz' ? 'Тақырыпты түсіндіреді' : 'Объясняет тему', language === 'kz' ? '5 ұқсас сұрақ' : '5 похожих вопросов', language === 'kz' ? 'Жауапты тексереді' : 'Проверяет ответ'].map((item, index) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm font-bold text-white/100">
                    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-cyan-200">{index + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button onClick={handleStartTutor} className="landing-primary-button">
                  {language === 'kz' ? 'AI-репетиторды ашу' : 'Открыть AI-репетитора'}
                  <LandingIcon name="arrow" className="h-5 w-5" />
                </button>
                <button onClick={() => handleStartTest()} className="landing-secondary-button">
                  <LandingIcon name="book" className="h-5 w-5" />
                  {language === 'kz' ? 'Алдымен тест' : 'Сначала пройти тест'}
                </button>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.065] p-7 backdrop-blur-2xl shadow-[0_28px_90px_rgba(0,0,0,0.32)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">AI Tutor</p>
                  <h3 className="mt-3 text-3xl font-black text-white [letter-spacing:0]">{defaultSubject ? (language === 'kz' ? defaultSubject.name_kz : defaultSubject.name_ru) : 'Информатика'}</h3>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-700 text-white shadow-[0_0_35px_rgba(168,85,247,0.45)]">
                  <LandingIcon name="sparkles" className="h-8 w-8" />
                </div>
              </div>
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                {['Выбираешь тему', 'AI объясняет', 'Ты пишешь ответ', 'AI даёт точную обратную связь'].map((item, index) => (
                  <div key={item} className="flex items-center gap-4 py-2 text-white/100">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/20 text-sm font-black text-cyan-200">{index + 1}</span>
                    {language === 'kz' ? ['Тақырып таңдайсың', 'AI түсіндіреді', 'Жауап жазасың', 'AI нақты кері байланыс береді'][index] : item}
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
                  <p className="text-4xl font-black text-cyan-300">5</p>
                  <p className="mt-2 text-white/50">{language === 'kz' ? 'ұқсас сұрақ' : 'похожих вопросов'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
                  <p className="text-4xl font-black text-violet-300">100</p>
                  <p className="mt-2 text-white/50">{language === 'kz' ? 'балдық тексеріс' : 'балльная проверка'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="podcasts" className="relative overflow-hidden py-24">
        <OrbitalBackdrop />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <Badge tone="orange" icon="headphones">AI подкасты</Badge>
              <h2 className="mt-6 text-5xl font-black text-white [letter-spacing:0] md:text-7xl">
                <span className="bg-gradient-to-r from-orange-300 via-pink-400 to-violet-400 bg-clip-text text-transparent">{text.podcastsTitle.split(' ')[0]}</span>
                <span className="block">{text.podcastsTitle.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-white/60">{text.podcastsDesc}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['3-5 минут', language === 'kz' ? 'Кез келген жерде' : 'Доступно везде', 'AI-эксперт'].map((item) => (
                  <span key={item} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white/70">{item}</span>
                ))}
              </div>
            </div>
            <div className="relative min-h-[360px]">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pink-400/20"></div>
              <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/25"></div>
              <div className="landing-float absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-slate-950 to-violet-950 text-pink-300 shadow-[0_0_70px_rgba(217,70,239,0.38)]">
                <LandingIcon name="headphones" className="h-28 w-28" />
              </div>
              <div className="absolute left-1/2 top-1/2 h-16 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-violet-500 blur-md"></div>
              {['mic', 'book', 'target', 'sparkles'].map((icon, index) => (
                <div key={icon} className={`absolute flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-violet-700 text-white shadow-lg ${index === 0 ? 'left-[16%] top-[16%]' : index === 1 ? 'left-[18%] bottom-[20%]' : index === 2 ? 'right-[18%] bottom-[20%]' : 'right-[16%] top-[18%]'}`}>
                  <LandingIcon name={icon} className="h-7 w-7" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[language === 'kz' ? 'Жаңа тақырыптар апта сайын' : 'Новые темы каждую неделю', language === 'kz' ? 'Мақсатты дайындық' : 'Целевая подготовка', language === 'kz' ? 'Кәсіби түсіндірмелер' : 'Профессиональные объяснения'].map((title, index) => (
              <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl">
                <LandingIcon name={['cards', 'target', 'bot'][index]} className="h-12 w-12 text-pink-300" />
                <h3 className="mt-5 text-xl font-black text-white [letter-spacing:0]">{title}</h3>
                <Link to="/podcasts" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-pink-300">
                  {language === 'kz' ? 'Көру' : 'Смотреть'}
                  <LandingIcon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="flashcards" className="relative overflow-hidden py-24">
        <OrbitalBackdrop />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[320px]">
              <div className="landing-float absolute left-8 top-12 h-40 w-56 rotate-[-12deg] rounded-[1.6rem] border border-pink-300/25 bg-gradient-to-br from-pink-500/70 to-violet-700/70 shadow-[0_0_60px_rgba(217,70,239,0.28)]"></div>
              <div className="landing-float landing-float-delay absolute left-24 top-20 h-44 w-56 rotate-[7deg] rounded-[1.6rem] border border-violet-300/25 bg-gradient-to-br from-violet-600/80 to-fuchsia-600/75 p-8 shadow-[0_0_60px_rgba(124,58,237,0.35)]">
                <LandingIcon name="trophy" className="mx-auto h-14 w-14 text-white/75" />
                <p className="mt-8 text-center text-3xl font-black text-white">1465</p>
                <p className="text-center text-sm text-white/70">{language === 'kz' ? 'оқу күні' : 'дней обучения'}</p>
                <div className="mt-8 h-2 rounded-full bg-white/20">
                  <div className="h-full w-3/5 rounded-full bg-pink-300"></div>
                </div>
              </div>
            </div>
            <div>
              <Badge tone="pink" icon="cards">{language === 'kz' ? 'Ақылды есте сақтау' : 'Умное запоминание'}</Badge>
              <h2 className="mt-6 text-5xl font-black text-white [letter-spacing:0] md:text-7xl">
                <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">{text.flashcardsTitle}</span>
                <span className="block text-3xl md:text-4xl">{language === 'kz' ? 'Spaced Repetition алгоритмімен' : 'с алгоритмом Spaced Repetition'}</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">{text.flashcardsDesc}</p>
              <div className="mt-7 space-y-3">
                {[language === 'kz' ? 'Пәнді таңдаңыз' : 'Выберите предмет', language === 'kz' ? 'Карточканы оқып аударыңыз' : 'Прочитайте карточку и переверните', language === 'kz' ? 'Жауапты белгілеңіз' : 'Свайпните или нажмите кнопку'].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 text-white/75">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/20 text-sm font-black text-pink-200">{index + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to="/flashcards" className="landing-primary-button">
                  <LandingIcon name="cards" className="h-5 w-5" />
                  {language === 'kz' ? 'Бастау' : 'Начать'}
                </Link>
                <Link to="/flashcards" className="landing-secondary-button">
                  {language === 'kz' ? 'Толығырақ' : 'Подробнее'}
                  <LandingIcon name="arrow" className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-20">
        <OrbitalBackdrop />
        <div className="relative z-10 mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.045] px-6 py-20 text-center backdrop-blur-2xl">
          <Badge tone="violet" icon="rocket">{language === 'kz' ? 'Жоғары баллға жолды бастаңыз' : 'Начните путь к высоким баллам'}</Badge>
          <h2 className="mt-6 text-5xl font-black text-white [letter-spacing:0] md:text-7xl">
            {text.ctaTitle.split(' ')[0]} <span className="bg-gradient-to-r from-pink-300 to-violet-400 bg-clip-text text-transparent">{text.ctaTitle.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">{text.ctaDesc}</p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/register" className="landing-primary-button">
              {language === 'kz' ? 'Тегін тіркелу' : 'Бесплатная регистрация'}
              <LandingIcon name="arrow" className="h-5 w-5" />
            </Link>
            <button onClick={() => handleStartTest()} className="landing-secondary-button">
              {language === 'kz' ? 'Демо көру' : 'Попробовать демо'}
              <LandingIcon name="arrow" className="h-5 w-5" />
            </button>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-5 md:grid-cols-5">
            {['1000+', '14+', 'AI', '98%', '24/7'].map((item) => (
              <div key={item} className="text-2xl font-black text-pink-300">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden border-t border-white/10 bg-black/10 py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/30 to-transparent"></div>
        <div className="pointer-events-none absolute left-1/2 top-0 h-44 w-[42rem] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"></div>

        <div className="container relative z-10 mx-auto px-4 text-white/50 sm:px-6 lg:px-8">
          <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <img src="/images/logo.png" alt="QazMind" className="h-11 w-11" />
                <div>
                  <p className="text-xl font-black text-white [letter-spacing:0]">QazMind</p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/40">
                    {language === 'kz' ? 'ЕНТ дайындық платформасы' : 'Платформа подготовки к ЕНТ'}
                  </p>
                </div>
              </div>
              <p className="mt-5 max-w-xs text-sm leading-6 text-white/48">
                {language === 'kz'
                  ? 'AI-ментор, тесттер, подкастар және карточкалар арқылы дайындалуға арналған платформа.'
                  : 'AI-платформа для подготовки к ЕНТ с тестами, подкастами и флеш-карточками.'}
              </p>
              <div className="mt-6 flex gap-3">
                {['vk', 'ig', 'tg', 'yt'].map((item) => (
                  <span key={item} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-black uppercase text-white/45">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-white [letter-spacing:0]">
                {language === 'kz' ? 'Жылдам сілтемелер' : 'Быстрые ссылки'}
              </h3>
              <div className="mt-5 grid gap-3 text-sm">
                <a href="#features" className="transition hover:text-white">{language === 'kz' ? 'Артықшылықтар' : 'Преимущества'}</a>
                <a href="#subjects" className="transition hover:text-white">{language === 'kz' ? 'Пәндер' : 'Предметы'}</a>
                <a href="#podcasts" className="transition hover:text-white">{language === 'kz' ? 'Подкастар' : 'Подкасты'}</a>
                <a href="#flashcards" className="transition hover:text-white">{language === 'kz' ? 'Карточкалар' : 'Карточки'}</a>
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-white [letter-spacing:0]">
                {language === 'kz' ? 'Құқықтық ақпарат' : 'Юридическая информация'}
              </h3>
              <div className="mt-5 grid gap-3 text-sm">
                <Link to="/privacy" className="transition hover:text-white">{language === 'kz' ? 'Құпиялылық' : 'Конфиденциальность'}</Link>
                <Link to="/terms" className="transition hover:text-white">{language === 'kz' ? 'Пайдалану шарттары' : 'Условия использования'}</Link>
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-white [letter-spacing:0]">
                {language === 'kz' ? 'Байланыс' : 'Контакты'}
              </h3>
              <div className="mt-5 grid gap-3 text-sm">
                <a href="mailto:info@qazmind.kz" className="transition hover:text-white">info@qazmind.kz</a>
                <a href="mailto:support@qazmind.kz" className="transition hover:text-white">support@qazmind.kz</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 pt-8 text-sm md:flex-row md:items-center">
            <p>© 2026 QazMind. {language === 'kz' ? 'Барлық құқықтар сақталған.' : 'Все права защищены.'}</p>
            <div className="flex flex-wrap gap-6">
              <Link to="/privacy" className="transition hover:text-white">{language === 'kz' ? 'Құпиялылық' : 'Конфиденциальность'}</Link>
              <Link to="/terms" className="transition hover:text-white">{language === 'kz' ? 'Шарттар' : 'Условия использования'}</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
