import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguageStore } from '../store/languageStore'
import { questionService } from '../services/api'

function Icon({ children, className = 'h-5 w-5' }) { return <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{children}</svg> }

export default function ExplanationModal({ question, attemptId, onClose }) {
  const [explanation, setExplanation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { language } = useLanguageStore()
  const ru = language === 'ru'
  const c = ru ? { eyebrow: 'AI‑РАЗБОР', title: 'Разберём ошибку', question: 'Вопрос', your: 'Ваш ответ', correct: 'Правильный ответ', get: 'Получить объяснение', thinking: 'AI готовит объяснение…', close: 'Закрыть', limit: 'Лимит запросов исчерпан. Попробуйте немного позже.', failed: 'Не удалось получить объяснение. Попробуйте ещё раз.' } : { eyebrow: 'AI‑ТАЛДАУ', title: 'Қатені талдайық', question: 'Сұрақ', your: 'Сіздің жауабыңыз', correct: 'Дұрыс жауап', get: 'Түсіндірме алу', thinking: 'AI түсіндірме дайындауда…', close: 'Жабу', limit: 'Сұраулар лимиті таусылды. Кейінірек қайталаңыз.', failed: 'Түсіндірме алу мүмкін болмады. Қайталап көріңіз.' }
  const getExplanation = async () => {
    setLoading(true); setError('')
    try { const data = await questionService.explainError(question.question_id, attemptId, question.user_answer_index, language); setExplanation(data.explanation_text) }
    catch (err) { setError(err.response?.status === 429 ? c.limit : c.failed) } finally { setLoading(false) }
  }
  return <AnimatePresence><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }} className="fixed inset-0 z-[90] flex items-end bg-[#003f34]/55 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"><motion.section initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} transition={{ duration: .22 }} className="flex max-h-[calc(100vh-12px)] w-full max-w-3xl flex-col overflow-hidden bg-[#f7faf7] text-[#003f34] shadow-2xl dark:bg-slate-950 dark:text-white sm:max-h-[88vh]" role="dialog" aria-modal="true" aria-labelledby="explanation-title">
    <header className="shrink-0 bg-[#003f34] px-6 py-5 text-white sm:px-8"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#c9f53e]">{c.eyebrow}</p><h2 id="explanation-title" className="mt-2 text-3xl font-semibold tracking-[-.055em]">{c.title}</h2></div><button onClick={onClose} className="flex h-9 w-9 items-center justify-center border border-white/20 transition hover:bg-white/10" aria-label={c.close}><Icon className="h-4 w-4"><path d="m6 6 12 12M18 6 6 18" /></Icon></button></div></header>
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7"><section className="border-b border-[#dce5df] pb-6 dark:border-white/10"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#7b8480] dark:text-white/45">{c.question}</p><p className="mt-3 text-lg font-semibold leading-7">{question.question_text}</p></section><section className="mt-6 grid gap-4 sm:grid-cols-2"><div className="border-l-2 border-[#aa3934] bg-[#fce9e7] p-4 dark:bg-red-400/10"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#aa3934] dark:text-red-200">{c.your}</p><p className="mt-2 text-sm leading-6">{question.user_answer || '—'}</p></div><div className="border-l-2 border-[#c9f53e] bg-[#eef5f0] p-4 dark:bg-[#c9f53e]/10"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#00715c] dark:text-[#c9f53e]">{c.correct}</p><p className="mt-2 text-sm leading-6">{question.correct_answer}</p></div></section>
    {!explanation && !loading && !error && <button onClick={getExplanation} className="mt-7 bg-[#003f34] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#005345] dark:bg-[#c9f53e] dark:text-[#003f34]">{c.get}</button>}
    {loading && <div className="py-10 text-center"><span className="mx-auto block h-8 w-8 animate-spin border-2 border-[#00715c] border-t-transparent dark:border-[#c9f53e] dark:border-t-transparent" /><p className="mt-4 text-sm font-semibold text-[#5d6763] dark:text-white/60">{c.thinking}</p></div>}
    {error && <div className="mt-7 border-l-2 border-[#aa3934] bg-[#fce9e7] px-4 py-3 text-sm text-[#aa3934] dark:bg-red-400/10 dark:text-red-200">{error}<button onClick={getExplanation} className="ml-3 font-bold underline underline-offset-4">{c.get}</button></div>}
    {explanation && <section className="mt-7 border-t border-[#b8c9c0] pt-6 dark:border-white/20"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#7b8480] dark:text-white/45">{c.eyebrow}</p><div className="mt-3 whitespace-pre-wrap border-l-2 border-[#c9f53e] bg-[#eef5f0] p-5 text-sm leading-7 dark:bg-white/10">{explanation}</div></section>}</div>
    <footer className="shrink-0 border-t border-[#dce5df] bg-white px-6 py-5 dark:border-white/10 dark:bg-slate-950 sm:px-8"><button onClick={onClose} className="float-right px-4 py-3 text-sm font-bold text-[#5d6763] hover:text-[#003f34] dark:text-white/60 dark:hover:text-white">{c.close}</button></footer>
  </motion.section></motion.div></AnimatePresence>
}
