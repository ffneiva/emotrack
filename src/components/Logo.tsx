import { ARCO } from '@/lib/cores'
import { cn } from '@/lib/utils'

/**
 * O logotipo: o arco de peças coloridas sobre o nome. Redesenhado em SVG
 * para o nome trocar de cor com o fundo (o arquivo original é preto).
 */
export function Logo({ className, nome = true }: { className?: string; nome?: boolean }) {
  // Medido no logotipo original: o arco nasce embaixo, à esquerda do "E", e
  // termina sobre o "t".
  const cx = nome ? 98 : 60
  const cy = nome ? 98 : 64
  const r = nome ? 84 : 50
  const a0 = (188 * Math.PI) / 180
  const a1 = (24 * Math.PI) / 180
  const segs = ARCO.length
  const ponto = (a: number) => [cx + Math.cos(a) * r, cy - Math.sin(a) * r] as const
  const pedaco = (i: number) => {
    const [xa, ya] = ponto(a0 + ((a1 - a0) * i) / segs)
    const [xb, yb] = ponto(a0 + ((a1 - a0) * (i + 1)) / segs)
    return `M${xa.toFixed(2)} ${ya.toFixed(2)} A${r} ${r} 0 0 1 ${xb.toFixed(2)} ${yb.toFixed(2)}`
  }
  return (
    <svg viewBox={nome ? '0 0 340 118' : '0 0 122 86'} className={cn('block', className)} role="img" aria-label="Emotrack">
      {ARCO.map((c, i) => (
        <path key={i} d={pedaco(i)} stroke={c} strokeWidth={nome ? 15 : 16} fill="none" />
      ))}
      {/* Os "dentes" entre as peças. */}
      {ARCO.slice(1).map((_, i) => {
        const [x, y] = ponto(a0 + ((a1 - a0) * (i + 1)) / segs)
        return <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={nome ? 4.2 : 4.4} fill={ARCO[i]} />
      })}
      {nome && (
        <text x="38" y="110" fill="currentColor" fontFamily="Lexend, sans-serif" fontWeight="500" fontSize="62" letterSpacing="-1.5">
          Emotrack
        </text>
      )}
    </svg>
  )
}
