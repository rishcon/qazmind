import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguageStore } from '../store/languageStore'
import { testService } from '../services/api'
import ExplanationModal from '../components/ExplanationModal'

export default function Results() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  
  const { attemptId } = useParams()
  const { language } = useLanguageStore()
  const navigate = useNavigate()

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true)
      try {
        const response = await testService.getTestResult(attemptId)
        setResults(response)
      } catch (error) {
        console.error('Failed to load results:', error)
        setResults(null)
      } finally {
        setLoading(false)
      }
    }

    if (attemptId) {
      loadResults()
      return
    }

    setLoading(false)
  }, [attemptId])

  const handleExplain = (question) => {
    setSelectedQuestion(question)
  }

  const handleRetakeTest = () => {
    // Перенаправляем на тот же тест, который проходили
    if (results?.subject_id) {
      navigate(`/test/${results.subject_id}`)
    } else {
      // Если subjectId не найден, идем на dashboard
      navigate('/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {language === 'kz' ? 'Нәтижелер жүктелуде...' : 'Загрузка результатов...'}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {language === 'kz' ? 'Күте тұрыңыз' : 'Подождите немного'}
          </p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="text-8xl mb-6 animate-bounce-subtle">📊</div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'kz' ? 'Нәтижелер табылмады' : 'Результаты не найдены'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {language === 'kz' ? 'Алдымен тестті өтіңіз' : 'Сначала пройдите тест'}
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold overflow-hidden transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-purple-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center gap-2">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {language === 'kz' ? 'Басты бетке' : 'На главную'}
            </span>
          </button>
        </div>
      </div>
    )
  }

  const percentage = Math.round((results.score / results.total) * 100)
  const passed = percentage >= 60

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Score Card */}
          <div className="group relative mb-8 animate-scale-in">
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-30 ${
              passed ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-red-400 to-orange-400'
            }`}></div>
            
            <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-slate-700 p-8 md:p-12">
              <div className="text-center">
                {/* Trophy or sad icon */}
                <div className="text-8xl mb-6 animate-bounce-subtle">
                  {passed ? '🏆' : '😔'}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {language === 'kz' ? 'Тест нәтижесі' : 'Результат теста'}
                </h1>
                
                {/* Score Circle */}
                <div className="relative inline-block mb-6">
                  {/* Background circle */}
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200 dark:text-slate-700"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(percentage / 100) * 534} 534`}
                      className="transition-all duration-1000"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={passed ? '#10b981' : '#ef4444'} />
                        <stop offset="100%" stopColor={passed ? '#34d399' : '#f97316'} />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Score text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-black" style={{
                      background: passed 
                        ? 'linear-gradient(135deg, #10b981, #34d399)' 
                        : 'linear-gradient(135deg, #ef4444, #f97316)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {percentage}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                      {results.score} / {results.total}
                    </div>
                  </div>
                </div>

                <div className={`inline-block px-8 py-3 rounded-2xl text-white text-xl font-bold shadow-lg mb-8 ${
                  passed 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse-scale' 
                    : 'bg-gradient-to-r from-red-500 to-orange-500'
                }`}>
                  {passed 
                    ? (language === 'kz' ? 'Өттіңіз! 🎉' : 'Вы прошли! 🎉')
                    : (language === 'kz' ? 'Өтпедіңіз' : 'Не прошли')}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <button 
                    onClick={handleRetakeTest} 
                    className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold overflow-hidden transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-purple-500/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative flex items-center gap-2">
                      <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {language === 'kz' ? 'Қайта өту' : 'Пройти снова'}
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/')} 
                    className="group relative px-8 py-4 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-2xl font-bold border-2 border-gray-200 dark:border-slate-600 overflow-hidden transition-all duration-300 hover:scale-105 shadow-xl"
                  >
                    <span className="relative flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {language === 'kz' ? 'Басты бетке' : 'На главную'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Wrong Answers */}
          {results.wrong_questions && results.wrong_questions.length > 0 && (
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-slate-700 p-8 animate-fade-in">
              <h2 className="text-3xl font-black mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-4xl">❌</span>
                <span>
                  {language === 'kz' ? 'Қате жауаптар' : 'Ошибки'}
                  <span className="ml-3 text-xl font-bold px-4 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full">
                    {results.wrong_questions.length}
                  </span>
                </span>
              </h2>
              
              <div className="space-y-6">
                {results.wrong_questions.map((item, index) => (
                  <div 
                    key={index} 
                    className="group relative border-2 border-red-200 dark:border-red-900/50 rounded-2xl p-6 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-900/10 dark:to-orange-900/10 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Question number badge */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                      {index + 1}
                    </div>
                    
                    <p className="font-bold text-lg mb-6 text-gray-900 dark:text-white pl-6">
                      {item.question_text}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      {/* User's wrong answer */}
                      <div className="flex items-start gap-3 p-4 bg-red-100 dark:bg-red-900/30 rounded-xl border-2 border-red-300 dark:border-red-700">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                          ✕
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                            {language === 'kz' ? 'Сіздің жауабыңыз' : 'Ваш ответ'}
                          </div>
                          <div className="text-gray-900 dark:text-white font-medium">{item.user_answer}</div>
                        </div>
                      </div>
                      
                      {/* Correct answer */}
                      <div className="flex items-start gap-3 p-4 bg-green-100 dark:bg-green-900/30 rounded-xl border-2 border-green-300 dark:border-green-700">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                            {language === 'kz' ? 'Дұрыс жауабы' : 'Правильный ответ'}
                          </div>
                          <div className="text-gray-900 dark:text-white font-medium">{item.correct_answer}</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleExplain(item)}
                      className="group/btn relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/50 w-full md:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                      <span className="relative flex items-center justify-center gap-2">
                        <span className="text-2xl">🤖</span>
                        {language === 'kz' ? 'Қатені түсіндір' : 'Объясни ошибку'}
                        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedQuestion && (
        <ExplanationModal
          question={selectedQuestion}
          attemptId={attemptId}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </div>
  )
}
