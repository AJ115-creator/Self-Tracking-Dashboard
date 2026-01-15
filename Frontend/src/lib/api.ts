import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const STORAGE_KEY_TOKEN = 'vigility_auth_token'
const STORAGE_KEY_USER = 'vigility_auth_user'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig

    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    // Don't retry tracking requests - they're fire-and-forget
    if (originalRequest.url?.includes('/track')) {
      console.warn('[Auth] Tracking request failed with 401, ignoring')
      return Promise.reject(error)
    }

    console.warn('[Auth] 401 Unauthorized - Logging out')
    handleSignOut()

    return Promise.reject(error)
  }
)

const handleSignOut = () => {
  localStorage.removeItem(STORAGE_KEY_TOKEN)
  localStorage.removeItem(STORAGE_KEY_USER)

  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login'
  }
}

export const trackEvent = async (featureName: string) => {
  return api.post('/track', { feature_name: featureName })
}

export interface AnalyticsParams {
  start_date?: string
  end_date?: string
  age_group?: string
  gender?: string
  feature_name?: string
}

export const getAnalytics = async (params: AnalyticsParams) => {
  const searchParams = new URLSearchParams()

  if (params.start_date) searchParams.append('start_date', params.start_date)
  if (params.end_date) searchParams.append('end_date', params.end_date)
  if (params.age_group) searchParams.append('age_group', params.age_group)
  if (params.gender) searchParams.append('gender', params.gender)
  if (params.feature_name) searchParams.append('feature_name', params.feature_name)

  return api.get(`/analytics?${searchParams.toString()}`)
}
