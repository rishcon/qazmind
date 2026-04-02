import { useEffect } from 'react'
import { useTestStore } from '../store/testStore'
import { useLanguageStore } from '../store/languageStore'

export default function Timer({ onTimeUp }) {
  const { timeRemaining, decrementTime } = useTestStore()
  const { language } = useLanguageStore()

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRemaining > 0) {
        decrementTime()
      } else {
        clearInterval(interval)
        onTimeUp()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  const isLowTime = timeRemaining < 300 // Less than 5 minutes

  return (
    <div className={`text-center ${isLowTime ? 'text-error' : 'text-gray-800 dark:text-gray-200'}`}>
      <div className="text-sm font-medium mb-1">
        {language === 'kz' ? 'Қалған уақыт' : 'Осталось времени'}
      </div>
      <div className="text-3xl font-bold font-mono">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  )
}
