import { useLanguageStore } from '../store/languageStore';

const StatCard = ({ icon, title, value, subtitle, color = "indigo" }) => {
  const colorClasses = {
    indigo: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    green: "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    yellow: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    red: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
          {subtitle && <div className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</div>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

const SubjectStatCard = ({ subject, stats, onStartTest }) => {
  const { language } = useLanguageStore();

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return 'text-green-600 dark:text-green-400';
    if (accuracy >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-3xl mr-3">{subject.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {language === 'kz' ? subject.name_kz : subject.name_ru}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stats.tests_completed} {language === 'kz' ? 'тест' : 'тестов'}
            </p>
          </div>
        </div>
        <div className={`text-2xl font-bold ${getAccuracyColor(stats.accuracy)}`}>
          {stats.accuracy.toFixed(0)}%
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-500">
            {language === 'kz' ? 'Сұрақтар' : 'Вопросов'}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {stats.total_questions}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">
            {language === 'kz' ? 'Дұрыс' : 'Верно'}
          </div>
          <div className="text-lg font-semibold text-green-600">
            {stats.total_correct}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">
            {language === 'kz' ? 'Қате' : 'Ошибок'}
          </div>
          <div className="text-lg font-semibold text-red-600">
            {stats.total_questions - stats.total_correct}
          </div>
        </div>
      </div>

      {stats.last_test_date && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {language === 'kz' ? 'Соңғы тест' : 'Последний тест'}: {' '}
          {new Date(stats.last_test_date).toLocaleDateString(language === 'kz' ? 'kk-KZ' : 'ru-RU')}
        </div>
      )}

      <button
        onClick={() => onStartTest(subject.id)}
        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
      >
        {language === 'kz' ? 'Тест бастау' : 'Начать тест'}
      </button>
    </div>
  );
};

const RecommendationCard = ({ recommendation }) => {
  const { language } = useLanguageStore();

  const priorityColors = {
    high: 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20',
    medium: 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20',
    low: 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
  };

  return (
    <div className={`rounded-lg p-4 border-2 ${priorityColors[recommendation.priority]}`}>
      <div className="flex items-start">
        <span className="text-2xl mr-3">{recommendation.icon}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {language === 'kz' ? recommendation.title_kz : recommendation.title_ru}
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {language === 'kz' ? recommendation.description_kz : recommendation.description_ru}
          </p>
        </div>
      </div>
    </div>
  );
};

export { StatCard, SubjectStatCard, RecommendationCard };
