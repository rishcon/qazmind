import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguageStore } from '../store/languageStore'
import { authService } from '../services/api'

export default function ForgotPassword() {
  const [stage, setStage] = useState('email') // 'email' -> 'code' -> 'newPassword'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [touched, setTouched] = useState({})

  const { language } = useLanguageStore()
  const navigate = useNavigate()

  const t = {
    kz: {
      title: 'Құпия сөзді қалпына келтіру',
      subtitle: 'Өзіңіздің аккаунтына қайта кіріңіз',
      
      stage1: {
        label: 'Email',
        placeholder: 'example@qazmind.kz',
        button: 'Кодты жіберу',
        info: 'Бізіл сізге растау кодын жіберемі'
      },
      
      stage2: {
        label: 'Растау коды',
        placeholder: '000000',
        info: 'Өз emailіңізге келген 6 таңбалы кодты енгізіңіз',
        button: 'Растау',
        resend: 'Кодты қайта жіберу',
        codeSent: 'Код жіберілді!',
        spamWarning: 'Пожалуйста, проверьте папку "Спам" или "Промоции" в вашей почте'
      },
      
      stage3: {
        newPassword: 'Жаңа құпия сөз',
        confirmPassword: 'Құпия сөзді растау',
        button: 'Құпия сөзді өзгерту',
        passwordShort: 'Құпия сөз кемінде 6 таңбадан тұруы керек',
        passwordMismatch: 'Құпия сөздер сәйкес келмейді'
      },
      
      errors: {
        emailRequired: 'Email енгізіңіз',
        invalidEmail: 'Дұрыс email енгізіңіз',
        emailNotFound: 'Бұл email тіркелмеген',
        codeRequired: 'Кодты енгізіңіз',
        invalidCode: 'Қате код',
        passwordRequired: 'Құпия сөзді енгізіңіз',
      },
      
      success: {
        codeSent: 'Растау коды emailге жіберілді',
        passwordReset: 'Құпия сөз сәтті өзгертілді! Кіріңіз'
      },
      
      back: 'Кіруге қайту',
      passwordMatch: 'Құпия сөздер сәйкес келеді',
    },
    ru: {
      title: 'Восстановление пароля',
      subtitle: 'Вернитесь в свой аккаунт',
      
      stage1: {
        label: 'Email',
        placeholder: 'example@qazmind.kz',
        button: 'Отправить код',
        info: 'Мы отправим код подтверждения на вашу почту'
      },
      
      stage2: {
        label: 'Код подтверждения',
        placeholder: '000000',
        info: 'Введите 6-значный код, который мы отправили на вашу почту',
        button: 'Проверить',
        resend: 'Отправить код еще раз',
        codeSent: 'Код отправлен!',
        spamWarning: 'Если письма нет, проверьте папку "Спам" или "Промоции"'
      },
      
      stage3: {
        newPassword: 'Новый пароль',
        confirmPassword: 'Подтвердите пароль',
        button: 'Изменить пароль',
        passwordShort: 'Пароль должен быть не менее 6 символов',
        passwordMismatch: 'Пароли не совпадают'
      },
      
      errors: {
        emailRequired: 'Введите email',
        invalidEmail: 'Введите корректный email',
        emailNotFound: 'Этот email не зарегистрирован',
        codeRequired: 'Введите код',
        invalidCode: 'Неверный код',
        passwordRequired: 'Введите пароль',
      },
      
      success: {
        codeSent: 'Код подтверждения отправлен на почту',
        passwordReset: 'Пароль успешно изменен! Войдите в аккаунт'
      },
      
      back: 'Вернуться в вход',
      passwordMatch: 'Пароли совпадают',
    }
  }

  const content = t[language]

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
  }

  // Stage 1: Send code
  const handleSendCode = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError(content.errors.emailRequired)
      return
    }

    if (!validateEmail(email)) {
      setError(content.errors.invalidEmail)
      return
    }

    setLoading(true)

    try {
      // API запрос для отправки кода
      const data = await authService.sendPasswordResetCode(email)

      setSuccess(data.message || content.success.codeSent)
      setCodeSent(true)
      setCountdown(60)
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Переходим ко второй стадии через 2 секунды
      setTimeout(() => {
        setStage('code')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error sending code')
    } finally {
      setLoading(false)
    }
  }

  // Stage 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!code) {
      setError(content.errors.codeRequired)
      return
    }

    setLoading(true)

    try {
      // API запрос для проверки кода
      const data = await authService.verifyPasswordResetCode(email, code)

      setSuccess('Code verified!')
      
      setTimeout(() => {
        setStage('newPassword')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error verifying code')
    } finally {
      setLoading(false)
    }
  }

  // Stage 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newPassword || !confirmPassword) {
      setError(content.errors.passwordRequired)
      return
    }

    if (newPassword.length < 6) {
      setError(content.stage3.passwordShort)
      return
    }

    if (newPassword !== confirmPassword) {
      setError(content.stage3.passwordMismatch)
      return
    }

    setLoading(true)

    try {
      // API запрос для сброса пароля
      await authService.resetPassword(email, code, newPassword)

      setSuccess(content.success.passwordReset)
      
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error resetting password')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return
    
    setError('')
    setSuccess('')
    setCountdown(60)
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    try {
      // Переотправляем код через API
      await authService.sendPasswordResetCode(email)
      setSuccess(content.stage2.codeSent)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error resending code')
    }
  }

  const isPasswordValid = !newPassword || newPassword.length >= 6
  const isPasswordsMatch = !newPassword || !confirmPassword || newPassword === confirmPassword

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl bg-opacity-90 dark:bg-opacity-80 border border-white/20 dark:border-slate-700/50 p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/images/logo.png" alt="QazMind Logo" className="w-16 h-16 object-contain" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 mb-2">
              {content.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {content.subtitle}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-2 mb-8">
            <div className={`flex-1 h-2 rounded-full transition-all ${stage === 'email' || stage === 'code' || stage === 'newPassword' ? 'bg-purple-500' : 'bg-gray-300 dark:bg-slate-600'}`}></div>
            <div className={`flex-1 h-2 rounded-full transition-all ${stage === 'code' || stage === 'newPassword' ? 'bg-purple-500' : 'bg-gray-300 dark:bg-slate-600'}`}></div>
            <div className={`flex-1 h-2 rounded-full transition-all ${stage === 'newPassword' ? 'bg-purple-500' : 'bg-gray-300 dark:bg-slate-600'}`}></div>
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

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50 text-green-700 dark:text-green-300 rounded-xl animate-scale-in flex gap-3 items-start">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          {/* Stage 1: Email */}
          {stage === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {content.stage1.label}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className="w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                    placeholder={content.stage1.placeholder}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {content.stage1.info}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {loading ? '...' : content.stage1.button}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                >
                  {content.back}
                </Link>
              </div>
            </form>
          )}

          {/* Stage 2: Code Verification */}
          {stage === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              {/* Spam Warning */}
              <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-200 rounded-xl flex gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{content.stage2.spamWarning}</span>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {content.stage2.label}
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.slice(0, 6))}
                  onBlur={() => handleBlur('code')}
                  maxLength="6"
                  className="w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white dark:border-slate-600 text-center text-2xl tracking-widest font-mono"
                  placeholder={content.stage2.placeholder}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {content.stage2.info}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {loading ? '...' : content.stage2.button}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={countdown > 0 || loading}
                className="w-full py-2 px-4 border border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {countdown > 0 ? `${content.stage2.resend} (${countdown}s)` : content.stage2.resend}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                >
                  {content.back}
                </Link>
              </div>
            </form>
          )}

          {/* Stage 3: New Password */}
          {stage === 'newPassword' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {content.stage3.newPassword}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onBlur={() => handleBlur('newPassword')}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white dark:border-slate-600 pr-12 ${
                      touched.newPassword && !isPasswordValid 
                        ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder="••••••••"
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
                {touched.newPassword && !isPasswordValid && (
                  <p className="text-red-500 text-xs mt-1">
                    {content.stage3.passwordShort}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {content.stage3.confirmPassword}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white dark:border-slate-600 pr-12 ${
                      touched.confirmPassword && !isPasswordsMatch
                        ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder="••••••••"
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
                {touched.confirmPassword && isPasswordsMatch && confirmPassword && (
                  <p className="text-green-600 dark:text-green-400 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {content.passwordMatch}
                  </p>
                )}
                {touched.confirmPassword && !isPasswordsMatch && (
                  <p className="text-red-500 text-xs mt-1">
                    {content.stage3.passwordMismatch}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid || !isPasswordsMatch}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {loading ? '...' : content.stage3.button}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                >
                  {content.back}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
