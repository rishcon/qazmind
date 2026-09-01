import { Link } from 'react-router-dom'
import { useLanguageStore } from '../store/languageStore'

const Logo = () => (
  <span className="qm-logo">
    <svg viewBox="0 0 40 44" aria-hidden="true">
      <path d="M20 3 35 12v20l-8 5-7-5 8-5v-11l-8-5-8 5v12l9 6-7 5L5 34V12L20 3Z" fill="currentColor" />
    </svg>
    <strong>QazMind</strong>
  </span>
)

const copy = {
  ru: { subjects: 'Предметы', how: 'Как это работает', privacy: 'Политика конфиденциальности', terms: 'Условия использования' },
  kz: { subjects: 'Пәндер', how: 'Қалай жұмыс істейді', privacy: 'Құпиялылық саясаты', terms: 'Пайдалану шарттары' },
}

/** The landing page's own footer — shared so /login and /register (and any
 *  other page styled after the landing) render byte-identical markup instead
 *  of falling back to the app's generic dark footer. */
export default function Footer() {
  const { language } = useLanguageStore()
  const t = copy[language] || copy.ru

  return (
    <footer className="qm-footer">
      <div className="qm-shell">
        <Logo />
        <nav aria-label="Footer">
          <a href="/#subjects">{t.subjects}</a>
          <a href="/#how">{t.how}</a>
          <Link to="/privacy">{t.privacy}</Link>
          <Link to="/terms">{t.terms}</Link>
        </nav>
        <div className="qm-footer-bottom"><span>© 2026 QazMind</span><span>RU / KZ</span></div>
      </div>
    </footer>
  )
}
