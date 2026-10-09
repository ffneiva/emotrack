import { type RefObject, useEffect } from 'react'
import { carregarMotor, type Motor } from '@/lib/movimento'

/**
 * Arma as animações de uma seção quando o GSAP chega.
 *
 * Tudo dentro de um `gsap.context` com escopo na seção: na desmontagem, os
 * ScrollTriggers e tweens dela somem juntos. Antes de o motor chegar — e para
 * sempre, se ele falhar — a seção já é uma composição estática completa.
 */
export function useMotor(
  ref: RefObject<HTMLElement | null>,
  armar: (motor: Motor, raiz: HTMLElement, calmo: boolean, ctx: gsap.Context) => void,
) {
  useEffect(() => {
    const raiz = ref.current
    if (!raiz) return
    let cancelado = false
    let desfazer: (() => void) | undefined
    const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    carregarMotor()
      .then((motor) => {
        if (cancelado) return
        const ctx = motor.gsap.context((self) => armar(motor, raiz, calmo, self), raiz)
        desfazer = () => ctx.revert()
      })
      .catch(() => {})
    return () => {
      cancelado = true
      desfazer?.()
    }
    // `armar` é estável por seção (definida no módulo ou memoizada).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])
}
