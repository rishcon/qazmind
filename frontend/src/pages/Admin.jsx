import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useLanguageStore } from '../store/languageStore'
import api from '../utils/api'

export default function Admin() {
  const { language } = useLanguageStore()
  const { token, user, updateUser } = useAuthStore()
  const navigate = useNavigate()
  
  const [subjects, setSubjects] = useState([])
  const [stats, setStats] = useState(null)
  const [jsonInput, setJsonInput] = useState('')
  const [csvFile, setCsvFile] = useState(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('stats')
  
  // Podcasts state
  const [podcasts, setPodcasts] = useState([])
  const [podcastForm, setPodcastForm] = useState({
    subject_id: 1,
    title_kz: '',
    title_ru: '',
    description_kz: '',
    description_ru: '',
    topic: '',
    difficulty: 'easy',
    order_index: 0
  })
  const [audioFile, setAudioFile] = useState(null)

  const t = {
    kz: {
      title: 'Әкімші панелі',
      stats: 'Статистика',
      uploadJson: 'JSON жүктеу',
      uploadCsv: 'CSV жүктеу',
      podcasts: 'Подкастар',
      totalQuestions: 'Барлығы сұрақтар',
      bySubject: 'Пәндер бойынша',
      pasteJson: 'JSON кодын қойыңыз',
      submit: 'Жіберу',
      selectFile: 'Файлды таңдаңыз',
      upload: 'Жүктеу',
      success: 'Сәтті!',
      error: 'Қате',
      downloadExample: 'Үлгіні жүктеп алу',
      // Podcasts
      addPodcast: 'Подкаст қосу',
      titleKz: 'Атауы (қазақша)',
      titleRu: 'Атауы (орысша)',
      descriptionKz: 'Сипаттама (қазақша)',
      descriptionRu: 'Сипаттама (орысша)',
      topic: 'Тақырып',
      subject: 'Пән',
      difficulty: 'Қиындық',
      orderIndex: 'Реттік нөмір',
      audioFile: 'Аудио файл',
      easy: 'Оңай',
      medium: 'Орташа',
      hard: 'Қиын',
      existingPodcasts: 'Қолданыстағы подкастар',
      delete: 'Өшіру'
    },
    ru: {
      title: 'Админ-панель',
      stats: 'Статистика',
      uploadJson: 'Загрузить JSON',
      uploadCsv: 'Загрузить CSV',
      podcasts: 'Подкасты',
      totalQuestions: 'Всего вопросов',
      bySubject: 'По предметам',
      pasteJson: 'Вставьте JSON код',
      submit: 'Отправить',
      selectFile: 'Выберите файл',
      upload: 'Загрузить',
      success: 'Успешно!',
      error: 'Ошибка',
      downloadExample: 'Скачать пример',
      // Podcasts
      addPodcast: 'Добавить подкаст',
      titleKz: 'Название (каз)',
      titleRu: 'Название (рус)',
      descriptionKz: 'Описание (каз)',
      descriptionRu: 'Описание (рус)',
      topic: 'Тема',
      subject: 'Предмет',
      difficulty: 'Сложность',
      orderIndex: 'Порядок',
      audioFile: 'Аудио файл',
      easy: 'Легко',
      medium: 'Средне',
      hard: 'Сложно',
      existingPodcasts: 'Существующие подкасты',
      delete: 'Удалить'
    }
  }

  const content = t[language]

  useEffect(() => {
    const verifyAccessAndLoad = async () => {
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const profileResponse = await api.get('/profile/me')
        if (profileResponse.data.role !== 'admin') {
          navigate('/dashboard')
          return
        }

        if (!user || user.role !== profileResponse.data.role) {
          updateUser({
            id: profileResponse.data.id,
            email: profileResponse.data.email,
            role: profileResponse.data.role,
          })
        }

        loadData()
      } catch (error) {
        console.error('Admin access check failed:', error)
        navigate('/dashboard')
      }
    }

    verifyAccessAndLoad()
  }, [token, user, updateUser, navigate])

  const loadData = async () => {
    try {
      const [subjectsRes, statsRes, podcastsRes] = await Promise.all([
        api.get('/admin/subjects'),
        api.get('/admin/questions/stats'),
        api.get('/podcasts/')
      ])
      
      setSubjects(subjectsRes.data)
      setStats(statsRes.data)
      setPodcasts(podcastsRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handlePodcastSubmit = async (e) => {
    e.preventDefault()
    if (!audioFile) {
      setMessage({ type: 'error', text: 'Пожалуйста, выберите аудио файл' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('subject_id', podcastForm.subject_id)
      formData.append('title_kz', podcastForm.title_kz)
      formData.append('title_ru', podcastForm.title_ru)
      formData.append('description_kz', podcastForm.description_kz)
      formData.append('description_ru', podcastForm.description_ru)
      formData.append('topic', podcastForm.topic)
      formData.append('difficulty', podcastForm.difficulty)
      formData.append('order_index', podcastForm.order_index)
      formData.append('audio_file', audioFile)

      await api.post('/podcasts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setMessage({ type: 'success', text: content.success + ' Подкаст добавлен!' })
      setPodcastForm({
        subject_id: 1,
        title_kz: '',
        title_ru: '',
        description_kz: '',
        description_ru: '',
        topic: '',
        difficulty: 'easy',
        order_index: 0
      })
      setAudioFile(null)
      loadData()
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || err.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePodcast = async (podcastId) => {
    if (!confirm('Вы уверены, что хотите удалить этот подкаст?')) return

    try {
      await api.delete(`/podcasts/${podcastId}`)
      setMessage({ type: 'success', text: 'Подкаст удален' })
      loadData()
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || err.message
      })
    }
  }

  const handleJsonSubmit = async () => {
    setLoading(true)
    setMessage(null)
    
    try {
      let questions = JSON.parse(jsonInput)
      // Добавляем subject_id к каждому вопросу
      questions = questions.map(q => ({ ...q, subject_id: selectedSubjectId }))
      
      const response = await api.post('/admin/questions/bulk', questions)
      
      setMessage({
        type: 'success',
        text: `${content.success} ${response.data.created} вопросов добавлено`
      })
      setJsonInput('')
      loadData()
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || err.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCsvUpload = async () => {
    if (!csvFile) return
    
    setLoading(true)
    setMessage(null)
    
    try {
      const formData = new FormData()
      formData.append('file', csvFile)
      formData.append('subject_id', selectedSubjectId)
      
      const response = await api.post('/admin/questions/import-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setMessage({
        type: 'success',
        text: `✅ ${response.data.imported} вопросов импортировано\n🎴 ${response.data.flashcards_created} флеш-карточек создано`
      })
      setCsvFile(null)
      loadData()
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || err.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-slide-down">
            <h1 className="text-4xl font-bold gradient-text mb-2">{content.title}</h1>
            <p className="text-gray-600 dark:text-gray-300">Управление вопросами и предметами</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 animate-slide-up">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              📊 {content.stats}
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'json'
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              📝 {content.uploadJson}
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'csv'
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              📄 {content.uploadCsv}
            </button>
            <button
              onClick={() => setActiveTab('podcasts')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'podcasts'
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              🎧 {content.podcasts}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl animate-scale-in ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300'
            }`}>
              {message.text}
            </div>
          )}

          {/* Content */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-6 animate-fade-in">
              <div className="card glass-effect">
                <h2 className="text-2xl font-bold mb-4">{content.totalQuestions}</h2>
                <div className="text-5xl font-bold gradient-text">{stats.total}</div>
              </div>

              <div className="card glass-effect">
                <h2 className="text-2xl font-bold mb-6">{content.bySubject}</h2>
                <div className="space-y-3">
                  {Object.entries(stats.by_subject).map(([subject, count]) => (
                    <div key={subject} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                      <span className="font-semibold">{subject}</span>
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-6 animate-fade-in">
              <div className="card glass-effect">
                <h2 className="text-2xl font-bold mb-4">JSON {content.upload}</h2>
                <p className="text-gray-600 mb-4">
                  Вставьте массив вопросов в формате JSON. 
                  <a 
                    href="/questions_example.json" 
                    download 
                    className="text-primary-600 hover:text-primary-700 ml-2 font-semibold"
                  >
                    {content.downloadExample}
                  </a>
                </p>
                
                {/* Subject Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">{content.subject}</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(parseInt(e.target.value))}
                    className="input"
                  >
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.icon} {language === 'kz' ? subject.name_kz : subject.name_ru}
                      </option>
                    ))}
                  </select>
                </div>
                
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={content.pasteJson}
                  className="input font-mono text-sm min-h-[400px]"
                />
                
                <button
                  onClick={handleJsonSubmit}
                  disabled={loading || !jsonInput}
                  className="btn btn-primary w-full mt-4 disabled:opacity-50"
                >
                  {loading ? '⏳ Загрузка...' : content.submit}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'csv' && (
            <div className="space-y-6 animate-fade-in">
              <div className="card glass-effect">
                <h2 className="text-2xl font-bold mb-4">CSV {content.upload}</h2>
                <p className="text-gray-600 mb-4">
                  Загрузите CSV файл с вопросами. Варианты разделяются символом |
                  <a 
                    href="/questions_example.csv" 
                    download 
                    className="text-primary-600 hover:text-primary-700 ml-2 font-semibold"
                  >
                    {content.downloadExample}
                  </a>
                </p>
                
                {/* Subject Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">{content.subject}</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(parseInt(e.target.value))}
                    className="input"
                  >
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.icon} {language === 'kz' ? subject.name_kz : subject.name_ru}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files[0])}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <div className="text-6xl mb-4">📂</div>
                    <p className="text-lg font-semibold mb-2">
                      {csvFile ? csvFile.name : content.selectFile}
                    </p>
                    <p className="text-sm text-gray-500">или перетащите файл сюда</p>
                  </label>
                </div>
                
                <button
                  onClick={handleCsvUpload}
                  disabled={loading || !csvFile}
                  className="btn btn-primary w-full mt-4 disabled:opacity-50"
                >
                  {loading ? '⏳ Загрузка...' : content.upload}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'podcasts' && (
            <div className="space-y-6 animate-fade-in">
              {/* Форма добавления */}
              <div className="card glass-effect">
                <h2 className="text-2xl font-bold mb-6">🎧 {content.addPodcast}</h2>
                
                <form onSubmit={handlePodcastSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Название KZ */}
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        {content.titleKz}
                      </label>
                      <input
                        type="text"
                        value={podcastForm.title_kz}
                        onChange={(e) => setPodcastForm({...podcastForm, title_kz: e.target.value})}
                        className="input"
                        required
                      />
                    </div>

                    {/* Название RU */}
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        {content.titleRu}
                      </label>
                      <input
                        type="text"
                        value={podcastForm.title_ru}
                        onChange={(e) => setPodcastForm({...podcastForm, title_ru: e.target.value})}
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  {/* Описание KZ */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      {content.descriptionKz}
                    </label>
                    <textarea
                      value={podcastForm.description_kz}
                      onChange={(e) => setPodcastForm({...podcastForm, description_kz: e.target.value})}
                      className="input min-h-[100px]"
                      required
                    />
                  </div>

                  {/* Описание RU */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      {content.descriptionRu}
                    </label>
                    <textarea
                      value={podcastForm.description_ru}
                      onChange={(e) => setPodcastForm({...podcastForm, description_ru: e.target.value})}
                      className="input min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Тема */}
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        {content.topic}
                      </label>
                      <input
                        type="text"
                        value={podcastForm.topic}
                        onChange={(e) => setPodcastForm({...podcastForm, topic: e.target.value})}
                        className="input"
                        placeholder="Например: История Казахстана"
                        required
                      />
                    </div>

                    {/* Сложность */}
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        {content.difficulty}
                      </label>
                      <select
                        value={podcastForm.difficulty}
                        onChange={(e) => setPodcastForm({...podcastForm, difficulty: e.target.value})}
                        className="input"
                      >
                        <option value="easy">{content.easy}</option>
                        <option value="medium">{content.medium}</option>
                        <option value="hard">{content.hard}</option>
                      </select>
                    </div>

                    {/* Порядок */}
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        {content.orderIndex}
                      </label>
                      <input
                        type="number"
                        value={podcastForm.order_index}
                        onChange={(e) => setPodcastForm({...podcastForm, order_index: parseInt(e.target.value)})}
                        className="input"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Предмет */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      {content.subject}
                    </label>
                    <select
                      value={podcastForm.subject_id}
                      onChange={(e) => setPodcastForm({...podcastForm, subject_id: parseInt(e.target.value)})}
                      className="input"
                    >
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {language === 'kz' ? subject.name_kz : subject.name_ru}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Аудио файл */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      {content.audioFile}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setAudioFile(e.target.files[0])}
                        className="hidden"
                        id="audio-upload"
                      />
                      <label htmlFor="audio-upload" className="cursor-pointer">
                        <div className="text-5xl mb-3">🎵</div>
                        <p className="text-lg font-semibold mb-1 text-gray-700 dark:text-gray-300">
                          {audioFile ? audioFile.name : content.selectFile}
                        </p>
                        <p className="text-sm text-gray-500">MP3, WAV, OGG</p>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full disabled:opacity-50"
                  >
                    {loading ? '⏳ Загрузка...' : `✅ ${content.addPodcast}`}
                  </button>
                </form>
              </div>

              {/* Список существующих подкастов */}
              <div className="card glass-effect">
                <h2 className="text-2xl font-bold mb-6">{content.existingPodcasts}</h2>
                
                {podcasts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Подкасты не найдены</p>
                ) : (
                  <div className="space-y-4">
                    {podcasts.map(podcast => (
                      <div key={podcast.id} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                              {language === 'kz' ? podcast.title_kz : podcast.title_ru}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {language === 'kz' ? podcast.description_kz : podcast.description_ru}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-semibold">
                                {podcast.topic}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                podcast.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                                podcast.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                              }`}>
                                {podcast.difficulty === 'easy' ? content.easy : 
                                 podcast.difficulty === 'medium' ? content.medium : content.hard}
                              </span>
                              <span className="text-xs text-gray-500">
                                📁 {podcast.audio_filename}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeletePodcast(podcast.id)}
                            className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          >
                            🗑️ {content.delete}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
