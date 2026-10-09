import { capitulo } from '@/lib/capitulos'

const PILARES = [
  { t: 'Base científica', p: 'Método fundamentado em ABA e TCC, com participação de especialistas em neurodesenvolvimento.' },
  { t: 'Tecnologia acessível', p: 'O primeiro app com versão gratuita para famílias.' },
  { t: 'Missão', p: 'Conectar as famílias a psicólogos, terapeutas ocupacionais e toda a equipe que acompanha a criança.' },
]

/** As peças se encaixam num quebra-cabeça, e o coração aparece no meio dele. */
export function Motivo() {
  return (
    <section data-3d data-tema="escuro" className="relative z-10 min-h-[150svh] px-5 text-white sm:px-8">
      <div data-s={capitulo('motivo')} className="pointer-events-none absolute inset-x-0 top-[38%] h-px" />
      <div className="mx-auto flex min-h-[150svh] max-w-6xl items-end pb-[12svh] lg:items-center lg:pb-0">
        <div className="vidro-escuro max-w-md rounded-[2rem] p-7 sm:p-9" data-revela>
          <p className="rotulo text-ciano-claro">Sobre a Emotrack</p>
          <h2 className="titulo mt-5 text-3xl sm:text-[2.6rem]">
            Cada registro é uma peça. <em className="text-rosa">Juntas</em>, elas mostram o que a criança está tentando dizer.
          </h2>
          <p className="mt-5 leading-relaxed text-white/75">
            A Emotrack organiza emoções e comportamentos com um método baseado em ciência, para você reconhecer padrões e chegar à
            consulta com clareza.
          </p>
          <ul className="mt-7 space-y-4 border-t border-white/10 pt-6">
            {PILARES.map((x) => (
              <li key={x.t} className="flex gap-3">
                <span className="arco-gradiente mt-2 size-1.5 shrink-0 rounded-full" />
                <span>
                  <span className="block text-sm font-semibold">{x.t}</span>
                  <span className="block text-sm leading-relaxed text-white/65">{x.p}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
