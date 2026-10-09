import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Medidor } from '@/components/Medidor'
import { Nav } from '@/components/Nav'
import { Palco, PalcoReserva, usePode3D } from '@/components/Palco'
import { BotaoFlutuante, Rodape } from '@/components/Rodape'
import { scrollToSection } from '@/lib/rolarPara'
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
  useMouseNaRaiz()
  useRevela()
  useEfeitos()

  // Sem cortina de abertura: o texto aparece na hora e as peças entram quando
  // a cena fica pronta. O "pronto" só espera o primeiro quadro, para a
  // entrada do título ser vista.
  const [pronto, setPronto] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setPronto(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only rounded-full bg-white px-5 py-2 text-xs text-tinta focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300]"
      >
        Pular para o conteúdo
      </a>
      <Nav aoIr={scrollToSection} />
      <main id="conteudo" ref={raiz} className="relative">
        {pode3D ? <Palco raiz={raiz} /> : <PalcoReserva />}
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
