import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useLanguageStore } from '../store/languageStore'
import { authService } from '../services/api'

function AuthIcon({ name, className = 'h-5 w-5' }) {
  const icons = {
    arrow: <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.8l4.3 4.3L19.5 6.8" />,
    eye: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S5.8 5.8 12 5.8 21.5 12 21.5 12 18.2 18.2 12 18.2 2.5 12 2.5 12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </>
    ),
    eyeOff: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6A3 3 0 0012 15a3 3 0 002.4-4.8M7.6 7.6C4.3 9.4 2.5 12 2.5 12s3.3 6.2 9.5 6.2c1.6 0 3-.4 4.2-1M13.8 5.9C19 6.8 21.5 12 21.5 12a16 16 0 01-2.2 3" />
      </>
    ),
    mail: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.5h16v11H4zM4 7l8 6 8-6" />,
    lock: <path strokeLinecap="round" strokeLinejoin="round" d="M7 10V8a5 5 0 0110 0v2m-11 0h12v10H6V10z" />,
    sparkles: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 4l.6 1.4L21 6l-1.4.6L19 8l-.6-1.4L17 6l1.4-.6L19 4z" />
      </>
    ),
    x: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
  }

  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})

  const { login } = useAuthStore()
  const { language } = useLanguageStore()
  const navigate = useNavigate()

  const t = {
    kz: {
      title: 'Аккаунт құру',
      subtitle: 'QazMind-қа қосылып, AI-ментормен дайындықты бастаңыз.',
      badge: 'Тегін тіркелу',
      email: 'Email',
      emailPlaceholder: 'example@qazmind.kz',
      password: 'Құпия сөз',
      passwordPlaceholder: '••••••••',
      confirmPassword: 'Құпия сөзді растау',
      submit: 'Тіркелу',
      hasAccount: 'Аккаунт бар ма?',
      login: 'Кіру',
      passwordMismatch: 'Құпия сөздер сәйкес келмейді',
      passwordShort: 'Құпия сөз кемінде 6 таңбадан тұруы керек',
      invalidEmail: 'Дұрыс email енгізіңіз',
      passwordStrength: 'Құпия сөз күші',
      weak: 'Әлсіз',
      medium: 'Орташа',
      strong: 'Күшті',
      reqMatch: 'Құпия сөздер сәйкес келеді',
      legalStart: 'Мен',
      privacyPolicy: 'құпиялылық саясатына',
      and: 'және',
      terms: 'қызмет шарттарына',
      legalEnd: 'келісемін',
    },
    ru: {
      title: 'Создать аккаунт',
      subtitle: 'Подключитесь к QazMind и начните подготовку с AI-ментором.',
      badge: 'Бесплатная регистрация',
      email: 'Email',
      emailPlaceholder: 'example@qazmind.kz',
      password: 'Пароль',
      passwordPlaceholder: '••••••••',
      confirmPassword: 'Подтвердите пароль',
      submit: 'Зарегистрироваться',
      hasAccount: 'Уже есть аккаунт?',
      login: 'Войти',
      passwordMismatch: 'Пароли не совпадают',
      passwordShort: 'Пароль должен быть не менее 6 символов',
      invalidEmail: 'Введите корректный email',
      passwordStrength: 'Надежность пароля',
      weak: 'Слабая',
      medium: 'Средняя',
      strong: 'Сильная',
      reqMatch: 'Пароли совпадают',
      legalStart: 'Я согласен с',
      privacyPolicy: 'политикой конфиденциальности',
      and: 'и',
      terms: 'условиями использования',
      legalEnd: '',
    },
  }

  const content = t[language]
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const getPasswordStrength = (value) => {
    if (!value) return 0
    let strength = 0
    if (value.length >= 6) strength += 1
    if (value.length >= 12) strength += 1
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength += 1
    if (/[0-9]/.test(value)) strength += 1
    if (/[^a-zA-Z0-9]/.test(value)) strength += 1
    return Math.min(strength, 3)
  }

  const passwordStrength = getPasswordStrength(password)
  const isEmailValid = !email || validateEmail(email)
  const isPasswordValid = !password || password.length >= 6
  const isPasswordsMatch = !password || !confirmPassword || password === confirmPassword
  const isFormValid = email && password && confirmPassword && isEmailValid && isPasswordValid && isPasswordsMatch

  const strengthLabel = passwordStrength === 1 ? content.weak : passwordStrength === 2 ? content.medium : content.strong
  const strengthColor = passwordStrength === 1 ? 'bg-red-400' : passwordStrength === 2 ? 'bg-amber-300' : 'bg-emerald-300'
  const strengthText = passwordStrength === 1 ? 'text-red-300' : passwordStrength === 2 ? 'text-amber-200' : 'text-emerald-300'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError(content.invalidEmail)
      return
    }

    if (password.length < 6) {
      setError(content.passwordShort)
      return
    }

    if (password !== confirmPassword) {
      setError(content.passwordMismatch)
      return
    }

    setLoading(true)

    try {
      const authData = await authService.register(email, password)
      let userData = { email }

      try {
        const profile = await authService.getCurrentProfile(authData.access_token)
        userData = {
          id: profile.id,
          email: profile.email,
          role: profile.role,
        }
      } catch (profileError) {
        console.error('Failed to load profile after registration:', profileError)
      }

      login(authData.access_token, userData)
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration error:', err)
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else if (err.message) {
        setError(err.message)
      } else {
        setError(language === 'kz' ? 'Тіркелу қатесі. Қайталап көріңіз' : 'Ошибка регистрации. Попробуйте еще раз')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
  }

  return (
    <div className="landing-page-bg relative min-h-[calc(100vh-5rem)] overflow-hidden px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="landing-orbit absolute -left-24 bottom-20 h-72 w-72 rounded-full border border-pink-400/25"></div>
        <div className="landing-orbit landing-orbit-slow absolute -right-28 top-28 h-80 w-80 rounded-full border border-violet-400/20"></div>
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="mx-auto w-full max-w-md lg:order-2">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.065] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-8">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-pink-300/70 to-transparent"></div>
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl"></div>

            <div className="mb-8 text-center">
              <img src="/images/logo.png" alt="QazMind Logo" className="mx-auto h-16 w-16 object-contain" />
              <h2 className="mt-5 text-4xl font-black text-white [letter-spacing:0]">{content.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/58">{content.subtitle}</p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-red-100">
                <AuthIcon name="x" className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/75">{content.email}</label>
                <div className="relative">
                  <AuthIcon name="mail" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-200/70" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full rounded-2xl border bg-black/20 px-12 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10 ${
                      touched.email && !isEmailValid ? 'border-red-400/60' : 'border-white/10'
                    }`}
                    placeholder={content.emailPlaceholder}
                    required
                  />
                  {touched.email && isEmailValid && email && <AuthIcon name="check" className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-300" />}
                </div>
                {touched.email && !isEmailValid && <p className="text-xs font-semibold text-red-300">{content.invalidEmail}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white/75">{content.password}</label>
                <div className="relative">
                  <AuthIcon name="lock" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-200/70" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`w-full rounded-2xl border bg-black/20 px-12 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-300/60 focus:ring-4 focus:ring-violet-300/10 ${
                      touched.password && !isPasswordValid ? 'border-red-400/60' : 'border-white/10'
                    }`}
                    placeholder={content.passwordPlaceholder}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 transition hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <AuthIcon name={showPassword ? 'eyeOff' : 'eye'} />
                  </button>
                </div>
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white/50">{content.passwordStrength}</span>
                      <span className={`font-black ${strengthText}`}>{strengthLabel}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full rounded-full transition-all duration-300 ${strengthColor} ${passwordStrength === 1 ? 'w-1/3' : passwordStrength === 2 ? 'w-2/3' : 'w-full'}`}></div>
                    </div>
                  </div>
                )}
                {touched.password && !isPasswordValid && <p className="text-xs font-semibold text-red-300">{content.passwordShort}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white/75">{content.confirmPassword}</label>
                <div className="relative">
                  <AuthIcon name="lock" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-pink-200/70" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    onBlur={() => handleBlur('confirm')}
                    className={`w-full rounded-2xl border bg-black/20 px-12 py-4 text-white outline-none transition placeholder:text-white/30 focus:ring-4 ${
                      touched.confirm && confirmPassword && !isPasswordsMatch
                        ? 'border-red-400/60 focus:border-red-300/70 focus:ring-red-300/10'
                        : touched.confirm && confirmPassword && isPasswordsMatch
                          ? 'border-emerald-300/60 focus:border-emerald-300/70 focus:ring-emerald-300/10'
                          : 'border-white/10 focus:border-pink-300/60 focus:ring-pink-300/10'
                    }`}
                    placeholder={content.passwordPlaceholder}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 transition hover:text-white"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    <AuthIcon name={showConfirmPassword ? 'eyeOff' : 'eye'} />
                  </button>
                </div>
                {confirmPassword && (
                  <p className={`flex items-center gap-2 text-xs font-semibold ${isPasswordsMatch ? 'text-emerald-300' : 'text-red-300'}`}>
                    <AuthIcon name={isPasswordsMatch ? 'check' : 'x'} className="h-4 w-4" />
                    {isPasswordsMatch ? content.reqMatch : content.passwordMismatch}
                  </p>
                )}
              </div>

              <label className="flex items-start gap-3 text-xs leading-5 text-white/55">
                <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 bg-black/20 text-pink-500 focus:ring-pink-400" />
                <span>
                  {content.legalStart}{' '}
                  <Link to="/privacy" className="font-bold text-cyan-200 transition hover:text-white">{content.privacyPolicy}</Link>{' '}
                  {content.and}{' '}
                  <Link to="/terms" className="font-bold text-cyan-200 transition hover:text-white">{content.terms}</Link>{' '}
                  {content.legalEnd}
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="landing-primary-button w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (language === 'kz' ? 'Жүктелуде...' : 'Загрузка...') : content.submit}
                {!loading && <AuthIcon name="arrow" className="h-5 w-5" />}
              </button>
            </form>

            <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>

            <p className="text-center text-sm text-white/60">
              {content.hasAccount}{' '}
              <Link to="/login" className="font-black text-cyan-200 transition hover:text-white">
                {content.login}
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:order-1 lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-300/20 bg-pink-300/10 px-4 py-2 text-sm font-black text-pink-200">
            <AuthIcon name="sparkles" className="h-4 w-4" />
            {content.badge}
          </div>
          <h1 className="mt-7 text-6xl font-black leading-none [letter-spacing:0]">
            QazMind
            <span className="block bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-400 bg-clip-text text-transparent">
              старт
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">{content.subtitle}</p>
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-2xl">
            <div className="grid grid-cols-3 gap-4">
              {['AI', '14+', '98%'].map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-3xl font-black text-white">{item}</p>
                  <p className="mt-1 text-sm text-white/50">{['ментор', 'предметов', 'точность'][index]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
