import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useLanguageStore } from '../store/languageStore'
import { authService } from '../services/api'

function AuthIcon({ name, className = '' }) {
  const icons = {
    arrow: <path d="M5 15 15 5M8 5h7v7" />,
    check: <path d="M4.5 12.8l4.3 4.3L19.5 6.8" />,
    eye: (
      <>
        <path d="M2.5 12S5.8 5.8 12 5.8 21.5 12 21.5 12 18.2 18.2 12 18.2 2.5 12 2.5 12z" />
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </>
    ),
    eyeOff: <path d="M3 3l18 18M10.6 10.6A3 3 0 0012 15a3 3 0 002.4-4.8M7.6 7.6C4.3 9.4 2.5 12 2.5 12s3.3 6.2 9.5 6.2c1.6 0 3-.4 4.2-1M13.8 5.9C19 6.8 21.5 12 21.5 12a16 16 0 01-2.2 3" />,
    mail: <path d="M4 6.5h16v11H4zM4 7l8 6 8-6" />,
    lock: <path d="M7 10V8a5 5 0 0110 0v2m-11 0h12v10H6V10z" />,
    x: <path d="M6 18L18 6M6 6l12 12" />,
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

const Logo = () => (
  <span className="qm-logo">
    <svg viewBox="0 0 40 44" aria-hidden="true">
      <path d="M20 3 35 12v20l-8 5-7-5 8-5v-11l-8-5-8 5v12l9 6-7 5L5 34V12L20 3Z" fill="currentColor" />
    </svg>
    <strong>QazMind</strong>
  </span>
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})

  const { login } = useAuthStore()
  const { language } = useLanguageStore()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()

  const t = {
    kz: {
      badge: 'AI оқу жүйесі',
      heroLines: ['Тоқтаған жерден', 'жалғастыр.'],
      points: [
        'ҰБТ-ның барлық пәндері бойынша тесттер',
        'AI қателерді қарапайым тілмен түсіндіреді',
        'Прогресс пен карточкалар аккаунтта сақталады',
      ],
      title: 'Қайта қош келдіңіз',
      subtitle: 'QazMind аккаунтыңызға кіріп, дайындықты жалғастырыңыз.',
      email: 'Email',
      emailPlaceholder: 'example@qazmind.kz',
      password: 'Құпия сөз',
      passwordPlaceholder: '••••••••',
      submit: 'Кіру',
      loading: 'Жүктелуде...',
      noAccount: 'Аккаунт жоқ па?',
      register: 'Тіркелу',
      help: 'Көмек',
      invalidEmail: 'Дұрыс email енгізіңіз',
      invalidPassword: 'Құпия сөз кемінде 6 таңбадан тұруы керек',
      error: 'Email немесе құпия сөз қате',
      legal: 'Кіру арқылы сіз құпиялылық саясаты мен қызмет шарттарын қабылдайсыз.',
    },
    ru: {
      badge: 'AI learning system',
      heroLines: ['Продолжай', 'с того места.'],
      points: [
        'Тесты по всем предметам ЕНТ',
        'AI объясняет ошибки понятным языком',
        'Прогресс и карточки сохраняются в аккаунте',
      ],
      title: 'С возвращением',
      subtitle: 'Войдите в QazMind и продолжайте подготовку с AI-ментором.',
      email: 'Email',
      emailPlaceholder: 'example@qazmind.kz',
      password: 'Пароль',
      passwordPlaceholder: '••••••••',
      submit: 'Войти',
      loading: 'Загрузка...',
      noAccount: 'Нет аккаунта?',
      register: 'Зарегистрироваться',
      help: 'Помощь',
      invalidEmail: 'Введите корректный email',
      invalidPassword: 'Пароль должен быть не менее 6 символов',
      error: 'Неверный email или пароль',
      legal: 'Входя в аккаунт, вы принимаете политику конфиденциальности и условия использования.',
    },
  }

  const content = t[language]
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const isEmailValid = !email || validateEmail(email)
  const isPasswordValid = !password || password.length >= 6
  const isFormValid = email && password && isEmailValid && isPasswordValid

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError(content.invalidEmail)
      return
    }

    if (password.length < 6) {
      setError(content.invalidPassword)
      return
    }

    setLoading(true)

    try {
      const authData = await authService.login(email, password)
      let userData = { email }

      try {
        const profile = await authService.getCurrentProfile(authData.access_token)
        userData = { id: profile.id, email: profile.email, role: profile.role }
      } catch (profileError) {
        console.error('Failed to load profile after login:', profileError)
      }

      login(authData.access_token, userData)
      navigate('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      if (err.response?.status === 401) {
        setError(content.error)
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else if (err.message) {
        setError(err.message)
      } else {
        setError(content.error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBlur = (field) => setTouched({ ...touched, [field]: true })

  const fadeUp = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }

  return (
    <div className="qm-auth">
      <div className="qm-auth-glow" aria-hidden="true" />
      <div className="qm-auth-shell">
        <div className="qm-auth-grid">
          <motion.div className="qm-auth-brand" {...fadeUp}>
            <p className="qm-eyebrow">{content.badge}</p>
            <h1>{content.heroLines.map((line) => <span key={line}>{line}</span>)}</h1>
            <p className="qm-lede">{content.subtitle}</p>
            <div className="qm-auth-points">
              {content.points.map((point) => (
                <div className="qm-auth-point" key={point}>
                  <AuthIcon name="check" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="qm-auth-card-wrap" {...fadeUp} transition={{ ...fadeUp.transition, delay: reduceMotion ? 0 : 0.1 }}>
            <div className="qm-auth-card">
              <div className="qm-auth-head">
                <Logo />
                <h2>{content.title}</h2>
                <p>{content.subtitle}</p>
              </div>

              {error && (
                <div className="qm-auth-error" role="alert">
                  <AuthIcon name="x" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="qm-auth-form" noValidate>
                <div className="qm-auth-field">
                  <label htmlFor="login-email">{content.email}</label>
                  <div className="qm-auth-input-wrap">
                    <AuthIcon name="mail" className="qm-auth-icon-lead" />
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`qm-auth-input ${touched.email && !isEmailValid ? 'is-error' : ''}`}
                      placeholder={content.emailPlaceholder}
                      aria-invalid={touched.email && !isEmailValid}
                      required
                    />
                    {touched.email && isEmailValid && email && <AuthIcon name="check" className="qm-auth-check-ok" />}
                  </div>
                  {touched.email && !isEmailValid && (
                    <p className="qm-auth-hint"><AuthIcon name="x" />{content.invalidEmail}</p>
                  )}
                </div>

                <div className="qm-auth-field">
                  <label htmlFor="login-password">{content.password}</label>
                  <div className="qm-auth-input-wrap">
                    <AuthIcon name="lock" className="qm-auth-icon-lead" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onBlur={() => handleBlur('password')}
                      className={`qm-auth-input ${touched.password && !isPasswordValid ? 'is-error' : ''}`}
                      placeholder={content.passwordPlaceholder}
                      aria-invalid={touched.password && !isPasswordValid}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="qm-auth-toggle"
                      aria-label={showPassword ? (language === 'kz' ? 'Құпия сөзді жасыру' : 'Скрыть пароль') : (language === 'kz' ? 'Құпия сөзді көрсету' : 'Показать пароль')}
                    >
                      <AuthIcon name={showPassword ? 'eyeOff' : 'eye'} />
                    </button>
                  </div>
                  {touched.password && !isPasswordValid && (
                    <p className="qm-auth-hint"><AuthIcon name="x" />{content.invalidPassword}</p>
                  )}
                </div>

                <div className="qm-auth-row">
                  <Link to="/privacy" className="qm-text-link">{content.help}</Link>
                </div>

                <button type="submit" disabled={loading || !isFormValid} className="qm-button qm-button-dark qm-auth-submit">
                  {loading ? content.loading : content.submit}
                  {!loading && <AuthIcon name="arrow" className="qm-icon" />}
                </button>
              </form>

              <p className="qm-auth-legal">{content.legal}</p>
              <div className="qm-auth-divider" />
              <p className="qm-auth-switch">
                {content.noAccount} <Link to="/register">{content.register}</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
