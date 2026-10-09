import { type ComponentType, useEffect, useRef, useState } from 'react'
import { armarCenas } from '@/lib/cenas'
import { carregarMotor, parallaxDeclarativo } from '@/lib/movimento'
import { Bilhetes } from './Bilhetes'
import { Ciencia } from './Ciencia'
import { Diario } from './Diario'
import { Duvidas } from './Duvidas'
import { Familias } from './Familias'
import { Fecho } from './Fecho'
import { Maia } from './Maia'
import { Manifesto } from './Manifesto'
import { Motivo } from './Motivo'
import { Plataforma } from './Plataforma'
import { Ponte } from './Ponte'
import { Rede } from './Rede'
import { Trajetoria } from './Trajetoria'

/** A ordem alterna capítulos da cena (transparentes, `data-3d`) e páginas opacas (`data-opaco`). */
const SECOES: ComponentType[] = [Bilhetes, Motivo, Ponte, Diario, Familias, Rede, Plataforma, Maia, Manifesto, Ciencia, Trajetoria, Duvidas, Fecho]

/** Quantas entram de cara: o que a pessoa alcança nos primeiros segundos. */
const DE_CARA = 2

/** Avisa quem varre a página (revelar, barra, ímã) que chegaram seções novas. */
export const EVENTO_SECOES = 'emotrack:secoes'

// O Safari não tem requestIdleCallback: lá, um intervalo curto faz o papel.
const temOcioso = typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function'
const ocioso = (fn: () => void) => (temOcioso ? window.requestIdleCallback(fn, { timeout: 400 }) : window.setTimeout(fn, 60))
const cancelarOcioso = (id: number) => (temOcioso ? window.cancelIdleCallback(id) : window.clearTimeout(id))

/**
 * Tudo depois do herói. As seções entram em etapas, uma por vez quando o
 * navegador está ocioso: montar a página inteira de uma vez custava quase
 * um segundo de layout no celular, e era exatamente quando a pessoa começa
 * a rolar depois do herói. Cada etapa arma os efeitos dos elementos novos.
 */
export default function Resto() {
  const ref = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(DE_CARA)
  const ctx = useRef<gsap.Context | null>(null)

  useEffect(() => {
    if (n >= SECOES.length) return
    const id = ocioso(() => setN((x) => x + 1))
    return () => cancelarOcioso(id)
  }, [n])

  useEffect(() => {
    window.dispatchEvent(new Event(EVENTO_SECOES))
    const raiz = ref.current
    if (!raiz || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cancelado = false
    carregarMotor()
      .then((motor) => {
        if (cancelado) return
        ctx.current ??= motor.gsap.context(() => {}, raiz)
        const c = ctx.current
        c.add(() => {
          parallaxDeclarativo(motor, raiz, c)
          armarCenas(motor, raiz, !window.matchMedia('(min-width: 1024px)').matches, c)
        })
      })
      .catch(() => {})
    return () => {
      cancelado = true
    }
  }, [n])

  useEffect(() => () => ctx.current?.revert(), [])

  return (
    <div ref={ref}>
      {SECOES.slice(0, n).map((S, i) => (
        <S key={i} />
      ))}
    </div>
  )
}
