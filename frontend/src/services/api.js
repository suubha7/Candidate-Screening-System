import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
})

// ── Candidate ──────────────────────────────────────────────────────────────
export const uploadResume = async (formData) => {
  const { data } = await api.post('/upload_resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// ── Roles ──────────────────────────────────────────────────────────────────
export const getRoles = async () => {
  const { data } = await api.get('/get_roles')
  return data
}

export const createRole = async (payload) => {
  const { data } = await api.post('/create_role', payload)
  return data
}

// ── Interview ──────────────────────────────────────────────────────────────
export const startInterview = async (payload) => {
  const { data } = await api.post('/start-interview', payload)
  return data
}

export const generateQuestion = async (sessionId) => {
  const { data } = await api.get(`/generate-question/${sessionId}`)
  return data
}

export const nextQuestion = async (payload) => {
  const { data } = await api.post('/next-question', payload)
  return data
}

export const endInterview = async (sessionId) => {
  const { data } = await api.post(`/end-interview/${sessionId}`)
  return data
}

export const getReport = async (sessionId) => {
  const { data } = await api.get(`/report/${sessionId}`)
  return data
}

export const getSession = async (sessionId) => {
  const { data } = await api.get(`/session/${sessionId}`)
  return data
}

export const getInterviewQA = async (sessionId) => {
  const { data } = await api.get(`/interview/${sessionId}`)
  return data
}

export default api
