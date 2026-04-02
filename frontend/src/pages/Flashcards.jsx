import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '../store/languageStore';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { playSound, vibrate } from '../utils/sounds';

export default function Flashcards() {
  const { language } = useLanguageStore();
  const { token } = useAuthStore();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ today: 0, total: 0, mastered: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState(''); // 'know' or 'learning'
  const [filterType, setFilterType] = useState('all'); // all, new, learning, review, mastered
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [cardsReviewed, setCardsReviewed] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Таймер сессии
  useEffect(() => {
    if (!sessionStartTime) return;
    
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  useEffect(() => {
    loadSubjects();
    loadStats();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await api.get('/flashcards/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/flashcards/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadCards = async (subjectId, filter = 'all') => {
    setLoading(true);
    try {
      const response = await api.get(`/flashcards/due/${subjectId}`, {
        params: { language, filter_type: filter }
      });
      setCards(response.data);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setSessionStartTime(Date.now());
      setSessionTime(0);
      setCardsReviewed(0);
    } catch (error) {
      console.error('Error loading cards:', error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    loadCards(subject.id, filterType);
  };

  const handleFilterChange = (newFilter) => {
    setFilterType(newFilter);
    if (selectedSubject) {
      loadCards(selectedSubject.id, newFilter);
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
    playSound('flip');
  };

  const handleSwipe = async (direction) => {
    if (!cards[currentCardIndex] || isFlipped === false) return;

    const card = cards[currentCardIndex];
    const isKnown = direction === 'right';

    try {
      await api.post('/flashcards/review', {
        card_id: card.id,
        quality: isKnown ? 4 : 1 // SuperMemo-2: 4 = easy, 1 = hard
      });

      // Show success animation
      setSuccessType(isKnown ? 'know' : 'learning');
      setShowSuccess(true);
      
      // Play sound and vibrate
      playSound(isKnown ? 'success' : 'learning');
      vibrate(isKnown ? [100, 50, 100] : [100]);
      
      setTimeout(() => setShowSuccess(false), 800);

      // Увеличиваем счетчик
      setCardsReviewed(cardsReviewed + 1);

      // Move to next card
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      } else {
        // All cards completed
        setCards([]);
        loadStats();
      }
    } catch (error) {
      console.error('Error reviewing card:', error);
    }
  };

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      handleSwipe(direction);
    }
  };

  const currentCard = cards[currentCardIndex];
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-lg">
              🧠 {language === 'kz' ? 'Ақылды қайталау' : 'Умное повторение'}
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {language === 'kz' ? 'Флеш-карточкалар' : 'Флеш-карточки'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {language === 'kz'
                ? 'Spaced Repetition әдісімен материалды тез және тиімді есте сақтаңыз'
                : 'Запоминайте материал быстро и эффективно с методом Spaced Repetition'}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-indigo-200 dark:border-indigo-800 text-center">
              <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-2">{stats.today}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {language === 'kz' ? 'Бүгін' : 'Сегодня'}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-purple-200 dark:border-purple-800 text-center">
              <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {language === 'kz' ? 'Барлығы' : 'Всего'}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-green-200 dark:border-green-800 text-center">
              <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2">{stats.mastered}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {language === 'kz' ? 'Меңгерілген' : 'Освоено'}
              </div>
            </div>
          </div>

          {/* Subject selection */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {subjects.map((subject, index) => (
              <motion.button
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSubjectSelect(subject)}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border-2 border-gray-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {subject.icon || '📚'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {language === 'kz' ? subject.name_kz : subject.name_ru}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {subject.flashcards_count || 0} {language === 'kz' ? 'карточка' : 'карточек'}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span>💡</span>
                {language === 'kz' ? 'Қалай жұмыс істейді?' : 'Как это работает?'}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    👉
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {language === 'kz' ? 'Білемін' : 'Знаю'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {language === 'kz'
                        ? 'Оңға свайп - карточка 3 күннен кейін көрсетіледі'
                        : 'Свайп вправо - карточка появится через 3 дня'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    👈
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {language === 'kz' ? 'Үйренуде' : 'Учу'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {language === 'kz'
                        ? 'Солға свайп - карточка 10 минуттан кейін көрсетіледі'
                        : 'Свайп влево - карточка появится через 10 минут'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {language === 'kz' ? 'Карточкалар жүктелуде...' : 'Загрузка карточек...'}
          </p>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            {language === 'kz' ? 'Керемет!' : 'Отлично!'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {language === 'kz'
              ? 'Барлық карточкаларды қарадыңыз!'
              : 'Вы просмотрели все карточки!'}
          </p>
          <button
            onClick={() => setSelectedSubject(null)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            {language === 'kz' ? 'Басты бетке' : 'На главную'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl"></div>

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className={`text-9xl ${successType === 'know' ? 'rotate-12' : '-rotate-12'}`}>
              {successType === 'know' ? '✅' : '📚'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setSelectedSubject(null)}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold">{language === 'kz' ? 'Артқа' : 'Назад'}</span>
          </button>

          <div className="flex items-center gap-4">
            {/* Time and progress */}
            <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">⏱️ {formatTime(sessionTime)}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentCardIndex + 1} / {cards.length}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {language === 'kz' ? 'Прогресс' : 'Прогресс'}: {cardsReviewed}/{cards.length}
            </span>
            <span className="text-xs text-gray-500">
              {Math.round((cardsReviewed / Math.max(cards.length, 1)) * 100)}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${(cardsReviewed / Math.max(cards.length, 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Filter buttons - show only when session started */}
        {cards.length > 0 && currentCardIndex === 0 && cardsReviewed === 0 && (
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            {[
              { id: 'all', label: language === 'kz' ? 'Барлығы' : 'Все' },
              { id: 'new', label: language === 'kz' ? '🆕 Жаңа' : '🆕 Новые' },
              { id: 'learning', label: language === 'kz' ? '📚 Оқу' : '📚 Обучение' },
              { id: 'review', label: language === 'kz' ? '🔄 Қайталау' : '🔄 Повтор' },
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterType === filter.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-white/60 dark:bg-slate-800/60 text-gray-700 dark:text-gray-300 hover:bg-white/80'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* Card */}
        <div className="relative h-screen md:h-[500px] max-md:min-h-[500px] flex items-center justify-center">
          <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            onClick={handleCardFlip}
            className="absolute cursor-grab active:cursor-grabbing"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="w-[90vw] md:w-[400px] h-[60vh] md:h-[500px] max-w-[400px]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center justify-center border-4 border-purple-200 dark:border-purple-800"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-5xl md:text-6xl mb-6 md:mb-8">{selectedSubject.icon}</div>
                <h3 className="text-xl md:text-3xl font-black text-center text-gray-900 dark:text-white mb-4">
                  {currentCard.front}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {language === 'kz' ? 'Басып көріңіз' : 'Нажмите чтобы перевернуть'}
                </p>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center justify-center border-4 border-purple-400"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <h3 className="text-xl md:text-3xl font-black text-center text-white mb-6">
                  {currentCard.back}
                </h3>
                {currentCard.hint && (
                  <p className="text-white/80 text-center text-sm">
                    💡 {currentCard.hint}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Action buttons */}
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-4 md:gap-8 mt-6 md:mt-8 flex-wrap"
          >
            <button
              onClick={() => handleSwipe('left')}
              className="group flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 text-sm md:text-base"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">{language === 'kz' ? 'Үйренуде' : 'Учу'}</span>
              <span className="sm:hidden">👈</span>
            </button>

            <button
              onClick={() => handleSwipe('right')}
              className="group flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 text-sm md:text-base"
            >
              <span className="hidden sm:inline">{language === 'kz' ? 'Білемін' : 'Знаю'}</span>
              <span className="sm:hidden">👉</span>
              <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Swipe hints */}
        {!isFlipped && (
          <div className="flex justify-between mt-12 px-8">
            <div className="flex items-center gap-2 text-red-500 opacity-50">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-bold">{language === 'kz' ? 'Үйренуде' : 'Учу'}</span>
            </div>
            <div className="flex items-center gap-2 text-green-500 opacity-50">
              <span className="font-bold">{language === 'kz' ? 'Білемін' : 'Знаю'}</span>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
