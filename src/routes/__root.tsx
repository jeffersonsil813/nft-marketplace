import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { ShoppingCart, Search } from 'lucide-react'
import { Button } from '@/shared/ui/button'

const nav = [
  { label: 'Início', to: '/' },
  { label: 'Mercado', to: '/' },
  { label: 'Criadores', to: '/' },
  { label: 'Aprenda', to: '/' },
] as const

function RootLayout() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[1200px] flex-col px-4 sm:px-6">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>
      <header className="flex items-center justify-between border-b border-border py-4">
        <Link to="/" className="text-sm font-bold tracking-widest">
          KURIO
        </Link>
        <nav aria-label="Principal" className="hidden gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-sm text-foreground/90 hover:text-primary [&.active]:font-bold [&.active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Buscar">
            <Search className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Carrinho">
            <ShoppingCart className="size-5" />
          </Button>
          <Button size="sm">Entrar</Button>
        </div>
      </header>
      <main id="conteudo" className="flex-1 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <section className="py-20 text-center" aria-labelledby="nf-title">
      <h1 id="nf-title" className="text-2xl font-bold">
        Página não encontrada
      </h1>
      <p className="mt-2 text-muted">O endereço que você acessou não existe no Kurio.</p>
      <Button asChild className="mt-6">
        <Link to="/">Voltar ao início</Link>
      </Button>
    </section>
  ),
})
