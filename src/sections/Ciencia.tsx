import { Foto } from '@/components/Foto'
import { IconeFuncao } from '@/components/Icones'
import { Peca } from '@/components/Peca'
import { MARCA } from '@/lib/cores'

const MOTIVOS = [
  { i: 'relogio', t: 'Intervenção precoce', d: 'Tempo é tudo no neurodesenvolvimento.', p: 'Quanto antes os padrões são identificados, mais cedo a intervenção começa. O registro estruturado acelera esse caminho.', cor: MARCA.rosa },
  { i: 'moeda', t: 'Acessível e econômico', d: 'Cuidado de qualidade não pode ser privilégio.', p: 'Versão gratuita para famílias e menos custo de acompanhamento, com as informações num lugar só.', cor: MARCA.amarelo },
  { i: 'ciencia', t: 'Ciência aplicada', d: 'Metodologia, não achismo.', p: 'Construída com base em ABA e TCC, com participação de psicólogos especialistas em neurodesenvolvimento.', cor: MARCA.verde },
  { i: 'pulso', t: 'Histórico contínuo', d: 'A memória da jornada não se perde.', p: 'Emoções, crises, avanços e contexto registrados ao longo do tempo, prontos para qualquer profissional.', cor: MARCA.ciano },
  { i: 'rede', t: 'Rede de cuidado', d: 'Todos na mesma página.', p: 'Famílias, escolas e profissionais compartilham o mesmo histórico inteligente, com segurança de dados.', cor: MARCA.roxo },
  { i: 'ia', t: 'Inteligência artificial', d: 'Padrões que olhos humanos podem perder.', p: 'IA que analisa tendências e gera insights para decisões clínicas mais assertivas.', cor: MARCA.azul },
]

const FRENTES = [
  ['Monitoramento emocional', 'Registro contínuo de emoções, comportamentos, crises, gatilhos e avanços.'],
  ['Relatórios clínicos', 'Relatórios semanais e mensais, compartilháveis com toda a rede de cuidado.'],
  ['Pasta digital da criança', 'Laudos, medicações, alergias e histórico clínico num lugar só.'],
  ['Plataforma profissional com IA', 'Insights e análise de padrões para clínicas, terapeutas e pesquisadores.'],
  ['Rede conectada', 'Famílias, escolas e profissionais acompanhando a mesma criança.'],
]

export function Ciencia() {
  return (
    <section id="ciencia" data-opaco data-tema="claro" className="relative z-10 overflow-hidden bg-papel px-5 py-24 text-tinta sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="rotulo text-verde" data-revela>
            Base científica
          </p>
          <h2 className="titulo mt-5 text-4xl sm:text-6xl" data-revela="1">
            Fundamentado em <span className="text-verde">ABA</span> e <span className="text-ciano">TCC.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-cinza" data-revela="2">
            A Emotrack não é um diário de humor: é uma infraestrutura de dados emocionais e comportamentais. Os registros seguem
            metodologias clínicas e viram relatórios e insights úteis para toda a rede de cuidado.
          </p>
          <ol className="mt-10 space-y-0 border-t border-black/10">
            {FRENTES.map(([t, p], i) => (
              <li key={t} className="group grid grid-cols-[3rem_1fr] gap-2 border-b border-black/10 py-4" data-revela={i}>
                <span className="num pt-0.5 text-sm font-semibold text-black/30 transition-colors group-hover:text-rosa">0{i + 1}</span>
                <span>
                  <span className="block font-semibold">{t}</span>
                  <span className="block text-sm text-cinza">{p}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative mx-auto w-full max-w-md" data-revela="2">
          <div className="absolute inset-x-6 top-16 bottom-0 rounded-[2.5rem] bg-[linear-gradient(160deg,#E6315B,#F5D054)]" />
          <Foto slug="menina" alt="Menina sorrindo com a camiseta da Emotrack" sizes="(min-width: 1024px) 440px, 90vw" recorte className="relative" />
          <Peca cor={MARCA.ciano} humor={1} className="anima-flutua absolute top-24 -left-4 size-16" />
          <Peca cor={MARCA.verde} humor={0.6} className="anima-flutua absolute top-1/2 -right-3 size-14 [animation-delay:-2s]" />
        </div>
      </div>

      <div className="mx-auto mt-28 max-w-6xl">
        <div className="max-w-2xl">
          <p className="rotulo text-rosa" data-revela>
            Por que a Emotrack
          </p>
          <h2 className="titulo mt-5 text-4xl sm:text-5xl" data-revela="1">
            Dados que <em>viram cuidado.</em>
          </h2>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOTIVOS.map((m, i) => (
            <li
              key={m.t}
              className="cartao group relative overflow-hidden p-7 transition-[transform,box-shadow] duration-500 ease-[var(--ease-sh)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(20_24_31/0.3)]"
              data-revela={i % 3}
            >
              <span
                aria-hidden
                className="absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-40"
                style={{ background: m.cor }}
              />
              <span className="relative grid size-12 place-items-center rounded-2xl text-white" style={{ background: m.cor }}>
                <IconeFuncao nome={m.i} className="size-5" />
              </span>
              <p className="relative mt-6 text-lg font-semibold">{m.t}</p>
              <p className="relative mt-1 text-sm font-medium" style={{ color: m.cor }}>
                {m.d}
              </p>
              <p className="relative mt-3 text-sm leading-relaxed text-cinza">{m.p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
