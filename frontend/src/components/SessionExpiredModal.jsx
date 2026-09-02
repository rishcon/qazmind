import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguageStore } from '../store/languageStore'

function ClockIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
}

export default function SessionExpiredModal({ open, onClose }) {
  const navigate = useNavigate()
  const { language } = useLanguageStore()
  const buttonRef = useRef(null)
  const ru = language === 'ru'
  const copy = ru
    ? { eyebrow: 'БЕЗОПАСНОСТЬ АККАУНТА', title: 'Сессия истекла', text: 'Для защиты вашего аккаунта мы завершили сессию. Войдите снова, чтобы продолжить подготовку.', action: 'Войти снова' }
    : { eyebrow: 'АККАУНТ ҚАУІПСІЗДІГІ', title: 'Сессия аяқталды', text: 'Аккаунтыңызды қорғау үшін сессия аяқталды. Дайындықты жалғастыру үшін қайта кіріңіз.', action: 'Қайта кіру' }

  useEffect(() => {
    if (!open) return undefined
    buttonRef.current?.focus()
    const onKeyDown = (event) => { if (event.key === 'Escape') event.preventDefault() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const login = () => { onClose(); navigate('/login', { replace: true }) }

  return <AnimatePresence>{open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#002f27]/72 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="session-expired-title"><motion.div initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="w-full max-w-md overflow-hidden bg-[#f7faf7] text-[#003f34] shadow-2xl dark:bg-slate-900 dark:text-white"><div className="h-1.5 bg-[#c9f53e]" /><div className="p-6 sm:p-8"><div className="flex h-12 w-12 items-center justify-center bg-[#003f34] text-[#c9f53e]"><ClockIcon /></div><p className="mt-7 text-[10px] font-bold uppercase tracking-[.2em] text-[#00715c] dark:text-[#c9f53e]">{copy.eyebrow}</p><h2 id="session-expired-title" className="mt-2 text-3xl font-semibold tracking-[-.055em]">{copy.title}</h2><p className="mt-4 max-w-sm text-sm leading-6 text-[#5d6763] dark:text-white/65">{copy.text}</p><button ref={buttonRef} type="button" onClick={login} className="mt-8 w-full bg-[#003f34] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#00715c] focus:outline-none focus:ring-2 focus:ring-[#c9f53e] focus:ring-offset-2 dark:bg-[#c9f53e] dark:text-[#003f34]">{copy.action}</button></div></motion.div></motion.div>}</AnimatePresence>
}
