import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLanguageStore } from '../store/languageStore'
import { useAuthStore } from '../store/authStore'
import Footer from '../components/Footer'
import api from '../utils/api'

const Arrow = ({ down = false }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" className={down ? 'qm-icon qm-icon-down' : 'qm-icon'}>
    <path d="M5 15 15 5M8 5h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Play = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 7 8 5-8 5V7Z" fill="currentColor" /></svg>
)

const Logo = () => (
  <span className="qm-logo" aria-label="QazMind">
    <svg viewBox="0 0 40 44" aria-hidden="true">
      <path d="M20 3 35 12v20l-8 5-7-5 8-5v-11l-8-5-8 5v12l9 6-7 5L5 34V12L20 3Z" fill="currentColor" />
    </svg>
    <strong>QazMind</strong>
  </span>
)

function Reveal({ children, className = '', delay = 0, amount = 0.18 }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function FeatureIcon({ name }) {
  const paths = {
    test: <><path d="M7 4.5h10M7 9h10M7 13.5h6" /><path d="m15 16 2 2 4-5" /></>,
    tutor: <><path d="M6 7.5h12a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H9l-5 3v-11a3 3 0 0 1 2-3Z" /><path d="M9 12h.01M15 12h.01M9 15h6" /></>,
    explain: <><path d="M12 3a7 7 0 0 0-4 12.7V20h8v-4.3A7 7 0 0 0 12 3Z" /><path d="M9 23h6M9 12h6M12 9v6" /></>,
    cards: <><rect x="6" y="4" width="13" height="16" rx="2" /><path d="M15 4V2H5a2 2 0 0 0-2 2v13h3M9 9h7M9 13h5" /></>,
    podcast: <><circle cx="12" cy="12" r="3" /><path d="M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 19.1a10 10 0 0 1 0-14.2M19.1 4.9a10 10 0 0 1 0 14.2" /></>,
    progress: <><path d="M4 20V10M10 20V5M16 20v-8M22 20V3" /><path d="m3 7 6-4 7 5 6-5" /></>,
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function FeatureVisual({ type, language }) {
  if (type === 'test') {
    return <div className="qm-feature-test"><span>01 / 20</span><strong>{language === 'kz' ? 'Сұраққа жауап бер' : 'Ответь на вопрос'}</strong><i><b /></i></div>
  }
  if (type === 'tutor') {
    return <div className="qm-feature-score"><span>AI</span><strong>87<small>/100</small></strong><em>{language === 'kz' ? 'Нақты кері байланыс' : 'Точная обратная связь'}</em></div>
  }
  if (type === 'cards') {
    return <div className="qm-feature-deck"><i /><i /><i /></div>
  }
  if (type === 'podcast') {
    return <div className="qm-feature-audio"><span><Play /></span>{Array.from({ length: 14 }).map((_, index) => <i key={index} />)}</div>
  }
  if (type === 'progress') {
    return <div className="qm-feature-chart">{[35, 58, 44, 76, 64, 90, 82].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
  }
  return <div className="qm-feature-explain"><span>01</span><i /><span>1</span><small>{language === 'kz' ? 'қарапайым тілмен' : 'простыми словами'}</small></div>
}

function FeatureCard({ feature, language, cta, index }) {
  const reduceMotion = useReducedMotion()
  const content = (
    <motion.article className={`qm-feature-card ${feature.large ? 'large' : ''}`} whileHover={reduceMotion ? undefined : { y: -6 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
      <div className="qm-feature-top">
        <span className="qm-feature-icon"><FeatureIcon name={feature.type} /></span>
        <em>{feature.tag}</em>
      </div>
      <div className="qm-feature-content">
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
      <FeatureVisual type={feature.type} language={language} />
      <span className="qm-feature-link">{cta}<Arrow /></span>
    </motion.article>
  )

  return (
    <Reveal className={feature.large ? 'qm-feature-wrap large' : 'qm-feature-wrap'} delay={(index % 3) * 0.08}>
      {feature.to.startsWith('#') ? <a href={feature.to}>{content}</a> : <Link to={feature.to}>{content}</Link>}
    </Reveal>
  )
}

const copy = {
  ru: {
    eyebrow: 'Подготовка к ЕНТ',
    hero: ['Твой темп.', 'Твой путь.', 'Твой результат.'],
    heroSub: 'Тесты, понятные разборы и практика каждый день.',
    try: 'Попробовать бесплатно',
    noSignup: 'Без регистрации',
    subjectsTitle: 'Начни со своего предмета.',
    subjectsSub: 'Выбери тему. Попробуй короткий тест.',
    allSubjects: 'Все предметы',
    question: 'Что хранит один бит?',
    answers: ['0 или 1', 'Любое число', 'Один символ'],
    check: 'Проверить ответ',
    correct: 'Верно. Бит хранит одно из двух состояний.',
    choose: 'Выбери один вариант ответа.',
    learnTitle: ['Разобраться.', 'И запомнить.'],
    learnSub: 'Выбирай удобный способ учиться.',
    tabs: ['Разбор с ИИ', 'Карточки', 'Подкасты'],
    explainLabel: 'QazMind объясняет',
    explainTitle: 'Почему один бит — это 0 или 1?',
    explainBody: 'У бита два состояния: включено или выключено. Как у обычного выключателя.',
    cardsBody: 'Повторяй главное по умному расписанию и не трать время на уже знакомое.',
    podcastsBody: 'Слушай короткие объяснения по дороге, на прогулке или перед тестом.',
    learnCta: 'Попробовать разбор',
    audio: 'Слушай в своём темпе',
    featuresEyebrow: 'Возможности QazMind',
    featuresTitle: ['Всё для подготовки.', 'Ничего лишнего.'],
    featuresSub: 'Один спокойный маршрут: проверить знания, разобраться в ошибках и закрепить материал.',
    featureCta: 'Открыть',
    features: [
      { type: 'test', title: 'Тесты по предметам', description: 'Проходи вопросы один за другим, следи за прогрессом и получай подробный результат.', tag: 'Практика', to: '#subjects', large: true },
      { type: 'tutor', title: 'AI-репетитор', description: 'Мини-урок, похожие задания и проверка письменного ответа по 100-балльной шкале.', tag: 'Объяснение', to: '/register', large: true },
      { type: 'explain', title: 'Разбор ошибок', description: 'AI объясняет, почему ответ неверный, понятным языком.', tag: 'После теста', to: '/register' },
      { type: 'cards', title: 'Умные карточки', description: 'Интервальные повторения возвращают карточку именно тогда, когда нужно.', tag: 'Запоминание', to: '/flashcards' },
      { type: 'podcast', title: 'Подкасты', description: 'Короткие аудиолекции с фильтрацией по предметам.', tag: 'В своём темпе', to: '/podcasts' },
      { type: 'progress', title: 'Личный прогресс', description: 'Статистика, история тестов и рекомендации по слабым темам.', tag: 'Фокус', to: '/dashboard' },
    ],
    pathEyebrow: 'Как это устроено',
    pathTitle: 'От вопроса к пониманию.',
    pathSub: 'QazMind не перегружает. Каждый следующий шаг появляется тогда, когда он действительно нужен.',
    steps: [
      ['01', 'Выбери предмет', 'Начни с теста или сразу открой тему в AI-репетиторе.'],
      ['02', 'Получи точный разбор', 'Посмотри результат, объяснение ошибки и рекомендации.'],
      ['03', 'Закрепи материал', 'Вернись к теме через карточки или послушай короткий подкаст.'],
    ],
    faqTitle: ['Остались', 'вопросы?'],
    faq: [
      ['Можно попробовать без регистрации?', 'Да. Начни с короткого демо-теста — аккаунт понадобится, чтобы сохранить прогресс.'],
      ['Есть русский и казахский языки?', 'Да. Язык интерфейса можно переключить в любой момент.'],
      ['Как работает ИИ-репетитор?', 'Он разбирает ответы, объясняет ошибки и подбирает следующий шаг по теме.'],
    ],
    ctaTitle: ['Большая цель.', 'Один шаг сегодня.'],
    ctaSub: 'Начни с короткого теста.',
    privacy: 'Политика конфиденциальности',
    terms: 'Условия использования',
    how: 'Как это работает',
    subjects: 'Предметы',
  },
  kz: {
    eyebrow: 'ҰБТ-ға дайындық',
    hero: ['Өз қарқының.', 'Өз жолың.', 'Өз нәтижең.'],
    heroSub: 'Тесттер, түсінікті талдаулар және күнделікті тәжірибе.',
    try: 'Тегін байқап көру',
    noSignup: 'Тіркелусіз',
    subjectsTitle: 'Өз пәніңнен баста.',
    subjectsSub: 'Тақырыпты таңда. Қысқа тестті байқап көр.',
    allSubjects: 'Барлық пәндер',
    question: 'Бір бит нені сақтайды?',
    answers: ['0 немесе 1', 'Кез келген сан', 'Бір таңба'],
    check: 'Жауапты тексеру',
    correct: 'Дұрыс. Бит екі күйдің бірін сақтайды.',
    choose: 'Бір жауапты таңда.',
    learnTitle: ['Түсіну.', 'Және есте сақтау.'],
    learnSub: 'Өзіңе ыңғайлы оқу тәсілін таңда.',
    tabs: ['AI талдауы', 'Карточкалар', 'Подкасттар'],
    explainLabel: 'QazMind түсіндіреді',
    explainTitle: 'Неліктен бір бит — 0 немесе 1?',
    explainBody: 'Биттің екі күйі бар: қосулы немесе өшірулі. Қарапайым қосқыш сияқты.',
    cardsBody: 'Маңыздысын ақылды кестемен қайталап, таныс материалға уақыт жоғалтпа.',
    podcastsBody: 'Жолда, серуенде немесе тест алдында қысқа түсіндірмелерді тыңда.',
    learnCta: 'Талдауды байқап көру',
    audio: 'Өз қарқыныңмен тыңда',
    featuresEyebrow: 'QazMind мүмкіндіктері',
    featuresTitle: ['Дайындыққа керектің бәрі.', 'Артық ештеңе жоқ.'],
    featuresSub: 'Білімді тексеру, қатені түсіну және материалды бекітуге арналған бір тыныш маршрут.',
    featureCta: 'Ашу',
    features: [
      { type: 'test', title: 'Пәндік тесттер', description: 'Сұрақтарды ретімен орындап, прогресті бақыла және толық нәтиже ал.', tag: 'Тәжірибе', to: '#subjects', large: true },
      { type: 'tutor', title: 'AI-репетитор', description: 'Мини-сабақ, ұқсас тапсырмалар және жазбаша жауапты 100 баллмен тексеру.', tag: 'Түсіндіру', to: '/register', large: true },
      { type: 'explain', title: 'Қатені талдау', description: 'AI жауаптың неліктен қате екенін қарапайым тілмен түсіндіреді.', tag: 'Тесттен кейін', to: '/register' },
      { type: 'cards', title: 'Ақылды карточкалар', description: 'Интервалды қайталау карточканы дәл керек уақытта қайтарады.', tag: 'Есте сақтау', to: '/flashcards' },
      { type: 'podcast', title: 'Подкасттар', description: 'Пәндер бойынша сүзгіленетін қысқа аудиодәрістер.', tag: 'Өз қарқыныңда', to: '/podcasts' },
      { type: 'progress', title: 'Жеке прогресс', description: 'Статистика, тест тарихы және әлсіз тақырыптарға ұсыныстар.', tag: 'Фокус', to: '/dashboard' },
    ],
    pathEyebrow: 'Қалай құрылған',
    pathTitle: 'Сұрақтан түсінуге дейін.',
    pathSub: 'QazMind артық жүктемейді. Келесі қадам дәл қажет болған кезде көрінеді.',
    steps: [
      ['01', 'Пәнді таңда', 'Тесттен баста немесе AI-репетитордағы тақырыпты бірден аш.'],
      ['02', 'Нақты талдау ал', 'Нәтижені, қате түсіндірмесін және ұсыныстарды қара.'],
      ['03', 'Материалды бекіт', 'Карточкалармен қайтала немесе қысқа подкаст тыңда.'],
    ],
    faqTitle: ['Сұрақтарың', 'бар ма?'],
    faq: [
      ['Тіркелусіз көруге бола ма?', 'Иә. Қысқа демо-тесттен баста — прогресті сақтау үшін аккаунт қажет.'],
      ['Қазақ және орыс тілдері бар ма?', 'Иә. Интерфейс тілін кез келген уақытта ауыстыруға болады.'],
      ['AI-репетитор қалай жұмыс істейді?', 'Ол жауаптарды талдайды, қателерді түсіндіреді және келесі қадамды ұсынады.'],
    ],
    ctaTitle: ['Үлкен мақсат.', 'Бүгін бір қадам.'],
    ctaSub: 'Қысқа тесттен баста.',
    privacy: 'Құпиялық саясаты',
    terms: 'Пайдалану шарттары',
    how: 'Қалай жұмыс істейді',
    subjects: 'Пәндер',
  },
}

const fallbackSubjects = [
  { id: 1, name_ru: 'История Казахстана', name_kz: 'Қазақстан тарихы' },
  { id: 4, name_ru: 'Математика', name_kz: 'Математика' },
  { id: 14, name_ru: 'Информатика', name_kz: 'Информатика' },
  { id: 6, name_ru: 'Биология', name_kz: 'Биология' },
]

const demoQuestions = {
  ru: {
    1: {
      question: 'В каком году Казахстан провозгласил независимость?',
      answers: ['В 1991 году', 'В 1986 году', 'В 1995 году'],
      correct: 'Верно. Независимость Казахстана была провозглашена 16 декабря 1991 года.',
    },
    4: {
      question: 'Чему равен квадрат числа 12?',
      answers: ['144', '24', '124'],
      correct: 'Верно. 12 × 12 = 144.',
    },
    14: {
      question: 'Что хранит один бит?',
      answers: ['0 или 1', 'Любое число', 'Один символ'],
      correct: 'Верно. Бит хранит одно из двух состояний: 0 или 1.',
    },
    6: {
      question: 'Какая органелла вырабатывает энергию для клетки?',
      answers: ['Митохондрия', 'Ядро', 'Рибосома'],
      correct: 'Верно. Митохондрии производят основную часть энергии клетки.',
    },
  },
  kz: {
    1: {
      question: 'Қазақстан тәуелсіздігін қай жылы жариялады?',
      answers: ['1991 жылы', '1986 жылы', '1995 жылы'],
      correct: 'Дұрыс. Қазақстан тәуелсіздігі 1991 жылғы 16 желтоқсанда жарияланды.',
    },
    4: {
      question: '12 санының квадраты нешеге тең?',
      answers: ['144', '24', '124'],
      correct: 'Дұрыс. 12 × 12 = 144.',
    },
    14: {
      question: 'Бір бит нені сақтайды?',
      answers: ['0 немесе 1', 'Кез келген сан', 'Бір таңба'],
      correct: 'Дұрыс. Бит екі күйдің бірін сақтайды: 0 немесе 1.',
    },
    6: {
      question: 'Жасушаға энергия өндіретін органоид қайсы?',
      answers: ['Митохондрия', 'Ядро', 'Рибосома'],
      correct: 'Дұрыс. Митохондрия жасуша энергиясының негізгі бөлігін өндіреді.',
    },
  },
}

export default function Landing() {
  const { language } = useLanguageStore()
  const { isAuthenticated } = useAuthStore()
  const reduceMotion = useReducedMotion()
  const navigate = useNavigate()
  const t = copy[language] || copy.ru
  const [subjects, setSubjects] = useState(fallbackSubjects)
  const [activeSubject, setActiveSubject] = useState(14)
  const [answer, setAnswer] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [tab, setTab] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    let alive = true
    api.get('/subjects/').then(({ data }) => {
      if (alive && Array.isArray(data) && data.length) setSubjects(data)
    }).catch(() => {})
    return () => { alive = false }
  }, [])

  const featuredSubjects = useMemo(() => {
    const wanted = [1, 4, 14, 6]
    const picked = wanted.map((id) => subjects.find((subject) => subject.id === id)).filter(Boolean)
    return picked.length === 4 ? picked : subjects.slice(0, 4)
  }, [subjects])

  const activeName = featuredSubjects.find((subject) => subject.id === activeSubject)?.[language === 'kz' ? 'name_kz' : 'name_ru'] || (language === 'kz' ? 'Информатика' : 'Информатика')
  const activeDemo = demoQuestions[language]?.[activeSubject] || demoQuestions[language]?.[14] || demoQuestions.ru[14]

  const checkAnswer = () => {
    if (answer === null) setFeedback(t.choose)
    else setFeedback(answer === 0 ? activeDemo.correct : (language === 'kz' ? 'Әзірге дұрыс емес. Басқа жауапты байқап көр.' : 'Пока неверно. Попробуй другой вариант.'))
  }

  const startTest = () => navigate(isAuthenticated ? `/test/${activeSubject}` : '/register')

  return (
    <div className="qm-landing">
      <section className="qm-hero" id="how">
        <div className="qm-shell qm-hero-grid">
          <motion.div
            className="qm-hero-copy"
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p className="qm-eyebrow" variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}>{t.eyebrow}</motion.p>
            <h1>{t.hero.map((line) => <motion.span key={line} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}>{line}</motion.span>)}</h1>
            <motion.p className="qm-lede" variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>{t.heroSub}</motion.p>
            <motion.a className="qm-button qm-button-dark" href="#subjects" variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }} whileHover={{ y: -3 }}>{t.try}<Arrow /></motion.a>
            <motion.small variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }}>{t.noSignup}</motion.small>
          </motion.div>
          <div className="qm-hero-art" aria-hidden="true">
            <div className="qm-glow" />
            <motion.img
              src="/images/landing/stairs.png"
              alt=""
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94, x: 24 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1, x: 0, y: [0, -8, 0] }}
              transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8 }, x: { duration: 0.8 }, y: { delay: 0.8, duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
            />
            <motion.div className="qm-mini-question" initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.65 }}>
              <strong>{language === 'kz' ? 'Информатика' : 'Информатика'}</strong>
              <span>{t.question}</span>
              <em><i />{t.answers[0]}</em>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="qm-subjects qm-section" id="subjects">
        <div className="qm-shell qm-subject-grid">
          <Reveal className="qm-subject-list">
            <h2>{t.subjectsTitle}</h2>
            <p>{t.subjectsSub}</p>
            <div className="qm-subject-options">
              {featuredSubjects.map((subject) => {
                const name = subject[language === 'kz' ? 'name_kz' : 'name_ru']
                return (
                  <button key={subject.id} className={activeSubject === subject.id ? 'active' : ''} onClick={() => { setActiveSubject(subject.id); setAnswer(null); setFeedback('') }}>
                    <span>{name}</span><i />
                  </button>
                )
              })}
            </div>
            <button className="qm-text-link" onClick={startTest}>{t.allSubjects}<Arrow /></button>
          </Reveal>

          <Reveal className="qm-test-card" delay={0.12}>
            <div className="qm-test-meta"><strong>{activeName}</strong><span>01 / 01</span></div>
            <AnimatePresence mode="wait">
              <motion.h3 key={`${language}-${activeSubject}`} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>{activeDemo.question}</motion.h3>
            </AnimatePresence>
            <div className="qm-answers">
              <AnimatePresence mode="wait">
                <motion.div key={`${language}-${activeSubject}-answers`} className="qm-answer-set" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduceMotion ? undefined : { opacity: 0 }} transition={{ duration: 0.25 }}>
                  {activeDemo.answers.map((item, index) => (
                    <button key={item} className={answer === index ? 'selected' : ''} onClick={() => { setAnswer(index); setFeedback('') }}>
                      <i />{item}
                    </button>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
            <button className="qm-button qm-button-dark" onClick={checkAnswer}>{t.check}<Arrow /></button>
            <AnimatePresence mode="wait">
              {feedback && <motion.p key={feedback} className={`qm-feedback ${answer === 0 ? 'correct' : ''}`} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>{feedback}</motion.p>}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>

      <section className="qm-learning qm-section" id="features">
        <div className="qm-shell qm-learning-grid">
          <Reveal className="qm-learning-copy">
            <h2>{t.learnTitle.map((line) => <span key={line}>{line}</span>)}</h2>
            <p>{t.learnSub}</p>
            <div className="qm-tabs" role="tablist">
              {t.tabs.map((label, index) => <button key={label} className={tab === index ? 'active' : ''} onClick={() => setTab(index)}>{label}</button>)}
            </div>
            <div className="qm-tab-panel">
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  {tab === 0 && <><strong><Logo /> {t.explainLabel}</strong><h3>{t.explainTitle}</h3><p>{t.explainBody}</p><div className="qm-bit"><span>0</span><i /><span>1</span></div></>}
                  {tab === 1 && <><h3>{t.tabs[1]}</h3><p>{t.cardsBody}</p><div className="qm-card-stack-mini"><i /><i /><i /></div></>}
                  {tab === 2 && <><h3>{t.tabs[2]}</h3><p>{t.podcastsBody}</p><div className="qm-wave-mini">{Array.from({ length: 20 }).map((_, i) => <i key={i} />)}</div></>}
                </motion.div>
              </AnimatePresence>
            </div>
            <Link className="qm-text-link" to={tab === 2 ? '/podcasts' : tab === 1 ? '/flashcards' : '/register'}>{t.learnCta}<Arrow /></Link>
          </Reveal>
          <Reveal className="qm-learning-art" delay={0.12}>
            <motion.img src="/images/landing/cards.png" alt={language === 'kz' ? 'Талдау және қайталау карточкалары' : 'Карточки для разбора и повторения'} whileInView={reduceMotion ? undefined : { y: [0, -7, 0], rotate: [0, 0.4, 0] }} viewport={{ once: false, amount: 0.5 }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
            <div className="qm-audio-row">
              <Link to="/podcasts" className="qm-play" aria-label={t.audio}><Play /></Link>
              <div><div className="qm-wave">{Array.from({ length: 30 }).map((_, i) => <i key={i} />)}</div><span>{t.audio}</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="qm-capabilities qm-section" id="capabilities">
        <div className="qm-shell">
          <Reveal className="qm-capabilities-head">
            <p className="qm-eyebrow">{t.featuresEyebrow}</p>
            <h2>{t.featuresTitle.map((line) => <span key={line}>{line}</span>)}</h2>
            <p>{t.featuresSub}</p>
          </Reveal>
          <div className="qm-feature-grid">
            {t.features.map((feature, index) => <FeatureCard key={feature.type} feature={feature} language={language} cta={t.featureCta} index={index} />)}
          </div>
        </div>
      </section>

      <section className="qm-path qm-section">
        <div className="qm-shell qm-path-grid">
          <Reveal className="qm-path-intro">
            <p className="qm-eyebrow">{t.pathEyebrow}</p>
            <h2>{t.pathTitle}</h2>
            <p>{t.pathSub}</p>
          </Reveal>
          <div className="qm-steps">
            {t.steps.map(([number, title, description], index) => (
              <Reveal key={number} className="qm-step" delay={index * 0.08}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
                <i />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="qm-faq qm-section">
        <div className="qm-shell qm-faq-grid">
          <Reveal><h2>{t.faqTitle.map((line) => <span key={line}>{line}</span>)}</h2></Reveal>
          <div className="qm-faq-list">
            {t.faq.map(([question, response], index) => (
              <motion.article key={question} className={openFaq === index ? 'open' : ''} layout>
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>
                  <strong>{question}</strong><span>{openFaq === index ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === index && <motion.p initial={reduceMotion ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduceMotion ? undefined : { height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>{response}</motion.p>}
                </AnimatePresence>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="qm-final">
        <div className="qm-shell qm-final-grid">
          <Reveal>
            <h2>{t.ctaTitle.map((line) => <span key={line}>{line}</span>)}</h2>
            <p>{t.ctaSub}</p>
            <a className="qm-button qm-button-lime" href="#subjects">{t.try}<Arrow /></a>
          </Reveal>
          <motion.img src="/images/landing/stairs.png" alt="" aria-hidden="true" initial={reduceMotion ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
