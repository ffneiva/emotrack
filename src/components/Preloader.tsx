import { useEffect, useState } from 'react'
import { ARCO } from '@/lib/cores'
import { cn } from '@/lib/utils'
import { aoCenaPronta } from './Palco'
import { Peca } from './Peca'

const CHAVE = 'emotrack-abertura'

/** A abertura só na primeira visita da sessão e nunca nas capturas de tela. */
export function devePreCarregar(): boolean {
  if (typeof window === 'undefined') return false
  if (new URLSearchParams(window.location.search).has('foto')) return false
  try {
    return !sessionStorage.getItem(CHAVE)
  } catch {
    return true
  }
}

/**
 * A cortina de abertura: as sete peças do logotipo chegam uma a uma e se
 * encaixam no arco, enquanto a cena compila por trás. Sobe quando a cena
 * pinta o primeiro quadro — ou em 4,5 s —, e nunca antes de 2 s.
 */
export function Preloader({ aoTerminar }: { aoTerminar: () => void }) {
  const [saindo, setSaindo] = useState(false)
  const [fora, setFora] = useState(false)
  const [montou, setMontou] = useState(false)

  useEffect(() => {
    const inicio = performance.now()
    let pronta = false
    let saiu = false
    const parar = aoCenaPronta(() => {
      pronta = true
    })
    const t0 = window.setTimeout(() => setMontou(true), 60)
    let t1 = 0
    let t2 = 0
    const iv = window.setInterval(() => {
      const t = performance.now() - inicio
      if (!saiu && ((pronta && t > 2000) || t > 4500)) {
        saiu = true
        setSaindo(true)
        try {
          sessionStorage.setItem(CHAVE, '1')
        } catch {
          // Aba privada: a abertura volta na próxima visita, sem problema.
        }
        t1 = window.setTimeout(aoTerminar, 450)
        t2 = window.setTimeout(() => setFora(true), 1500)
        window.clearInterval(iv)
      }
    }, 80)
    return () => {
      window.clearInterval(iv)
      window.clearTimeout(t0)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      parar()
    }
  }, [aoTerminar])

  if (fora) return null

  // As peças no arco: de 200° a 0°, como no logotipo.
  const r = 92
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[200] grid place-items-center bg-noite transition-[clip-path] duration-[1200ms] ease-[var(--ease-sh)]"
      style={{ clipPath: saindo ? 'circle(0% at 50% 45%)' : 'circle(150% at 50% 45%)' }}
    >
      <div className={cn('flex flex-col items-center transition-all duration-700', saindo && 'scale-90 opacity-0')}>
        <div className="relative h-[130px] w-[240px]">
          {ARCO.map((c, i) => {
            const a = ((200 - (200 * (i + 0.5)) / ARCO.length) * Math.PI) / 180
            const x = 120 + Math.cos(a) * r
            const y = 110 - Math.sin(a) * r
            const giro = 90 - (a * 180) / Math.PI
            return (
              <div
                key={i}
                className="absolute top-0 left-0 size-11 transition-[transform,opacity] duration-[900ms] ease-[var(--ease-sh)]"
                style={{
                  transform: montou
                    ? `translate(${x - 22}px, ${y - 22}px) rotate(${giro}deg)`
                    : `translate(${x - 22 + (i % 2 ? 140 : -140)}px, ${y - 22 + (i - 3) * 50}px) rotate(${giro + 220}deg)`,
                  opacity: montou ? 1 : 0,
                  transitionDelay: `${i * 110}ms`,
                }}
              >
                <Peca cor={c} humor={1} className="size-full" />
              </div>
            )
          })}
        </div>
        <p className="mt-6 text-4xl font-medium tracking-tight text-white">Emotrack</p>
        <p className="rotulo mt-3 text-white/55">Cada registro, uma peça</p>
      </div>
    </div>
  )
}
