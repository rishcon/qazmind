import { AnimatePresence, motion } from 'framer-motion'
import { useLanguageStore } from '../store/languageStore'

export default function LogoutConfirmModal({ open, onCancel, onConfirm }) {
  const { language } = useLanguageStore()
  const c = language === 'ru' ? { title: 'Выйти из аккаунта?', text: 'Вы сможете войти снова в любое время.', cancel: 'Остаться', confirm: 'Выйти' } : { title: 'Аккаунттан шығу керек пе?', text: 'Кез келген уақытта қайта кіре аласыз.', cancel: 'Қалу', confirm: 'Шығу' }
  return <AnimatePresence>{open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#002f27]/70 p-5 backdrop-blur-sm" role="dialog" aria-modal="true"><motion.div initial={{ opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: .98 }} className="w-full max-w-sm bg-[#f7faf7] p-6 text-[#003f34] shadow-2xl dark:bg-slate-900 dark:text-white"><div className="h-1 w-12 bg-[#c9f53e]" /><h2 className="mt-6 text-2xl font-semibold tracking-[-.05em]">{c.title}</h2><p className="mt-3 text-sm leading-6 text-[#5d6763] dark:text-white/65">{c.text}</p><div className="mt-7 flex gap-3"><button onClick={onCancel} className="flex-1 border border-[#b8c9c0] py-3 text-sm font-bold dark:border-white/20">{c.cancel}</button><button onClick={onConfirm} className="flex-1 bg-[#003f34] py-3 text-sm font-bold text-white dark:bg-[#c9f53e] dark:text-[#003f34]">{c.confirm}</button></div></motion.div></motion.div>}</AnimatePresence>
}
