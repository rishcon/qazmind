import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/languageStore';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import SubjectSelector from '../components/SubjectSelector';
import Modal from '../components/Modal';
import { StatCard, SubjectStatCard, RecommendationCard } from '../components/StatCards';


export default function Dashboard() {
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const { token } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubjectSelector, setShowSubjectSelector] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showPodcastsModal, setShowPodcastsModal] = useState(false);
  const [selectedSubjectForDetails, setSelectedSubjectForDetails] = useState(null);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [token, navigate]);

  const loadDashboardData = async () => {
    try {
      // Загружаем профиль пользователя
      const profileResponse = await api.get('/profile/me');
      setProfile(profileResponse.data);

      // Если пользователь еще не выбрал предметы, показываем селектор
      if (!profileResponse.data.profile_completed || !profileResponse.data.selected_subjects?.length) {
        setShowSubjectSelector(true);
      }

      // Загружаем статистику
      const statsResponse = await api.get('/profile/stats');
      setStats(statsResponse.data);

      // Генерируем данные активности (последние 30 дней)
      generateActivityData(statsResponse.data);

      // Загружаем рекомендации
      const recsResponse = await api.get('/profile/recommendations');
      setRecommendations(Array.isArray(recsResponse.data?.recommendations) ? recsResponse.data.recommendations : []);

      // Загружаем все предметы
      const subjectsResponse = await api.get('/subjects/');
      setSubjects(subjectsResponse.data);

      // Загружаем подкасты
      const podcastsResponse = await api.get('/podcasts/');
      setPodcasts(podcastsResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateActivityData = (statsData) => {
    const activityByDate = {};
    for (const test of statsData?.recent_tests || []) {
      const dateKey = new Date(test.completed_at).toISOString().split('T')[0];
      activityByDate[dateKey] = (activityByDate[dateKey] || 0) + 1;
    }

    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const activity = activityByDate[dateKey] || 0;
      
      days.push({
        date: dateKey,
        count: activity,
        level: activity === 0 ? 0 : activity <= 1 ? 1 : activity <= 2 ? 2 : activity <= 3 ? 3 : 4
      });
    }
    
    setActivityData(days);
  };

  const handleSubjectSelectionComplete = () => {
    setShowSubjectSelector(false);
    loadDashboardData(); // Перезагружаем данные
  };

  const handleStartTest = (subjectId) => {
    navigate(`/test/${subjectId}`);
  };

  const handleStartTutor = (subjectId) => {
    navigate(`/tutor/${subjectId}`);
  };

  const getDaysUntilENT = () => {
    if (!profile?.ent_date) return null;
    const today = new Date();
    const entDate = new Date(profile.ent_date);
    const diffTime = entDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getSelectedSubjects = () => {
    if (!profile?.selected_subjects || !subjects.length) return [];
    return subjects.filter(s => profile.selected_subjects.includes(s.id));
  };

  const getSubjectStats = (subjectId) => {
    if (!stats?.subjects_stats) return null;
    return stats.subjects_stats.find(s => s.subject_id === subjectId);
  };

  const getSubjectPodcasts = () => {
    if (!profile?.selected_subjects || !podcasts.length) return [];
    return podcasts.filter(p => profile.selected_subjects.includes(p.subject_id));
  };

  const getCurrentStreak = () => {
    if (!activityData.length) return 0;
    let streak = 0;
    for (let i = activityData.length - 1; i >= 0; i--) {
      if (activityData[i].count > 0) streak++;
      else break;
    }
    return streak;
  };

  const getTotalActivity = () => {
    return activityData.reduce((sum, day) => sum + day.count, 0);
  };

  const getWeakSubjects = () => {
    if (!stats?.subjects_stats) return [];
    return stats.subjects_stats
      .filter(s => s.accuracy < 60 && s.tests_completed > 0)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);
  };

  const getStrongSubjects = () => {
    if (!stats?.subjects_stats) return [];
    return stats.subjects_stats
      .filter(s => s.accuracy >= 80 && s.tests_completed > 0)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 3);
  };

  const getProgressToGoal = () => {
    if (!stats || !stats.total_tests) return 0;
    const goal = 100; // Цель: 100 тестов
    return Math.min(Math.round((stats.total_tests / goal) * 100), 100);
  };

  const getTutorSubject = () => {
    const selected = getSelectedSubjects().filter(subject => (subject.questions_count || 0) > 0);
    const preferred = selected.find(
      subject => subject.name_ru === 'Информатика' || subject.name_kz === 'Информатика'
    );
    return preferred || selected[0] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {language === 'kz' ? 'Жүктелуде...' : 'Загрузка...'}
          </p>
        </div>
      </div>
    );
  }

  const selectedSubjects = getSelectedSubjects();
  const daysUntilENT = getDaysUntilENT();
  const subjectPodcasts = getSubjectPodcasts();
  const topRecommendations = Array.isArray(recommendations) 
    ? recommendations.filter(r => r.priority === 'high').slice(0, 2)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SubjectSelector
        isOpen={showSubjectSelector}
        onClose={() => setShowSubjectSelector(false)}
        onComplete={handleSubjectSelectionComplete}
      />

      {/* Модальное окно статистики */}
      <Modal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        title={language === 'kz' ? 'Толық статистика' : 'Полная статистика'}
        size="large"
      >
        {stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: language === 'kz' ? 'Тестер' : 'Тестов', val: stats.total_tests, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                { label: language === 'kz' ? 'Дұрыс' : 'Верно', val: stats.total_correct, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                { label: language === 'kz' ? 'Дәлдік' : 'Точность', val: `${stats.average_score.toFixed(0)}%`, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                { label: language === 'kz' ? 'Уақыт' : 'Минут', val: `${stats.study_time_minutes}м`, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
              ].map((item, i) => (
                <div key={i} className={`text-center p-4 ${item.bg} rounded-xl`}>
                  <div className={`text-3xl font-bold ${item.color}`}>{item.val}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
            {stats.recent_tests && stats.recent_tests.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">
                  {language === 'kz' ? 'Соңғы тестер' : 'Последние тесты'}
                </h3>
                <div className="space-y-2">
                  {stats.recent_tests.map((test, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {language === 'kz' ? test.subject_name_kz : test.subject_name_ru}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{new Date(test.completed_at).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{test.score}%</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{test.total_correct}/{test.total_questions}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Модальное окно подкастов */}
      <Modal
        isOpen={showPodcastsModal}
        onClose={() => setShowPodcastsModal(false)}
        title={language === 'kz' ? 'Подкастар' : 'Подкасты'}
        size="large"
      >
        {subjectPodcasts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectPodcasts.map((podcast) => (
              <div key={podcast.id} className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-gray-200 dark:border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                    {language === 'kz' ? podcast.title_kz : podcast.title_ru}
                  </h3>
                  <span className={`ml-2 shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                    podcast.difficulty === 'easy' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                    podcast.difficulty === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {podcast.difficulty === 'easy' ? (language === 'kz' ? 'Оңай' : 'Легко') :
                     podcast.difficulty === 'medium' ? (language === 'kz' ? 'Орта' : 'Средне') :
                     (language === 'kz' ? 'Қиын' : 'Сложно')}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{Math.floor(podcast.duration_seconds / 60)} {language === 'kz' ? 'мин' : 'мин'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {language === 'kz' ? podcast.description_kz : podcast.description_ru}
                </p>
                <button
                  onClick={() => { setShowPodcastsModal(false); navigate('/podcasts'); }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium text-sm"
                >
                  {language === 'kz' ? 'Тыңдау' : 'Слушать'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-gray-400 dark:text-gray-500 text-sm">{language === 'kz' ? 'Подкастар табылмады' : 'Подкасты не найдены'}</p>
          </div>
        )}
      </Modal>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Верхняя полоса: приветствие + счётчик дней + настройка ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 
                        bg-white dark:bg-slate-800 rounded-2xl px-6 py-5 
                        shadow-sm border border-gray-100 dark:border-slate-700">
          <div>
            <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1">
              {language === 'kz' ? 'Бақылау тақтасы' : 'Панель управления'}
            </p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile?.full_name
                ? (language === 'kz' ? `Сәлем, ${profile.full_name}` : `Привет, ${profile.full_name}`)
                : (language === 'kz' ? 'Сәлем!' : 'Добро пожаловать!')}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {daysUntilENT !== null && (
              <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl px-4 py-2.5">
                <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-300">{daysUntilENT}</span>
                  <span className="text-xs text-indigo-500 dark:text-indigo-400 ml-1">
                    {language === 'kz' ? 'күн қалды' : 'дней до ҰБТ'}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowSubjectSelector(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-medium text-sm transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {language === 'kz' ? 'Пәндер' : 'Предметы'}
            </button>
          </div>
        </div>

        {/* ── Прогресс-бар к цели ── */}
        {stats && stats.total_tests > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl px-6 py-4 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {language === 'kz' ? 'Жалпы прогресс (100 тест мақсаты)' : 'Общий прогресс (цель: 100 тестов)'}
              </span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {stats.total_tests} / 100
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-700"
                style={{ width: `${getProgressToGoal()}%` }}
              />
            </div>
          </div>
        )}

        {/* ── 4 карточки статистики ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Тесты */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-700 px-2 py-1 rounded-lg">
                {language === 'kz' ? 'барлығы' : 'всего'}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.total_tests || 0}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{language === 'kz' ? 'Тест орындалды' : 'Тестов пройдено'}</div>
          </div>

          {/* Точность */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-700 px-2 py-1 rounded-lg">
                {language === 'kz' ? 'орташа' : 'среднее'}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.average_score ? stats.average_score.toFixed(0) : 0}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{language === 'kz' ? 'Дұрыс жауаптар' : 'Точность ответов'}</div>
          </div>

          {/* Серия дней */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 transition group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-700 px-2 py-1 rounded-lg">
                {language === 'kz' ? 'серия' : 'серия'}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{getCurrentStreak()}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{language === 'kz' ? 'Күн қатарынан' : 'Дней подряд'}</div>
          </div>

          {/* Время */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 transition group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-500 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-700 px-2 py-1 rounded-lg">
                {language === 'kz' ? 'оқу' : 'учёба'}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.study_time_minutes || 0}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{language === 'kz' ? 'Минут оқыдым' : 'Минут учёбы'}</div>
          </div>
        </div>

        {/* ── Предметы ── */}
        {selectedSubjects.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  {language === 'kz' ? 'Менің пәндерім' : 'Мои предметы'}
                </h2>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{selectedSubjects.length} {language === 'kz' ? 'пән' : 'предм.'}</span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {selectedSubjects.map(subject => {
                const subjectStats = getSubjectStats(subject.id);
                const hasQuestions = subject.questions_count && subject.questions_count > 0;
                const accuracy = subjectStats?.accuracy ?? null;
                const accuracyColor = accuracy === null ? '' : accuracy >= 75 ? 'text-emerald-600 dark:text-emerald-400' : accuracy >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400';
                return (
                  <div key={subject.id} className="flex flex-col bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all overflow-hidden">
                    {/* Заголовок предмета */}
                    <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                        {subject.icon
                          ? <span className="text-xl leading-none">{subject.icon}</span>
                          : <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        }
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                        {language === 'kz' ? subject.name_kz : subject.name_ru}
                      </span>
                    </div>
                    {/* Статы */}
                    <div className="px-4 pb-3 flex items-center justify-between text-sm">
                      <span className="text-gray-400 dark:text-gray-500 text-xs">
                        {subject.questions_count || 0} {language === 'kz' ? 'сұрақ' : 'вопр.'}
                      </span>
                      {accuracy !== null ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${accuracy >= 75 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                              style={{ width: `${accuracy}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${accuracyColor}`}>{accuracy}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                          {language === 'kz' ? 'тест жоқ' : 'нет тестов'}
                        </span>
                      )}
                    </div>
                    {subjectStats && (
                      <div className="px-4 pb-3 text-xs text-gray-400 dark:text-gray-500">
                        {subjectStats.tests_completed} {language === 'kz' ? 'тест орындалды' : 'тестов пройдено'}
                      </div>
                    )}
                    {/* Кнопка */}
                    <div className="mt-auto px-4 pb-4">
                      <button
                        onClick={() => handleStartTest(subject.id)}
                        disabled={!hasQuestions}
                        className="w-full py-2 rounded-lg text-sm font-medium transition
                          enabled:bg-indigo-600 enabled:hover:bg-indigo-700 enabled:text-white
                          disabled:bg-gray-200 dark:disabled:bg-slate-600 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        {!hasQuestions
                          ? (language === 'kz' ? 'Сұрақтар жоқ' : 'Нет вопросов')
                          : (language === 'kz' ? 'Тест бастау' : 'Начать тест')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {language === 'kz' ? 'Пәндерді таңдаңыз' : 'Выберите предметы'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {language === 'kz' ? 'Бастау үшін дайындалатын пәндеріңізді таңдаңыз' : 'Выберите предметы для подготовки, чтобы начать'}
            </p>
            <button
              onClick={() => setShowSubjectSelector(true)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition font-medium text-sm"
            >
              {language === 'kz' ? 'Пәндерді таңдау' : 'Выбрать предметы'}
            </button>
          </div>
        )}

        {/* ── AI Tutor ── */}
        {getTutorSubject() && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-sky-600 dark:text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  {language === 'kz' ? 'AI-репетитор' : 'AI-репетитор'}
                </h2>
              </div>
              <span className="text-xs font-medium text-sky-600 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/20 px-3 py-1 rounded-full">
                {language === 'kz' ? 'Жаңа формат' : 'Новый формат'}
              </span>
            </div>
            <div className="p-5 grid lg:grid-cols-[1.1fr_0.9fr] gap-5 items-start">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === 'kz' ? 'Тақырыпты түсінбей жатсаң, AI-мен пысықта' : 'Если тема не даётся, разбери её с AI'}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-6 mb-4">
                  {language === 'kz'
                    ? 'AI мини-сабақ береді, ұқсас сұрақтар құрастырады және сенің жазбаша жауабыңды 100 баллдық шкаламен тексереді.'
                    : 'AI даёт мини-урок, подбирает похожие вопросы и проверяет твой письменный ответ по 100-балльной шкале.'}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {[
                    language === 'kz' ? 'Мини-сабақ' : 'Мини-урок',
                    language === 'kz' ? '5 ұқсас сұрақ' : '5 похожих вопросов',
                    language === 'kz' ? 'Жазбаша тексеру' : 'Проверка ответа'
                  ].map((item) => (
                    <span key={item} className="px-3 py-2 rounded-full bg-slate-50 dark:bg-slate-700 text-xs font-medium text-gray-700 dark:text-gray-200">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleStartTutor(getTutorSubject().id)}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 text-white font-semibold hover:from-sky-600 hover:to-violet-700 transition shadow-lg"
                  >
                    {language === 'kz' ? 'AI-репетиторды ашу' : 'Открыть AI-репетитора'}
                  </button>
                  <button
                    onClick={() => handleStartTest(getTutorSubject().id)}
                    className="px-5 py-3 rounded-xl border border-sky-200 dark:border-slate-600 text-sky-700 dark:text-sky-300 font-semibold hover:bg-sky-50 dark:hover:bg-slate-700 transition"
                  >
                    {language === 'kz' ? 'Алдымен тест бастау' : 'Сначала начать тест'}
                  </button>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-violet-50 dark:from-slate-700 dark:to-slate-700/70 border border-sky-100 dark:border-slate-600 p-4">
                <div className="text-xs uppercase tracking-wide font-semibold text-sky-600 dark:text-sky-300 mb-2">
                  {language === 'kz' ? 'Ұсынылатын пән' : 'Рекомендуемый предмет'}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {language === 'kz' ? getTutorSubject().name_kz : getTutorSubject().name_ru}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {(getTutorSubject().questions_count || 0)} {language === 'kz' ? 'сұрақ бар' : 'вопросов доступно'}
                </div>
                <div className="space-y-2">
                  <div className="rounded-xl bg-white/80 dark:bg-slate-800 px-3 py-3 text-sm text-gray-700 dark:text-gray-200">
                    {language === 'kz' ? 'Түсіндірме + тәжірибе + кері байланыс' : 'Объяснение + практика + обратная связь'}
                  </div>
                  <div className="rounded-xl bg-white/80 dark:bg-slate-800 px-3 py-3 text-sm text-gray-700 dark:text-gray-200">
                    {language === 'kz' ? 'Өз сөзіңмен жазып үйренуге жақсы' : 'Хорошо подходит для ответов своими словами'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Нижний ряд: Активность | Анализ предметов | Быстрые действия ── */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* Активность */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-slate-700">
              <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {language === 'kz' ? 'Белсенділік (30 күн)' : 'Активность (30 дней)'}
              </h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-10 gap-1 mb-3">
                {activityData.map((day, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-sm transition-all hover:scale-110 cursor-default ${
                      day.level === 0 ? 'bg-gray-100 dark:bg-slate-700' :
                      day.level === 1 ? 'bg-indigo-100 dark:bg-indigo-900/50' :
                      day.level === 2 ? 'bg-indigo-200 dark:bg-indigo-800' :
                      day.level === 3 ? 'bg-indigo-400 dark:bg-indigo-600' :
                      'bg-indigo-600 dark:bg-indigo-400'
                    }`}
                    title={`${day.date}: ${day.count} ${language === 'kz' ? 'тест' : 'тест.'}`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
                <span>{language === 'kz' ? 'Аз' : 'Меньше'}</span>
                <div className="flex gap-1">
                  {['bg-gray-100 dark:bg-slate-700','bg-indigo-100 dark:bg-indigo-900/50','bg-indigo-200 dark:bg-indigo-800','bg-indigo-400 dark:bg-indigo-600','bg-indigo-600 dark:bg-indigo-400'].map((cls,i)=>(
                    <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
                  ))}
                </div>
                <span>{language === 'kz' ? 'Көп' : 'Больше'}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                <div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{language === 'kz' ? 'Барлық белсенділік' : 'Всего действий'}</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{getTotalActivity()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{language === 'kz' ? 'Ең ұзақ серия' : 'Лучшая серия'}</div>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{getCurrentStreak()} {language === 'kz' ? 'күн' : 'дн.'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Анализ предметов */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-slate-700">
              <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {language === 'kz' ? 'Пән талдауы' : 'Анализ предметов'}
              </h3>
            </div>
            <div className="p-5 space-y-4">
              {/* Сильные */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {language === 'kz' ? 'Күшті пәндер' : 'Сильные'}
                  </span>
                </div>
                {getStrongSubjects().length > 0 ? (
                  <div className="space-y-1.5">
                    {getStrongSubjects().map((subj, idx) => {
                      const subject = subjects.find(s => s.id === subj.subject_id);
                      return (
                        <div key={idx} className="flex items-center justify-between py-2 px-3 bg-emerald-50 dark:bg-emerald-900/15 rounded-lg">
                          <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                            {language === 'kz' ? subject?.name_kz : subject?.name_ru}
                          </span>
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{subj.accuracy}%</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic px-1">{language === 'kz' ? 'Деректер жоқ' : 'Нет данных'}</p>
                )}
              </div>
              {/* Слабые */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wide">
                    {language === 'kz' ? 'Назар аудару керек' : 'Требуют внимания'}
                  </span>
                </div>
                {getWeakSubjects().length > 0 ? (
                  <div className="space-y-1.5">
                    {getWeakSubjects().map((subj, idx) => {
                      const subject = subjects.find(s => s.id === subj.subject_id);
                      return (
                        <div key={idx} className="flex items-center justify-between py-2 px-3 bg-red-50 dark:bg-red-900/15 rounded-lg">
                          <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                            {language === 'kz' ? subject?.name_kz : subject?.name_ru}
                          </span>
                          <span className="text-sm font-bold text-red-500 dark:text-red-400">{subj.accuracy}%</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic px-1">
                    {language === 'kz' ? 'Барлығы жақсы!' : 'Всё отлично!'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Быстрые действия */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-slate-700">
              <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {language === 'kz' ? 'Жылдам іс-қимыл' : 'Быстрые действия'}
              </h3>
            </div>
            <div className="p-4 space-y-2">
              {/* Статистика */}
              <button
                onClick={() => setShowStatsModal(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-700 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{language === 'kz' ? 'Статистика' : 'Статистика'}</div>
                    {stats && stats.total_tests > 0 && (
                      <div className="text-xs text-gray-400 dark:text-gray-500">{stats.total_tests} {language === 'kz' ? 'тест' : 'тестов'} · {stats.average_score.toFixed(0)}%</div>
                    )}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Подкасты */}
              <button
                onClick={() => setShowPodcastsModal(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-transparent hover:border-orange-200 dark:hover:border-orange-700 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{language === 'kz' ? 'Подкастар' : 'Подкасты'}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{subjectPodcasts.length} {language === 'kz' ? 'қол жетімді' : 'доступно'}</div>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-orange-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {getTutorSubject() && (
                <button
                  onClick={() => handleStartTutor(getTutorSubject().id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-sky-50 dark:hover:bg-sky-900/20 border border-transparent hover:border-sky-200 dark:hover:border-sky-700 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-sky-600 dark:text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{language === 'kz' ? 'AI-репетитор' : 'AI-репетитор'}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {language === 'kz' ? 'Жазбаша жауаппен жұмыс' : 'Работа с письменным ответом'}
                      </div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-sky-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Рекомендации */}
              <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 border border-transparent">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{language === 'kz' ? 'Ұсыныстар' : 'Рекомендации'}</span>
                </div>
                {topRecommendations.length > 0 ? (
                  <div className="space-y-1 pl-11">
                    {topRecommendations.map((rec, idx) => (
                      <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                        {language === 'kz' ? rec.title_kz : rec.title_ru}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 pl-11">{language === 'kz' ? 'Барлығы жақсы!' : 'Всё отлично!'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
