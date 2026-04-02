import { useState } from 'react'
import { useLanguageStore } from '../store/languageStore'
import { questionService } from '../services/api'

export default function ExplanationModal({ question, attemptId, onClose }) {
  const [explanation, setExplanation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const { language } = useLanguageStore()

  const handleGetExplanation = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await questionService.explainError(
        question.question_id,
        attemptId,
        question.user_answer_index,
        language
      )
      setExplanation(data.explanation_text)
    } catch (err) {
      if (err.response?.status === 429) {
        setError(
          language === 'kz'
            ? 'Лимит асып кетті. Сәл күтіп тұрыңыз.'
            : 'Превышен лимит запросов. Подождите немного.'
        )
      } else {
        setError(
          language === 'kz'
            ? 'Қате орын алды. Қайтадан көріңіз.'
            : 'Произошла ошибка. Попробуйте снова.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === 'kz' ? 'AI түсіндіруі 🤖' : 'AI объяснение 🤖'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Question */}
          <div className="mb-6">
            <p className="font-medium mb-3 text-gray-900 dark:text-white">{question.question_text}</p>
            
            <div className="space-y-2">
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
                <span className="font-semibold text-error dark:text-red-400">
                  {language === 'kz' ? 'Сіздің жауабыңыз:' : 'Ваш ответ:'}
                </span>
                <p className="mt-1 text-gray-800 dark:text-gray-200">{question.user_answer}</p>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                <span className="font-semibold text-success dark:text-green-400">
                  {language === 'kz' ? 'Дұрыс жауап:' : 'Правильный ответ:'}
                </span>
                <p className="mt-1 text-gray-800 dark:text-gray-200">{question.correct_answer}</p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          {!explanation && !loading && !error && (
            <button
              onClick={handleGetExplanation}
              className="btn btn-primary w-full"
            >
              {language === 'kz' ? 'Түсіндіру алу' : 'Получить объяснение'}
            </button>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-slate-600 border-t-primary-600 dark:border-t-primary-400"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {language === 'kz' ? 'AI ойланып жатыр...' : 'AI думает...'}
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {explanation && (
            <div className="prose max-w-none">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
                <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{explanation}</div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="mt-6">
            <button onClick={onClose} className="btn btn-secondary w-full">
              {language === 'kz' ? 'Жабу' : 'Закрыть'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
