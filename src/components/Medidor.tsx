import { useEffect, useRef } from 'react'
import { MARCA } from '@/lib/cores'
import { Peca } from './Peca'

/**
 * O medidor "caos → clareza": o progresso da página inteira numa régua, com
 * uma peça que sai torta do caos e chega reta na clareza. Só no desktop
 * (no celular, o canto é do botão de baixar o app).
 */
export function Medidor() {
  const raiz = useRef<HTMLDivElement>(null)
  const barra = useRef<HTMLDivElement>(null)
  const peca = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const quadro = () => {
      raf = 0
      const total = document.documentElement.scrollHeight - window.innerHeight
      const p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0
      raiz.current?.classList.toggle('opacity-0', window.scrollY < window.innerHeight * 0.4)
      if (barra.current) barra.current.style.transform = `scaleX(${p.toFixed(4)})`
      if (peca.current) {
        // No começo, a peça treme e gira; perto do fim, assenta.
        const giro = (1 - p) * 180 + Math.sin(p * 40) * 18 * (1 - p)
        peca.current.style.transform = `translateX(${(p * 140).toFixed(1)}px) rotate(${giro.toFixed(1)}deg)`
      }
    }
    const aoRolar = () => {
      if (!raf) raf = requestAnimationFrame(quadro)
    }
    quadro()
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
    }
  }, [])

  return (
    <div
      ref={raiz}
      aria-hidden
      className="pointer-events-none fixed bottom-6 left-6 z-40 hidden items-center gap-3 rounded-full bg-noite/80 py-2.5 pr-4 pl-4 text-[0.68rem] font-semibold tracking-widest text-white/70 uppercase ring-1 ring-white/10 transition-opacity duration-500 lg:flex"
    >
      <span>Caos</span>
      <div className="relative h-5 w-[140px]">
        <div className="absolute top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-white/15" />
        <div ref={barra} className="arco-gradiente absolute top-[9px] h-0.5 w-full origin-left rounded-full" />
        <div ref={peca} className="absolute top-0 -left-2.5 size-5">
          <Peca cor={MARCA.amarelo} humor={1} rosto={false} className="size-5" />
        </div>
      </div>
      <span className="text-white">Clareza</span>
    </div>
  )
}
