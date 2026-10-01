import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'

/**
 * Skeleton com shimmer. Sempre receba as dimensões finais do conteúdo via
 * className (h-*, w-*, aspect-*) para não causar deslocamento de layout (CLS).
 */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div aria-hidden="true" className={cn('skeleton rounded-md', className)} {...props} />
}
