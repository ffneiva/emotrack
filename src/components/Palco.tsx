import { type RefObject, useEffect, useRef, useState } from 'react'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { capitulo, capituloDaRolagem } from '@/lib/capitulos'
import { publicarCapitulo } from '@/lib/rolagem'
import { cn } from '@/lib/utils'
import { DIAS } from '@/lib/semana'
import type { Leitura, Pecas } from '@/scene/pecas'

let suporte: boolean | null = null
function suportaWebGL(): boolean {
  if (suporte !== null) return suporte
  try {
    suporte = Boolean(document.createElement('canvas').getContext('webgl2'))
  } catch {
    suporte = false
  }
  return suporte
}

/**
 * A cena existe? Basta WebGL 2 — em qualquer tela.
 *
 * NÃO depende de "reduzir movimento": no Windows, "Efeitos de animação"
 * desligado liga essa preferência sem a pessoa saber. Com ela, a cena roda
 * em modo calmo: só se move quando a própria pessoa rola.
 */
export function usePode3D(): boolean {
  return typeof window !== 'undefined' && suportaWebGL()
}

/* A cena, para quem precisa falar com ela (o diário interativo). */
let cenaAtual: Pecas | null = null
const esperando = new Set<(c: Pecas) => void>()
export function comCena(fn: (c: Pecas) => void) {
  if (cenaAtual) fn(cenaAtual)
  else esperando.add(fn)
}

let pronta = false
const avisos = new Set<() => void>()
export function aoCenaPronta(fn: () => void): () => void {
  if (pronta) fn()
  else avisos.add(fn)
  return () => avisos.delete(fn)
}
function marcarPronta() {
  pronta = true
  for (const f of avisos) f()
  avisos.clear()
}

type Grupo = 'ponte' | 'padroes' | 'rede' | 'maia'
const ROTULOS: { id: string; texto: string; sub?: string; grupo: Grupo; tom?: 'claro' }[] = [
  { id: 'casa', texto: 'Casa', sub: 'a família registra', grupo: 'ponte' },
  { id: 'terapia', texto: 'Terapia', sub: 'o profissional decide', grupo: 'ponte' },
  ...DIAS.map((d, i) => ({ id: `dia-${i}`, texto: d, grupo: 'padroes' as const })),
  { id: 'familia', texto: 'Família', sub: 'registra o dia a dia', grupo: 'rede' },
  { id: 'escola', texto: 'Escola', sub: 'acompanha a rotina', grupo: 'rede' },
  { id: 'profissional', texto: 'Profissionais', sub: 'decidem com dados', grupo: 'rede' },
  { id: 'maia', texto: 'Maia', sub: 'sua assistente inteligente', grupo: 'maia', tom: 'claro' },
]

/** Uma janela suave em torno de um capítulo (0 fora, 1 dentro). */
function janela(s: number, de: number, ate: number, borda = 0.45) {
  const entra = Math.min(1, Math.max(0, (s - (de - borda)) / borda))
  const sai = Math.min(1, Math.max(0, (ate + borda - s) / borda))
  return Math.min(entra, sai)
}

type Props = { raiz: RefObject<HTMLElement | null>; abertura: boolean }

/**
 * O palco: um canvas fixo atrás da página inteira, com as peças voando de
 * capítulo em capítulo. Quando uma seção opaca cobre a tela inteira, o laço
 * de render para: nada é desenhado por baixo dela.
 */
