import axios from 'axios'

/** Códigos de erro do contrato REST (ver ARCHITECTURE.md). */
export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'SESSION_EXPIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'AVAILABILITY_CONFLICT'
  | 'PRICE_CHANGED'
  | 'TRANSIENT'
  | 'NETWORK'
  | 'TIMEOUT'
  | 'UNKNOWN'

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly status: number | null
  readonly fieldErrors: Record<string, string>

  constructor(init: {
    code: ApiErrorCode
    message: string
    status?: number | null
    fieldErrors?: Record<string, string>
  }) {
    super(init.message)
    this.name = 'ApiError'
    this.code = init.code
    this.status = init.status ?? null
    this.fieldErrors = init.fieldErrors ?? {}
  }

  /** Falhas que valem nova tentativa automática (nunca em mutations de pedido). */
  get retryable() {
    return this.code === 'TRANSIENT' || this.code === 'NETWORK' || this.code === 'TIMEOUT'
  }
}

interface ErrorBody {
  code?: ApiErrorCode
  message?: string
  fieldErrors?: Record<string, string>
}

/** Converte qualquer falha do Axios num ApiError tipado, em um único lugar. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (axios.isAxiosError<ErrorBody>(error)) {
    if (axios.isCancel(error)) {
      return new ApiError({ code: 'UNKNOWN', message: 'Requisição cancelada.' })
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError({ code: 'TIMEOUT', message: 'A requisição demorou demais.' })
    }
    if (!error.response) {
      return new ApiError({ code: 'NETWORK', message: 'Sem conexão com o servidor.' })
    }
    const { status, data } = error.response
    const fallback: ApiErrorCode =
      status === 401 ? 'UNAUTHENTICATED' : status === 403 ? 'FORBIDDEN' : status === 404 ? 'NOT_FOUND'
      : status === 409 ? 'CONFLICT' : status === 422 ? 'VALIDATION_ERROR' : status >= 500 ? 'TRANSIENT' : 'UNKNOWN'
    return new ApiError({
      code: data?.code ?? fallback,
      message: data?.message ?? 'Não foi possível concluir a operação.',
      status,
      fieldErrors: data?.fieldErrors,
    })
  }
  return new ApiError({ code: 'UNKNOWN', message: 'Erro inesperado.' })
}
