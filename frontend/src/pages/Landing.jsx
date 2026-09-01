import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useLanguageStore } from '../store/languageStore'
import api from '../utils/api'
import KazakhPattern from '../components/KazakhPattern'

// ---------------------------------------------------------------------------
// Icons — small geometric line-icon set, reused across the page instead of
// pulling in an icon library for a handful of glyphs.
// ---------------------------------------------------------------------------
function LandingIcon({ name, className = 'h-6 w-6', strokeWidth = 1.75 }) {
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
    headphones: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0115 0v5.2a2.2 2.2 0 01-2.2 2.3h-.8v-6h.8a2.2 2.2 0 012.2 2.2M4.5 15.7a2.2 2.2 0 012.2-2.2h.8v6h-.8a2.2 2.2 0 01-2.2-2.3v-1.5z" />,
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
    chevron: <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />,
  }

  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

// A subject's icon + a quiet two-way tile tone (deterministic, not per-subject
// rainbow) so the grid reads calm at a glance while still being scannable.
function getSubjectVisual(subject, index = 0) {
  const name = `${subject?.name_ru || ''} ${subject?.name_kz || ''}`.toLowerCase()
  let icon = 'book'
  if (name.includes('история') || name.includes('тарих')) icon = 'history'
  else if (name.includes('математ')) icon = 'calculator'
  else if (name.includes('грамот') || name.includes('оқу')) icon = 'book'
  else if (name.includes('физик')) icon = 'atom'
  else if (name.includes('биолог')) icon = 'sparkles'
  else if (name.includes('хими')) icon = 'flask'
  return { icon, tile: index % 3 === 0 ? 'gold' : 'ink' }
}

