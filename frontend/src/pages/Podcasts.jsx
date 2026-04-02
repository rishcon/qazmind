import { useEffect, useMemo, useState } from 'react'
import { useLanguageStore } from '../store/languageStore'
import { useThemeStore } from '../store/themeStore'
import AudioPlayer from '../components/AudioPlayer'
import api from '../utils/api'

function PodcastIcon({ children, className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

const difficultyTone = {
  easy: 'border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200',
  medium: 'border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200',
  hard: 'border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200',
}

const subjectOrder = [
  'История Казахстана',
  'Математическая грамотность',
  'Грамотность чтения',
  'Математика',
  'Физика',
  'Биология',
  'Химия',
  'Иностранный язык (Английский)',
  'Всемирная история',
  'География',
  'Казахский язык',
  'Русский язык',
  'Литература',
  'Информатика',
]

const subjectGlyphs = {
  'История Казахстана': { label: 'KZ', tone: 'from-amber-500 to-orange-500' },
  'Математическая грамотность': { label: '12', tone: 'from-blue-500 to-cyan-500' },
  'Грамотность чтения': { label: 'Aa', tone: 'from-emerald-500 to-teal-500' },
  Математика: { label: 'fx', tone: 'from-yellow-500 to-amber-500' },
  Физика: { label: 'at', tone: 'from-violet-500 to-fuchsia-500' },
  Биология: { label: 'DNA', tone: 'from-lime-500 to-green-500' },
  Химия: { label: 'H2O', tone: 'from-cyan-500 to-sky-500' },
  'Иностранный язык (Английский)': { label: 'EN', tone: 'from-slate-600 to-slate-800' },
  'Всемирная история': { label: 'GL', tone: 'from-blue-600 to-indigo-600' },
  География: { label: 'MAP', tone: 'from-emerald-500 to-cyan-500' },
  'Казахский язык': { label: 'KZ', tone: 'from-cyan-500 to-teal-500' },
  'Русский язык': { label: 'RU', tone: 'from-slate-500 to-slate-700' },
  Литература: { label: 'BK', tone: 'from-rose-500 to-pink-500' },
  Информатика: { label: 'DEV', tone: 'from-slate-700 to-slate-900' },
}

function getSubjectOrderIndex(subject) {
  const name = subject.name_ru
  const index = subjectOrder.indexOf(name)
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

function SubjectGlyph({ subject }) {
  const config = subjectGlyphs[subject.name_ru] || {
    label: (subject.name_ru || 'SB').slice(0, 2).toUpperCase(),
    tone: 'from-cyan-500 to-violet-500',
  }

  return (
    <span className={`inline-flex h-7 min-w-7 items-center justify-center rounded-xl bg-gradient-to-br ${config.tone} px-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(15,23,42,0.12)]`}>
      {config.label}
    </span>
  )
}

export default function Podcasts() {
  const [podcasts, setPodcasts] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPodcast, setSelectedPodcast] = useState(null)
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [filterSubject, setFilterSubject] = useState('all')
  const { language } = useLanguageStore()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const t = {
    kz: {
      title: 'AI Подкастар',
      subtitle: 'Тақырыптарды тыңдап, қысқа форматта қайтала.',
      eyebrow: 'PODCASTS',
      all: 'Барлығы',
      easy: 'Оңай',
      medium: 'Орта',
      hard: 'Қиын',
      minutes: 'мин',
      loading: 'Подкастар жүктелуде...',
      nopodcasts: 'Бұл сүзгілер бойынша подкастар табылмады',
      listenNow: 'Тыңдау',
      closePlayer: 'Жабу',
      filterBySubject: 'Пән',
      filterByDifficulty: 'Қиындық',
      noDescription: 'Бұл эпизодқа сипаттама әлі қосылмаған.',
      topicFallback: 'Жалпы тақырып',
      results: 'эпизод',
    },
    ru: {
      title: 'AI Подкасты',
      subtitle: 'Слушай темы и повторяй материал в коротком аудио-формате.',
      eyebrow: 'PODCASTS',
      all: 'Все',
      easy: 'Легко',
      medium: 'Средне',
      hard: 'Сложно',
      minutes: 'мин',
      loading: 'Подкасты загружаются...',
      nopodcasts: 'По этим фильтрам подкасты не найдены',
      listenNow: 'Слушать',
      closePlayer: 'Закрыть',
      filterBySubject: 'Предмет',
      filterByDifficulty: 'Сложность',
      noDescription: 'Для этого эпизода описание пока не добавлено.',
      topicFallback: 'Общая тема',
      results: 'эпизодов',
    },
  }

  const content = t[language]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [podcastsRes, subjectsRes] = await Promise.all([api.get('/podcasts/'), api.get('/subjects/')])
      setPodcasts(podcastsRes.data)
      setSubjects(subjectsRes.data)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredPodcasts = useMemo(
    () =>
      podcasts.filter((podcast) => {
        if (filterDifficulty !== 'all' && podcast.difficulty !== filterDifficulty) return false
        if (filterSubject !== 'all' && podcast.subject_id !== parseInt(filterSubject, 10)) return false
        return true
      }),
    [podcasts, filterDifficulty, filterSubject]
  )

  const sortedSubjects = useMemo(
    () => [...subjects].sort((a, b) => getSubjectOrderIndex(a) - getSubjectOrderIndex(b)),
    [subjects]
  )

  const getDifficultyLabel = (difficulty) => content[difficulty] || difficulty

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe,transparent_34%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_46%,#ffffff_100%)] px-4 py-20 dark:bg-[radial-gradient(circle_at_top,#0f1b38,transparent_34%),linear-gradient(180deg,#020617_0%,#081226_46%,#020617_100%)]">
        <div className="mx-auto flex min-h-[55vh] max-w-6xl items-center justify-center">
          <div className="rounded-[28px] border border-slate-200/70 bg-white/90 px-8 py-10 text-center shadow-[0_24px_70px_rgba(59,130,246,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-cyan-500 via-violet-500 to-pink-500 text-white">
              <PodcastIcon className="h-7 w-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5a6.5 6.5 0 006.5-6.5M12 5.5A6.5 6.5 0 015 12m7 6.5V21m0-15.5V3m-3.5 5.5a3.5 3.5 0 000 7m7 0a3.5 3.5 0 000-7" />
              </PodcastIcon>
            </div>
            <p className="text-lg font-semibold text-slate-600 dark:text-slate-200">{content.loading}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen pb-16 pt-8 ${
      isDark
        ? 'bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_18%),linear-gradient(180deg,#020617_0%,#081226_44%,#020617_100%)]'
        : 'bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_20%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_44%,#ffffff_100%)]'
    }`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className={`rounded-[32px] p-6 backdrop-blur-2xl sm:p-8 ${
          isDark
            ? 'border border-white/10 bg-slate-900/72 shadow-[0_24px_70px_rgba(0,0,0,0.28)]'
            : 'border border-white/60 bg-white/85 shadow-[0_24px_70px_rgba(59,130,246,0.10)]'
        }`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/8 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-200">
                <PodcastIcon className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5a6.5 6.5 0 006.5-6.5M12 5.5A6.5 6.5 0 015 12m7 6.5V21m0-15.5V3" />
                </PodcastIcon>
                {content.eyebrow}
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">{content.title}</h1>
              <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{content.subtitle}</p>
            </div>

            <div className="flex items-center gap-3 rounded-[24px] border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
              <PodcastIcon className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 12h6m-6 5h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </PodcastIcon>
              <span>{filteredPodcasts.length} {content.results}</span>
            </div>
          </div>
        </section>

        <section className={`mt-6 rounded-[32px] p-5 backdrop-blur-xl ${
          isDark
            ? 'border border-white/10 bg-slate-900/72 shadow-[0_20px_60px_rgba(0,0,0,0.24)]'
            : 'border border-slate-200/70 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.08)]'
        }`}>
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <aside className="space-y-5">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">{content.filterBySubject}</p>
                <div className="grid gap-2">
                  <button
                    onClick={() => setFilterSubject('all')}
                    className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      filterSubject === 'all'
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-white/[0.1]'
                    }`}
                  >
                    {content.all}
                  </button>
                  {sortedSubjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => setFilterSubject(subject.id.toString())}
                      className={`inline-flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                        filterSubject === subject.id.toString()
                          ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-white/[0.1]'
                      }`}
                    >
                      <SubjectGlyph subject={subject} />
                      <span className="min-w-0 break-words">
                        {language === 'kz' ? subject.name_kz : subject.name_ru}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">{content.filterByDifficulty}</p>
                <div className="flex flex-wrap gap-2">
                  {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setFilterDifficulty(difficulty)}
                      className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                        filterDifficulty === difficulty
                          ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-white/[0.1]'
                      }`}
                    >
                      {content[difficulty]}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <div>
              {filteredPodcasts.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-slate-300/80 bg-slate-50/70 px-6 py-16 text-center dark:border-white/12 dark:bg-white/[0.03]">
                  <p className="text-lg font-semibold text-slate-600 dark:text-slate-200">{content.nopodcasts}</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredPodcasts.map((podcast) => {
                    const title = language === 'kz' ? podcast.title_kz : podcast.title_ru
                    const description = language === 'kz' ? podcast.description_kz : podcast.description_ru
                    const isOpen = selectedPodcast?.id === podcast.id

                    return (
                      <article
                        key={podcast.id}
                        className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/88 shadow-[0_16px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-slate-900/72"
                      >
                        <div className="p-5 sm:p-6">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-xl font-black leading-tight text-slate-950 dark:text-white">{title}</h3>
                                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase ${difficultyTone[podcast.difficulty] || difficultyTone.medium}`}>
                                  {getDifficultyLabel(podcast.difficulty)}
                                </span>
                              </div>

                              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {description || content.noDescription}
                              </p>

                              <div className="mt-4 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                                  <PodcastIcon className="h-3.5 w-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </PodcastIcon>
                                  {podcast.topic || content.topicFallback}
                                </span>
                                {podcast.duration_seconds ? (
                                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                                    <PodcastIcon className="h-3.5 w-3.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </PodcastIcon>
                                    {Math.ceil(podcast.duration_seconds / 60)} {content.minutes}
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            {!isOpen ? (
                              <button
                                onClick={() => setSelectedPodcast(podcast)}
                                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 text-sm font-bold text-white transition hover:opacity-95 sm:min-w-[140px]"
                              >
                                {content.listenNow}
                              </button>
                            ) : null}
                          </div>

                          {isOpen ? (
                            <div className="mt-5 space-y-4 border-t border-slate-200/70 pt-5 dark:border-white/10">
                              <AudioPlayer podcast={podcast} audioUrl={`/api/podcasts/${podcast.id}/audio`} />
                              <button
                                onClick={() => setSelectedPodcast(null)}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.1]"
                              >
                                <PodcastIcon className="h-4 w-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                                </PodcastIcon>
                                {content.closePlayer}
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
