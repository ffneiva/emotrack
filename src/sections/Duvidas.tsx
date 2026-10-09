import { IconeEmail, IconeMais } from '@/components/Icones'
import { LINKS } from '@/lib/links'

const PERGUNTAS = [
  [
    'Isso é apenas "monitoramento de emoções"?',
    'Não. A Emotrack é uma infraestrutura de dados emocionais e comportamentais. Os registros seguem metodologias clínicas (ABA e TCC) e viram relatórios e insights úteis para toda a rede de cuidado, não apenas um diário de humor.',
  ],
  [
    'Preciso pagar para usar?',
    'A Emotrack oferece uma versão gratuita do app para famílias atípicas. A plataforma profissional com IA já está disponível para clínicas e profissionais.',
  ],
  [
    'Meus dados estão seguros?',
    'Sim. A segurança e a privacidade dos dados são prioridade. As informações ficam centralizadas, com controle de acesso para a rede de cuidado autorizada pelo responsável.',
  ],
  [
    'Serve para quais neurodivergências?',
    'Autismo (TEA), TDAH e outras neurodivergências. O registro estruturado se adapta à jornada de cada criança.',
  ],
]

export function Duvidas() {
  return (
    <section id="duvidas" data-opaco data-tema="claro" className="relative z-10 bg-creme px-5 py-24 text-tinta sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="rotulo text-rosa" data-revela>
            Dúvidas frequentes
          </p>
          <h2 className="titulo mt-5 text-4xl sm:text-5xl" data-revela="1">
            Perguntas <em>frequentes</em>
          </h2>
          <div className="cartao mt-10 p-6" data-revela="2">
            <p className="font-semibold">Para jornalistas</p>
            <p className="mt-1 text-sm text-cinza">Materiais de imprensa, logos e dados sob demanda.</p>
            <a href={`mailto:${LINKS.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-rosa hover:underline">
              <IconeEmail className="size-4" /> {LINKS.email}
            </a>
          </div>
        </div>
        <div className="divide-y divide-black/10 border-y border-black/10">
          {PERGUNTAS.map(([p, r], i) => (
            <details key={p} className="group" data-revela={i} open={i === 0}>
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-lg font-semibold">
                {p}
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white transition-colors group-open:bg-rosa group-open:text-white">
                  <IconeMais className="mais size-4 transition-transform duration-300" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-cinza">{r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