// One consistent scroll-reveal used everywhere on the page — an "orchestrated
// moment" rather than scattered per-element effects, and a no-op under
// prefers-reduced-motion.
function Reveal({ children, delay = 0, className = '' }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Eyebrow({ children }) {
  return <p className="landing-eyebrow">{children}</p>
}

function SectionHeading({ eyebrow, title, lede, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink dark:text-ink-dark sm:text-5xl">
        {title}
      </h2>
      {lede && <p className="mt-4 text-lg leading-7 text-ink-muted dark:text-ink-dark/60">{lede}</p>}
    </div>
  )
}

function StatRow({ items }) {
  return (
    <div className="grid grid-cols-3 divide-x divide-ink/10 dark:divide-ink-dark/10">
      {items.map(([value, label]) => (
        <div key={label} className="px-4 first:pl-0 sm:px-6">
          <p className="font-display text-3xl text-ink dark:text-ink-dark sm:text-4xl">{value}</p>
          <p className="mt-1 text-sm text-ink-muted dark:text-ink-dark/55">{label}</p>
        </div>
      ))}
    </div>
  )
}

function IconTile({ icon, tone = 'ink' }) {
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
        tone === 'gold' ? 'bg-gold text-paper' : 'bg-ink text-paper dark:bg-ink-dark dark:text-ink'
      }`}
    >
      <LandingIcon name={icon} className="h-6 w-6" />
    </div>
  )
}

function FeatureCard({ icon, tone, title, description, points, onClick, delay }) {
  return (
    <Reveal delay={delay}>
      <article className="landing-card group flex h-full flex-col p-7 hover:border-ink/25 dark:hover:border-ink-dark/25">
        <IconTile icon={icon} tone={tone} />
        <h3 className="mt-6 font-display text-xl text-ink dark:text-ink-dark">{title}</h3>
        <p className="mt-2 text-[15px] leading-6 text-ink-muted dark:text-ink-dark/60">{description}</p>
        <ul className="mt-5 space-y-2.5">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm text-ink/80 dark:text-ink-dark/75">
              <LandingIcon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {point}
            </li>
          ))}
        </ul>
        <button
          onClick={onClick}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition group-hover:decoration-ink dark:text-ink-dark dark:decoration-ink-dark/25 dark:group-hover:decoration-ink-dark"
        >
          Узнать больше
          <LandingIcon name="arrow" className="h-3.5 w-3.5" />
        </button>
      </article>
    </Reveal>
  )
}

function SubjectCard({ subject, language, onStart, index }) {
  const visual = getSubjectVisual(subject, index)
  const title = language === 'kz' ? subject.name_kz : subject.name_ru

  return (
    <article className="landing-card group flex h-full flex-col p-5 hover:border-ink/25 dark:hover:border-ink-dark/25">
      <IconTile icon={visual.icon} tone={visual.tile} />
      <h3 className="mt-4 min-h-[2.75rem] font-display text-lg leading-tight text-ink dark:text-ink-dark">{title}</h3>
      <p className="text-sm text-ink-muted dark:text-ink-dark/50">
        {subject.questions_count || 0} {language === 'kz' ? 'сұрақ' : 'вопросов'}
      </p>
      <button
        onClick={() => onStart(subject.id)}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 py-2.5 text-sm font-semibold text-ink transition group-hover:border-ink group-hover:bg-ink group-hover:text-paper dark:border-ink-dark/20 dark:text-ink-dark dark:group-hover:border-ink-dark dark:group-hover:bg-ink-dark dark:group-hover:text-ink"
      >
        {language === 'kz' ? 'Тест бастау' : 'Начать тест'}
        <LandingIcon name="arrow" className="h-3.5 w-3.5" />
      </button>
    </article>
  )
}

function SkeletonSubject() {
  return (
    <div className="landing-card p-5">
      <div className="h-12 w-12 animate-pulse rounded-xl bg-ink/10 dark:bg-ink-dark/10" />
      <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-ink/10 dark:bg-ink-dark/10" />
      <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-ink/10 dark:bg-ink-dark/10" />
      <div className="mt-4 h-10 animate-pulse rounded-full bg-ink/10 dark:bg-ink-dark/10" />
    </div>
  )
}

// ---------------------------------------------------------------------------

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
      heroEyebrow: 'ҰБТ-ға дайындық платформасы',
      heroTitle: 'Дайындық,',
      heroAccent: 'асықпай да дәл',
      heroDesc: 'Жасанды интеллект қателеріңізді талдайды, түсіндіреді және сізге жеке оқу бағытын ұсынады — артық шу жоқ, тек нәтижеге апаратын қадамдар.',
      demo: 'Демо тест',
      register: 'Тегін тіркелу',
      featuresEyebrow: 'Неге QazMind',
      featuresTitle: 'Оқу тәжірибесі, ойластырылған',
      featuresSubtitle: 'Әр мүмкіндіктің өз орны бар — техника емес, нәтиже үшін.',
      subjectsEyebrow: '14 пән',
      subjectsTitle: 'Қолжетімді пәндер',
      subjectsLede: '1000+ сұрақ, толық түсіндірмелер және AI ұсыныстары.',
      required: 'Міндетті пәндер',
      profile: 'Бейінді пәндер',
      tutorEyebrow: 'Жаңа режим',
      tutorTitle: 'AI-репетитор',
      tutorSub: 'тақырып бойынша',
      tutorDesc: 'Тақырыпты таңда, мини-сабақ ал, өз сөзіңмен жауап жаз және AI тексерісін ал.',
      tutorCta: 'AI-репетиторды ашу',
      tutorAlt: 'Алдымен тест',
      podcastsEyebrow: 'Аудио-форматта',
      podcastsTitle: 'AI-экспертпен лекциялар',
      podcastsDesc: 'Қысқа әрі түсінікті подкастар күрделі тақырыптарды жеңіл меңгеруге көмектеседі.',
      flashcardsEyebrow: 'Ақылды есте сақтау',
      flashcardsTitle: 'Флеш-карточкалар',
      flashcardsSub: 'Spaced Repetition алгоритмімен',
      flashcardsDesc: 'Алгоритм материалды дәл уақытында қайталауға көмектеседі — артық емес, керек мөлшерде.',
      ctaEyebrow: 'Бастауға дайынсыз ба',
      ctaTitle: 'Бүгін бастаңыз',
      ctaDesc: 'Тіркелу тегін. AI-менторға және QazMind мүмкіндіктеріне қол жеткізіңіз.',
    },
    ru: {
      heroEyebrow: 'Платформа подготовки к ЕНТ',
      heroTitle: 'Подготовка,',
      heroAccent: 'без лишней спешки',
      heroDesc: 'Искусственный интеллект анализирует ошибки, объясняет сложные темы и помогает выстроить личный маршрут подготовки — без лишнего шума, только шаги, которые приближают к результату.',
      demo: 'Демо тест',
      register: 'Зарегистрироваться',
      featuresEyebrow: 'Почему QazMind',
      featuresTitle: 'Обучение, устроенное продуманно',
      featuresSubtitle: 'У каждой возможности есть своё место — не ради технологии, а ради результата.',
      subjectsEyebrow: '14 предметов',
      subjectsTitle: 'Доступные предметы',
      subjectsLede: '1000+ вопросов, полные разборы и рекомендации от AI.',
      required: 'Обязательные предметы',
      profile: 'Профильные предметы',
      tutorEyebrow: 'Новый режим',
      tutorTitle: 'AI-репетитор',
      tutorSub: 'по теме',
      tutorDesc: 'Выбери тему, получи мини-урок, напиши ответ своими словами и дай AI проверить понимание.',
      tutorCta: 'Открыть AI-репетитора',
      tutorAlt: 'Сначала пройти тест',
      podcastsEyebrow: 'В аудиоформате',
      podcastsTitle: 'Лекции с AI-экспертом',
      podcastsDesc: 'Короткие и понятные подкасты помогают усвоить сложные темы легко и эффективно.',
      flashcardsEyebrow: 'Умное запоминание',
      flashcardsTitle: 'Флеш-карточки',
      flashcardsSub: 'с алгоритмом Spaced Repetition',
      flashcardsDesc: 'Алгоритм подбирает лучшее время для повторения материала — ровно тогда, когда нужно.',
      ctaEyebrow: 'Готовы начать',
      ctaTitle: 'Начните сегодня',
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
    <main className="landing-page-bg min-h-screen">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 text-ink dark:text-ink-dark lg:block">
          <KazakhPattern />
        </div>
        <div className="container relative mx-auto px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-xl">
              <Eyebrow>{text.heroEyebrow}</Eyebrow>
              <h1 className="mt-5 font-display text-5xl leading-[1.04] text-ink dark:text-ink-dark sm:text-6xl lg:text-[4rem]">
                {text.heroTitle}
                <br />
                <span className="italic text-gold">{text.heroAccent}</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-7 text-ink-muted dark:text-ink-dark/60">{text.heroDesc}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => handleStartTest()} className="landing-primary-button">
                  {isAuthenticated ? (language === 'kz' ? 'Оқуды бастау' : 'Начать обучение') : text.demo}
                  <LandingIcon name="arrow" className="h-4 w-4" />
                </button>
                <Link to={isAuthenticated ? '/dashboard' : '/register'} className="landing-secondary-button">
                  {isAuthenticated ? (language === 'kz' ? 'Дашборд' : 'Панель управления') : text.register}
                </Link>
              </div>
              <div className="mt-12 max-w-md">
                <StatRow
                  items={[
                    ['14+', language === 'kz' ? 'Пән' : 'Предметов'],
                    ['1000+', language === 'kz' ? 'Сұрақ' : 'Вопросов'],
                    ['AI', language === 'kz' ? 'Жеке тәсіл' : 'Персональный подход'],
                  ]}
                />
              </div>
            </div>

            <Reveal delay={0.1}>
              <div className="landing-card mx-auto w-full max-w-md p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Eyebrow>QazMind</Eyebrow>
                    <h3 className="mt-1.5 font-display text-xl text-ink dark:text-ink-dark">
                      {language === 'kz' ? 'Бүгінгі сабақ' : 'Сегодняшняя сессия'}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-paper dark:bg-ink-dark dark:text-ink">
                    <LandingIcon name="check" className="h-3.5 w-3.5" />
                    {language === 'kz' ? 'Өте жақсы' : 'Отлично'}
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm">
                  <span className="text-ink-muted dark:text-ink-dark/55">
                    {defaultSubject ? (language === 'kz' ? defaultSubject.name_kz : defaultSubject.name_ru) : (language === 'kz' ? 'Сынақ №1' : 'Тест №1')}
                  </span>
                  <span className="font-semibold text-gold-ink dark:text-gold-bright">80%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-ink/10 dark:bg-ink-dark/10">
                  <div className="h-full w-4/5 rounded-full bg-gold" />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-ink/10 pt-6 dark:border-ink-dark/10">
                  {[
                    ['28', language === 'kz' ? 'сабақ' : 'уроков'],
                    ['156', language === 'kz' ? 'ұпай' : 'очков'],
                    ['85%', language === 'kz' ? 'орташа' : 'средний'],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <p className="font-display text-xl text-ink dark:text-ink-dark">{value}</p>
                      <p className="text-xs text-ink-muted dark:text-ink-dark/50">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-3 rounded-xl bg-paper-soft p-3.5 dark:bg-white/[0.04]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-paper">
                    <LandingIcon name="bot" className="h-[18px] w-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink dark:text-ink-dark">
                      {language === 'kz' ? 'Үздік оқушы режимі' : 'Режим лучшего ученика'}
                    </p>
                    <p className="truncate text-xs text-ink-muted dark:text-ink-dark/50">
                      {language === 'kz' ? 'Осы қарқынды сақтаңыз' : 'Продолжайте в том же духе'}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className="border-t border-ink/10 py-24 dark:border-ink-dark/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow={text.featuresEyebrow} title={text.featuresTitle} lede={text.featuresSubtitle} />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon="bot"
              tone="gold"
              title={language === 'kz' ? 'AI түсіндіру' : 'AI объяснения'}
              description={language === 'kz' ? 'Әр қателікке жеке және түсінікті түсіндірме.' : 'Персонализированные объяснения каждой вашей ошибки.'}
              points={language === 'kz' ? ['Қарапайым түсінік', 'Нақты аналогиялар', 'Жеке тәсіл'] : ['Понятные объяснения', 'Примеры и аналогии', 'Индивидуальный подход']}
              onClick={() => handleStartTest()}
              delay={0}
            />
            <FeatureCard
              icon="book"
              tone="ink"
              title={language === 'kz' ? 'Бейімделген оқу' : 'Адаптивное обучение'}
              description={language === 'kz' ? 'Тесттер сіздің қателеріңізге және деңгейіңізге бейімделеді.' : 'Тесты подстраиваются под ваши ошибки и уровень знаний.'}
              points={language === 'kz' ? ['Ақылды таңдау', 'Әлсіз тұстар', 'Үздіксіз даму'] : ['Умный подбор заданий', 'Фокус на слабых местах', 'Постоянное улучшение']}
              onClick={() => handleStartTest()}
              delay={0.08}
            />
            <FeatureCard
              icon="chart"
              tone="gold"
              title={language === 'kz' ? 'Прогресс бақылауы' : 'Отслеживание прогресса'}
              description={language === 'kz' ? 'Нәтижелерді көріп, мақсатқа жақындағаныңызды бақылаңыз.' : 'Следите за результатами и двигайтесь к цели понятным маршрутом.'}
              points={language === 'kz' ? ['Толық статистика', 'Динамика', 'Мақсаттар'] : ['Детальная статистика', 'Графики и динамика', 'Цели и достижения']}
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
              delay={0.16}
            />
          </div>

          <Reveal delay={0.1}>
            <div className="landing-card mt-6 grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-ink/10 dark:lg:divide-ink-dark/10">
              {[
                ['14+', language === 'kz' ? 'Пәндер' : 'Предметов'],
                ['1000+', language === 'kz' ? 'Пайдаланушы' : 'Пользователей'],
                ['AI', language === 'kz' ? 'Технология' : 'Технологии'],
                ['98%', language === 'kz' ? 'Түсіндіру дәлдігі' : 'Точность объяснений'],
              ].map(([value, label]) => (
                <div key={label} className="lg:pl-6 lg:first:pl-0">
                  <p className="font-display text-2xl text-ink dark:text-ink-dark">{value}</p>
                  <p className="text-sm text-ink-muted dark:text-ink-dark/50">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Subjects ---------- */}
      <section id="subjects" className="border-t border-ink/10 bg-paper-soft py-24 dark:border-ink-dark/10 dark:bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <SectionHeading eyebrow={text.subjectsEyebrow} title={text.subjectsTitle} lede={text.subjectsLede} />
              <div className="landing-card p-6">
                <StatRow
                  items={[
                    ['1000+', language === 'kz' ? 'сұрақ' : 'вопросов'],
                    ['AI', language === 'kz' ? 'ұсыныстар' : 'рекомендации'],
                    ['100%', language === 'kz' ? 'талдау' : 'разбор'],
                  ]}
                />
              </div>
            </div>
          </Reveal>

          <div className="mt-16">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-xl text-ink dark:text-ink-dark">{text.required}</h3>
              <span className="rounded-full border border-ink/15 px-3.5 py-1.5 text-xs font-semibold text-ink-muted dark:border-ink-dark/20 dark:text-ink-dark/60">
                {language === 'kz' ? 'Міндетті' : 'Обязательно'}
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {loadingSubjects
                ? Array.from({ length: 4 }).map((_, index) => <SkeletonSubject key={index} />)
                : requiredSubjects.map((subject, index) => (
                    <SubjectCard key={subject.id} subject={subject} language={language} onStart={handleStartTest} index={index} />
                  ))}
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-xl text-ink dark:text-ink-dark">{text.profile}</h3>
              <span className="rounded-full border border-ink/15 px-3.5 py-1.5 text-xs font-semibold text-ink-muted dark:border-ink-dark/20 dark:text-ink-dark/60">
                {language === 'kz' ? 'Таңдау бойынша' : 'На выбор'}
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {loadingSubjects
                ? Array.from({ length: 3 }).map((_, index) => <SkeletonSubject key={index} />)
                : profileSubjects.slice(0, 3).map((subject, index) => (
                    <SubjectCard key={subject.id} subject={subject} language={language} onStart={handleStartTest} index={index} />
                  ))}
            </div>
            {!loadingSubjects && profileSubjects.length > 3 && (
              <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${showAllProfile ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="grid gap-5 pt-5 md:grid-cols-3">
                    {profileSubjects.slice(3).map((subject, index) => (
                      <SubjectCard key={subject.id} subject={subject} language={language} onStart={handleStartTest} index={index + 3} />
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
                  className="landing-secondary-button"
                >
                  {showAllProfile
                    ? (language === 'kz' ? 'Жасыру' : 'Скрыть')
                    : (language === 'kz' ? `Барлық пәндерді көрсету (${profileSubjects.length})` : `Показать все предметы (${profileSubjects.length})`)}
                  <LandingIcon name="chevron" className={`h-4 w-4 transition-transform ${showAllProfile ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
            {!loadingSubjects && subjects.length === 0 && (
              <div className="landing-card p-8 text-center text-ink-muted dark:text-ink-dark/60">
                {language === 'kz' ? 'Пәндер қазір жүктелмеді. Кейінірек қайталап көріңіз.' : 'Предметы сейчас не загрузились. Попробуйте позже.'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- AI Tutor ---------- */}
      <section id="tutor" className="border-t border-ink/10 py-24 dark:border-ink-dark/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <Eyebrow>{text.tutorEyebrow}</Eyebrow>
                <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink dark:text-ink-dark sm:text-5xl">
                  {text.tutorTitle} <span className="italic text-gold">{text.tutorSub}</span>
                </h2>
                <p className="mt-5 max-w-md text-lg leading-7 text-ink-muted dark:text-ink-dark/60">{text.tutorDesc}</p>
                <div className="mt-7 space-y-3">
                  {(language === 'kz'
                    ? ['Тақырыпты түсіндіреді', '5 ұқсас сұрақ', 'Жауапты тексереді']
                    : ['Объясняет тему', '5 похожих вопросов', 'Проверяет ответ']
                  ).map((item, index) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-medium text-ink dark:text-ink-dark">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/5 text-xs font-semibold text-ink-muted dark:bg-ink-dark/10 dark:text-ink-dark/60">
                        {index + 1}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button onClick={handleStartTutor} className="landing-primary-button">
                    {text.tutorCta}
                    <LandingIcon name="arrow" className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleStartTest()} className="landing-secondary-button">
                    {text.tutorAlt}
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="landing-card p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <Eyebrow>AI Tutor</Eyebrow>
                    <h3 className="mt-1.5 font-display text-2xl text-ink dark:text-ink-dark">
                      {defaultSubject ? (language === 'kz' ? defaultSubject.name_kz : defaultSubject.name_ru) : 'Информатика'}
                    </h3>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-paper">
                    <LandingIcon name="sparkles" className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-6 space-y-1 rounded-xl bg-paper-soft p-4 dark:bg-white/[0.04]">
                  {(language === 'kz'
                    ? ['Тақырып таңдайсың', 'AI түсіндіреді', 'Жауап жазасың', 'AI нақты кері байланыс береді']
                    : ['Выбираешь тему', 'AI объясняет', 'Ты пишешь ответ', 'AI даёт точную обратную связь']
                  ).map((item, index) => (
                    <div key={item} className="flex items-center gap-3 py-1.5 text-sm text-ink/85 dark:text-ink-dark/80">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/5 text-xs font-semibold text-ink-muted dark:bg-ink-dark/10 dark:text-ink-dark/55">
                        {index + 1}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-ink/10 pt-5 dark:border-ink-dark/10">
                  <div>
                    <p className="font-display text-3xl text-ink dark:text-ink-dark">5</p>
                    <p className="mt-1 text-sm text-ink-muted dark:text-ink-dark/50">{language === 'kz' ? 'ұқсас сұрақ' : 'похожих вопросов'}</p>
                  </div>
                  <div>
                    <p className="font-display text-3xl text-ink dark:text-ink-dark">100</p>
                    <p className="mt-1 text-sm text-ink-muted dark:text-ink-dark/50">{language === 'kz' ? 'балдық тексеріс' : 'балльная проверка'}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Podcasts ---------- */}
      <section id="podcasts" className="border-t border-ink/10 bg-paper-soft py-24 dark:border-ink-dark/10 dark:bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
            <Reveal>
              <div>
                <Eyebrow>{text.podcastsEyebrow}</Eyebrow>
                <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink dark:text-ink-dark sm:text-5xl">{text.podcastsTitle}</h2>
                <p className="mt-5 max-w-md text-lg leading-7 text-ink-muted dark:text-ink-dark/60">{text.podcastsDesc}</p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {['3–5 ' + (language === 'kz' ? 'минут' : 'минут'), language === 'kz' ? 'Кез келген жерде' : 'Доступно везде', 'AI-эксперт'].map((item) => (
                    <span key={item} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-sm font-medium text-ink-muted dark:border-ink-dark/20 dark:text-ink-dark/60">
                      {item}
                    </span>
                  ))}
                </div>
                <Link to="/podcasts" className="landing-primary-button mt-8 w-fit">
                  {language === 'kz' ? 'Подкастарды көру' : 'Смотреть подкасты'}
                  <LandingIcon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="landing-card flex flex-col items-center p-10 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink text-paper dark:bg-ink-dark dark:text-ink">
                  <LandingIcon name="headphones" className="h-9 w-9" />
                </div>
                <p className="mt-6 font-display text-lg text-ink dark:text-ink-dark">
                  {language === 'kz' ? 'Абылай хан және Дала тарихы' : 'Абылай хан и история степи'}
                </p>
                <div className="mt-5 flex w-full items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-paper">
                    <LandingIcon name="play" className="h-4 w-4" />
                  </div>
                  <div className="h-1 flex-1 rounded-full bg-ink/10 dark:bg-ink-dark/10">
                    <div className="h-full w-1/3 rounded-full bg-gold" />
                  </div>
                  <span className="text-xs text-ink-muted dark:text-ink-dark/50">4:12</span>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {[
                [language === 'kz' ? 'Жаңа тақырыптар апта сайын' : 'Новые темы каждую неделю', 'cards'],
                [language === 'kz' ? 'Мақсатты дайындық' : 'Целевая подготовка', 'target'],
                [language === 'kz' ? 'Кәсіби түсіндірмелер' : 'Профессиональные объяснения', 'bot'],
              ].map(([title, icon]) => (
                <div key={title} className="landing-card p-6">
                  <IconTile icon={icon} tone="ink" />
                  <h3 className="mt-5 font-display text-lg text-ink dark:text-ink-dark">{title}</h3>
                  <Link to="/podcasts" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-4 dark:text-ink-dark dark:decoration-ink-dark/25">
                    {language === 'kz' ? 'Көру' : 'Смотреть'}
                    <LandingIcon name="arrow" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Flashcards ---------- */}
      <section id="flashcards" className="border-t border-ink/10 py-24 dark:border-ink-dark/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal>
              <div className="relative mx-auto flex h-72 w-full max-w-sm items-center justify-center">
                <div className="landing-card absolute h-52 w-40 -rotate-6 bg-paper-soft dark:bg-white/[0.04]" />
                <div className="landing-card relative flex h-56 w-44 rotate-3 flex-col items-center justify-center gap-3 p-6">
                  <LandingIcon name="trophy" className="h-9 w-9 text-gold" />
                  <p className="font-display text-3xl text-ink dark:text-ink-dark">1465</p>
                  <p className="text-center text-xs text-ink-muted dark:text-ink-dark/50">
                    {language === 'kz' ? 'оқу күні' : 'дней обучения'}
                  </p>
                  <div className="h-1 w-full rounded-full bg-ink/10 dark:bg-ink-dark/10">
                    <div className="h-full w-3/5 rounded-full bg-gold" />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div>
                <Eyebrow>{text.flashcardsEyebrow}</Eyebrow>
                <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink dark:text-ink-dark sm:text-5xl">
                  {text.flashcardsTitle}
                  <br />
                  <span className="text-2xl italic text-gold sm:text-3xl">{text.flashcardsSub}</span>
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-7 text-ink-muted dark:text-ink-dark/60">{text.flashcardsDesc}</p>
                <div className="mt-7 space-y-3">
                  {(language === 'kz'
                    ? ['Пәнді таңдаңыз', 'Карточканы оқып аударыңыз', 'Жауапты белгілеңіз']
                    : ['Выберите предмет', 'Прочитайте карточку и переверните', 'Отметьте, насколько легко вспомнили']
                  ).map((item, index) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-medium text-ink dark:text-ink-dark">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/5 text-xs font-semibold text-ink-muted dark:bg-ink-dark/10 dark:text-ink-dark/60">
                        {index + 1}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/flashcards" className="landing-primary-button">
                    <LandingIcon name="cards" className="h-4 w-4" />
                    {language === 'kz' ? 'Бастау' : 'Начать'}
                  </Link>
                  <Link to="/flashcards" className="landing-secondary-button">
                    {language === 'kz' ? 'Толығырақ' : 'Подробнее'}
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="border-t border-ink/10 px-4 py-24 dark:border-ink-dark/10">
        <Reveal>
          <div className="landing-card mx-auto max-w-5xl px-6 py-16 text-center sm:px-12">
            <Eyebrow>{text.ctaEyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink dark:text-ink-dark sm:text-6xl">{text.ctaTitle}</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-7 text-ink-muted dark:text-ink-dark/60">{text.ctaDesc}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/register" className="landing-primary-button">
                {language === 'kz' ? 'Тегін тіркелу' : 'Бесплатная регистрация'}
                <LandingIcon name="arrow" className="h-4 w-4" />
              </Link>
              <button onClick={() => handleStartTest()} className="landing-secondary-button">
                {language === 'kz' ? 'Демо көру' : 'Попробовать демо'}
              </button>
            </div>
            <div className="mx-auto mt-12 max-w-2xl border-t border-ink/10 pt-8 dark:border-ink-dark/10">
              <div className="grid grid-cols-5 gap-2">
                {['1000+', '14+', 'AI', '98%', '24/7'].map((item) => (
                  <div key={item} className="font-display text-lg text-ink dark:text-ink-dark sm:text-2xl">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="relative overflow-hidden border-t border-ink/10 dark:border-ink-dark/10">
        <div className="pointer-events-none absolute inset-0 text-ink dark:text-ink-dark">
          <KazakhPattern />
        </div>
        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 border-b border-ink/10 pb-12 dark:border-ink-dark/10 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <img src="/images/logo.png" alt="QazMind" className="h-10 w-10 rounded-xl" />
                <div>
                  <p className="font-display text-lg text-ink dark:text-ink-dark">QazMind</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted dark:text-ink-dark/45">
                    {language === 'kz' ? 'ЕНТ дайындық платформасы' : 'Платформа подготовки к ЕНТ'}
                  </p>
                </div>
              </div>
              <p className="mt-5 max-w-xs text-sm leading-6 text-ink-muted dark:text-ink-dark/50">
                {language === 'kz'
                  ? 'AI-ментор, тесттер, подкастар және карточкалар арқылы дайындалуға арналған платформа.'
                  : 'AI-платформа для подготовки к ЕНТ с тестами, подкастами и флеш-карточками.'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink dark:text-ink-dark">
                {language === 'kz' ? 'Жылдам сілтемелер' : 'Быстрые ссылки'}
              </h3>
              <div className="mt-5 grid gap-3 text-sm text-ink-muted dark:text-ink-dark/55">
                <a href="#features" className="transition hover:text-ink dark:hover:text-ink-dark">{language === 'kz' ? 'Артықшылықтар' : 'Преимущества'}</a>
                <a href="#subjects" className="transition hover:text-ink dark:hover:text-ink-dark">{language === 'kz' ? 'Пәндер' : 'Предметы'}</a>
                <a href="#podcasts" className="transition hover:text-ink dark:hover:text-ink-dark">{language === 'kz' ? 'Подкастар' : 'Подкасты'}</a>
                <a href="#flashcards" className="transition hover:text-ink dark:hover:text-ink-dark">{language === 'kz' ? 'Карточкалар' : 'Карточки'}</a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink dark:text-ink-dark">
                {language === 'kz' ? 'Құқықтық ақпарат' : 'Юридическая информация'}
              </h3>
              <div className="mt-5 grid gap-3 text-sm text-ink-muted dark:text-ink-dark/55">
                <Link to="/privacy" className="transition hover:text-ink dark:hover:text-ink-dark">{language === 'kz' ? 'Құпиялылық' : 'Конфиденциальность'}</Link>
                <Link to="/terms" className="transition hover:text-ink dark:hover:text-ink-dark">{language === 'kz' ? 'Пайдалану шарттары' : 'Условия использования'}</Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink dark:text-ink-dark">
                {language === 'kz' ? 'Байланыс' : 'Контакты'}
              </h3>
              <div className="mt-5 grid gap-3 text-sm text-ink-muted dark:text-ink-dark/55">
                <a href="mailto:info@qazmind.kz" className="transition hover:text-ink dark:hover:text-ink-dark">info@qazmind.kz</a>
                <a href="mailto:support@qazmind.kz" className="transition hover:text-ink dark:hover:text-ink-dark">support@qazmind.kz</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 pt-8 text-sm text-ink-muted dark:text-ink-dark/50 md:flex-row md:items-center">
            <p>© 2026 QazMind. {language === 'kz' ? 'Барлық құқықтар сақталған.' : 'Все права защищены.'}</p>
            <div className="flex flex-wrap gap-6">
              <Link to="/privacy" className="transition hover:text-ink dark:hover:text-ink-dark">{language === 'kz' ? 'Құпиялылық' : 'Конфиденциальность'}</Link>
              <Link to="/terms" className="transition hover:text-ink dark:hover:text-ink-dark">{language === 'kz' ? 'Шарттар' : 'Условия использования'}</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
