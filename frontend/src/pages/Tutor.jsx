import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../utils/api'
import { tutorService } from '../services/api'
import { useLanguageStore } from '../store/languageStore'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'

export default function Tutor() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguageStore()
  const { isAuthenticated } = useAuthStore()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [availableSubjects, setAvailableSubjects] = useState([])
  const [subject, setSubject] = useState(null)
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState('')
  const [session, setSession] = useState(null)
  const [answerText, setAnswerText] = useState('')
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  const getLocalizedTopicLabel = (topic) => {
    if (!topic) return ''
    const parts = String(topic).split(' / ')
    if (parts.length < 2) return String(topic)
    return language === 'kz' ? parts[0].trim() : parts[1].trim()
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadTutorData()
  }, [subjectId, language, isAuthenticated])

  const loadTutorData = async () => {
    setLoading(true)
    setError('')
    try {
      const [subjectsRes, subjectRes, topicsRes] = await Promise.all([
        api.get('/subjects/'),
        api.get(`/subjects/${subjectId}`),
        tutorService.getTopics(subjectId),
      ])
      const tutorSubjects = (subjectsRes.data || []).filter(item => (item.questions_count || 0) > 0)
      setAvailableSubjects(tutorSubjects)
      setSubject(subjectRes.data)
      setTopics(topicsRes.topics || [])
      setSelectedTopic((topicsRes.topics || [])[0] || '')
      setSession(null)
      setReview(null)
      setAnswerText('')
    } catch (err) {
      console.error('Failed to load tutor data:', err)
      setError(language === 'kz' ? 'AI-репетиторды жүктеу мүмкін болмады.' : 'Не удалось загрузить AI-репетитора.')
    } finally {
      setLoading(false)
    }
  }

  const handleStartSession = async () => {
    if (!selectedTopic) return
    setStarting(true)
    setError('')
    setReview(null)
    try {
      const data = await tutorService.startSession(parseInt(subjectId, 10), selectedTopic, language)
      setSession(data)
      setAnswerText('')
    } catch (err) {
      console.error('Failed to start tutor session:', err)
      setError(
        err.response?.data?.detail ||
        (language === 'kz' ? 'Мини-сабақты бастау мүмкін болмады.' : 'Не удалось запустить мини-урок.')
      )
    } finally {
      setStarting(false)
    }
  }

  const handleCheckAnswer = async () => {
    if (!session || answerText.trim().length < 20) return
    setChecking(true)
    setError('')
    try {
      const data = await tutorService.reviewAnswer(session.session_id, answerText, language)
      setReview(data)
      const refreshedSession = await tutorService.getSession(session.session_id)
      setSession(refreshedSession)
    } catch (err) {
      console.error('Failed to review tutor answer:', err)
      setError(
        err.response?.data?.detail ||
        (language === 'kz' ? 'Жауапты тексеру мүмкін болмады.' : 'Не удалось проверить ответ.')
      )
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
            {language === 'kz' ? 'AI-репетитор жүктелуде...' : 'Загрузка AI-репетитора...'}
          </p>
        </div>
      </div>
    )
  }

  const currentSubjectName = subject ? (language === 'kz' ? subject.name_kz : subject.name_ru) : ''
  const currentQuestionsCount = subject?.questions_count || 0

  return (
    <div className={`min-h-screen py-8 md:py-10 ${
      isDark
        ? 'bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.14),_transparent_26%),linear-gradient(180deg,#0f172a_0%,#111827_48%,#0b1220_100%)]'
        : 'bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.16),_transparent_30%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_42%,#ffffff_100%)]'
    }`}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <section className={`relative overflow-hidden rounded-[2rem] backdrop-blur-xl ${
            isDark
              ? 'border border-slate-700/80 bg-slate-900/76 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.38)]'
              : 'border border-sky-100/80 bg-white/85 shadow-[0_20px_60px_-20px_rgba(14,116,144,0.25)]'
          }`}>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.10),transparent_32%,rgba(139,92,246,0.12))]"></div>
            <div className="relative grid xl:grid-cols-[1.15fr_0.85fr] gap-8 p-6 md:p-8 xl:p-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100/80 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
                  <span className="text-xs md:text-sm font-black uppercase tracking-[0.24em]">AI Tutor</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                    {language === 'kz' ? 'AI-репетитор' : 'AI-репетитор'}
                    {currentSubjectName ? (
                      <span className="block mt-1 bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        {currentSubjectName}
                      </span>
                    ) : null}
                  </h1>
                  <p className="max-w-3xl text-base md:text-lg leading-8 text-gray-600 dark:text-gray-300">
                    {language === 'kz'
                      ? 'Тақырыпты таңда, қысқа мини-сабақ ал, ұқсас сұрақтармен бекіт, өз жауабыңды жаз және AI-ден нақты кері байланыс ал.'
                      : 'Выбери тему, получи короткий мини-урок, закрепи её похожими вопросами, напиши свой ответ и получи точную обратную связь от AI.'}
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-white/80 dark:border-slate-700 px-4 py-4 shadow-sm">
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{topics.length || 0}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {language === 'kz' ? 'қолжетімді тақырып' : 'доступных тем'}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-white/80 dark:border-slate-700 px-4 py-4 shadow-sm">
                    <div className="text-2xl font-black text-gray-900 dark:text-white">5</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {language === 'kz' ? 'ұқсас сұрақ' : 'похожих вопросов'}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-white/80 dark:border-slate-700 px-4 py-4 shadow-sm">
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{currentQuestionsCount}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {language === 'kz' ? 'пәндегі сұрақ' : 'вопросов в предмете'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className={`rounded-[1.75rem] p-5 md:p-6 shadow-lg ${
                  isDark
                    ? 'border border-slate-700 bg-slate-950/60'
                    : 'border border-sky-100 bg-white/90'
                }`}>
                  <div className="text-sm font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300 mb-4">
                    {language === 'kz' ? 'Жылдам бастау' : 'Быстрый старт'}
                  </div>
                  <div className="grid gap-4">
                    <select
                      value={subjectId}
                      onChange={(e) => navigate(`/tutor/${e.target.value}`)}
                      className="w-full rounded-2xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3.5 text-gray-900 dark:text-white"
                    >
                      {availableSubjects.map((item) => (
                        <option key={item.id} value={item.id}>
                          {language === 'kz' ? item.name_kz : item.name_ru}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => navigate(-1)}
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                    >
                      {language === 'kz' ? 'Артқа қайту' : 'Вернуться назад'}
                    </button>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-gradient-to-br from-sky-500 to-violet-600 text-white p-5 md:p-6 shadow-xl">
                  <div className="text-sm font-black uppercase tracking-[0.2em] mb-3 opacity-90">
                    {language === 'kz' ? 'Формат' : 'Формат'}
                  </div>
                  <div className="space-y-3 text-sm md:text-base leading-7">
                    <div>1. {language === 'kz' ? 'Пән мен тақырыпты таңдайсың' : 'Выбираешь предмет и тему'}</div>
                    <div>2. {language === 'kz' ? 'AI қысқа мини-сабақ береді' : 'AI даёт короткий мини-урок'}</div>
                    <div>3. {language === 'kz' ? 'Сен өз сөзіңмен жауап жазасың' : 'Ты пишешь ответ своими словами'}</div>
                    <div>4. {language === 'kz' ? 'AI тексеріп, нақты кері байланыс береді' : 'AI проверяет и даёт точную обратную связь'}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid xl:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
            <div className="space-y-8">
              <section className="rounded-[2rem] border border-sky-100/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/85 shadow-lg p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <div className="text-sm font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
                      {language === 'kz' ? 'Сабақты бастау' : 'Запуск занятия'}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mt-2">
                      {language === 'kz' ? '1. Пән мен тақырыпты таңда' : '1. Выбери предмет и тему'}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400">
                    <span className={`w-2.5 h-2.5 rounded-full ${session ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                    {session
                      ? (language === 'kz' ? 'Сессия белсенді' : 'Сессия активна')
                      : (language === 'kz' ? 'Сессия әлі басталмады' : 'Сессия ещё не начата')}
                  </div>
                </div>

                <div className="grid lg:grid-cols-[0.85fr_1.15fr_auto] gap-4">
                  <select
                    value={subjectId}
                    onChange={(e) => navigate(`/tutor/${e.target.value}`)}
                    className="rounded-2xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3.5 text-gray-900 dark:text-white"
                  >
                    {availableSubjects.map((item) => (
                      <option key={item.id} value={item.id}>
                        {language === 'kz' ? item.name_kz : item.name_ru}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="rounded-2xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3.5 text-gray-900 dark:text-white"
                  >
                    {topics.map((topic) => (
                      <option key={topic} value={topic}>{getLocalizedTopicLabel(topic)}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleStartSession}
                    disabled={starting || !selectedTopic}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition"
                  >
                    {starting
                      ? (language === 'kz' ? 'Дайындалуда...' : 'Готовится...')
                      : (language === 'kz' ? 'Мини-сабақты бастау' : 'Начать мини-урок')}
                  </button>
                </div>

                {!topics.length && (
                  <div className="mt-5 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-4 text-sm text-amber-700 dark:text-amber-300">
                    {language === 'kz' ? 'Бұл пәнде AI-репетитор үшін тақырыптар әлі жоқ.' : 'Для этого предмета пока нет тем для AI-репетитора.'}
                  </div>
                )}

                <div className="mt-6 grid sm:grid-cols-3 gap-3">
                  {[
                    language === 'kz' ? 'Мини-сабақ' : 'Мини-урок',
                    language === 'kz' ? 'Практика' : 'Практика',
                    language === 'kz' ? 'Кері байланыс' : 'Обратная связь',
                  ].map((item, index) => (
                    <div
                      key={item}
                      className={`rounded-2xl px-4 py-4 border text-sm font-semibold ${
                        session && index === 0
                          ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300'
                          : review && index === 2
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <span className="block text-xs uppercase tracking-wide mb-1 opacity-70">{index + 1}</span>
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              {session ? (
                <>
                  <section className="rounded-[2rem] border border-sky-100/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/85 shadow-lg overflow-hidden">
                    <div className="px-6 md:px-8 pt-6 md:pt-8 pb-5 border-b border-sky-100 dark:border-slate-700 bg-gradient-to-r from-sky-50/80 via-white to-violet-50/70 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="text-sm font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
                            {language === 'kz' ? 'Мини-сабақ' : 'Мини-урок'}
                          </div>
                          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mt-2">
                            {getLocalizedTopicLabel(session.topic)}
                          </h2>
                        </div>
                        <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-600 text-sm font-bold text-sky-700 dark:text-sky-300">
                          {currentSubjectName}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 md:p-8">
                      <div className="prose prose-slate max-w-none dark:prose-invert">
                        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 leading-8 text-[15px] md:text-[17px]">
                          {session.lesson_text}
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <section className="rounded-[2rem] border border-sky-100/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/85 shadow-lg p-6 md:p-7">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center shadow-lg font-black">
                          5
                        </div>
                        <div>
                          <div className="text-sm font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
                            {language === 'kz' ? 'Бекіту' : 'Закрепление'}
                          </div>
                          <h3 className="text-xl font-black text-gray-900 dark:text-white">
                            {language === 'kz' ? 'Ұқсас сұрақтар' : 'Похожие вопросы'}
                          </h3>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {session.similar_questions.map((item, index) => (
                          <div key={index} className="rounded-2xl border border-sky-100 dark:border-slate-700 bg-sky-50/70 dark:bg-slate-900 px-4 py-4 text-gray-700 dark:text-gray-200 leading-7">
                            <span className="inline-flex w-7 h-7 rounded-full bg-white dark:bg-slate-800 items-center justify-center text-xs font-black text-sky-600 dark:text-sky-300 mr-3 align-top">
                              {index + 1}
                            </span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-[2rem] border border-violet-100/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/85 shadow-lg p-6 md:p-7">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center shadow-lg font-black">
                          ≈
                        </div>
                        <div>
                          <div className="text-sm font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">
                            {language === 'kz' ? 'Түсіну' : 'Понимание'}
                          </div>
                          <h3 className="text-xl font-black text-gray-900 dark:text-white">
                            {language === 'kz' ? 'Салыстыру' : 'Сравнение понятий'}
                          </h3>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-violet-100 dark:border-slate-700 bg-violet-50/70 dark:bg-slate-900 px-4 py-4 whitespace-pre-wrap text-gray-700 dark:text-gray-200 leading-8">
                        {session.comparison_text}
                      </div>
                    </section>
                  </div>

                  <section className="rounded-[2rem] border border-emerald-100/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/85 shadow-lg overflow-hidden">
                    <div className="px-6 md:px-8 pt-6 md:pt-8 pb-5 border-b border-emerald-100 dark:border-slate-700 bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/60 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
                      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                          <div className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                            {language === 'kz' ? 'Жазбаша тәжірибе' : 'Письменная практика'}
                          </div>
                          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mt-2">
                            {language === 'kz' ? 'Жауабыңды өз сөзіңмен жаз' : 'Напиши ответ своими словами'}
                          </h2>
                        </div>
                        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          {language === 'kz' ? 'Кемі 20 таңба' : 'Минимум 20 символов'}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-5">
                      <div className="rounded-2xl border border-violet-100 dark:border-violet-900/40 bg-violet-50/80 dark:bg-violet-900/15 px-5 py-5 text-gray-800 dark:text-gray-200 leading-8">
                        {session.assignment_prompt}
                      </div>

                      <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        rows={10}
                        placeholder={language === 'kz' ? 'Жауабыңды осы жерге жаз. Негізгі ойды, мысалды және қысқа қорытындыны қосуға тырыс...' : 'Напиши свой ответ здесь. Постарайся раскрыть основную мысль, привести пример и сделать короткий вывод...'}
                        className="w-full rounded-[1.5rem] border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-5 py-5 text-gray-900 dark:text-white leading-7 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {language === 'kz'
                            ? `Қазір ${answerText.trim().length} таңба жазылды`
                            : `Сейчас написано ${answerText.trim().length} символов`}
                        </div>
                        <button
                          onClick={handleCheckAnswer}
                          disabled={checking || answerText.trim().length < 20}
                          className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition"
                        >
                          {checking
                            ? (language === 'kz' ? 'Тексерілуде...' : 'Проверяется...')
                            : (language === 'kz' ? 'AI арқылы тексеру' : 'Проверить через AI')}
                        </button>
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                <section className="rounded-[2rem] border border-dashed border-sky-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 shadow-sm p-8 md:p-12 text-center">
                  <div className="w-20 h-20 mx-auto rounded-[1.75rem] bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-white text-3xl shadow-xl mb-6">
                    ✦
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3">
                    {language === 'kz' ? 'Мини-сабақты баста' : 'Запусти мини-урок'}
                  </h2>
                  <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400 leading-8">
                    {language === 'kz'
                      ? 'Алдымен пән мен тақырыпты таңда. Осыдан кейін AI саған қысқа түсіндірме, ұқсас сұрақтар және жазбаша тапсырма береді.'
                      : 'Сначала выбери предмет и тему. После этого AI покажет краткое объяснение, похожие вопросы и письменное задание.'}
                  </p>
                </section>
              )}
            </div>

            <div className="space-y-6 xl:sticky xl:top-24">
              {error && (
                <div className="rounded-[1.75rem] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-5 py-4 text-red-700 dark:text-red-300 shadow-sm">
                  {error}
                </div>
              )}

              <section className="rounded-[2rem] border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/85 shadow-lg p-6 md:p-7">
                <div className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-4">
                  {language === 'kz' ? 'Оқу картасы' : 'Карта занятия'}
                </div>
                <div className="space-y-3">
                  {[
                    {
                      title: language === 'kz' ? 'Тақырыпты таңдау' : 'Выбор темы',
                      active: true,
                    },
                    {
                      title: language === 'kz' ? 'Мини-сабақ пен мысалдар' : 'Мини-урок и примеры',
                      active: Boolean(session),
                    },
                    {
                      title: language === 'kz' ? 'Жазбаша жауап' : 'Письменный ответ',
                      active: Boolean(session && answerText.trim().length > 0),
                    },
                    {
                      title: language === 'kz' ? 'AI тексеруі' : 'Проверка AI',
                      active: Boolean(review),
                    },
                  ].map((step, index) => (
                    <div key={step.title} className={`flex items-center gap-3 rounded-2xl px-4 py-3 border ${step.active ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-700' : 'bg-slate-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${step.active ? 'bg-gradient-to-br from-sky-500 to-violet-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-slate-700'}`}>
                        {index + 1}
                      </div>
                      <div className={`font-semibold ${step.active ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {step.title}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {review ? (
                <section className="rounded-[2rem] border border-emerald-100/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/85 shadow-lg p-6 md:p-7 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                        {language === 'kz' ? 'Нәтиже' : 'Результат'}
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                        {language === 'kz' ? 'AI тексеруі' : 'Проверка AI'}
                      </h2>
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xl font-black shadow-lg">
                      {review.score}/100
                    </div>
                  </div>

                  <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 px-4 py-4 whitespace-pre-wrap text-gray-700 dark:text-gray-200 leading-8">
                    {review.feedback_text}
                  </div>

                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white mb-3">
                      {language === 'kz' ? 'Күшті тұстар' : 'Сильные стороны'}
                    </h3>
                    <div className="space-y-2">
                      {review.strengths.map((item, index) => (
                        <div key={index} className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-gray-700 dark:text-gray-200">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white mb-3">
                      {language === 'kz' ? 'Жақсартуға болады' : 'Что улучшить'}
                    </h3>
                    <div className="space-y-2">
                      {review.improvements.map((item, index) => (
                        <div key={index} className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-gray-700 dark:text-gray-200">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white mb-3">
                      {language === 'kz' ? 'Үлгі жауап' : 'Образец ответа'}
                    </h3>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 px-4 py-4 whitespace-pre-wrap text-gray-700 dark:text-gray-200 leading-8">
                      {review.model_answer}
                    </div>
                  </div>
                </section>
              ) : (
                <section className="rounded-[2rem] border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/85 shadow-lg p-6 md:p-7">
                  <div className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-4">
                    {language === 'kz' ? 'Кеңес' : 'Подсказка'}
                  </div>
                  <div className="space-y-4 text-sm leading-7 text-gray-600 dark:text-gray-300">
                    <p>
                      {language === 'kz'
                        ? 'Жауапты жай ғана көшіріп жазбай, өз сөзіңмен түсіндіруге тырыс. Бұл AI-дің де, сенің де нақты түсінгеніңді көруге көмектеседі.'
                        : 'Старайся не переписывать ответ, а объяснять своими словами. Так и AI, и ты сам увидите, насколько глубоко ты понял тему.'}
                    </p>
                    <p>
                      {language === 'kz'
                        ? 'Жақсы жауапта анықтама, қысқа түсіндіру және бір мысал болса жеткілікті.'
                        : 'Для хорошего ответа обычно достаточно определения, краткого объяснения и одного примера.'}
                    </p>
                  </div>
                </section>
              )}

              {session?.messages?.length > 0 && (
                <section className="rounded-[2rem] border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/85 shadow-lg p-6 md:p-7">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">
                    {language === 'kz' ? 'Сессия тарихы' : 'История сессии'}
                  </h2>
                  <div className="space-y-3 max-h-[34rem] overflow-auto pr-1">
                    {session.messages.map((message, index) => (
                      <div
                        key={`${message.kind}-${index}`}
                        className={`rounded-2xl px-4 py-4 ${
                          message.role === 'student'
                            ? 'bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800'
                            : 'bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                          {message.role === 'student'
                            ? (language === 'kz' ? 'Оқушы жауабы' : 'Ответ ученика')
                            : (language === 'kz' ? 'AI пікірі' : 'Ответ AI')}
                          {typeof message.score === 'number' ? ` · ${message.score}/100` : ''}
                        </div>
                        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 leading-7">
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
