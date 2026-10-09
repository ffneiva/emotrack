import { Foto } from '@/components/Foto'
import { IconeInstagram } from '@/components/Icones'
import type { SlugImagem } from '@/lib/imagens.gen'
import { LINKS } from '@/lib/links'

const MARCOS = [
  ['2024', 'Nascimento da Emotrack', 'Da vivência de famílias atípicas para um produto com propósito.'],
  ['2024', 'MVP validado', 'Primeiros registros estruturados em campo, com famílias reais.'],
  ['2025', 'Acelerações e editais', 'Reconhecimento de instituições de inovação e empreendedorismo.'],
  ['2025', 'Rumo à IA', 'Desenvolvimento da plataforma profissional com inteligência artificial.'],
]

const FOTOS: { slug: SlugImagem; alt: string }[] = [
  { slug: 'evento-1', alt: 'Equipe da Emotrack em evento de inovação' },
  { slug: 'evento-2', alt: 'A Emotrack em evento de empreendedorismo' },
  { slug: 'evento-3', alt: 'Apresentação da Emotrack' },
  { slug: 'evento-4', alt: 'A Emotrack com parceiros' },
]

const PARCEIROS = [
  'SEBRAE', 'Darwin Startups', '2G', 'ABStartups', 'Porto Digital', 'HUB GO', 'Governo de Goiás', 'DV', 'Commerciare', 'AKCIT', 'Descobrindo Crianças', 'NextValue', 'Busca Professor',
]

export function Trajetoria() {
  return (
    <section data-opaco data-tema="claro" className="relative z-10 overflow-hidden bg-white px-5 py-24 text-tinta sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="rotulo text-roxo" data-revela>
              Nossa trajetória
            </p>
            <h2 className="titulo mt-5 text-4xl sm:text-5xl" data-revela="1">
              Não é uma promessa: é um produto <em className="text-roxo">validado.</em>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-cinza" data-revela="2">
              Premiada e acelerada por instituições de referência no Brasil, a Emotrack nasceu da vivência de famílias atípicas.
            </p>
            <ol className="relative mt-10 space-y-8 border-l-2 border-dashed border-black/10 pl-7">
              {MARCOS.map(([ano, t, p], i) => (
                <li key={t} className="relative" data-revela={i}>
                  <span className="arco-gradiente absolute top-1 -left-[2.17rem] size-3.5 rounded-full ring-4 ring-white" />
                  <span className="num text-xs font-semibold text-roxo">{ano}</span>
                  <p className="mt-1 font-semibold">{t}</p>
                  <p className="text-sm text-cinza">{p}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-3 self-start sm:gap-4">
            {FOTOS.map((f, i) => (
              <Foto
                key={f.slug}
                slug={f.slug}
                alt={f.alt}
                sizes="(min-width: 1024px) 320px, 45vw"
                className={`aspect-square rounded-[1.6rem] ${i % 2 ? 'translate-y-10' : ''}`}
                velocidade={i % 2 ? -0.05 : 0.04}
              />
            ))}
          </div>
        </div>

        <div className="mt-28 text-center">
          <p className="rotulo text-cinza" data-revela>
            Ecossistema
          </p>
          <h3 className="titulo mt-4 text-3xl sm:text-4xl" data-revela="1">
            Quem acredita no nosso propósito
          </h3>
        </div>
      </div>
      {/* Letreiro com os nomes; a imagem oficial dos logotipos logo abaixo. */}
      <div className="relative mt-10 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]" aria-hidden>
        <div className="anima-letreiro flex w-max gap-10 whitespace-nowrap">
          {[...PARCEIROS, ...PARCEIROS].map((p, i) => (
            <span key={i} className="flex items-center gap-10 text-2xl font-semibold text-black/20 sm:text-3xl">
              {p}
              <span className="arco-gradiente size-2 rounded-full opacity-60" />
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-5xl" data-revela>
        <Foto
          slug="parceiros"
          alt="Parceiros e instituições: SEBRAE, Darwin Startups, 2G, ABStartups, Porto Digital, HUB GO, Governo de Goiás, DV, Commerciare, AKCIT, Descobrindo Crianças, NextValue e Busca Professor"
          sizes="(min-width: 1024px) 1000px, 100vw"
          recorte
          className="rounded-3xl border border-black/5 bg-white p-4 sm:p-6"
        />
      </div>
      <div className="mt-14 text-center" data-revela>
        <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-linha text-tinta">
          <IconeInstagram className="size-4" /> Acompanhe a jornada no @emotrackbr
        </a>
      </div>
    </section>
  )
}
