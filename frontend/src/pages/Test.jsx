import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTestStore } from '../store/testStore'
import { useLanguageStore } from '../store/languageStore'
import { testService } from '../services/api'
import api from '../utils/api'
import Timer from '../components/Timer'
import QuestionCard from '../components/QuestionCard'
import QuestionNavigation from '../components/QuestionNavigation'

export default function Test() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [subject, setSubject] = useState(null)
  
  const {
    attemptId,
    questions,
    currentQuestionIndex,
    answers,
    setAttemptId,
    setQuestions,
    resetTest
  } = useTestStore()
  
  const { language } = useLanguageStore()
  const navigate = useNavigate()
  const { subjectId } = useParams()

  useEffect(() => {
    if (subjectId) {
      loadSubjectAndStartTest()
    }
    return () => resetTest()
  }, [subjectId])

  const loadSubjectAndStartTest = async () => {
    try {
      // Загружаем информацию о предмете
      const subjectResponse = await api.get(`/subjects/${subjectId}`)
      setSubject(subjectResponse.data)
      
      // Создаем тест
      const data = await testService.createTest(parseInt(subjectId), language, 20, 'new')
      setAttemptId(data.attempt_id)
      setQuestions(data.questions)
      setLoading(false)
    } catch (err) {
      console.error('Failed to create test:', err)
      navigate('/')
    }
  }

  const handleSubmit = async () => {
    if (submitting) return

    // Check if all questions are answered
    const unanswered = questions.filter(q => !(q.id in answers))
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        language === 'kz'
          ? `${unanswered.length} сұраққа жауап берілмеді. Жіберуді жалғастырасыз ба?`
          : `${unanswered.length} вопросов не отвечены. Продолжить отправку?`
      )
      if (!confirmSubmit) return
    }

    setSubmitting(true)

    try {
      await testService.submitTest(attemptId, answers)
      navigate(`/results/${attemptId}`)
    } catch (err) {
      console.error('Failed to submit test:', err)
      alert('Error submitting test')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {language === 'kz' ? 'Тест дайындалуда...' : 'Загрузка теста...'}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{language === 'kz' ? 'Күте тұрыңыз' : 'Подождите немного'}</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Header */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-slate-700 p-6 mb-8 animate-slide-down">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {language === 'kz' ? 'Прогресс' : 'Прогресс'}
                </span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${progress}%` }}
                >
                  <div className="h-full w-full bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <span className="text-3xl">📝</span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {subject ? (language === 'kz' ? subject.name_kz : subject.name_ru) : ''}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">
                    {language === 'kz' 
                      ? `Сұрақ ${currentQuestionIndex + 1}`
                      : `Вопрос ${currentQuestionIndex + 1}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/tutor/${subjectId}`)}
                  className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  <span>AI</span>
                  <span>{language === 'kz' ? 'Репетитор' : 'Репетитор'}</span>
                </button>
                <Timer onTimeUp={handleSubmit} />
              </div>
            </div>
          </div>

          {/* Question */}
          <QuestionCard question={currentQuestion} />

          {/* Navigation */}
          <QuestionNavigation />

          {/* Submit Button */}
          <div className="mt-8 flex justify-center animate-scale-in">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="group relative px-12 py-4 text-lg font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-white flex items-center gap-3">
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {language === 'kz' ? 'Жіберілуде...' : 'Отправка...'}
                  </>
                ) : (
                  <>
                    {language === 'kz' ? 'Тестті аяқтау' : 'Завершить тест'}
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
