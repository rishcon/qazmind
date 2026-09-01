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
  const reduceMotion = useReducedMotion()

  const t = {
    kz: {
      badge: 'Тегін тіркелу',
      heroLines: ['Дайындықты', 'бүгін баста.'],
      points: [
        'Тіркелу бір минуттан аз уақыт алады',
        'Қазақ және орыс тілдерінде қолжетімді',
        'AI-репетитор алғашқы күннен көмектеседі',
      ],
      title: 'Аккаунт құру',
      subtitle: 'QazMind-қа қосылып, AI-ментормен дайындықты бастаңыз.',
      email: 'Email',
      emailPlaceholder: 'example@qazmind.kz',
      password: 'Құпия сөз',
      passwordPlaceholder: '••••••••',
      confirmPassword: 'Құпия сөзді растау',
      submit: 'Тіркелу',
      loading: 'Жүктелуде...',
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
      genericError: 'Тіркелу қатесі. Қайталап көріңіз',
    },
    ru: {
      badge: 'Бесплатная регистрация',
      heroLines: ['Начни готовиться', 'уже сегодня.'],
      points: [
        'Регистрация занимает меньше минуты',
        'Доступно на казахском и русском',
        'AI-репетитор помогает с первого дня',
      ],
      title: 'Создать аккаунт',
      subtitle: 'Подключитесь к QazMind и начните подготовку с AI-ментором.',
      email: 'Email',
      emailPlaceholder: 'example@qazmind.kz',
      password: 'Пароль',
      passwordPlaceholder: '••••••••',
      confirmPassword: 'Подтвердите пароль',
      submit: 'Зарегистрироваться',
      loading: 'Загрузка...',
      hasAccount: 'Уже есть аккаунт?',
      login: 'Войти',
      passwordMismatch: 'Пароли не совпадают',
      passwordShort: 'Пароль должен быть не менее 6 символов',
      invalidEmail: 'Введите корректный email',
      passwordStrength: 'Надёжность пароля',
      weak: 'Слабая',
      medium: 'Средняя',
      strong: 'Сильная',
      reqMatch: 'Пароли совпадают',
      legalStart: 'Я согласен с',
      privacyPolicy: 'политикой конфиденциальности',
      and: 'и',
      terms: 'условиями использования',
      legalEnd: '',
      genericError: 'Ошибка регистрации. Попробуйте ещё раз',
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
  const strengthKey = passwordStrength === 1 ? 'weak' : passwordStrength === 2 ? 'medium' : 'strong'
  const strengthLabel = passwordStrength === 1 ? content.weak : passwordStrength === 2 ? content.medium : content.strong

  const isEmailValid = !email || validateEmail(email)
  const isPasswordValid = !password || password.length >= 6
  const isPasswordsMatch = !password || !confirmPassword || password === confirmPassword
  const isFormValid = email && password && confirmPassword && isEmailValid && isPasswordValid && isPasswordsMatch

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
        userData = { id: profile.id, email: profile.email, role: profile.role }
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
        setError(content.genericError)
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
                  <label htmlFor="register-email">{content.email}</label>
                  <div className="qm-auth-input-wrap">
                    <AuthIcon name="mail" className="qm-auth-icon-lead" />
                    <input
                      id="register-email"
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
                  <label htmlFor="register-password">{content.password}</label>
                  <div className="qm-auth-input-wrap">
                    <AuthIcon name="lock" className="qm-auth-icon-lead" />
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
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
                  {password && (
                    <div className="qm-auth-strength">
                      <div className="qm-auth-strength-row">
                        <span>{content.passwordStrength}</span>
                        <span className={`is-${strengthKey}`}>{strengthLabel}</span>
                      </div>
                      <div className="qm-auth-strength-track">
                        {[1, 2, 3].map((step) => (
                          <i key={step} className={step <= passwordStrength ? `filled ${strengthKey}` : ''} />
                        ))}
                      </div>
                    </div>
                  )}
                  {touched.password && !isPasswordValid && (
                    <p className="qm-auth-hint"><AuthIcon name="x" />{content.passwordShort}</p>
                  )}
                </div>

                <div className="qm-auth-field">
                  <label htmlFor="register-confirm">{content.confirmPassword}</label>
                  <div className="qm-auth-input-wrap">
                    <AuthIcon name="lock" className="qm-auth-icon-lead" />
                    <input
                      id="register-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      onBlur={() => handleBlur('confirm')}
                      className={`qm-auth-input ${touched.confirm && confirmPassword && !isPasswordsMatch ? 'is-error' : ''}`}
                      placeholder={content.passwordPlaceholder}
                      aria-invalid={touched.confirm && confirmPassword && !isPasswordsMatch}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="qm-auth-toggle"
                      aria-label={showConfirmPassword ? (language === 'kz' ? 'Құпия сөзді жасыру' : 'Скрыть пароль') : (language === 'kz' ? 'Құпия сөзді көрсету' : 'Показать пароль')}
                    >
                      <AuthIcon name={showConfirmPassword ? 'eyeOff' : 'eye'} />
                    </button>
                  </div>
                  {confirmPassword && (
                    <p className={`qm-auth-hint ${isPasswordsMatch ? 'ok' : ''}`}>
                      <AuthIcon name={isPasswordsMatch ? 'check' : 'x'} />
                      {isPasswordsMatch ? content.reqMatch : content.passwordMismatch}
                    </p>
                  )}
                </div>

                <label className="qm-auth-checkbox">
                  <input type="checkbox" />
                  <span>
                    {content.legalStart}{' '}
                    <Link to="/privacy">{content.privacyPolicy}</Link>{' '}
                    {content.and}{' '}
                    <Link to="/terms">{content.terms}</Link>{' '}
                    {content.legalEnd}
                  </span>
                </label>

                <button type="submit" disabled={loading || !isFormValid} className="qm-button qm-button-dark qm-auth-submit">
                  {loading ? content.loading : content.submit}
                  {!loading && <AuthIcon name="arrow" className="qm-icon" />}
                </button>
              </form>

              <div className="qm-auth-divider" />
              <p className="qm-auth-switch">
                {content.hasAccount} <Link to="/login">{content.login}</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
