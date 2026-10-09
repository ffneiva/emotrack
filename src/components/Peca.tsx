import { useId } from 'react'
import { cn } from '@/lib/utils'

/** O mesmo contorno da peça 3D (scene/pecas.ts), em SVG (y para baixo). */
const PERFIL = [
  [0.36, 0], [0.42, 0], [0.4, 0.1], [0.37, 0.16], [0.32, 0.26], [0.4, 0.34], [0.5, 0.34],
  [0.6, 0.34], [0.68, 0.26], [0.63, 0.16], [0.6, 0.1], [0.58, 0], [0.64, 0],
] as const

function caminho(): string {
  const lados = [
    { a: [-0.5, -0.5], b: [0.5, -0.5], n: [0, -1], s: -1 },
    { a: [0.5, -0.5], b: [0.5, 0.5], n: [1, 0], s: 1 },
    { a: [0.5, 0.5], b: [-0.5, 0.5], n: [0, 1], s: 1 },
    { a: [-0.5, 0.5], b: [-0.5, -0.5], n: [-1, 0], s: -1 },
  ] as const
  const f = (x: number) => +x.toFixed(4)
  let d = 'M-0.5 0.5'
  for (const { a, b, n, s } of lados) {
    const p = (i: number) => {
      const [u, v] = PERFIL[i]
      const x = a[0] + (b[0] - a[0]) * u + n[0] * v * s * 0.8
      const y = a[1] + (b[1] - a[1]) * u + n[1] * v * s * 0.8
      return `${f(x)} ${f(-y)}`
    }
    d += ` L${p(0)} C${p(1)} ${p(2)} ${p(3)} C${p(4)} ${p(5)} ${p(6)} C${p(7)} ${p(8)} ${p(9)} C${p(10)} ${p(11)} ${p(12)} L${f(b[0])} ${f(-b[1])}`
  }
  return d + ' Z'
}

export const CAMINHO_PECA = caminho()

type Props = {
  cor: string
  /** −1 triste/bravo · 0 neutro · 1 sorriso. */
  humor?: number
  rosto?: boolean
  className?: string
}

/** Um mascote: a peça da emoção, com a cara dela. */
export function Peca({ cor, humor = 0.6, rosto = true, className }: Props) {
  const id = `p${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  // A boca: uma curva de controle acima (triste) ou abaixo (sorriso) das pontas.
  const controle = 0.075 + 0.12 * humor
  return (
    <svg viewBox="-0.56 -0.82 1.38 1.38" className={cn('block', className)} aria-hidden>
      <path d={CAMINHO_PECA} fill={cor} />
      <path d={CAMINHO_PECA} fill={`url(#${id})`} />
      {rosto && (
        <g transform="translate(-0.03 0.02)" fill="#171429">
          <circle cx="-0.12" cy="-0.08" r="0.045" />
          <circle cx="0.12" cy="-0.08" r="0.045" />
          <path
            d={`M-0.115 0.075 Q0 ${controle.toFixed(3)} 0.115 0.075`}
            fill="none"
            stroke="#171429"
            strokeWidth="0.034"
            strokeLinecap="round"
          />
          {humor > 0.3 && (
            <>
              <circle cx="-0.21" cy="0.01" r="0.045" fill="#ff8a95" opacity="0.45" />
              <circle cx="0.21" cy="0.01" r="0.045" fill="#ff8a95" opacity="0.45" />
            </>
          )}
        </g>
      )}
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
