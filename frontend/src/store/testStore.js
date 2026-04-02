import { create } from 'zustand'

export const useTestStore = create((set) => ({
  attemptId: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  timeRemaining: 20 * 60, // 20 minutes in seconds
  
  setAttemptId: (id) => set({ attemptId: id }),
  
  setQuestions: (questions) => set({ questions }),
  
  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
  
  nextQuestion: () => set((state) => ({
    currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1)
  })),
  
  prevQuestion: () => set((state) => ({
    currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
  })),
  
  setAnswer: (questionId, answerIndex) => set((state) => ({
    answers: {
      ...state.answers,
      [questionId]: answerIndex
    }
  })),
  
  decrementTime: () => set((state) => ({
    timeRemaining: Math.max(state.timeRemaining - 1, 0)
  })),
  
  resetTest: () => set({
    attemptId: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: 20 * 60
  }),
}))
