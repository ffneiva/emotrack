import type { CSSProperties } from 'react'
import { IMAGENS, type SlugImagem } from '@/lib/imagens.gen'
import { cn } from '@/lib/utils'

type Props = {
  slug: SlugImagem
  alt: string
  /** `sizes` do srcset — quanto da largura da tela a foto ocupa. */
  sizes?: string
  className?: string
  imgClassName?: string
  prioridade?: boolean
  /** Força o carregamento já (ex.: galeria horizontal, onde o lazy do navegador chega tarde). */
  ja?: boolean
  style?: CSSProperties
  /** Parallax interno: a foto desliza dentro da moldura (ver parallaxDeclarativo). */
  velocidade?: number
  /** Desliza com o mouse (parallax de ponteiro). */
  mouse?: boolean
  /** PNG com transparência (as telas do app): sem o borrão de espera. */
  recorte?: boolean
  /** Abre de dentro para fora com a rolagem (lib/cenas.ts). */
  revela?: boolean
}

/**
 * Foto responsiva: AVIF com WebP de reserva, três larguras, e um borrão de
 * 24 px (embutido no HTML) enquanto a imagem não chega.
 */
export function Foto({ slug, alt, sizes = '100vw', className, imgClassName, prioridade, style, velocidade, mouse, ja, recorte, revela }: Props) {
  const info = IMAGENS[slug]
  const srcset = (ext: string) => info.larguras.map((l) => `/img/${slug}-${l}.${ext} ${l}w`).join(', ')
  const maior = info.larguras[info.larguras.length - 1]
  return (
    <div
      data-revela-foto={revela || undefined}
      className={cn(!className?.includes('absolute') && 'relative', 'overflow-hidden', className)}
      style={{ backgroundImage: info.lqip && !recorte ? `url(${info.lqip})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', ...style }}
    >
      <picture className="block h-full w-full">
        <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
        <img
          src={`/img/${slug}-${maior}.webp`}
          srcSet={srcset('webp')}
          sizes={sizes}
          alt={alt}
          width={info.w}
          height={info.h}
          loading={prioridade || ja ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={prioridade ? 'high' : undefined}
          data-velocidade={velocidade}
          data-mouse={mouse || undefined}
          className={cn(recorte ? 'h-auto w-full' : 'h-full w-full object-cover', velocidade ? 'scale-[1.18] will-change-transform' : undefined, imgClassName)}
        />
      </picture>
    </div>
  )
}
