import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/shared/api/errors'

/**
 * Política de cache, retries e sincronização (documentada no ARCHITECTURE.md):
 * - staleTime 30s: catálogo/detalhe não refazem fetch ao navegar de volta.
 *   Preço e disponibilidade ficam frescos via Socket.IO (nft.updated).
 * - gcTime 5min: dados em cache sobrevivem a navegações curtas.
 * - retry: só para falhas transitórias/rede e no máximo 2 vezes. Erros de
 *   negócio (4xx) nunca repetem. Mutations NÃO repetem automaticamente:
 *   o reenvio de pedidos é feito com chave de idempotência.
 * - refetchOnWindowFocus desligado: a reconciliação é por evento/reconexão.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) =>
        error instanceof ApiError && error.retryable && failureCount < 2,
      retryDelay: (attempt) => Math.min(400 * 2 ** attempt, 3000),
    },
    mutations: { retry: false },
  },
})
