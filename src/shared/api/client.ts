import axios from 'axios'
import { toApiError } from './errors'

/**
 * Único ponto de saída HTTP da aplicação. Não há respostas fictícias aqui:
 * quem responde é o MSW, na camada de rede (src/mocks).
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})

let accessToken: string | null = null
export const setAccessToken = (token: string | null) => {
  accessToken = token
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

/** Callback registrado pelo módulo de auth para reagir a sessão expirada. */
let onSessionExpired: (() => void) | null = null
export const setSessionExpiredHandler = (fn: (() => void) | null) => {
  onSessionExpired = fn
}

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error)
    if (apiError.code === 'SESSION_EXPIRED') onSessionExpired?.()
    return Promise.reject(apiError)
  },
)