export function Palco({ raiz, abertura }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotulosRef = useRef<Record<string, HTMLDivElement | null>>({})
  const grupos = useRef<Record<Grupo, number>>({ ponte: 0, padroes: 0, rede: 0, maia: 0 })
  const [pintou, setPintou] = useState(false)
  const [coberto, setCoberto] = useState(false)
  const desktop = useIsDesktop()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelado = false
    let limpar: (() => void) | undefined
    const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    import('@/scene/pecas')
      .then(({ Pecas }) => {
        if (cancelado) return
        const cena = new Pecas(canvas, { compacto: !desktop, calmo })
        cenaAtual = cena
        for (const f of esperando) f(cena)
        esperando.clear()

        const medir = () => cena.redimensionar(window.innerWidth, window.innerHeight)
        medir()
        window.addEventListener('resize', medir)

        let cobertoAgora = false
        const aoRolar = () => {
          const r = raiz.current
          if (!r) return
          const s = capituloDaRolagem(r, window.innerHeight / 2)
          cena.definirProgresso(s)
          publicarCapitulo(s)
          const g = grupos.current
          g.ponte = janela(s, capitulo('ponte'), capitulo('ponte'))
          g.padroes = janela(s, capitulo('padroes'), capitulo('padroes'))
          g.rede = janela(s, capitulo('rede'), capitulo('rede'))
          g.maia = janela(s, capitulo('maia'), capitulo('maia'))
          let cobre = false
          for (const el of r.querySelectorAll<HTMLElement>('[data-opaco]')) {
            const b = el.getBoundingClientRect()
            if (b.top <= 0 && b.bottom >= window.innerHeight) {
              cobre = true
              break
            }
          }
          if (cobre !== cobertoAgora) {
            cobertoAgora = cobre
            setCoberto(cobre)
            if (cobre) cena.pausar()
            else if (!document.hidden) cena.iniciar()
          }
        }
        const aoMover = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          cena.definirPonteiro((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1))
        }
        const aoSair = () => cena.sairPonteiro()

        // Arrastar gira a formação — de qualquer ponto das seções 3D que não
        // seja link, botão ou texto. No toque, só na horizontal (a vertical
        // continua rolando a página: as seções 3D têm touch-action: pan-y).
        let ativo = false
        let ux = 0
        let uy = 0
        let ut = 0
        let andou = 0
        const livre = (e: PointerEvent) => {
          const alvo = e.target as Element | null
          if (!alvo?.closest('[data-3d]')) return false
          return !alvo.closest('a, button, input, select, textarea, label, [role="button"], [data-painel]')
        }
        const baixo = (e: PointerEvent) => {
          if (e.button !== 0 || cobertoAgora || !livre(e)) return
          ativo = true
          andou = 0
          ux = e.clientX
          uy = e.clientY
          ut = performance.now()
        }
        const arrastando = (e: PointerEvent) => {
          if (!ativo) return
          const agora = performance.now()
          const dx = e.clientX - ux
          const dy = e.pointerType === 'mouse' ? e.clientY - uy : 0
          andou += Math.hypot(dx, dy)
          if (andou > 4) {
            document.documentElement.classList.add('girando')
            cena.arrastar(dx, dy, (agora - ut) / 1000)
          }
          ux = e.clientX
          uy = e.clientY
          ut = agora
        }
        const cima = () => {
          if (!ativo) return
          ativo = false
          document.documentElement.classList.remove('girando')
          cena.soltar()
        }
        const aoTrocarAba = () => {
          if (document.hidden) cena.pausar()
          else if (!cobertoAgora) cena.iniciar()
        }

        cena.aoQuadro = (l: Leitura) => {
          const g = grupos.current
          // Os rótulos que não são da formação atual somem.
          for (const [id, el] of Object.entries(rotulosRef.current)) {
            if (el && !l.rotulos.some((r) => r.id === id)) el.style.opacity = '0'
          }
          for (const r of l.rotulos) {
            const el = rotulosRef.current[r.id]
            if (!el) continue
            const def = ROTULOS.find((x) => x.id === r.id)
            const op = def ? g[def.grupo] : 0
            const vis = r.visivel && op > 0.01
            el.style.opacity = vis ? String(op) : '0'
            if (vis) el.style.transform = `translate3d(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px, 0)`
          }
        }

        aoRolar()
        window.addEventListener('scroll', aoRolar, { passive: true })
        window.addEventListener('pointermove', aoMover, { passive: true })
        document.documentElement.addEventListener('pointerleave', aoSair)
        window.addEventListener('pointerdown', baixo)
        window.addEventListener('pointermove', arrastando, { passive: true })
        window.addEventListener('pointerup', cima)
        window.addEventListener('pointercancel', cima)
        document.addEventListener('visibilitychange', aoTrocarAba)

        cena
          .preparar()
          .then(() => {
            if (cancelado) return
            cena.desenharUmaVez()
            if (!cobertoAgora && !document.hidden) cena.iniciar()
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                if (cancelado) return
                setPintou(true)
                marcarPronta()
              }),
            )
          })
          .catch(() => marcarPronta())

        limpar = () => {
          window.removeEventListener('resize', medir)
          window.removeEventListener('scroll', aoRolar)
          window.removeEventListener('pointermove', aoMover)
          document.documentElement.removeEventListener('pointerleave', aoSair)
          window.removeEventListener('pointerdown', baixo)
          window.removeEventListener('pointermove', arrastando)
          window.removeEventListener('pointerup', cima)
          window.removeEventListener('pointercancel', cima)
          document.removeEventListener('visibilitychange', aoTrocarAba)
          cena.destruir()
          if (cenaAtual === cena) cenaAtual = null
        }
      })
      .catch(() => marcarPronta())

    return () => {
      cancelado = true
      limpar?.()
    }
  }, [raiz, desktop])

  return (
    <div aria-hidden className={cn('pointer-events-none fixed inset-0 z-0', coberto && 'invisible')}>
      <canvas
        ref={canvasRef}
        className={cn(
          'h-full w-full transition-opacity duration-[1400ms] ease-[var(--ease-sh)]',
          pintou || !abertura ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div className="absolute inset-0">
        {ROTULOS.map((r) => (
          <div
            key={r.id}
            ref={(el) => {
              rotulosRef.current[r.id] = el
            }}
            className="absolute top-0 left-0 opacity-0 will-change-transform"
          >
            <div className="-translate-x-1/2 pt-1 text-center">
              {r.grupo === 'padroes' ? (
                <span className={cn('text-[0.72rem] font-semibold tracking-wide', r.texto === 'Agora' ? 'text-rosa' : 'text-tinta/55')}>
                  {r.texto}
                </span>
              ) : (
                <div className={cn('rounded-full px-3.5 py-1.5 whitespace-nowrap', r.tom === 'claro' ? 'vidro-escuro' : 'vidro-claro')}>
                  <span className={cn('text-[0.8rem] font-semibold', r.tom === 'claro' ? 'text-white' : 'text-tinta')}>{r.texto}</span>
                  {r.sub && <span className={cn('ml-2 text-[0.7rem]', r.tom === 'claro' ? 'text-ciano-claro' : 'text-tinta/55')}>{r.sub}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Sem WebGL: a página continua inteira, com um degradê da marca no lugar das peças. */
export function PalcoReserva() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(80%_60%_at_30%_20%,#2D3690_0%,#100d2e_70%)]"
    />
  )
}
