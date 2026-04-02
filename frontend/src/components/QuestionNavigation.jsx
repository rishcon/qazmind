import { useTestStore } from '../store/testStore'
import { useLanguageStore } from '../store/languageStore'

export default function QuestionNavigation() {
  const {
    questions,
    currentQuestionIndex,
    answers,
    nextQuestion,
    prevQuestion,
    setCurrentQuestion
  } = useTestStore()
  
  const { language } = useLanguageStore()

  const canGoPrev = currentQuestionIndex > 0
  const canGoNext = currentQuestionIndex < questions.length - 1

  return (
    <div className="mt-8 space-y-6 animate-fade-in">
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={prevQuestion}
          disabled={!canGoPrev}
          className={`group relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            !canGoPrev
              ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-cyan-500/30 hover:scale-105'
          }`}
        >
          <svg className={`w-5 h-5 ${canGoPrev ? 'group-hover:-translate-x-1 transition-transform' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === 'kz' ? 'Артқа' : 'Назад'}
        </button>

        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {language === 'kz' ? 'Сұрақ' : 'Вопрос'}
          </div>
          <div className="text-2xl font-black bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
        
        <button
          onClick={nextQuestion}
          disabled={!canGoNext}
          className={`group relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            !canGoNext
              ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-purple-500/30 hover:scale-105'
          }`}
        >
          {language === 'kz' ? 'Алға' : 'Вперед'}
          <svg className={`w-5 h-5 ${canGoNext ? 'group-hover:translate-x-1 transition-transform' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Question Grid */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-2xl">📋</span>
          {language === 'kz' ? 'Барлық сұрақтар' : 'Все вопросы'}
        </h3>
        
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-6">
          {questions.map((q, index) => {
            const isAnswered = answers[q.id] !== undefined
            const isCurrent = currentQuestionIndex === index
            
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`group relative aspect-square rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden ${
                  isCurrent
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-110'
                    : isAnswered
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md hover:shadow-green-500/30 hover:scale-105'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-cyan-400 hover:to-blue-400 hover:text-white hover:scale-105'
                }`}
              >
                {isCurrent && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                )}
                <span className="relative">{index + 1}</span>
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-md"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {language === 'kz' ? 'Ағымдағы' : 'Текущий'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow-md"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {language === 'kz' ? 'Жауап берілді' : 'Отвечено'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 shadow-md"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {language === 'kz' ? 'Жауап берілмеді' : 'Не отвечено'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
