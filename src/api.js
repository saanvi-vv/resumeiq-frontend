import axios from 'axios'

const BASE_URL = 'https://resumeiq-backend-q2f1.onrender.com/'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/users/me')

// Analysis
export const analyzeResume = (formData) => api.post('/analyze', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const getAnalyses = () => api.get('/analyses')
export const getAnalysis = (id) => api.get(`/analyses/${id}`)
export const deleteAnalysis = (id) => api.delete(`/analyses/${id}`)
export const exportAnalysis = (id) => api.get(`/analyses/${id}/export`, {
  responseType: 'blob'
})