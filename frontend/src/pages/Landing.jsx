import { Link, useNavigate } from 'react-router-dom'
import { useLanguageStore } from '../store/languageStore'
import { useAuthStore } from '../store/authStore'
import { useState, useEffect } from 'react'
import api from '../utils/api'

function LandingIcon({ name, className = 'w-6 h-6', strokeWidth = 2 }) {
  const icons = {
    rocket: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 00-8.48-8.48l-4.33 4.34a2 2 0 000 2.82l4.24 4.24a2 2 0 002.83 0l4.34-4.33z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 15.5l-1 4 4-1M14 10h.01" />
      </>
    ),
    sparkles: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 4l.6 1.4L21 6l-1.4.6L19 8l-.6-1.4L17 6l1.4-.6L19 4zM5 16l.9 2.1L8 19l-2.1.9L5 22l-.9-2.1L2 19l2.1-.9L5 16z" />
      </>
    ),
    document: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75h6l3 3v13.5H7.5a2.25 2.25 0 01-2.25-2.25V6A2.25 2.25 0 017.5 3.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 3.75V7.5H17.25M9 11.25h5.25M9 15h5.25" />
      </>
    ),
    trophy: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5h7.5v2.25a3.75 3.75 0 01-7.5 0V4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.75H4.5A1.5 1.5 0 003 8.25v.75A3.75 3.75 0 006.75 12M18 6.75h1.5A1.5 1.5 0 0121 8.25v.75A3.75 3.75 0 0117.25 12M12 10.5v4.5M9 21h6" />
      </>
    ),
    bot: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75h6M12 3.75v3m-6 3h12a2.25 2.25 0 012.25 2.25v4.5A2.25 2.25 0 0118 18.75H6A2.25 2.25 0 013.75 16.5V12A2.25 2.25 0 016 9.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5h.01M15 13.5h.01M8.25 18.75v1.5M15.75 18.75v1.5" />
      </>
    ),
    book: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    ),
    chart: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15V9.75M12 15V6.75M16.5 15v-3.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15" />
      </>
    ),
    target: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a8.25 8.25 0 108.25 8.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25H20.25V3.75M20.25 3.75L13.5 10.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25a3.75 3.75 0 103.75 3.75" />
      </>
    ),
    headphones: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 1115 0v5.25A2.25 2.25 0 0117.25 19.5H16.5v-6h.75A2.25 2.25 0 0119.5 15.75M4.5 15.75A2.25 2.25 0 016.75 13.5h.75v6h-.75A2.25 2.25 0 014.5 17.25V15.75z" />
      </>
    ),
    mic: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5v1.5a7.5 7.5 0 01-15 0v-1.5M12 19.5v2.25M8.25 21.75h7.5" />
      </>
    ),
    music: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM19.5 17.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18.75V6.75l10.5-2.25v12.75" />
      </>
    ),
    books: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h7.5v9h-7.5zM9.75 4.5h7.5v9h-7.5zM12.75 2.25h4.5v9h-4.5z" />
      </>
    ),
    cards: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5h9a2.25 2.25 0 012.25 2.25v8.25a2.25 2.25 0 01-2.25 2.25h-9A2.25 2.25 0 016 18V9.75A2.25 2.25 0 018.25 7.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7.5V6A2.25 2.25 0 0012.75 3.75h-7.5A2.25 2.25 0 003 6v8.25A2.25 2.25 0 005.25 16.5H6" />
      </>
    ),
    hand: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 11.25V6.75a1.5 1.5 0 113 0v3M11.25 9.75v-4.5a1.5 1.5 0 113 0v4.5M14.25 9.75V6a1.5 1.5 0 113 0v7.5a6 6 0 01-6 6H10.5a4.5 4.5 0 01-4.5-4.5V12.75a1.5 1.5 0 113 0v1.5" />
      </>
    ),
    brain: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5a3 3 0 016 0 3 3 0 013 3 3 3 0 010 6 3 3 0 01-3 3 3 3 0 01-6 0 3 3 0 01-3-3 3 3 0 010-6 3 3 0 013-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5v9M9.75 9.75h4.5M9.75 14.25h4.5" />
      </>
    ),
    atom: (
      <>
        <circle cx="12" cy="12" r="1.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 6.343c2.343 2.343 3.05 5.435 1.58 6.905-1.47 1.47-4.562.763-6.905-1.58-2.343-2.343-3.05-5.435-1.58-6.905 1.47-1.47 4.562-.763 6.905 1.58z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 17.657c-2.343 2.343-5.435 3.05-6.905 1.58-1.47-1.47-.763-4.562 1.58-6.905 2.343-2.343 5.435-3.05 6.905-1.58 1.47 1.47.763 4.562-1.58 6.905z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.343 17.657c-2.343-2.343-3.05-5.435-1.58-6.905 1.47-1.47 4.562-.763 6.905 1.58 2.343 2.343 3.05 5.435 1.58 6.905-1.47 1.47-4.562.763-6.905-1.58z" />
      </>
    ),
    play: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 6.75v10.5L16.5 12 7.5 6.75z" />
    ),
    plus: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.25v13.5M5.25 12h13.5" />
    ),
    trend: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 16.5l4.5-4.5 3 3 6-7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.5h4.5V12" />
      </>
    ),
    lightbulb: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a6 6 0 00-3.75 10.686c.51.397.75 1.031.75 1.678V16.5h6v-.386c0-.647.24-1.281.75-1.678A6 6 0 0012 3.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 19.5h4.5" />
      </>
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l4.5 4.5 10.5-10.5" />
    ),
    xmark: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    ),
    history: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" />
    ),
    calculator: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M12 6v6M8.25 15h.008v.008H8.25V15zm3.75 0h.008v.008H12V15zm3.75 0h.008v.008H15.75V15z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75z" />
      </>
    ),
    bolt: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 2.25L6 13.5h4.5l-1.5 8.25L16.5 10.5H12l1.5-8.25z" />
    ),
    flask: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3v4.59l-4.72 8.259A2.25 2.25 0 006.98 19.5h10.04a2.25 2.25 0 001.95-3.651L14.25 7.59V3M9 3h6" />
    ),
  }

  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

function getSubjectVisual(subject) {
  const fullName = `${subject?.name_ru || ''} ${subject?.name_kz || ''}`.toLowerCase()

  if (fullName.includes('история') || fullName.includes('тарих')) {
    return { icon: 'history', iconClass: 'text-rose-500 dark:text-rose-300', accent: 'from-red-500 to-pink-500' }
  }
  if (fullName.includes('математ')) {
    return { icon: 'calculator', iconClass: 'text-sky-500 dark:text-sky-300', accent: 'from-sky-500 to-indigo-500' }
  }
  if (fullName.includes('грамот') || fullName.includes('оқу') || fullName.includes('язык') || fullName.includes('тілі')) {
    return { icon: 'books', iconClass: 'text-emerald-500 dark:text-emerald-300', accent: 'from-emerald-500 to-cyan-500' }
  }
  if (fullName.includes('физик')) {
    return { icon: 'atom', iconClass: 'text-violet-500 dark:text-violet-300', accent: 'from-violet-500 to-purple-500' }
  }
  if (fullName.includes('хими')) {
    return { icon: 'flask', iconClass: 'text-cyan-500 dark:text-cyan-300', accent: 'from-cyan-500 to-blue-500' }
  }
  if (fullName.includes('биолог')) {
    return { icon: 'sparkles', iconClass: 'text-green-500 dark:text-green-300', accent: 'from-green-500 to-emerald-500' }
  }
  if (fullName.includes('географ')) {
    return { icon: 'target', iconClass: 'text-amber-500 dark:text-amber-300', accent: 'from-amber-500 to-orange-500' }
  }
  if (fullName.includes('информат')) {
    return { icon: 'chart', iconClass: 'text-fuchsia-500 dark:text-fuchsia-300', accent: 'from-fuchsia-500 to-pink-500' }
  }

  return { icon: 'book', iconClass: 'text-blue-500 dark:text-blue-300', accent: 'from-blue-500 to-cyan-500' }
}

