import { useTestStore } from '../store/testStore'
import { useLanguageStore } from '../store/languageStore'

export default function QuestionCard({ question }) {
  const { answers, setAnswer } = useTestStore()
  const { language } = useLanguageStore()
  
  const selectedAnswer = answers[question.id]

  const handleSelectAnswer = (index) => {
    setAnswer(question.id, index)
  }

  return (
    <div className="group relative animate-scale-in">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
      
      <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-slate-700 p-8 transition-all duration-300 hover:shadow-3xl">
        {/* Question number badge */}
        <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg">
          {language === 'kz' ? 'Сұрақ' : 'Вопрос'}
        </div>

        <h2 className="text-xl md:text-2xl font-bold mb-8 text-gray-900 dark:text-white leading-relaxed">
          {question.text}
        </h2>

        <div className="space-y-4">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const letter = String.fromCharCode(65 + index)
            
            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`group/option relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? 'border-purple-500 dark:border-purple-400 shadow-lg shadow-purple-500/20 scale-[1.02]'
                    : 'border-gray-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                }`}
              >
                {/* Background gradient for selected */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"></div>
                )}
                
                <div className="relative flex items-center gap-4">
                  {/* Radio button */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-300 ${
                    isSelected
                      ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-110'
                      : 'border-gray-300 dark:border-slate-500 text-gray-500 dark:text-gray-400 group-hover/option:border-purple-400 dark:group-hover/option:border-purple-500'
                  }`}>
                    {isSelected ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      letter
                    )}
                  </div>
                  
                  <span className={`flex-1 font-medium transition-colors ${
                    isSelected 
                      ? 'text-gray-900 dark:text-white font-semibold' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {option}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
