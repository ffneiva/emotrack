import { capitulo } from '@/lib/capitulos'

/** Três esferas de peças — família, escola, profissionais — e o histórico correndo entre elas. */
export function Rede() {
  return (
    <section data-3d data-tema="claro" className="relative z-10 min-h-[120svh] px-5 pt-[14svh] text-tinta sm:px-8">
      <div className="mx-auto max-w-3xl text-center" data-revela>
        <p className="rotulo text-verde">Rede conectada</p>
        <h2 className="titulo legivel-claro mt-5 text-[2.1rem] sm:text-5xl lg:text-6xl">
          Família, escola e profissionais olhando para <em>a mesma criança.</em>
        </h2>
      </div>
      <div data-s={capitulo('rede')} className="h-[58svh]" />
      <div className="mx-auto max-w-2xl pb-[14svh] text-center" data-revela>
        <p className="legivel-claro text-lg leading-relaxed text-cinza sm:text-xl">
          O mesmo histórico inteligente para todos, sem perda de informação. Os dados só são compartilhados com a autorização do
          responsável, e cada um vê apenas o que foi liberado.
        </p>
      </div>
    </section>
  )
}
