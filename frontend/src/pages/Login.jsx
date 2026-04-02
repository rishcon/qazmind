import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useLanguageStore } from '../store/languageStore'
import { authService } from '../services/api'

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

  const t = {
    kz: {
      title: 'Кіру',
      subtitle: 'Қазақ өлімі: Менің сабағыма қайта оралыңыз',
      email: 'Email',
      emailPlaceholder: 'example@qazmind.kz',
      password: 'Құпия сөз',
      passwordPlaceholder: '••••••••',
      submit: 'Кіру',
      noAccount: 'Аккаунт жоқ па?',
      register: 'Тіркелу',
      invalidEmail: 'Дұрыс email енгізіңіз',
      invalidPassword: 'Құпия сөз кемінде 6 таңбадан тұруы керек',
      error: 'Email немесе құпия сөз қате',
      rememberMe: 'Мені есте сақта'
    },
    ru: {
      title: 'Вход',
      subtitle: 'Добро пожаловать в QazMind - изучайте казахский язык',
      email: 'Email',
      emailPlaceholder: 'example@qazmind.kz',
      password: 'Пароль',
      passwordPlaceholder: '••••••••',
      submit: 'Войти',
      noAccount: 'Нет аккаунта?',
      register: 'Зарегистрироваться',
      invalidEmail: 'Введите корректный email',
      invalidPassword: 'Пароль должен быть не менее 6 символов',
      error: 'Неверный email или пароль',
      rememberMe: 'Запомнить меня'
    }
  }

  const content = t[language]

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isEmailValid = !email || validateEmail(email)
  const isPasswordValid = !password || password.length >= 6
  const isFormValid = email && password && isEmailValid && isPasswordValid

  const handleSubmit = async (e) => {
    e.preventDefault()
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
        userData = {
          id: profile.id,
          email: profile.email,
          role: profile.role
        }
      } catch (profileError) {
        console.error('Failed to load profile after login:', profileError)
      }

      login(authData.access_token, userData)
      navigate('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      // Show user-friendly error message
      if (err.response?.status === 401) {
        setError(content.error) // "Неверный email или пароль"
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
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 mb-2">
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
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white dark:border-slate-600 ${
                    touched.email && !isEmailValid 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  }`}
                  placeholder={content.emailPlaceholder}
                  required
                />
                {touched.email && !isEmailValid && (
                  <span className="absolute right-3 top-3 text-red-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.313 12.898a1 1 0 00-1.414 1.415l3.5 3.5a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
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
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {content.password}
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white dark:border-slate-600 pr-12 ${
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
              {touched.password && !isPasswordValid && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.313 12.898a1 1 0 00-1.414 1.415l3.5 3.5a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                  </svg>
                  {content.invalidPassword}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:bg-slate-700 dark:border-slate-600"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {content.rememberMe}
                </span>
              </label>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2 pt-2">
              <input 
                type="checkbox" 
                id="terms"
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:bg-slate-700 dark:border-slate-600 mt-1 flex-shrink-0"
              />
              <label htmlFor="terms" className="text-xs text-gray-600 dark:text-gray-400">
                {language === 'kz' ? (
                  <>
                    Мен <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">құпиялылық саясатына</Link> және <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">қызмет шарттарына</Link> келісемін
                  </>
                ) : (
                  <>
                    Я согласен с <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">политикой конфиденциальности</Link> и <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">условиями использования</Link>
                  </>
                )}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mt-6"
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
                или
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {content.noAccount}{' '}
              <Link 
                to="/register" 
                className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors hover:underline"
              >
                {content.register}
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
