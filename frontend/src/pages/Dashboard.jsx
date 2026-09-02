import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import SubjectSelector from '../components/SubjectSelector'
import SubjectIcon from '../components/SubjectIcon'
import { useAuthStore } from '../store/authStore'
import { useLanguageStore } from '../store/languageStore'

const Icon = ({ children, className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

const Arrow = () => <Icon className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6" /></Icon>

function FadeIn({ children, delay = 0, className = '' }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { language } = useLanguageStore()
  const { token } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSubjectSelector, setShowSubjectSelector] = useState(false)

  const copy = language === 'kz' ? {
    eyebrow: 'Оқу кеңістігі',
    greeting: 'Қайта оралғаныңа қуаныштымыз',
    continue: 'Оқуды жалғастыр',
    chooseSubjects: 'Пәндерді таңдау',
    exams: 'ҰБТ-ға дейін',
    days: 'күн',
    goal: 'Апталық бағыт',
    goalText: '100 тестік межеге ілгерілеу',
    tests: 'Өтілген тест',
    accuracy: 'Дәлдік',
    minutes: 'Оқу уақыты',
    streak: 'Қатарынан күн',
    subjects: 'Менің пәндерім',
    subjectsHint: 'Бүгін нені пысықтаймыз?',
    start: 'Тест бастау',
    tutor: 'AI-ментор',
    noSubjects: 'Пәндерді таңда да, жеке оқу жоспарыңды баста.',
    recommendations: 'Келесі қадамдар',
    recommendationsHint: 'Сенің нәтижелеріңе сай',
    noRecommendations: 'Алғашқы тесттен кейін жеке ұсыныстар осында пайда болады.',
    recent: 'Соңғы әрекеттер',
    noRecent: 'Әзірге тесттер жоқ. Бастау үшін пәнді таңда.',
    allStats: 'Барлық статистика',
    of: 'ішінен',
    progress: 'прогресс',
  } : {
    eyebrow: 'Учебное пространство',
    greeting: 'Рады видеть вас снова',
    continue: 'Продолжить обучение',
    chooseSubjects: 'Настроить предметы',
    exams: 'До ЕНТ',
    days: 'дней',
    goal: 'Ваш ориентир',
    goalText: 'Движение к цели в 100 тестов',
    tests: 'Пройдено тестов',
    accuracy: 'Точность',
    minutes: 'Минут учёбы',
    streak: 'Дней подряд',
    subjects: 'Мои предметы',
    subjectsHint: 'Что повторим сегодня?',
    start: 'Начать тест',
    tutor: 'AI-ментор',
    noSubjects: 'Выберите предметы — и мы соберём ваше учебное пространство.',
    recommendations: 'Следующие шаги',
    recommendationsHint: 'На основе ваших результатов',
    noRecommendations: 'После первого теста здесь появятся персональные рекомендации.',
    recent: 'Последняя активность',
    noRecent: 'Тестов пока нет. Выберите предмет, чтобы начать.',
    allStats: 'Вся статистика',
    of: 'из',
    progress: 'прогресса',
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    let active = true
    const load = async () => {
      try {
        const [profileResponse, statsResponse, recommendationsResponse, subjectsResponse] = await Promise.all([
          api.get('/profile/me'),
          api.get('/profile/stats'),
          api.get('/profile/recommendations'),
          api.get('/subjects/'),
        ])
        if (!active) return
        setProfile(profileResponse.data)
        setStats(statsResponse.data)
        setRecommendations(Array.isArray(recommendationsResponse.data?.recommendations) ? recommendationsResponse.data.recommendations : [])
        setSubjects(subjectsResponse.data)
        if (!profileResponse.data.profile_completed || !profileResponse.data.selected_subjects?.length) setShowSubjectSelector(true)
      } catch (error) {
        console.error('Unable to load dashboard:', error)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [token, navigate])

  const selectedSubjects = useMemo(
    () => subjects.filter((subject) => profile?.selected_subjects?.includes(subject.id)),
    [profile, subjects],
  )
  const progress = Math.min(Math.round(((stats?.total_tests || 0) / 100) * 100), 100)
  const daysUntilExam = profile?.ent_date ? Math.max(0, Math.ceil((new Date(profile.ent_date) - new Date()) / 86400000)) : null
  const recentTests = stats?.recent_tests || []
  const currentStreak = useMemo(() => {
    const dates = new Set(recentTests.map((test) => new Date(test.completed_at).toDateString()))
    let streak = 0
    const day = new Date()
    while (dates.has(day.toDateString())) {
      streak += 1
      day.setDate(day.getDate() - 1)
    }
    return streak
  }, [recentTests])

  const subjectStats = (id) => stats?.subjects_stats?.find((item) => item.subject_id === id)
  const recommendedSubject = selectedSubjects.find((subject) => (subject.questions_count || 0) > 0) || selectedSubjects[0]
  const displayName = profile?.full_name || profile?.email?.split('@')[0]

  const refreshProfile = async () => {
    setShowSubjectSelector(false)
    const [profileResponse, subjectsResponse] = await Promise.all([api.get('/profile/me'), api.get('/subjects/')])
    setProfile(profileResponse.data)
    setSubjects(subjectsResponse.data)
  }

  if (loading) {
    return <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#f7faf7] dark:bg-slate-950"><span className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9f53e] border-t-[#003f34]" /></div>
  }

  const summary = [
    { label: copy.tests, value: stats?.total_tests || 0, icon: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 9h6M9 13h6M9 17h3" /></> },
    { label: copy.accuracy, value: `${Math.round(stats?.average_score || 0)}%`, icon: <><circle cx="12" cy="12" r="8" /><path d="m8.5 12 2.2 2.2 4.8-5" /></> },
    { label: copy.minutes, value: stats?.study_time_minutes || 0, icon: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2" /></> },
    { label: copy.streak, value: currentStreak, icon: <><path d="M13.2 2.8c.4 3.5-1.4 5.2-3 6.8-1.1 1.1-1.8 2.4-1.8 4.1A3.6 3.6 0 0 0 12 17.3c2 0 3.6-1.6 3.6-3.6 0-1.1-.5-2.2-1.4-3.1.2 2-1 2.8-2.2 3.4.2-2.4-1.2-4.1-2.7-5.4" /><path d="M5 21h14" /></> },
  ]

  return (
    <main className="min-h-screen bg-[#f7faf7] pb-16 text-[#003f34] dark:bg-slate-950 dark:text-white">
      <SubjectSelector isOpen={showSubjectSelector} onClose={() => setShowSubjectSelector(false)} onComplete={refreshProfile} />

      <div className="mx-auto w-[min(1180px,calc(100%-32px))] pt-8 sm:w-[min(1180px,calc(100%-48px))] sm:pt-12">
        <FadeIn className="border-b border-[#dce5df] pb-8 dark:border-white/10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#00715c] dark:text-[#c9f53e]">{copy.eyebrow}</p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
                {displayName ? `${copy.greeting}, ${displayName}` : copy.greeting}
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowSubjectSelector(true)} className="inline-flex min-h-12 items-center gap-2 border border-[#b8c9c0] px-5 text-sm font-bold transition hover:border-[#003f34] hover:bg-white dark:border-white/20 dark:hover:border-white dark:hover:bg-white/5">
                <Icon className="h-4 w-4"><path d="M4 6h16M7 12h10M10 18h4" /></Icon>{copy.chooseSubjects}
              </button>
              {recommendedSubject && <button onClick={() => navigate(`/test/${recommendedSubject.id}`)} className="inline-flex min-h-12 items-center gap-2 bg-[#003f34] px-5 text-sm font-bold text-white transition hover:bg-[#005345] dark:bg-[#c9f53e] dark:text-[#003f34]">
                {copy.continue}<Arrow />
              </button>}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.05} className="grid border-b border-[#dce5df] py-6 dark:border-white/10 lg:grid-cols-[1.25fr_.75fr]">
          <section className="border-b border-[#dce5df] pb-6 dark:border-white/10 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10 dark:lg:border-white/10">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[#5d6763] dark:text-white/55"><span>{copy.goal}</span><span>{stats?.total_tests || 0} {copy.of} 100</span></div>
            <div className="mt-5 flex items-end gap-5"><strong className="text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">{progress}%</strong><p className="mb-1 max-w-44 text-sm leading-5 text-[#5d6763] dark:text-white/55">{copy.goalText}</p></div>
            <div className="mt-5 h-2 overflow-hidden bg-[#dce5df] dark:bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full bg-[#c9f53e]" /></div>
          </section>
          <section className="flex items-center gap-5 pt-6 lg:justify-end lg:pt-0">
            <div className="flex h-12 w-12 items-center justify-center bg-[#c9f53e] text-[#003f34]"><Icon><path d="M7 3v3m10-3v3M5 9h14M6 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" /></Icon></div>
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5d6763] dark:text-white/55">{copy.exams}</p><p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">{daysUntilExam === null ? '—' : `${daysUntilExam} ${copy.days}`}</p></div>
          </section>
        </FadeIn>

        <section className="grid grid-cols-2 border-b border-[#dce5df] dark:border-white/10 md:grid-cols-4">
          {summary.map((item, index) => <FadeIn key={item.label} delay={0.1 + index * 0.04} className={`py-6 ${index % 2 === 0 ? 'border-r border-[#dce5df] dark:border-white/10' : ''} ${index < 2 ? 'border-b md:border-b-0' : ''} ${index < 3 ? 'md:border-r md:border-[#dce5df] md:dark:border-white/10' : ''} px-4 first:pl-0 sm:px-6`}>
            <Icon className="h-5 w-5 text-[#00715c] dark:text-[#c9f53e]">{item.icon}</Icon>
            <p className="mt-5 text-3xl font-semibold tracking-[-0.05em]">{item.value}</p><p className="mt-1 text-sm text-[#5d6763] dark:text-white/55">{item.label}</p>
          </FadeIn>)}
        </section>

        <section className="py-10 sm:py-14">
          <FadeIn className="mb-7 flex items-end justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#00715c] dark:text-[#c9f53e]">01</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.055em]">{copy.subjects}</h2></div><p className="hidden text-sm text-[#5d6763] sm:block dark:text-white/55">{copy.subjectsHint}</p></FadeIn>
          {selectedSubjects.length ? <div className="divide-y divide-[#dce5df] border-y border-[#dce5df] dark:divide-white/10 dark:border-white/10">
            {selectedSubjects.map((subject, index) => {
              const subjectProgress = subjectStats(subject.id)
              const accuracy = Math.round(subjectProgress?.accuracy || 0)
              const questions = subject.questions_count || 0
              return <FadeIn key={subject.id} delay={0.06 * index}>
                <div className="group grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_140px_auto] sm:items-center sm:gap-8">
                  <div className="flex min-w-0 items-center gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#eef5f0] text-[#00715c] dark:bg-white/10 dark:text-[#c9f53e]"><SubjectIcon name={subject.name_ru} /></span><div className="min-w-0"><h3 className="truncate text-lg font-semibold tracking-[-0.03em]">{language === 'kz' ? subject.name_kz : subject.name_ru}</h3><p className="mt-1 text-xs text-[#5d6763] dark:text-white/55">{questions ? `${questions} ${language === 'kz' ? 'сұрақ қолжетімді' : 'вопросов доступно'}` : (language === 'kz' ? 'Жақында қолжетімді' : 'Скоро будет доступно')}</p></div></div>
                  <div className="flex items-center gap-3"><div className="h-1.5 flex-1 bg-[#dce5df] dark:bg-white/10"><div className="h-full bg-[#c9f53e]" style={{ width: `${accuracy}%` }} /></div><span className="w-9 text-right text-sm font-bold">{accuracy}%</span></div>
                  <div className="flex gap-2"><button disabled={!questions} onClick={() => navigate(`/test/${subject.id}`)} className="inline-flex min-h-10 items-center gap-2 bg-[#003f34] px-4 text-xs font-bold text-white transition hover:bg-[#005345] disabled:cursor-not-allowed disabled:opacity-35 dark:bg-white dark:text-[#003f34]">{copy.start}<Arrow /></button><button onClick={() => navigate(`/tutor/${subject.id}`)} className="inline-flex min-h-10 items-center border border-[#b8c9c0] px-3 text-xs font-bold transition hover:bg-[#eef5f0] dark:border-white/20 dark:hover:bg-white/10">{copy.tutor}</button></div>
                </div>
              </FadeIn>
            })}
          </div> : <FadeIn className="flex flex-col items-start gap-5 border-y border-[#dce5df] py-10 dark:border-white/10"><p className="max-w-md text-lg leading-7 text-[#5d6763] dark:text-white/60">{copy.noSubjects}</p><button onClick={() => setShowSubjectSelector(true)} className="inline-flex min-h-12 items-center gap-2 bg-[#003f34] px-5 text-sm font-bold text-white dark:bg-[#c9f53e] dark:text-[#003f34]">{copy.chooseSubjects}<Arrow /></button></FadeIn>}
        </section>

        <section className="grid gap-10 border-t border-[#dce5df] py-10 dark:border-white/10 lg:grid-cols-[1.05fr_.95fr] sm:py-14">
          <FadeIn><div className="mb-6"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#00715c] dark:text-[#c9f53e]">02</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.055em]">{copy.recommendations}</h2><p className="mt-2 text-sm text-[#5d6763] dark:text-white/55">{copy.recommendationsHint}</p></div>
            {recommendations.length ? <div className="divide-y divide-[#dce5df] border-y border-[#dce5df] dark:divide-white/10 dark:border-white/10">{recommendations.slice(0, 3).map((recommendation, index) => <div key={recommendation.id || index} className="py-5"><div className="flex gap-4"><span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c9f53e] text-xs font-bold text-[#003f34]">{index + 1}</span><div><h3 className="font-semibold">{language === 'kz' ? recommendation.title_kz || recommendation.title : recommendation.title_ru || recommendation.title}</h3><p className="mt-1 text-sm leading-6 text-[#5d6763] dark:text-white/55">{language === 'kz' ? recommendation.description_kz || recommendation.description : recommendation.description_ru || recommendation.description}</p></div></div></div>)}</div> : <p className="border-y border-[#dce5df] py-7 text-sm leading-6 text-[#5d6763] dark:border-white/10 dark:text-white/55">{copy.noRecommendations}</p>}
          </FadeIn>
          <FadeIn delay={0.1}><div className="mb-6 flex items-end justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#00715c] dark:text-[#c9f53e]">03</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.055em]">{copy.recent}</h2></div><span className="text-sm text-[#5d6763] dark:text-white/55">{recentTests.length}</span></div>
            {recentTests.length ? <div className="divide-y divide-[#dce5df] border-y border-[#dce5df] dark:divide-white/10 dark:border-white/10">{recentTests.slice(0, 4).map((test, index) => <div key={`${test.id || index}-${test.completed_at}`} className="flex items-center justify-between gap-4 py-4"><div><h3 className="font-semibold">{language === 'kz' ? test.subject_name_kz : test.subject_name_ru}</h3><p className="mt-1 text-xs text-[#5d6763] dark:text-white/55">{new Date(test.completed_at).toLocaleDateString(language === 'kz' ? 'kk-KZ' : 'ru-RU')}</p></div><div className="text-right"><strong className="text-lg">{Math.round(test.score || 0)}%</strong><p className="mt-1 text-xs text-[#5d6763] dark:text-white/55">{test.total_correct}/{test.total_questions}</p></div></div>)}</div> : <p className="border-y border-[#dce5df] py-7 text-sm leading-6 text-[#5d6763] dark:border-white/10 dark:text-white/55">{copy.noRecent}</p>}
          </FadeIn>
        </section>
      </div>
    </main>
  )
}
