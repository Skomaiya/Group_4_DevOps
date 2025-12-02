import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// Get base URL from environment variable or use default
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Create axios instance with base configuration
const axiosClient = axios.create({
  baseURL: `${baseURL}/api/`,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token if present
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem('access_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      } else if (config.headers) {
        // Explicitly remove Authorization header if no token
        delete config.headers.Authorization
      }
    } catch (e) {
      // localStorage not available (e.g., SSR)
      console.warn('localStorage not available:', e)
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error logging
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Log all errors for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    return Promise.reject(error)
  }
)

export default axiosClient
