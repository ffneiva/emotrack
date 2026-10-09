import { Peca } from '@/components/Peca'
import { ARCO } from '@/lib/cores'

/** Uma faixa de texto gigante que corre de lado com a rolagem. */
export function Faixa({ palavras, sentido = 1, tom = 'claro' }: { palavras: string[]; sentido?: 1 | -1; tom?: 'claro' | 'escuro' }) {
  const linha = [...palavras, ...palavras, ...palavras]
  return (
    <div aria-hidden className="relative overflow-hidden py-6 sm:py-10">
      <div data-faixa={sentido} className="flex w-max items-center gap-6 whitespace-nowrap sm:gap-10">
        {linha.map((p, i) => (
          <span key={i} className="flex items-center gap-6 sm:gap-10">
            <span
              className={
                i % 2
                  ? `titulo text-6xl sm:text-8xl lg:text-[9rem] ${tom === 'claro' ? 'text-tinta' : 'text-white'}`
                  : `titulo text-6xl text-transparent sm:text-8xl lg:text-[9rem] ${tom === 'claro' ? '[-webkit-text-stroke:1.5px_rgb(20_24_31/0.35)]' : '[-webkit-text-stroke:1.5px_rgb(255_255_255/0.35)]'}`
              }
            >
              {p}
            </span>
            <Peca cor={ARCO[i % ARCO.length]} humor={1} className="size-12 shrink-0 sm:size-16" />
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * O princípio da Emotrack — a alta tecnologia fica nos bastidores, e a tela é
 * simples e humana — em palavras que acendem uma a uma com a rolagem. É o
 * "do caos à clareza" dito com todas as letras.
 */
export function Manifesto() {
  return (
    <section data-opaco data-tema="escuro" className="relative z-10 overflow-hidden bg-breu py-24 text-white sm:py-32">
      <Faixa palavras={['caos', 'registro', 'padrão', 'clareza', 'cuidado']} tom="escuro" />
      <div className="mx-auto mt-14 max-w-5xl px-5 sm:px-8">
        <p className="rotulo text-ciano-claro">Do caos à clareza</p>
        <p data-acende className="titulo mt-8 text-[1.9rem] leading-[1.15] sm:text-5xl lg:text-[3.6rem]">
          Por trás, alta tecnologia: dados estruturados, ABA e TCC, inteligência artificial. Na tela, só o que importa, simples e humano.
          Para a família registrar em poucos minutos e o profissional decidir com clareza.
        </p>
        <figure className="mt-16 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-[auto_1fr] sm:items-center" data-revela>
          <div className="flex -space-x-3">
            {ARCO.slice(0, 4).map((c, i) => (
              <Peca key={i} cor={c} humor={1} className="size-12 drop-shadow-[0_8px_14px_rgb(0_0_0/0.4)]" />
            ))}
          </div>
          <div>
            <blockquote className="enfase text-2xl text-white sm:text-3xl">“A tecnologia vem para resolver dores.”</blockquote>
            <figcaption className="mt-2 text-sm text-white/55">Carol Moraes, CEO e cofundadora da Emotrack, em entrevista ao ES Brasil</figcaption>
          </div>
        </figure>
      </div>
    </section>
  )
}
