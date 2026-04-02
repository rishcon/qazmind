import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useLanguageStore } from '../store/languageStore'
import { useThemeStore } from '../store/themeStore'
import api from '../utils/api'

function NavIcon({ children, className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

export default function Navbar() {
  const { isAuthenticated, logout, user, token, updateUser } = useAuthStore()
  const { language, setLanguage } = useLanguageStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !token || user?.role) {
      return
    }

    let cancelled = false

    const loadProfile = async () => {
      try {
        const response = await api.get('/profile/me')
        if (!cancelled) {
          updateUser({
            id: response.data.id,
            email: response.data.email,
            role: response.data.role,
          })
        }
      } catch (error) {
        console.error('Failed to load user role:', error)
      }
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, token, user?.role, updateUser])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname, language])

  const isAdmin = user?.role === 'admin'
  const isLanding = location.pathname === '/'
  const isDark = theme === 'dark'

  const t = {
    kz: {
      features: 'Артықшылықтар',
      subjects: 'Пәндер',
      podcasts: 'Подкастар',
      flashcards: 'Карточкалар',
      dashboard: 'Дашборд',
      admin: 'Админ',
      login: 'Кіру',
      register: 'Тіркелу',
      logout: 'Шығу',
      theme: theme === 'light' ? 'Қараңғы режим' : 'Жарық режим',
      openLearning: 'Оқуға өту',
      tagline: 'ҰБТ-ге дайындық дайындық платформасы',
    },
    ru: {
      features: 'Преимущества',
      subjects: 'Предметы',
      podcasts: 'Подкасты',
      flashcards: 'Карточки',
      dashboard: 'Панель',
      admin: 'Админ',
      login: 'Войти',
      register: 'Регистрация',
      logout: 'Выйти',
      theme: theme === 'light' ? 'Темная тема' : 'Светлая тема',
      openLearning: 'К обучению',
      tagline: 'Платформа подготовки к ЕНТ',
    },
  }

  const landingLinks = [
    { href: '/#features', label: t[language].features },
    { href: '/#subjects', label: t[language].subjects },
    { href: '/#podcasts', label: t[language].podcasts },
    { href: '/#flashcards', label: t[language].flashcards },
  ]

  const appLinks = isAuthenticated
    ? [
        { to: '/dashboard', label: t[language].dashboard },
        { to: '/podcasts', label: t[language].podcasts },
        { to: '/flashcards', label: t[language].flashcards },
      ]
    : []

  const handleLogout = () => {
    setIsMobileMenuOpen(false)
    logout()
    navigate('/')
  }

  const mobileButtonBase = isLanding
    ? 'border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.1] hover:text-white'
    : isDark
      ? 'border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.1] hover:text-white'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950'

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-2xl ${
      isLanding
        ? 'border-b border-white/10 bg-slate-950/75 text-white shadow-[0_14px_42px_rgba(2,6,23,0.32)]'
        : isDark
          ? 'border-b border-white/10 bg-slate-950/82 text-white shadow-[0_14px_42px_rgba(2,6,23,0.32)]'
          : 'border-b border-slate-200/80 bg-white/95 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)]'
    }`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent dark:via-cyan-300/60"></div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/30 to-transparent dark:via-fuchsia-400/35"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-3 py-3 sm:py-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-[0_12px_28px_rgba(15,23,42,0.08)] sm:h-11 sm:w-11 ${
                isLanding
                  ? 'border-white/12 bg-white/[0.08] shadow-[0_12px_28px_rgba(0,0,0,0.18)]'
                  : isDark
                    ? 'border-white/12 bg-white/[0.08] shadow-[0_12px_28px_rgba(0,0,0,0.18)]'
                    : 'border-slate-200 bg-white'
              }`}>
                <img src="/images/logo.png" alt="QazMind Logo" className="h-7 w-7 object-contain sm:h-8 sm:w-8" />
              </div>
              <div className="min-w-0">
                <p className={`truncate text-lg font-black tracking-tight sm:text-xl ${
                  isLanding ? 'text-white' : isDark ? 'text-white' : 'text-slate-900'
                }`}>QazMind</p>
                <p className={`hidden text-[11px] uppercase tracking-[0.24em] md:block ${
                  isLanding ? 'text-cyan-100/85' : isDark ? 'text-cyan-100/85' : 'text-slate-500'
                }`}>
                  {t[language].tagline}
                </p>
              </div>
            </Link>

            <div className="hidden xl:flex xl:items-center xl:gap-1 xl:pl-3">
              {isLanding
                ? landingLinks.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isLanding
                          ? 'text-white/90 hover:bg-white/[0.08] hover:text-white'
                          : isDark
                            ? 'text-white/90 hover:bg-white/[0.08] hover:text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      {item.label}
                    </a>
                  ))
                : appLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        location.pathname === item.to
                          ? isDark ? 'bg-white/[0.1] text-white' : 'bg-slate-900 text-white'
                          : isDark
                            ? 'text-white/90 hover:bg-white/[0.08] hover:text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition sm:h-11 sm:w-11 ${mobileButtonBase}`}
              title={t[language].theme}
            >
              {theme === 'light' ? (
                <NavIcon>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3c0 .58.05 1.15.15 1.7A7 7 0 0021 12.79z" />
                </NavIcon>
              ) : (
                <NavIcon>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.5 12H3m18 0h-1.5M18.364 5.636l-1.06 1.06M6.696 17.304l-1.06 1.06m12.728 0l-1.06-1.06M6.696 6.696l-1.06-1.06M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </NavIcon>
              )}
            </button>

            <div className={`flex items-center rounded-2xl border p-1 ${
              isLanding
                ? 'border-white/12 bg-white/[0.05]'
                : isDark
                  ? 'border-white/12 bg-white/[0.05]'
                  : 'border-slate-200 bg-white'
            }`}>
              <button
                onClick={() => setLanguage('kz')}
                className={`rounded-xl px-2.5 py-2 text-[11px] font-bold transition sm:px-4 sm:text-xs ${
                  language === 'kz'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : `${isLanding ? 'text-white/80 hover:text-white' : isDark ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`
                }`}
              >
                KZ
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={`rounded-xl px-2.5 py-2 text-[11px] font-bold transition sm:px-4 sm:text-xs ${
                  language === 'ru'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : `${isLanding ? 'text-white/80 hover:text-white' : isDark ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`
                }`}
              >
                RU
              </button>
            </div>

            {isAuthenticated ? (
              <div className="hidden items-center gap-2 md:flex">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden rounded-2xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100 dark:border-amber-300/30 dark:bg-amber-400/12 dark:text-amber-100 dark:hover:bg-amber-400/20 lg:inline-flex"
                  >
                    {t[language].admin}
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:border-white/12 dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.1] lg:inline-flex"
                >
                  {t[language].dashboard}
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 px-4 py-3 text-sm font-bold text-white shadow-[0_14px_32px_rgba(168,85,247,0.24)] transition hover:scale-[1.02] sm:px-5"
                >
                  {t[language].openLearning}
                  <NavIcon className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />
                  </NavIcon>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-red-50 hover:text-red-600 dark:border-white/12 dark:bg-white/[0.05] dark:text-white/75 dark:hover:bg-red-500/18 dark:hover:text-white"
                  title={t[language].logout}
                >
                  <NavIcon>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h9m0 0l-3-3m3 3l-3 3" />
                  </NavIcon>
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/login"
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    isLanding
                      ? 'border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.1]'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:border-white/12 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]'
                  }`}
                >
                  {t[language].login}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 px-4 py-3 text-sm font-bold text-white shadow-[0_14px_32px_rgba(168,85,247,0.24)] transition hover:scale-[1.02] sm:px-5"
                >
                  {t[language].register}
                  <NavIcon className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />
                  </NavIcon>
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition md:hidden ${mobileButtonBase}`}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <NavIcon className="h-5 w-5">
                {isMobileMenuOpen ? (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                  </>
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                  </>
                )}
              </NavIcon>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className={`mb-4 rounded-[28px] border p-4 md:hidden ${
            isLanding
              ? 'border-white/12 bg-white/[0.06] text-white'
              : 'border-slate-200 bg-white text-slate-900 dark:border-white/12 dark:bg-slate-950/88 dark:text-white'
          }`}>
            <div className="flex flex-col gap-2">
              {(isLanding ? landingLinks : appLinks).map((item) =>
                isLanding ? (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isLanding
                        ? 'bg-white/[0.04] text-white/90 hover:bg-white/[0.1] hover:text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-white/[0.04] dark:text-white/90 dark:hover:bg-white/[0.1]'
                    }`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      location.pathname === item.to
                        ? 'bg-slate-900 text-white dark:bg-white/[0.12] dark:text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-white/[0.04] dark:text-white/90 dark:hover:bg-white/[0.1]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}

              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="rounded-2xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100 dark:border-amber-300/30 dark:bg-amber-400/12 dark:text-amber-100 dark:hover:bg-amber-400/20"
                    >
                      {t[language].admin}
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-between rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 px-4 py-3 text-sm font-bold text-white shadow-[0_14px_32px_rgba(168,85,247,0.24)]"
                  >
                    {t[language].openLearning}
                    <NavIcon className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />
                    </NavIcon>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-white/12 dark:bg-white/[0.05] dark:text-red-300 dark:hover:bg-red-500/12"
                  >
                    {t[language].logout}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isLanding
                        ? 'bg-white/[0.04] text-white/90 hover:bg-white/[0.1]'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-white/[0.04] dark:text-white/90 dark:hover:bg-white/[0.1]'
                    }`}
                  >
                    {t[language].login}
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-between rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 px-4 py-3 text-sm font-bold text-white shadow-[0_14px_32px_rgba(168,85,247,0.24)]"
                  >
                    {t[language].register}
                    <NavIcon className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />
                    </NavIcon>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
