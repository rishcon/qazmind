import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useTestStore } from '../store/testStore'
import { useLanguageStore } from '../store/languageStore'
import { useThemeStore } from '../store/themeStore'
import { testService } from '../services/api'
import api from '../utils/api'
import Timer from '../components/Timer'

function Icon({ children, className = 'h-5 w-5' }) { return <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">{children}</svg> }

export default function Test() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [subject, setSubject] = useState(null)
  const [exitOpen, setExitOpen] = useState(false)
  const [submitOpen, setSubmitOpen] = useState(false)
  const { attemptId, questions, currentQuestionIndex, answers, setAttemptId, setQuestions, setCurrentQuestion, setAnswer, resetTest } = useTestStore()
  const { language } = useLanguageStore()
  const { theme } = useThemeStore()
  const navigate = useNavigate()
  const { subjectId } = useParams()
  const ru = language === 'ru'
  const c = ru ? { mode: 'РЕЖИМ ТЕСТИРОВАНИЯ', progress: 'Прогресс', exit: 'Выйти из теста', exitTitle: 'Завершить попытку?', exitText: 'Тест будет сохранён как непройденный с результатом 0 баллов. Вернуться к нему позже нельзя.', stay: 'Продолжить тест', confirmExit: 'Завершить как непройденный', finish: 'Завершить тест', sending: 'Отправляем…', question: 'Вопрос', answered: 'отвечено', all: 'Все вопросы', load: 'Подготавливаем тест…', unanswered: 'Без ответа', submitConfirm: 'Не отвечено вопросов: ' } : { mode: 'ТЕСТ РЕЖИМІ', progress: 'Прогресс', exit: 'Тесттен шығу', exitTitle: 'Талпынысты аяқтау керек пе?', exitText: 'Тест 0 баллмен өтпеген болып сақталады. Оған кейін оралуға болмайды.', stay: 'Тестті жалғастыру', confirmExit: 'Өтпеген ретінде аяқтау', finish: 'Тестті аяқтау', sending: 'Жіберілуде…', question: 'Сұрақ', answered: 'жауап берілді', all: 'Барлық сұрақ', load: 'Тест дайындалуда…', unanswered: 'Жауапсыз', submitConfirm: 'Жауапсыз сұрақтар: ' }
  const shell = theme === 'dark' ? 'min-h-screen bg-slate-950 text-white' : 'min-h-screen bg-[#f7faf7] text-[#003f34]'

  useEffect(() => {
    let active = true
    const start = async () => {
      try { const [subjectResponse, data] = await Promise.all([api.get('/subjects/' + subjectId), testService.createTest(Number(subjectId), language, 20, 'new')]); if (!active) return; setSubject(subjectResponse.data); setAttemptId(data.attempt_id); setQuestions(data.questions); setLoading(false) }
      catch (error) { console.error(error); navigate('/dashboard') }
    }
    start()
    return () => { active = false; resetTest() }
  }, [subjectId])
  useEffect(() => {
    if (!attemptId) return undefined
    const ask = () => setExitOpen(true)
    // Keep a guarded history entry while an attempt is active. Pressing the
    // browser's Back button returns to this entry and opens our app modal
    // instead of silently navigating away from the test.
    const guardState = { qazmindTestAttempt: attemptId || true }
    window.history.pushState(guardState, '', window.location.href)
    const onPopState = () => {
      window.history.pushState(guardState, '', window.location.href)
      setExitOpen(true)
    }
    const beforeUnload = (event) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('qazmind:request-test-exit', ask)
    window.addEventListener('popstate', onPopState)
    window.addEventListener('beforeunload', beforeUnload)
    return () => { window.removeEventListener('qazmind:request-test-exit', ask); window.removeEventListener('popstate', onPopState); window.removeEventListener('beforeunload', beforeUnload) }
  }, [attemptId])

  const finalizeSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    try { await testService.submitTest(attemptId, answers); navigate('/results/' + attemptId) } catch (error) { console.error(error); setSubmitting(false) }
  }
  const requestSubmit = () => {
    const missing = questions.filter((q) => !(q.id in answers)).length
    if (missing) { setSubmitOpen(true); return }
    finalizeSubmit()
  }
  const submit = requestSubmit
  const abandon = async () => {
    if (!attemptId) return navigate('/dashboard')
    setSubmitting(true)
    try { await testService.abandonTest(attemptId); navigate('/dashboard') } catch (error) { console.error(error); setSubmitting(false) }
  }
  if (loading) return <div className={shell + ' flex min-h-[65vh] items-center justify-center'}><div className="text-center"><span className="mx-auto mb-4 block h-8 w-8 animate-spin border-2 border-current border-t-transparent" /><p className="text-sm font-semibold">{c.load}</p></div></div>
  const question = questions[currentQuestionIndex]
  const answeredCount = questions.filter((q) => q.id in answers).length
  const progress = Math.round((answeredCount / Math.max(questions.length, 1)) * 100)
  return <div className={shell}><div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-10">
    <header className="border-b border-[#dce5df] pb-5 dark:border-white/10"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#7b8480] dark:text-white/45">{c.mode}</p><h1 className="mt-2 text-2xl font-semibold tracking-[-.05em] sm:text-3xl">{subject ? (ru ? subject.name_ru : subject.name_kz) : ''}</h1></div><div className="flex items-center gap-3"><button onClick={() => setExitOpen(true)} className="text-xs font-bold text-[#aa3934]">{c.exit}</button><Timer onTimeUp={finalizeSubmit} /></div></div><div className="mt-6"><div className="flex justify-between text-xs font-semibold"><span>{c.progress} · {answeredCount}/{questions.length} {c.answered}</span><span>{progress}%</span></div><div className="mt-2 h-1 bg-[#dce5df] dark:bg-white/15"><motion.div className="h-full bg-[#c9f53e]" animate={{ width: progress + '%' }} /></div></div></header>
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_210px]"><main><motion.section key={question.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-y border-[#b8c9c0] py-7 dark:border-white/20"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#7b8480] dark:text-white/45">{c.question} {currentQuestionIndex + 1}</p><h2 className="mt-4 text-xl font-semibold leading-8 tracking-[-.03em] sm:text-2xl">{question.text}</h2><div className="mt-8 divide-y divide-[#dce5df] border-y border-[#dce5df] dark:divide-white/10 dark:border-white/10">{question.options.map((option, index) => { const selected = answers[question.id] === index; return <button key={option} onClick={() => setAnswer(question.id, index)} className={selected ? 'flex w-full items-center gap-4 bg-[#eef5f0] px-4 py-5 text-left dark:bg-white/10' : 'flex w-full items-center gap-4 px-4 py-5 text-left transition hover:bg-[#eef5f0] dark:hover:bg-white/[.04]'}><span className={selected ? 'flex h-8 w-8 shrink-0 items-center justify-center bg-[#003f34] text-xs font-bold text-white dark:bg-[#c9f53e] dark:text-[#003f34]' : 'flex h-8 w-8 shrink-0 items-center justify-center border border-[#b8c9c0] text-xs font-bold dark:border-white/25'}>{String.fromCharCode(65 + index)}</span><span className="text-sm leading-6 sm:text-base">{option}</span></button> })}</div></motion.section><div className="mt-6 flex justify-between gap-3"><button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestion(currentQuestionIndex - 1)} className="border border-[#b8c9c0] px-4 py-3 text-sm font-bold disabled:opacity-30 dark:border-white/20">←</button>{currentQuestionIndex < questions.length - 1 ? <button onClick={() => setCurrentQuestion(currentQuestionIndex + 1)} className="bg-[#003f34] px-5 py-3 text-sm font-bold text-white dark:bg-[#c9f53e] dark:text-[#003f34]">→</button> : <button disabled={submitting} onClick={submit} className="bg-[#c9f53e] px-5 py-3 text-sm font-bold text-[#003f34] disabled:opacity-40">{submitting ? c.sending : c.finish}</button>}</div></main>
    <aside className="lg:sticky lg:top-24 lg:h-fit"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#7b8480] dark:text-white/45">{c.all}</p><div className="mt-4 grid grid-cols-5 gap-2">{questions.map((item, index) => <button key={item.id} onClick={() => setCurrentQuestion(index)} title={item.id in answers ? c.answered : c.unanswered} className={index === currentQuestionIndex ? 'aspect-square bg-[#003f34] text-xs font-bold text-white dark:bg-[#c9f53e] dark:text-[#003f34]' : item.id in answers ? 'aspect-square bg-[#c9f53e] text-xs font-bold text-[#003f34]' : 'aspect-square border border-[#dce5df] text-xs font-bold dark:border-white/15'}>{index + 1}</button>)}</div><button disabled={submitting} onClick={requestSubmit} className="mt-6 w-full border border-[#003f34] py-3 text-sm font-bold text-[#003f34] dark:border-[#c9f53e] dark:text-[#c9f53e]">{submitting ? c.sending : c.finish}</button></aside></div></div>
    <AnimatePresence>{exitOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-end bg-[#003f34]/55 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"><motion.section initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="w-full max-w-md bg-[#f7faf7] p-6 text-[#003f34] dark:bg-slate-950 dark:text-white sm:p-8"><span className="flex h-10 w-10 items-center justify-center bg-[#fce9e7] text-[#aa3934]"><Icon><path d="M12 8v5m0 3h.01M5.5 20h13a2 2 0 0 0 1.75-3l-6.5-11a2 2 0 0 0-3.5 0l-6.5 11a2 2 0 0 0 1.75 3Z" /></Icon></span><h2 className="mt-5 text-2xl font-semibold tracking-[-.05em]">{c.exitTitle}</h2><p className="mt-3 text-sm leading-6 text-[#5d6763] dark:text-white/60">{c.exitText}</p><div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button disabled={submitting} onClick={() => setExitOpen(false)} className="px-4 py-3 text-sm font-bold">{c.stay}</button><button disabled={submitting} onClick={abandon} className="bg-[#aa3934] px-4 py-3 text-sm font-bold text-white disabled:opacity-40">{c.confirmExit}</button></div></motion.section></motion.div>}</AnimatePresence>
    <AnimatePresence>{submitOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[81] flex items-end bg-[#003f34]/55 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"><motion.section initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="w-full max-w-md bg-[#f7faf7] p-6 text-[#003f34] dark:bg-slate-950 dark:text-white sm:p-8"><span className="flex h-10 w-10 items-center justify-center bg-[#fff3d9] text-[#8a5a00] dark:bg-amber-300/10 dark:text-amber-200"><Icon><path d="M12 8v5m0 3h.01M5.5 20h13a2 2 0 0 0 1.75-3l-6.5-11a2 2 0 0 0-3.5 0l-6.5 11a2 2 0 0 0 1.75 3Z" /></Icon></span><h2 className="mt-5 text-2xl font-semibold tracking-[-.05em]">{ru ? 'Отправить неполный тест?' : 'Толық емес тестті жіберу керек пе?'}</h2><p className="mt-3 text-sm leading-6 text-[#5d6763] dark:text-white/60">{ru ? 'Без ответа осталось: ' : 'Жауапсыз қалғаны: '}<strong>{questions.filter((item) => !(item.id in answers)).length}</strong>. {ru ? 'Неотвеченные вопросы будут засчитаны как неверные.' : 'Жауапсыз сұрақтар қате болып есептеледі.'}</p><div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button disabled={submitting} onClick={() => setSubmitOpen(false)} className="px-4 py-3 text-sm font-bold">{ru ? 'Вернуться к вопросам' : 'Сұрақтарға оралу'}</button><button disabled={submitting} onClick={finalizeSubmit} className="bg-[#003f34] px-4 py-3 text-sm font-bold text-white disabled:opacity-40 dark:bg-[#c9f53e] dark:text-[#003f34]">{ru ? 'Отправить тест' : 'Тестті жіберу'}</button></div></motion.section></motion.div>}</AnimatePresence>
  </div>
}
