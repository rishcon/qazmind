import api from '../utils/api'

export const authService = {
  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password })
    return response.data
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  getCurrentProfile: async (token) => {
    const response = await api.get('/profile/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    })
    return response.data
  },

  sendPasswordResetCode: async (email) => {
    const response = await api.post('/auth/password-reset/send-code', { email })
    return response.data
  },

  verifyPasswordResetCode: async (email, code) => {
    const response = await api.post('/auth/password-reset/verify-code', { email, code })
    return response.data
  },

  resetPassword: async (email, code, newPassword) => {
    const response = await api.post('/auth/password-reset/reset', {
      email,
      code,
      new_password: newPassword
    })
    return response.data
  },
}

export const testService = {
  createTest: async (subjectId, language, count = 20, mode = 'new') => {
    const response = await api.post('/tests/new', {
      subject_id: subjectId,
      language,
      count,
      mode
    })
    return response.data
  },

  submitTest: async (attemptId, answers) => {
    const response = await api.post(`/tests/${attemptId}/submit`, { answers })
    return response.data
  },

  getTestResult: async (attemptId) => {
    const response = await api.get(`/tests/${attemptId}/result`)
    return response.data
  },
}

export const questionService = {
  explainError: async (questionId, attemptId, userAnswerIndex, language) => {
    const response = await api.post(`/questions/${questionId}/explain`, {
      attempt_id: attemptId,
      user_answer_index: userAnswerIndex,
      language
    })
    return response.data
  },
}

export const tutorService = {
  getTopics: async (subjectId) => {
    const response = await api.get(`/tutor/subjects/${subjectId}/topics`)
    return response.data
  },

  startSession: async (subjectId, topic, language) => {
    const response = await api.post('/tutor/session', {
      subject_id: subjectId,
      topic,
      language,
    })
    return response.data
  },

  getSession: async (sessionId) => {
    const response = await api.get(`/tutor/session/${sessionId}`)
    return response.data
  },

  reviewAnswer: async (sessionId, answerText, language) => {
    const response = await api.post(`/tutor/session/${sessionId}/review`, {
      answer_text: answerText,
      language,
    })
    return response.data
  },
}

export const feedbackService = {
  submitFeedback: async (questionId, type, comment) => {
    const response = await api.post('/feedback/question', {
      question_id: questionId,
      type,
      comment
    })
    return response.data
  },
}

export const adminService = {
  getSubjects: async () => {
    const response = await api.get('/admin/subjects')
    return response.data
  },
}