export default function Landing() {
  const { language } = useLanguageStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const [showAllProfile, setShowAllProfile] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(null)

  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      const response = await api.get('/subjects/')
      const data = response.data
      const mathIndex = data.findIndex(
        (subject) =>
          subject.name_ru === 'Математика' || subject.name_kz === 'Математика'
      )
      const historyIndex = data.findIndex(
        (subject) =>
          subject.name_ru === 'История Казахстана' ||
          subject.name_kz === 'Қазақстан тарихы'
      )

      if (mathIndex !== -1 && historyIndex !== -1) {
        ;[data[mathIndex], data[historyIndex]] = [data[historyIndex], data[mathIndex]]
      }

      setSubjects(data)
    } catch (err) {
      console.error('Error loading subjects:', err)
    } finally {
      setLoadingSubjects(false)
    }
  }

  const t = {
    kz: {
      hero: {
        title: 'ҰБТ-ға дайындалу',
        subtitle: 'AI-ментормен',
        description: 'Жасанды интеллект қателеріңізді талдайды және түсіндіреді. Тестілеуден өтіп, білім деңгейіңізді көтеріңіз!',
        tryDemo: 'Демо тестілеу',
        startLearning: 'Оқуды бастау',
      },
      features: {
        title: 'Неліктен QazMind?',
        ai: {
          title: 'AI түсіндіру',
          desc: 'Әр қателікке жеке түсініктеме'
        },
        adaptive: {
          title: 'Бейімделген оқыту',
          desc: 'Қателіктеріңізге негізделген тестілер'
        },
        tracking: {
          title: 'Прогресс бақылау',
          desc: 'Өз нәтижелеріңізді қадағалаңыз'
        },
      },
      subjects: {
        title: 'Қол жетімді пәндер',
        required: 'Міндетті пәндер',
        profile: 'Бейінді пәндер',
        questions: 'сұрақ',
        startTest: 'Тест бастау',
        comingSoon: 'Жақында...'
      },
      tutor: {
        badge: 'Жаңа AI-формат',
        title: 'AI-репетитор по теме',
        description: 'Тақырыпты таңда, мини-сабақ ал, өз сөзіңмен жауап жаз, ал AI сенің ойлауыңды, дәлдігіңді және түсінгеніңді тексереді.',
        feature1: 'Тақырыпты қарапайым тілмен түсіндіреді',
        feature2: '5 ұқсас сұрақ береді',
        feature3: 'Жазбаша тапсырманы тексереді',
        start: 'AI-репетиторды ашу',
        test: 'Алдымен тест тапсыру'
      },
      podcasts: {
        title: 'AI Подкастар',
        subtitle: '3-5 минуттық аудио-лекциялар',
        description: 'Кез келген уақытта, кез келген жерде тыңдаңыз',
        feature1: 'Жаңа тақырыптар әр апта',
        feature2: 'Тақырып бойынша дайындық',
        feature3: 'Кәсіби түсіндірмелер',
        listenNow: 'Тыңдау',
        comingSoon: 'Жақында шығады'
      },
      flashcards: {
        title: 'Флеш-карточкалар',
        subtitle: 'Spaced Repetition алгоритмімен',
        description: 'Материалды тиімді есте сақтау',
        feature1: 'Tinder стилі свайп',
        feature2: 'SuperMemo-2 алгоритмі',
        feature3: 'Жеке бейімделу',
        cardsFront: 'карточек қолжетімді',
        knowButton: 'Білемін',
        learningButton: 'Үйренемін',
        startCards: 'Бастау',
        learnMore: 'Көбірек білу'
      },
    },
    ru: {
      hero: {
        title: 'Подготовка к ЕНТ',
        subtitle: 'с AI-ментором',
        description: 'Искусственный интеллект анализирует и объясняет ваши ошибки. Проходите тесты и повышайте уровень знаний!',
        tryDemo: 'Демо тест',
        startLearning: 'Начать обучение',
      },
      features: {
        title: 'Почему QazMind?',
        ai: {
          title: 'AI объяснения',
          desc: 'Персонализированные объяснения каждой ошибки'
        },
        adaptive: {
          title: 'Адаптивное обучение',
          desc: 'Тесты на основе ваших ошибок'
        },
        tracking: {
          title: 'Отслеживание прогресса',
          desc: 'Следите за своими результатами'
        },
      },
      subjects: {
        title: 'Доступные предметы',
        required: 'Обязательные предметы',
        profile: 'Профильные предметы',
        questions: 'вопросов',
        startTest: 'Начать тест',
        comingSoon: 'Скоро...'
      },
      tutor: {
        badge: 'Новый AI-режим',
        title: 'AI-репетитор по теме',
        description: 'Выбери тему, получи мини-урок, напиши ответ своими словами и дай AI проверить, насколько глубоко ты понял материал.',
        feature1: 'Объясняет тему простым языком',
        feature2: 'Даёт 5 похожих вопросов',
        feature3: 'Проверяет письменный ответ',
        start: 'Открыть AI-репетитора',
        test: 'Сначала пройти тест'
      },
      podcasts: {
        title: 'AI Подкасты',
        subtitle: 'Аудио-лекции по 3-5 минут',
        description: 'Слушайте в любое время, в любом месте',
        feature1: 'Новые темы каждую неделю',
        feature2: 'Целевая подготовка',
        feature3: 'Профессиональные объяснения',
        listenNow: 'Слушать',
        comingSoon: 'Скоро'
      },
      flashcards: {
        title: 'Флеш-карточки',
        subtitle: 'С алгоритмом Spaced Repetition',
        description: 'Эффективное запоминание материала',
        feature1: 'Tinder-стиль свайп',
        feature2: 'Алгоритм SuperMemo-2',
        feature3: 'Персональная адаптация',
        cardsFront: 'карточек доступно',
        knowButton: 'Знаю',
        learningButton: 'Учу',
        startCards: 'Начать',
        learnMore: 'Подробнее'
      },
    }
  }

  const content = t[language]

  const handleStartTest = (subjectId = 1) => {
    if (isAuthenticated) {
      navigate(`/test/${subjectId}`)
    } else {
      navigate('/register')
    }
  }

  const getDefaultTutorSubject = () => {
    const withQuestions = subjects.filter(subject => (subject.questions_count || 0) > 0)
    const preferred = withQuestions.find(
      subject =>
        subject.name_ru === 'Информатика' ||
        subject.name_kz === 'Информатика'
    )
    return preferred || withQuestions[0] || null
  }

  const handleStartTutor = (subjectId) => {
    if (!subjectId) return
    if (isAuthenticated) {
      navigate(`/tutor/${subjectId}`)
    } else {
      navigate('/register')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Premium */}
      <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_14%,rgba(34,211,238,0.16),transparent_18%),radial-gradient(circle_at_84%_22%,rgba(168,85,247,0.16),transparent_22%),radial-gradient(circle_at_80%_84%,rgba(236,72,153,0.18),transparent_24%),linear-gradient(145deg,#13204a_0%,#241556_34%,#45126a_64%,#741655_100%)] text-white flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.06]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/14"></div>
          <div className="absolute -left-16 top-20 h-32 w-32 rounded-[34px] border border-white/10 bg-white/[0.03] rotate-12"></div>
          <div className="absolute right-16 top-32 h-14 w-14 rounded-full border border-white/10 bg-white/[0.03]"></div>
          <div className="absolute bottom-20 left-1/4 h-16 w-16 rounded-[22px] border border-white/10 bg-white/[0.03] -rotate-12"></div>
          <div className="absolute left-[44%] top-[54%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/8 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[0.98fr_1.02fr] gap-16 items-center">
              <div className="space-y-9">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/8 border border-white/12 backdrop-blur-md flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.14)]">
                    <img src="/images/logo.png" alt="QazMind Logo" className="w-9 h-9" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">QazMind</h2>
                    <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/55">
                      {language === 'kz' ? 'AI дайындық жүйесі' : 'AI learning system'}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/[0.07] border border-white/12 backdrop-blur-md shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/12 text-cyan-200">
                    <LandingIcon name="sparkles" className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-semibold text-white/88">
                    {language === 'kz' ? 'Заманауи әрі тиімді дайындық' : 'Современная и понятная подготовка'}
                  </span>
                </div>

                <div className="space-y-5">
                  <h1 className="max-w-3xl text-6xl lg:text-[6.8rem] font-black leading-[0.9] tracking-[-0.055em]">
                    <span className="block bg-gradient-to-r from-cyan-300 via-sky-200 to-fuchsia-100 bg-clip-text text-transparent">
                      {content.hero.title}
                    </span>
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-2xl lg:text-[2.65rem] font-bold text-cyan-100">
                    <span>{content.hero.subtitle}</span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] border border-white/12 backdrop-blur-md">
                      <LandingIcon name="bot" className="w-7 h-7 text-cyan-200" />
                    </span>
                  </div>
                </div>

                <p className="max-w-xl text-lg lg:text-[1.35rem] leading-8 text-white/84">
                  {content.hero.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-1">
                  <button
                    onClick={handleStartTest}
                    className="group relative px-8 py-4 text-lg font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_14px_32px_rgba(236,72,153,0.2)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 transition-opacity duration-300"></div>
                    <span className="relative text-white flex items-center justify-center gap-2">
                      {isAuthenticated ? content.hero.startLearning : content.hero.tryDemo}
                      <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>

                  <Link
                    to={isAuthenticated ? "/dashboard" : "/register"}
                    className="group px-8 py-4 text-lg font-bold rounded-2xl backdrop-blur-md bg-white/[0.05] border border-white/14 hover:bg-white/[0.1] transition-all duration-300 hover:scale-[1.02] text-white text-center shadow-[0_10px_24px_rgba(0,0,0,0.1)]"
                  >
                    <span className="inline-flex items-center gap-2">
                      {isAuthenticated
                        ? (language === 'kz' ? 'Дашборд' : 'Панель управления')
                        : (language === 'kz' ? 'Тегін тіркелу' : 'Зарегистрироваться')}
                      <svg className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-7">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-4 shadow-[0_10px_24px_rgba(0,0,0,0.1)]">
                    <div className="text-3xl font-black text-cyan-300">14+</div>
                    <div className="text-sm mt-1 text-cyan-100/80">{language === 'kz' ? 'Пән' : 'Предметов'}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-4 shadow-[0_10px_24px_rgba(0,0,0,0.1)]">
                    <div className="text-3xl font-black text-violet-300">1000+</div>
                    <div className="text-sm mt-1 text-violet-100/80">{language === 'kz' ? 'Сұрақ' : 'Вопросов'}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-4 shadow-[0_10px_24px_rgba(0,0,0,0.1)]">
                    <div className="text-3xl font-black text-pink-300">AI</div>
                    <div className="text-sm mt-1 text-pink-100/80">{language === 'kz' ? 'Ментор' : 'Наставник'}</div>
                  </div>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-violet-400/8 to-pink-500/10 rounded-[40px] blur-3xl"></div>
                <div className="relative ml-auto max-w-[540px]">
                  <div className="relative overflow-hidden rounded-[38px] border border-white/14 bg-white/[0.09] p-6 backdrop-blur-2xl shadow-[0_26px_80px_rgba(0,0,0,0.2)] rotate-[-2deg]">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"></div>
                    <div className="absolute -right-8 top-12 h-24 w-24 rounded-full bg-cyan-300/10 blur-2xl"></div>
                    <div className="absolute -left-8 bottom-10 h-24 w-24 rounded-full bg-pink-400/12 blur-2xl"></div>

                    <div className="relative space-y-5">
                      <div className="flex items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-white/[0.05] px-5 py-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                            {language === 'kz' ? 'QazMind жүйесі' : 'QazMind system'}
                          </p>
                          <p className="mt-1 text-base font-bold text-white/90">
                            {language === 'kz' ? 'AI дайындық панелі' : 'AI панель подготовки'}
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-3 rounded-2xl border border-cyan-300/14 bg-cyan-400/10 px-4 py-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                            <LandingIcon name="trend" className="w-5 h-5" />
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/65">{language === 'kz' ? 'Өсу' : 'Рост'}</p>
                            <p className="text-lg font-black text-white">+28%</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.14] to-white/[0.06] p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                              <LandingIcon name="document" className="w-7 h-7" />
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-white/45">{language === 'kz' ? 'Сценарий' : 'Сценарий'}</p>
                              <h3 className="text-xl font-black text-white">{language === 'kz' ? 'Сынақ №1' : 'Тест №1'}</h3>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-slate-900 shadow-[0_8px_20px_rgba(74,222,128,0.25)]">
                            <LandingIcon name="check" className="w-4 h-4" />
                            {language === 'kz' ? 'Күшті' : 'Отлично'}
                          </span>
                        </div>

                        <div className="mb-3 flex items-center justify-between text-sm">
                          <span className="text-white/70">{language === 'kz' ? 'Прогресс' : 'Прогресс'}</span>
                          <span className="font-bold text-cyan-200">80%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-300 shadow-[0_0_16px_rgba(103,232,249,0.25)]"></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-[24px] border border-cyan-300/12 bg-gradient-to-br from-cyan-400/14 to-blue-500/8 p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-3xl font-black text-cyan-200">28</div>
                              <div className="mt-1 text-sm text-cyan-50/70">{language === 'kz' ? 'Пройдено' : 'Пройдено'}</div>
                            </div>
                            <LandingIcon name="book" className="w-8 h-8 text-cyan-200/80" />
                          </div>
                        </div>
                        <div className="rounded-[24px] border border-fuchsia-300/12 bg-gradient-to-br from-violet-400/14 to-pink-500/8 p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-3xl font-black text-fuchsia-200">156</div>
                              <div className="mt-1 text-sm text-fuchsia-50/70">{language === 'kz' ? 'Ұпай' : 'Очки'}</div>
                            </div>
                            <LandingIcon name="chart" className="w-8 h-8 text-fuchsia-200/80" />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-amber-300/12 bg-gradient-to-r from-amber-400/12 via-orange-400/8 to-pink-400/8 p-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-amber-100">
                            <LandingIcon name="trophy" className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-sm uppercase tracking-[0.22em] text-amber-100/55">{language === 'kz' ? 'Статус' : 'Статус'}</p>
                            <p className="text-xl font-black text-amber-50">{language === 'kz' ? 'Үздік оқушы режимі' : 'Режим лучшего ученика'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-[1.15fr_0.85fr] gap-4">
                        <div className="rounded-[24px] border border-white/10 bg-gradient-to-r from-white/[0.12] to-white/[0.06] p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-400/12 text-pink-200">
                              <LandingIcon name="bot" className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-white/45">AI</p>
                              <p className="text-sm font-bold text-white">{language === 'kz' ? 'Жеке түсіндіру' : 'Персональный разбор'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-[24px] border border-cyan-300/12 bg-gradient-to-br from-cyan-400/12 to-violet-500/10 p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                            {language === 'kz' ? 'Дәлдік' : 'Точность'}
                          </p>
                          <p className="mt-2 text-2xl font-black text-cyan-200">92%</p>
                          <p className="mt-1 text-sm text-white/60">
                            {language === 'kz' ? 'AI талдауы' : 'AI анализ'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 3D Cards */}
      <section id="features" className="py-32 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-block mb-4 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg">
              <LandingIcon name="sparkles" className="w-4 h-4" /> {language === 'kz' ? 'Біздің артықшылықтар' : 'Наши преимущества'}
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {content.features.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {language === 'kz' 
                ? 'Заманауи технологиялар мен AI арқылы тиімді оқыту'
                : 'Эффективное обучение с помощью современных технологий и AI'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 - AI */}
            <div className="group animate-scale-in" style={{animationDelay: '0.1s'}}>
              <div className="relative h-full">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                <div className="relative h-full bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-gray-200 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-500 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2">
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <LandingIcon name="bot" className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {content.features.ai.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {content.features.ai.desc}
                  </p>
                  <button 
                    onClick={() => setSelectedFeature('ai')}
                    className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold group-hover:gap-4 transition-all cursor-pointer"
                  >
                    <span>{language === 'kz' ? 'Көбірек білу' : 'Узнать больше'}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Feature 2 - Adaptive */}
            <div className="group animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                <div className="relative h-full bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-gray-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2">
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <LandingIcon name="book" className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {content.features.adaptive.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {content.features.adaptive.desc}
                  </p>
                  <button 
                    onClick={() => setSelectedFeature('adaptive')}
                    className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold group-hover:gap-4 transition-all cursor-pointer"
                  >
                    <span>{language === 'kz' ? 'Көбірек білу' : 'Узнать больше'}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Feature 3 - Progress */}
            <div className="group animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                <div className="relative h-full bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-gray-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2">
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <LandingIcon name="chart" className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {content.features.tracking.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {content.features.tracking.desc}
                  </p>
                  <button 
                    onClick={() => setSelectedFeature('tracking')}
                    className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold group-hover:gap-4 transition-all cursor-pointer"
                  >
                    <span>{language === 'kz' ? 'Көбірек білу' : 'Узнать больше'}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section - Improved */}
      <section id="subjects" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-cyan-50/50 to-purple-50/50 dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-900"></div>
        
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-300/10 dark:bg-cyan-500/5 rounded-full blur-3xl -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300/10 dark:bg-purple-500/5 rounded-full blur-3xl -ml-40 -mb-40"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30">
              <LandingIcon name="book" className="w-6 h-6 text-cyan-600 dark:text-cyan-300" />
              <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">
                {language === 'kz' ? '14 пәндерде білік' : '14 предметов для подготовки'}
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-600 dark:from-cyan-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              {content.subjects.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {language === 'kz' ? '1000+ сұрақ, AI ұсынымы және толық түсіндірме' : '1000+ вопросов, AI рекомендации и полные объяснения'}
            </p>
          </div>

          <div className="max-w-7xl mx-auto space-y-12">
            {/* Required Subjects */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white">
                  <LandingIcon name="sparkles" className="w-6 h-6 inline-block mr-2 text-amber-500" />{content.subjects.required}
                </h3>
                <span className="ml-auto px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-full text-sm font-bold text-red-700 dark:text-red-400">
                  {language === 'kz' ? 'Міндетті' : 'Обязательно'}
                </span>
              </div>

              {loadingSubjects ? (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-40 bg-gray-200 dark:bg-slate-700 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {subjects.slice(0, 4).map((subject, index) => {
                    const subjectVisual = getSubjectVisual(subject)

                    return (
                    <div
                      key={subject.id}
                      className="group relative animate-scale-in"
                      style={{animationDelay: `${index * 0.08}s`}}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${subjectVisual.accent} rounded-2xl blur-lg opacity-0 group-hover:opacity-25 transition-opacity duration-500`}></div>
                      
                      <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-500 transition-all duration-300 h-full flex flex-col group-hover:shadow-xl group-hover:-translate-y-1">
                        <div className="flex-1 p-5 space-y-3">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subjectVisual.accent} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 origin-left`}>
                            <LandingIcon name={subjectVisual.icon} className="w-8 h-8 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            {language === 'kz' ? subject.name_kz : subject.name_ru}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {subject.questions_count || '40'} {content.subjects.questions}
                          </p>
                        </div>
                        <button
                          onClick={() => handleStartTest(subject.id)}
                          className={`w-full px-4 py-3 bg-gradient-to-r ${subjectVisual.accent} text-white font-bold text-sm rounded-b-lg transition-all duration-300 group-hover:shadow-lg`}
                        >
                          {content.subjects.startTest}
                        </button>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>

            {/* Profile Subjects */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white">
                  <LandingIcon name="target" className="w-6 h-6 inline-block mr-2 text-purple-500" />{content.subjects.profile}
                </h3>
                <span className="ml-auto px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full text-sm font-bold text-purple-700 dark:text-purple-400">
                  {language === 'kz' ? 'Таңдау' : 'На выбор'}
                </span>
              </div>

              {loadingSubjects ? (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-40 bg-gray-200 dark:bg-slate-700 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {subjects.slice(4, 7).map((subject, index) => {
                      const subjectVisual = getSubjectVisual(subject)

                      return (
                      <div
                        key={subject.id}
                        className="group relative animate-scale-in"
                        style={{animationDelay: `${index * 0.08}s`}}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${subjectVisual.accent} rounded-2xl blur-lg opacity-0 group-hover:opacity-25 transition-opacity duration-500`}></div>
                        
                        <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 h-full flex flex-col group-hover:shadow-xl group-hover:-translate-y-1">
                          <div className="flex-1 p-5 space-y-3">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subjectVisual.accent} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 origin-left`}>
                              <LandingIcon name={subjectVisual.icon} className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                              {language === 'kz' ? subject.name_kz : subject.name_ru}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {subject.questions_count || '40'} {content.subjects.questions}
                            </p>
                          </div>
                          <button
                            onClick={() => handleStartTest(subject.id)}
                            className={`w-full px-4 py-3 bg-gradient-to-r ${subjectVisual.accent} text-white font-bold text-sm rounded-b-lg transition-all duration-300 group-hover:shadow-lg`}
                          >
                            {content.subjects.startTest}
                          </button>
                        </div>
                      </div>
                    )})}
                  </div>

                  {/* Show More Subjects */}
                  {subjects.length > 7 && (
                    <div className="text-center">
                      <button
                        onClick={() => setShowAllProfile(!showAllProfile)}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                      >
                        <span>
                          {showAllProfile 
                            ? (language === 'kz' ? 'Жасыру' : 'Скрыть') 
                            : (language === 'kz' ? `Барлығын көрсету (+${subjects.length - 7})` : `Показать все (+${subjects.length - 7})`)}
                        </span>
                        <svg 
                          className={`w-5 h-5 transition-transform duration-300 ${showAllProfile ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Additional subjects */}
                  <div
                    className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-hidden transition-all duration-700 ease-in-out"
                    style={{
                      maxHeight: showAllProfile ? '2000px' : '0',
                      opacity: showAllProfile ? 1 : 0,
                      marginTop: showAllProfile ? '16px' : '0'
                    }}
                  >
                    {subjects.slice(7).map((subject, index) => {
                      const subjectVisual = getSubjectVisual(subject)

                      return (
                      <div
                        key={subject.id}
                        className="group relative"
                        style={{
                          animation: showAllProfile ? `scaleIn 0.6s ease-out ${0.1 + index * 0.05}s both` : 'none'
                        }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${subjectVisual.accent} rounded-2xl blur-lg opacity-0 group-hover:opacity-25 transition-opacity duration-500`}></div>
                        
                        <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 h-full flex flex-col group-hover:shadow-xl group-hover:-translate-y-1">
                          <div className="flex-1 p-5 space-y-3">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subjectVisual.accent} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 origin-left`}>
                              <LandingIcon name={subjectVisual.icon} className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                              {language === 'kz' ? subject.name_kz : subject.name_ru}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {subject.questions_count || '40'} {content.subjects.questions}
                            </p>
                          </div>
                          {subject.questions_count > 0 ? (
                            <button
                              onClick={() => handleStartTest(subject.id)}
                              className={`w-full px-4 py-3 bg-gradient-to-r ${subjectVisual.accent} text-white font-bold text-sm rounded-b-lg transition-all duration-300 group-hover:shadow-lg`}
                            >
                              {content.subjects.startTest}
                            </button>
                          ) : (
                            <span className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-400 font-bold text-sm text-center rounded-b-lg">
                              {content.subjects.comingSoon}
                            </span>
                          )}
                        </div>
                      </div>
                    )})}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AI Tutor Section */}
      <section id="ai-tutor" className="relative py-28 overflow-hidden bg-[radial-gradient(circle_at_20%_30%,rgba(56,189,248,0.13),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_40%),linear-gradient(160deg,#0f172a_0%,#1e1b4b_45%,#2e1065_100%)]">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-violet-600/20 blur-[96px]"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-cyan-500/15 blur-[96px]"></div>
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] rounded-full bg-indigo-500/10 blur-[80px]"></div>
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">

              {/* Left: Text content */}
              <div className="space-y-8 animate-slide-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-cyan-400/25 bg-white/[0.06] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/20">
                    <LandingIcon name="sparkles" className="w-3.5 h-3.5 text-cyan-300" />
                  </span>
                  <span className="text-sm font-bold tracking-wide text-cyan-200">
                    {content.tutor.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-5xl md:text-[3.75rem] font-black leading-[1.05] tracking-tight bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300 bg-clip-text text-transparent">
                  {content.tutor.title}
                </h2>

                {/* Description */}
                <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-lg">
                  {content.tutor.description}
                </p>

                {/* Feature pills */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {[
                    { text: content.tutor.feature1, icon: 'bot' },
                    { text: content.tutor.feature2, icon: 'book' },
                    { text: content.tutor.feature3, icon: 'check' },
                  ].map(({ text, icon }, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur px-4 py-3.5 text-sm font-semibold text-white/85 shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:bg-white/[0.09] hover:border-cyan-400/30 transition-all duration-200"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-white/10">
                        <LandingIcon name={icon} className="w-4 h-4 text-cyan-300" />
                      </span>
                      {text}
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-1">
                  <button
                    onClick={() => handleStartTutor(getDefaultTutorSubject()?.id)}
                    disabled={!getDefaultTutorSubject()}
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl overflow-hidden font-bold text-base text-white shadow-[0_14px_32px_rgba(139,92,246,0.35)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-purple-600"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400 via-violet-400 to-purple-500 transition-opacity duration-300"></div>
                    <LandingIcon name="sparkles" className="relative w-5 h-5 text-white" />
                    <span className="relative">{content.tutor.start}</span>
                    <svg className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>

                  {getDefaultTutorSubject() && (
                    <button
                      onClick={() => handleStartTest(getDefaultTutorSubject().id)}
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur text-white/85 font-bold hover:bg-white/[0.12] hover:border-white/25 transition-all duration-200"
                    >
                      <LandingIcon name="book" className="w-5 h-5 text-cyan-300" />
                      <span>{content.tutor.test}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right: Preview card */}
              <div className="animate-scale-in">
                <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.07] backdrop-blur-xl shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden">
                  {/* Card inner glow */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/12 rounded-[2rem]"></div>
                  <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-violet-500/20 blur-3xl"></div>

                  <div className="relative p-7 md:p-8 space-y-5">
                    {/* Card header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[0.7rem] font-black uppercase tracking-[0.28em] text-cyan-400/80 mb-2">AI Tutor</div>
                        <div className="text-2xl font-black text-white leading-tight">
                          {getDefaultTutorSubject()
                            ? `${language === 'kz' ? getDefaultTutorSubject().name_kz : getDefaultTutorSubject().name_ru}`
                            : (language === 'kz' ? 'Кез келген пән' : 'Любой предмет')}
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-[0_8px_24px_rgba(139,92,246,0.5)]">
                        <LandingIcon name="sparkles" className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    {/* Mini-lesson format */}
                    <div className="rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.08] px-5 py-4">
                      <div className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-cyan-400/70 mb-3">
                        {language === 'kz' ? 'Мини-сабақ форматы' : 'Формат мини-урока'}
                      </div>
                      <div className="space-y-2">
                        {(language === 'kz'
                          ? ['Тақырыпты таңда', 'AI түсіндіреді', 'Сен жазбаша жауап бересің', 'AI нақты кері байланыс береді']
                          : ['Выбираешь тему', 'AI объясняет', 'Ты пишешь ответ', 'AI даёт точную обратную связь']
                        ).map((step, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 text-[0.65rem] font-black text-cyan-300">
                              {i + 1}
                            </span>
                            <span className="text-sm text-white/75">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4">
                        <div className="text-3xl font-black bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">5</div>
                        <div className="text-xs text-white/50 mt-1 font-medium">
                          {language === 'kz' ? 'ұқсас сұрақ' : 'похожих вопросов'}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4">
                        <div className="text-3xl font-black bg-gradient-to-r from-violet-300 to-purple-400 bg-clip-text text-transparent">100</div>
                        <div className="text-xs text-white/50 mt-1 font-medium">
                          {language === 'kz' ? 'ұпаймен тексеру' : 'балльная проверка'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Podcasts Section */}
      <section id="podcasts" className="py-24 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-down">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white shadow-2xl animate-bounce-subtle">
                <LandingIcon name="headphones" className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              {content.podcasts.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-semibold mb-3">
              {content.podcasts.subtitle}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {content.podcasts.description}
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="card glass-effect text-center group hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up border-2 border-orange-200 dark:border-orange-900">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <LandingIcon name="mic" className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {content.podcasts.feature1}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'kz' ? 'Үнемі жаңартылатын контент' : 'Регулярно обновляемый контент'}
                </p>
              </div>

              <div className="card glass-effect text-center group hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up border-2 border-pink-200 dark:border-pink-900" style={{animationDelay: '0.1s'}}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <LandingIcon name="target" className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {content.podcasts.feature2}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'kz' ? 'Керекті тақырыптарға фокус' : 'Фокус на нужные темы'}
                </p>
              </div>

              <div className="card glass-effect text-center group hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up border-2 border-purple-200 dark:border-purple-900" style={{animationDelay: '0.2s'}}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <LandingIcon name="sparkles" className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {content.podcasts.feature3}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'kz' ? 'Мамандардан түсініктеме' : 'Объяснения от экспертов'}
                </p>
              </div>
            </div>

            {/* Podcast Preview Card */}
            <div className="card glass-effect relative overflow-hidden group animate-scale-in" style={{animationDelay: '0.3s'}}>
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 group-hover:opacity-100 opacity-50 transition-opacity"></div>
              
              <div className="relative flex flex-col md:flex-row items-center gap-8 p-8">
                {/* Left - Visual */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-2xl group-hover:scale-105 transition-transform">
                      <div className="text-center">
                        <LandingIcon name="music" className="w-14 h-14 mx-auto mb-2 text-white" />
                        <div className="text-sm font-semibold">3-5 {language === 'kz' ? 'мин' : 'мин'}</div>
                      </div>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400 rounded-full opacity-20 animate-pulse"></div>
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-500 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                </div>

                {/* Right - Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-bold rounded-full mb-4 animate-pulse">
                    {content.podcasts.comingSoon}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    {language === 'kz' 
                      ? 'Қазақстан тарихы: Алтын Орда' 
                      : 'История Казахстана: Золотая Орда'}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {language === 'kz'
                      ? 'Алтын Орданың құрылуы мен дамуы туралы қысқаша аудио-лекция. Негізгі оқиғалар мен маңызды тұлғалар.'
                      : 'Краткая аудио-лекция о создании и развитии Золотой Орды. Ключевые события и важные персоны.'}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                      <LandingIcon name="history" className="w-4 h-4 inline-block mr-1" />{language === 'kz' ? 'Тарих' : 'История'}
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                      <LandingIcon name="sparkles" className="w-4 h-4 inline-block mr-1" />{language === 'kz' ? 'Орташа' : 'Средний'}
                    </span>
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold">
                      <LandingIcon name="headphones" className="w-4 h-4 inline-block mr-1" />5 {language === 'kz' ? 'мин' : 'мин'}
                    </span>
                  </div>

                  <Link
                    to={isAuthenticated ? "/podcasts" : "/dashboard"}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>{isAuthenticated ? content.podcasts.listenNow : (language === 'kz' ? 'Бастау' : 'Начать')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flashcards Section */}
      <section id="flashcards" className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-slide-down">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-2xl animate-bounce-subtle">
                <LandingIcon name="cards" className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              {content.flashcards.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-semibold mb-3">
              {content.flashcards.subtitle}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {content.flashcards.description}
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="card glass-effect text-center group hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up border-2 border-purple-200 dark:border-purple-900">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <LandingIcon name="hand" className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {content.flashcards.feature1}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'kz' ? 'Оңға - білемін, солға - үйренемін' : 'Вправо - знаю, влево - учу'}
                </p>
              </div>

              <div className="card glass-effect text-center group hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up border-2 border-pink-200 dark:border-pink-900" style={{animationDelay: '0.1s'}}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-400 to-blue-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <LandingIcon name="brain" className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {content.flashcards.feature2}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'kz' ? 'Ғылыми есте сақтау әдісі' : 'Научный метод запоминания'}
                </p>
              </div>

              <div className="card glass-effect text-center group hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up border-2 border-blue-200 dark:border-blue-900" style={{animationDelay: '0.2s'}}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <LandingIcon name="chart" className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {content.flashcards.feature3}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'kz' ? 'Сіздің қарқыныңызбен' : 'В вашем темпе'}
                </p>
              </div>
            </div>

            {/* Flashcard Demo Preview */}
            <div className="card glass-effect relative overflow-hidden group animate-scale-in" style={{animationDelay: '0.3s'}}>
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 group-hover:opacity-100 opacity-50 transition-opacity"></div>
              
              <div className="relative flex flex-col md:flex-row items-center gap-8 p-8">
                {/* Left - Card Visual */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {/* Card Stack Effect */}
                    <div className="absolute top-2 left-2 w-48 h-64 rounded-2xl bg-gradient-to-br from-purple-300 to-pink-300 opacity-30"></div>
                    <div className="absolute top-1 left-1 w-48 h-64 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 opacity-50"></div>
                    
                    {/* Main Card */}
                    <div className="relative w-48 h-64 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex flex-col items-center justify-center text-white shadow-2xl group-hover:scale-105 transition-transform p-6">
                      <div className="text-center">
                        <LandingIcon name="trophy" className="w-12 h-12 mx-auto mb-4 text-white" />
                        <div className="text-lg font-bold mb-2">1465 год</div>
                        <div className="text-sm opacity-90">
                          {language === 'kz' ? 'Нажмите чтобы перевернуть' : 'Нажмите чтобы перевернуть'}
                        </div>
                      </div>
                      
                      {/* Swipe indicators */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
                        <div className="flex items-center gap-1 text-white/60">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                          <LandingIcon name="book" className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-1 text-white/60">
                          <LandingIcon name="check" className="w-5 h-5" />
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats badge */}
                    <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                      58 {content.flashcards.cardsFront}
                    </div>
                  </div>
                </div>

                {/* Right - Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-bold rounded-full mb-4">
                    <LandingIcon name="sparkles" className="w-4 h-4 inline-block mr-1" />{language === 'kz' ? 'Қазір қолжетімді!' : 'Уже доступно!'}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    {language === 'kz' 
                      ? 'Материалды тез есте сақтаңыз' 
                      : 'Запоминайте материал быстрее'}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {language === 'kz'
                      ? 'SuperMemo-2 алгоритмі есте сақтаудың ең тиімді уақытын анықтайды. Күн сайын 10 минут жеткілікті!'
                      : 'Алгоритм SuperMemo-2 определяет оптимальное время для повторения. Достаточно 10 минут в день!'}
                  </p>
                  
                  {/* How it works */}
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400 font-bold flex-shrink-0">
                        1
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-left">
                        {language === 'kz' ? 'Пәнді таңдаңыз' : 'Выберите предмет'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">
                        2
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-left">
                        {language === 'kz' ? 'Карточканы оқыңыз және аударыңыз' : 'Прочитайте карточку и переверните'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">
                        3
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-left">
                        {language === 'kz' ? 'Свайп немесе батырма арқылы бағалаңыз' : 'Свайпните или нажмите кнопку'}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <Link
                      to={isAuthenticated ? "/flashcards" : "/dashboard"}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                      </svg>
                      <span>{isAuthenticated ? content.flashcards.startCards : (language === 'kz' ? 'Бастау' : 'Начать')}</span>
                    </Link>
                    
                    <button
                      onClick={() => setSelectedFeature('flashcards')}
                      className="inline-flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 font-semibold rounded-xl border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300"
                    >
                      <span>{content.flashcards.learnMore}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
                      <LandingIcon name="book" className="w-4 h-4 inline-block mr-1" />{language === 'kz' ? '5 пән' : '5 предметов'}
                    </span>
                    <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 rounded-full text-sm font-semibold">
                      <LandingIcon name="cards" className="w-4 h-4 inline-block mr-1" />58 {language === 'kz' ? 'карточка' : 'карточек'}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                      <LandingIcon name="brain" className="w-4 h-4 inline-block mr-1" />{language === 'kz' ? 'Ғылыми әдіс' : 'Научный метод'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
        
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-cyan-500/30 rounded-full blur-3xl top-0 left-1/4 animate-pulse"></div>
          <div className="absolute w-[500px] h-[500px] bg-pink-500/30 rounded-full blur-3xl bottom-0 right-1/4 animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Floating shapes */}
          <div className="absolute top-20 left-10 w-24 h-24 border-4 border-white/10 rounded-3xl rotate-12 animate-float"></div>
          <div className="absolute top-40 right-20 w-20 h-20 border-4 border-white/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 border-4 border-white/10 rounded-2xl rotate-45 animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10 text-white">
          <div className="max-w-4xl mx-auto">
            {/* Icon */}
            <div className="inline-block mb-8 animate-slide-up">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                  <LandingIcon name="rocket" className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight animate-slide-up" style={{animationDelay: '0.1s'}}>
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                {language === 'kz' ? 'Бүгін бастаңыз!' : 'Начните сегодня!'}
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl mb-6 text-cyan-50 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
              {language === 'kz' 
                ? 'Тіркелу тегін. AI-менторға қолжетімділік алыңыз.'
                : 'Регистрация бесплатна. Получите доступ к AI-ментору.'}
            </p>
            
            {/* Benefits list */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-2 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold">{language === 'kz' ? 'Кредит карта керек емес' : 'Без кредитной карты'}</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold">{language === 'kz' ? 'Барлық функциялар' : 'Все функции'}</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold">{language === 'kz' ? 'Кез келген уақытта тоқтата аласыз' : 'Отмена в любой момент'}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in" style={{animationDelay: '0.5s'}}>
              <Link 
                to={isAuthenticated ? "/dashboard" : "/register"} 
                className="group relative px-12 py-6 text-xl font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-white/30"
              >
                <div className="absolute inset-0 bg-white"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                  {isAuthenticated 
                    ? (language === 'kz' ? 'Тестілерге өту' : 'Перейти к тестам') 
                    : (language === 'kz' ? 'Тегін тіркелу' : 'Бесплатная регистрация')}
                  <svg className="w-6 h-6 text-pink-600 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              
              <button
                onClick={handleStartTest}
                className="group px-10 py-6 text-xl font-semibold rounded-2xl backdrop-blur-md bg-white/10 border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 text-white"
              >
                {language === 'kz' ? 'Демо тестті көру' : 'Попробовать демо'} →
              </button>
            </div>
            
            <p className="mt-8 text-sm text-cyan-100 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <LandingIcon name="sparkles" className="w-4 h-4 inline-block mr-1" />{language === 'kz' ? '2 минутта бастаңыз' : 'Начните за 2 минуты'}
            </p>
          </div>
        </div>
      </section>

      {/* Feature Details Modal */}
      {selectedFeature && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedFeature(null)}
        >
          <div 
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`relative p-8 rounded-t-3xl ${
              selectedFeature === 'ai' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
              selectedFeature === 'adaptive' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
              selectedFeature === 'flashcards' ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500' :
              'bg-gradient-to-r from-orange-500 to-red-500'
            }`}>
              <button 
                onClick={() => setSelectedFeature(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all hover:rotate-90"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <LandingIcon
                    name={selectedFeature === 'ai' ? 'bot' : selectedFeature === 'adaptive' ? 'book' : selectedFeature === 'flashcards' ? 'cards' : 'chart'}
                    className="w-9 h-9 text-white"
                  />
                </div>
                <h2 className="text-4xl font-black text-white">
                  {selectedFeature === 'ai' && content.features.ai.title}
                  {selectedFeature === 'adaptive' && content.features.adaptive.title}
                  {selectedFeature === 'tracking' && content.features.tracking.title}
                  {selectedFeature === 'flashcards' && content.flashcards.title}
                </h2>
              </div>
              <p className="text-white/90 text-lg">
                {selectedFeature === 'ai' && content.features.ai.desc}
                {selectedFeature === 'adaptive' && content.features.adaptive.desc}
                {selectedFeature === 'tracking' && content.features.tracking.desc}
                {selectedFeature === 'flashcards' && content.flashcards.description}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {selectedFeature === 'ai' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {language === 'kz' ? 'AI менторы қалай жұмыс істейді?' : 'Как работает AI ментор?'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {language === 'kz' ? 'Қате талдау' : 'Анализ ошибок'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {language === 'kz' 
                            ? 'AI жүйесі сіздің жауаптарыңызды талдап, қай жерде қателескеніңізді анықтайды'
                            : 'AI система анализирует ваши ответы и определяет, где вы допустили ошибки'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {language === 'kz' ? 'Жеке түсініктеме' : 'Персональное объяснение'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {language === 'kz'
                            ? 'Әр қате үшін AI түсінікті және қысқа түсініктеме береді, теорияны ұсынады'
                            : 'Для каждой ошибки AI дает понятное и краткое объяснение, предлагает теорию'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {language === 'kz' ? 'Үздіксіз оқыту' : 'Непрерывное обучение'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {language === 'kz'
                            ? 'Жүйе сіздің прогрессіңізді есепке алып, оқыту стратегиясын үздіксіз жақсартады'
                            : 'Система учитывает ваш прогресс и постоянно улучшает стратегию обучения'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800">
                    <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                      <LandingIcon name="lightbulb" className="w-5 h-5 inline-block mr-1 text-cyan-600 dark:text-cyan-300" />{language === 'kz' 
                        ? 'AI менторы 24/7 жұмыс істейді және кез келген сұрақтарыңызға жауап береді'
                        : 'AI ментор работает 24/7 и отвечает на любые ваши вопросы'}
                    </p>
                  </div>
                </div>
              )}

              {selectedFeature === 'adaptive' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {language === 'kz' ? 'Бейімделген оқыту дегеніміз не?' : 'Что такое адаптивное обучение?'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {language === 'kz' ? 'Әлсіз жақтарды анықтау' : 'Определение слабых мест'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {language === 'kz'
                            ? 'Жүйе қай тақырыптарда қиналатыныңызды анықтап, оларға назар аударады'
                            : 'Система определяет, в каких темах вы испытываете трудности и фокусируется на них'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {language === 'kz' ? 'Жеке тапсырмалар' : 'Персональные задания'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {language === 'kz'
                            ? 'Сізге өзіңіздің деңгейіңізге сәйкес тест сұрақтары ұсынылады'
                            : 'Вам предлагаются тестовые вопросы, соответствующие вашему уровню'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {language === 'kz' ? 'Тиімді дамыту' : 'Эффективное развитие'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {language === 'kz'
                            ? 'Уақытты тиімді қолданып, нәтижеге жылдам жетесіз'
                            : 'Эффективно используя время, вы быстрее достигаете результата'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
                    <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                      <LandingIcon name="target" className="w-5 h-5 inline-block mr-1 text-purple-600 dark:text-purple-300" />{language === 'kz'
                        ? 'Сіздің білім деңгейіңіз өскен сайын тапсырмалар қиындай түседі'
                        : 'По мере роста вашего уровня знаний задания становятся сложнее'}
                    </p>
                  </div>
                </div>
              )}

              {selectedFeature === 'tracking' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {language === 'kz' ? 'Прогрессті қалай бақылауға болады?' : 'Как отслеживать прогресс?'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {language === 'kz' ? 'Детальды статистика' : 'Детальная статистика'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {language === 'kz'
                            ? 'Әр пән және тақырып бойынша нәтижелеріңізді көріңіз'
                            : 'Просматривайте свои результаты по каждому предмету и теме'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {language === 'kz' ? 'Визуалды графиктер' : 'Визуальные графики'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {language === 'kz'
                            ? 'Прогрессіңізді график және диаграммалар арқылы көріңіз'
                            : 'Отслеживайте свой прогресс через графики и диаграммы'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {language === 'kz' ? 'Мақсатқа жетуді жоспарлау' : 'Планирование достижения цели'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {language === 'kz'
                            ? 'ҰБТ-ға дейін уақытты тиімді бөліп, жоспарлаңыз'
                            : 'Эффективно распределяйте и планируйте время до ЕНТ'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800">
                    <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                      <LandingIcon name="trend" className="w-5 h-5 inline-block mr-1 text-orange-600 dark:text-orange-300" />{language === 'kz'
                        ? 'Күнделікті прогрессті бақылап, өз мақсатыңызға жетіңіз'
                        : 'Отслеживайте ежедневный прогресс и достигайте своих целей'}
                    </p>
                  </div>
                </div>
              )}

              {selectedFeature === 'flashcards' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {language === 'kz' ? 'Флеш-карточкалар қалай жұмыс істейді?' : 'Как работают флеш-карточки?'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {language === 'kz' ? 'SuperMemo-2 алгоритмі' : 'Алгоритм SuperMemo-2'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {language === 'kz'
                            ? 'Ғылыми негізделген алгоритм есте сақтаудың ең тиімді уақытын анықтайды. Құмарлық қисығын ескеалады.'
                            : 'Научно обоснованный алгоритм определяет оптимальное время для повторения. Учитывает кривую забывания.'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {language === 'kz' ? 'Tinder стилі интерфейс' : 'Tinder-стиль интерфейс'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {language === 'kz'
                            ? 'Оңға свайп - білемін (3+ күн), солға свайп - үйренемін (10 минут). Немесе батырмаларды пайдаланыңыз.'
                            : 'Свайп вправо - знаю (3+ дня), свайп влево - учу (10 минут). Или используйте кнопки.'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                          {language === 'kz' ? 'Жеке бейімделу' : 'Персональная адаптация'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {language === 'kz'
                            ? 'Жүйе сіздің жауаптарыңызға негізделген интервалдарды автоматты түрде реттейді. Қиын карточкалар жиі көрсетіледі.'
                            : 'Система автоматически регулирует интервалы на основе ваших ответов. Сложные карточки показываются чаще.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                      <LandingIcon name="chart" className="w-5 h-5 inline-block mr-2 text-purple-600 dark:text-purple-300" />{language === 'kz' ? 'Интервалдар схемасы:' : 'Схема интервалов:'}
                    </h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <LandingIcon name="check" className="w-4 h-4 text-green-500" />
                        <span>{language === 'kz' ? '1-ші қайталау: 1 күн' : '1-е повторение: 1 день'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <LandingIcon name="check" className="w-4 h-4 text-green-500" />
                        <span>{language === 'kz' ? '2-ші қайталау: 6 күн' : '2-е повторение: 6 дней'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <LandingIcon name="check" className="w-4 h-4 text-green-500" />
                        <span>{language === 'kz' ? '3-ші қайталау: интервал × EF коэффициенті' : '3-е повторение: интервал × EF коэффициент'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <LandingIcon name="xmark" className="w-4 h-4 text-red-500" />
                        <span>{language === 'kz' ? 'Қате: 10 минуттан кейін қайта' : 'Ошибка: повтор через 10 минут'}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                      <LandingIcon name="target" className="w-5 h-5 inline-block mr-2 text-blue-600 dark:text-blue-300" />{language === 'kz' ? 'Қолжетімді карточкалар:' : 'Доступные карточки:'}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <LandingIcon name="history" className="w-6 h-6 text-purple-500" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{language === 'kz' ? 'Тарих' : 'История'}</div>
                          <div className="text-gray-600 dark:text-gray-400">15 {language === 'kz' ? 'карточка' : 'карточек'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <LandingIcon name="calculator" className="w-6 h-6 text-blue-500" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{language === 'kz' ? 'Математика' : 'Математика'}</div>
                          <div className="text-gray-600 dark:text-gray-400">15 {language === 'kz' ? 'карточка' : 'карточек'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <LandingIcon name="bolt" className="w-6 h-6 text-amber-500" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{language === 'kz' ? 'Физика' : 'Физика'}</div>
                          <div className="text-gray-600 dark:text-gray-400">10 {language === 'kz' ? 'карточка' : 'карточек'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <LandingIcon name="flask" className="w-6 h-6 text-cyan-500" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{language === 'kz' ? 'Химия' : 'Химия'}</div>
                          <div className="text-gray-600 dark:text-gray-400">10 {language === 'kz' ? 'карточка' : 'карточек'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border-2 border-purple-300 dark:border-purple-700">
                    <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                      <LandingIcon name="lightbulb" className="w-5 h-5 inline-block mr-1 text-purple-600 dark:text-purple-300" />{language === 'kz'
                        ? 'Күн сайын 10 минут жеткілікті! Тұрақтылық - табыстың кілті.'
                        : 'Достаточно 10 минут в день! Постоянство - ключ к успеху.'}
                    </p>
                  </div>
                </div>
              )}

              {/* CTA Button in Modal */}
              <div className="mt-8 text-center">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span>{isAuthenticated 
                    ? (language === 'kz' ? 'Тестілерге өту' : 'Перейти к тестам') 
                    : (language === 'kz' ? 'Қазір бастау' : 'Начать сейчас')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
