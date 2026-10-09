import { useEffect, useState } from 'react'
import { LINKS as EXTERNOS } from '@/lib/links'
import { cn } from '@/lib/utils'
import { IconeFechar, IconePlay } from './Icones'
import { Logo } from './Logo'

export const SECOES = [
  { id: 'familias', rotulo: 'Para famílias' },
  { id: 'profissionais', rotulo: 'Para profissionais' },
  { id: 'maia', rotulo: 'Maia' },
  { id: 'ciencia', rotulo: 'Ciência' },
  { id: 'duvidas', rotulo: 'Dúvidas' },
] as const

/** O tema do que está passando por baixo da barra (as seções marcam `data-tema`). */
function useTemaSobABarra() {
  const [escuro, setEscuro] = useState(true)
  useEffect(() => {
    let raf = 0
    const medir = () => {
      raf = 0
      const els = document.elementsFromPoint(window.innerWidth / 2, 36)
      const sec = els.map((e) => e.closest<HTMLElement>('[data-tema]')).find(Boolean)
      setEscuro((sec?.dataset.tema ?? 'escuro') === 'escuro')
    }
    const aoRolar = () => {
      if (!raf) raf = requestAnimationFrame(medir)
    }
    medir()
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar)
    return () => {
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
    }
  }, [])
  return escuro
}

/** Navegação fixa em pílula de vidro: some ao descer, volta ao subir, e troca de tom com o fundo. */
export function Nav({ aoIr }: { aoIr: (id: string) => void }) {
  const [oculta, setOculta] = useState(false)
  const [menu, setMenu] = useState(false)
  const escuro = useTemaSobABarra()

  useEffect(() => {
    let ultimo = window.scrollY
    const aoRolar = () => {
      const y = window.scrollY
      if (Math.abs(y - ultimo) > 6) {
        setOculta(y > ultimo && y > 400)
        ultimo = y
      }
    }
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = menu ? 'hidden' : ''
    if (!menu) return
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(false)
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [menu])

  const ir = (id: string) => {
    setMenu(false)
    aoIr(id)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-700 ease-[var(--ease-sh)] sm:px-5 sm:pt-4',
          oculta && !menu ? '-translate-y-[130%]' : 'translate-y-0',
        )}
      >
        <div
          className={cn(
            'mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full pr-2 pl-5 transition-colors duration-500 sm:h-16 sm:pl-6',
            escuro || menu ? 'vidro-escuro text-white' : 'vidro-claro text-tinta',
          )}
        >
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault()
              ir('inicio')
            }}
            aria-label="Emotrack — início"
          >
            <Logo className="h-7 w-auto sm:h-8" />
          </a>
          <nav aria-label="Seções" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {SECOES.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      ir(l.id)
                    }}
                    className="text-[0.84rem] font-medium opacity-75 transition-opacity hover:opacity-100"
                  >
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href={EXTERNOS.googlePlay} target="_blank" rel="noopener noreferrer" className="btn btn-rosa hidden !py-2.5 !text-[0.8rem] sm:inline-flex">
              <IconePlay className="size-3.5" /> Baixar o app
            </a>
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-expanded={menu}
              aria-controls="menu-movel"
              className="grid size-10 place-items-center rounded-full border border-current/20 lg:hidden"
            >
              <span className="sr-only">{menu ? 'Fechar menu' : 'Abrir menu'}</span>
              {menu ? (
                <IconeFechar className="size-5" />
              ) : (
                <span aria-hidden className="flex w-5 flex-col items-end gap-1.5">
                  <span className="h-0.5 w-5 rounded bg-current" />
                  <span className="h-0.5 w-3 rounded bg-current" />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-movel"
        className={cn(
          'fixed inset-0 z-40 flex flex-col justify-end bg-noite/96 px-6 pt-24 pb-10 backdrop-blur-xl transition-[opacity,visibility] duration-500 lg:hidden',
          menu ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <div className="arco-gradiente mb-8 h-1 w-24 rounded-full" />
        <ul className="space-y-1">
          {SECOES.map((l, i) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  ir(l.id)
                }}
                className="titulo flex items-baseline gap-4 py-2 text-4xl text-white"
              >
                <span className="rotulo text-ciano-claro">0{i + 1}</span>
                {l.rotulo}
              </a>
            </li>
          ))}
        </ul>
        <a href={EXTERNOS.googlePlay} target="_blank" rel="noopener noreferrer" className="btn btn-rosa mt-10">
          <IconePlay className="size-4" /> Baixar o app grátis
        </a>
        <a href={EXTERNOS.plataforma} target="_blank" rel="noopener noreferrer" className="btn btn-linha mt-3 text-white">
          Plataforma profissional
        </a>
      </div>
    </>
  )
}
