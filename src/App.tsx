import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Medidor } from '@/components/Medidor'
import { Nav } from '@/components/Nav'
import { Palco, PalcoReserva, usePode3D } from '@/components/Palco'
import { devePreCarregar, Preloader } from '@/components/Preloader'
import { BotaoFlutuante, Rodape } from '@/components/Rodape'
import { scrollToSection, useSmoothScroll } from '@/hooks/useSmoothScroll'
import { useEfeitos } from '@/hooks/useEfeitos'
import { useRevela } from '@/hooks/useRevela'
import { Heroi } from '@/sections/Heroi'

// Pedido já no carregamento, em paralelo com o three.js.
const carregarResto = () => import('@/sections/Resto')
const Resto = lazy(carregarResto)
carregarResto()

/**
 * Uma página só, contada como uma história — "do caos à clareza": as peças
 * 3D ficam fixas atrás de tudo e se organizam de capítulo em capítulo
 * (lib/capitulos.ts); as seções opacas passam por cima como páginas.
 */
export default function App() {
  const raiz = useRef<HTMLDivElement>(null)
  const pode3D = usePode3D()
  useSmoothScroll()
  useMouseNaRaiz()
  useRevela()
  useEfeitos()

  const [abertura] = useState(() => devePreCarregar())
  const [pronto, setPronto] = useState(!abertura)
  const aoTerminar = useCallback(() => setPronto(true), [])

  return (
    <>
      {abertura && <Preloader aoTerminar={aoTerminar} />}
      <a
        href="#conteudo"
        className="sr-only rounded-full bg-white px-5 py-2 text-xs text-tinta focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300]"
      >
        Pular para o conteúdo
      </a>
      <Nav aoIr={scrollToSection} />
      <main id="conteudo" ref={raiz} className="relative">
        {pode3D ? <Palco raiz={raiz} abertura={abertura} /> : <PalcoReserva />}
        <Heroi pronto={pronto} aoIr={scrollToSection} />
        <Suspense fallback={<div className="min-h-[400vh]" />}>
          <Resto />
        </Suspense>
      </main>
      <Rodape aoIr={scrollToSection} />
      <BotaoFlutuante />
      <Medidor />
    </>
  )
}

/** Escreve a posição do mouse (−1…1) em --mx/--my na raiz: o parallax de ponteiro do CSS. */
function useMouseNaRaiz() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    let raf = 0
    let x = 0
    let y = 0
    const mover = (e: PointerEvent) => {
      x = (e.clientX / window.innerWidth) * 2 - 1
      y = (e.clientY / window.innerHeight) * 2 - 1
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = document.documentElement.style
        r.setProperty('--mx', x.toFixed(3))
        r.setProperty('--my', y.toFixed(3))
      })
    }
    window.addEventListener('pointermove', mover, { passive: true })
    return () => window.removeEventListener('pointermove', mover)
  }, [])
}
