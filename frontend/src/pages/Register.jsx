import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useLanguageStore } from '../store/languageStore'
import { authService } from '../services/api'

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
      title: 'Тіркелу',
      subtitle: 'Өзіңізге аккаунт құрыңыз және оқуды бастаңыз',
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
      passwordStrength: 'Құпия сөз күші:',
      weak: 'Сәл',
      medium: 'Орташа',
      strong: 'Құқық',
      requirements: 'Құпия сөз талаптары:',
      req6chars: 'Кемінде 6 таңба',
      reqMatch: 'Құпия сөздер сәйкес келе',
      agreeTerms: 'Келісім шарттарына келісемін',
      privacyPolicy: 'Құпиялылық саясаты'
    },
    ru: {
      title: 'Регистрация',
      subtitle: 'Создайте аккаунт и начните учиться',
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
      passwordStrength: 'Надежность пароля:',
      weak: 'Слабая',
      medium: 'Средняя',
      strong: 'Сильная',
      requirements: 'Требования к паролю:',
      req6chars: 'Минимум 6 символов',
      reqMatch: 'Пароли совпадают',
      agreeTerms: 'Согласен с условиями использования',
      privacyPolicy: 'Политика конфиденциальности'
    }
  }

  const content = t[language]

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Определяем силу пароля
  const getPasswordStrength = (pass) => {
    if (!pass) return 0
    let strength = 0
    if (pass.length >= 6) strength++
    if (pass.length >= 12) strength++
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++
    if (/[0-9]/.test(pass)) strength++
    if (/[^a-zA-Z0-9]/.test(pass)) strength++
    return Math.min(strength, 3) // Max 3 levels
  }

  const passwordStrength = getPasswordStrength(password)

  const isEmailValid = !email || validateEmail(email)
  const isPasswordValid = !password || password.length >= 6
  const isPasswordsMatch = !password || !confirmPassword || password === confirmPassword
  const isFormValid = email && password && confirmPassword && isEmailValid && isPasswordValid && isPasswordsMatch

  const handleSubmit = async (e) => {
    e.preventDefault()
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
          role: profile.role
        }
      } catch (profileError) {
        console.error('Failed to load profile after registration:', profileError)
      }

      login(authData.access_token, userData)
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration error:', err)
      // Show user-friendly error message
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else if (err.message) {
        setError(err.message)
      } else {
        setError('Ошибка регистрации. Попробуйте еще раз')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl bg-opacity-90 dark:bg-opacity-80 border border-white/20 dark:border-slate-700/50 p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/images/logo.png" alt="QazMind Logo" className="w-16 h-16 object-contain" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2">
              {content.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {content.subtitle}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 rounded-xl animate-scale-in flex gap-3 items-start">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {content.email}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white dark:border-slate-600 ${
                    touched.email && !isEmailValid 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  }`}
                  placeholder={content.emailPlaceholder}
                  required
                />
                {touched.email && isEmailValid && email && (
                  <span className="absolute right-3 top-3 text-green-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              {touched.email && !isEmailValid && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.313 12.898a1 1 0 00-1.414 1.415l3.5 3.5a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                  </svg>
                  {content.invalidEmail}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {content.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white dark:border-slate-600 pr-12 ${
                    touched.password && !isPasswordValid 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  }`}
                  placeholder={content.passwordPlaceholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {content.passwordStrength}
                    </span>
                    <span className="text-xs font-semibold">
                      {passwordStrength === 1 && (
                        <span className="text-red-500">{content.weak}</span>
                      )}
                      {passwordStrength === 2 && (
                        <span className="text-yellow-500">{content.medium}</span>
                      )}
                      {passwordStrength >= 3 && (
                        <span className="text-green-500">{content.strong}</span>
                      )}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength === 1
                          ? 'w-1/3 bg-red-500'
                          : passwordStrength === 2
                          ? 'w-2/3 bg-yellow-500'
                          : 'w-full bg-green-500'
                      }`}
                    />
                  </div>
                </div>
              )}

              {touched.password && !isPasswordValid && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.313 12.898a1 1 0 00-1.414 1.415l3.5 3.5a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                  </svg>
                  {content.passwordShort}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {content.confirmPassword}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur('confirm')}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white dark:border-slate-600 pr-12 ${
                    touched.confirm && confirmPassword && !isPasswordsMatch 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
                      : touched.confirm && confirmPassword && isPasswordsMatch
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  }`}
                  placeholder={content.passwordPlaceholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Passwords Match Indicator */}
              {confirmPassword && (
                <div className="flex items-center gap-2">
                  {isPasswordsMatch ? (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {content.reqMatch}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-xs">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      {content.passwordMismatch}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2 pt-2">
              <input 
                type="checkbox" 
                id="terms"
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:bg-slate-700 dark:border-slate-600 mt-1 flex-shrink-0"
              />
              <label htmlFor="terms" className="text-xs text-gray-600 dark:text-gray-400">
                {language === 'kz' ? (
                  <>
                    Мен <Link to="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">құпиялылық саясатына</Link> және <Link to="/terms" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">қызмет шарттарына</Link> келісемін
                  </>
                ) : (
                  <>
                    Я согласен с <Link to="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">политикой конфиденциальности</Link> и <Link to="/terms" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">условиями использования</Link>
                  </>
                )}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {language === 'kz' ? 'Жүктеліп жатыр...' : 'Загрузка...'}
                </>
              ) : content.submit}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                {language === 'kz' ? 'немесе' : 'или'}
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {content.hasAccount}{' '}
              <Link 
                to="/login" 
                className="font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors hover:underline"
              >
                {content.login}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">
          {language === 'kz' ? 'QazMind © 2026. Барлық құқықтар сақталған.' : 'QazMind © 2026. Все права защищены.'}
        </p>
      </div>
    </div>
  )
}
