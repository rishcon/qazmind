import { Outlet, Link, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import { useLanguageStore } from '../store/languageStore'

export default function Layout() {
  const { language } = useLanguageStore()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  const t = {
    kz: {
      copyright: '© 2026 QazMind. Барлық құқықтар сақталған.',
      privacy: 'Құпиялылық',
      terms: 'Қызмет Қарымы',
      contact: 'Байланыс'
    },
    ru: {
      copyright: '© 2026 QazMind. Все права защищены.',
      privacy: 'Конфиденциальность',
      terms: 'Условия использования',
      contact: 'Контакты'
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isLanding && (
      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-300 py-12 mt-12 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/images/logo.png" alt="QazMind Logo" className="w-8 h-8" />
                <h3 className="text-lg font-bold text-white">QazMind</h3>
              </div>
              <p className="text-sm text-gray-400">
                {language === 'kz'
                  ? 'ҰБТ-ге дайындық үшін ИИ-қосындысы платформа'
                  : 'ИИ-платформа для подготовки к ЕНТ'}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">
                {language === 'kz' ? 'Тез сілтемелер' : 'Быстрые ссылки'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                    {language === 'kz' ? 'Басты бет' : 'Главная'}
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors">
                    {language === 'kz' ? 'Кіру' : 'Войти'}
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-400 hover:text-primary-400 transition-colors">
                    {language === 'kz' ? 'Тіркелу' : 'Регистрация'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">
                {language === 'kz' ? 'Заңды' : 'Юридическая информация'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                    {t[language].privacy}
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                    {t[language].terms}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">
                {t[language].contact}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:info@qazmind.kz" className="text-gray-400 hover:text-primary-400 transition-colors">
                    info@qazmind.kz
                  </a>
                </li>
                <li>
                  <a href="mailto:support@qazmind.kz" className="text-gray-400 hover:text-primary-400 transition-colors">
                    support@qazmind.kz
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                {t[language].copyright}
              </p>
              <div className="flex gap-6 mt-4 md:mt-0 text-sm">
                <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                  {t[language].privacy}
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                  {t[language].terms}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  )
}
