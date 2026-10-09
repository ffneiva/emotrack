import { useRef } from 'react'
import { IconeFuncao, IconeSeta } from '@/components/Icones'
import { useMotor } from '@/hooks/useMotor'
import { EMOCOES } from '@/lib/cores'
import { LINKS } from '@/lib/links'

const PONTOS = [
  { i: 'relogio', t: 'Contexto antes da sessão', p: 'O que a família registrou na semana, organizado para você.' },
  { i: 'ia', t: 'Padrões com IA', p: 'Tendências de emoções, comportamentos e gatilhos detectadas automaticamente.' },
  { i: 'relatorio', t: 'Relatórios clínicos', p: 'Resumos por período prontos para exportar e anexar ao prontuário.' },
  { i: 'rede', t: 'Equipe conectada', p: 'Psicólogos, terapeutas ocupacionais e a família acompanhando o mesmo histórico.' },
]

/* A demonstração do painel — a mesma do site atual, com dados fictícios. */
const KPIS = [
  ['Registros diários', '24', '+4 esta semana'],
  ['Crises registradas', '7', '−2 vs mês ant.'],
  ['Média de intensidade', '6,2', '−0,8 vs mês ant.'],
  ['Estratégias efetivas', '78%', '+12% vs mês ant.'],
]
const COMPORTAMENTOS: [string, number][] = [
  ['Regulação oral/tátil', 78],
  ['Movimentos repetitivos', 62],
  ['Agitação / ansiedade', 45],
  ['Isolamento social', 31],
  ['Hipersensibilidade', 24],
]
const DISTRIBUICAO: [string, number, string][] = [
  ['Ansiedade', 38, EMOCOES[2].cor],
  ['Tristeza', 24, EMOCOES[4].cor],
  ['Calmo', 18, EMOCOES[0].cor],
  ['Irritação', 12, EMOCOES[5].cor],
  ['Alegria', 8, EMOCOES[1].cor],
]
const GATILHOS = [
  ['Sobrecarga sensorial', '3x'],
  ['Mudanças de rotina', '2x'],
  ['Fome ou sono', '2x'],
]
const MENU = ['Pacientes', 'Análises e Insights', 'Anotações Clínicas', 'Formulários', 'Notificações', 'Documentos', 'Equipe']

function Rosca() {
  const total = DISTRIBUICAO.reduce((a, x) => a + x[1], 0)
  let acum = 0
  const R = 15.9155
  return (
    <svg viewBox="0 0 42 42" className="size-32 -rotate-90 sm:size-36">
      <circle cx="21" cy="21" r={R} fill="none" stroke="rgb(255 255 255 / 0.06)" strokeWidth="6" />
      {DISTRIBUICAO.map(([n, v, c]) => {
        const ini = acum
        acum += v
        return (
          <circle
            key={n}
            data-rosca
            cx="21"
            cy="21"
            r={R}
            fill="none"
            stroke={c}
            strokeWidth="6"
            strokeDasharray={`${(v / total) * 100 - 1.2} ${100 - (v / total) * 100 + 1.2}`}
            strokeDashoffset={-ini}
          />
        )
      })}
    </svg>
  )
}

function Painel() {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#121538] text-white shadow-[0_60px_120px_-40px_rgb(3_160_215/0.45)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-3 truncate text-[0.7rem] text-white/40">Pacientes › Arthur Mendes › Visão geral</span>
      </div>
      <div className="grid md:grid-cols-[180px_1fr]">
        <aside className="hidden border-r border-white/10 p-4 md:block">
          <p className="text-[0.62rem] font-semibold tracking-widest text-white/35 uppercase">Menu</p>
          <ul className="mt-3 space-y-1 text-[0.78rem]">
            {MENU.map((m, i) => (
              <li key={m} className={i === 0 ? 'rounded-lg bg-white/10 px-2.5 py-1.5 font-medium text-white' : 'px-2.5 py-1.5 text-white/50'}>
                {m}
              </li>
            ))}
          </ul>
        </aside>
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-lg font-semibold">
                Arthur Mendes <span className="rounded-full bg-verde/30 px-2 py-0.5 text-[0.6rem] font-semibold text-[#7be0b0]">Verificado</span>
              </p>
              <p className="text-[0.72rem] text-white/45">Autismo (TEA), TDAH · Medicação: Risperidona</p>
            </div>
            <span className="rounded-full border border-white/15 px-3 py-1.5 text-[0.7rem] text-white/70">Exportar PDF</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {KPIS.map(([r, v, d]) => (
              <div key={r} className="rounded-xl bg-white/[0.05] p-3">
                <p className="text-[0.65rem] text-white/50">{r}</p>
                <p className="num mt-1 text-2xl font-semibold" data-conta={v}>
                  {v}
                </p>
                <p className="text-[0.62rem] text-[#7be0b0]">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-xl bg-white/[0.05] p-4">
              <p className="text-[0.75rem] font-semibold">Comportamentos mais comuns</p>
              <ul className="mt-3 space-y-2.5">
                {COMPORTAMENTOS.map(([n, v]) => (
                  <li key={n} className="text-[0.7rem]">
                    <div className="flex justify-between text-white/65">
                      <span>{n}</span>
                      <span className="num">{v}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div data-barra className="h-full origin-left rounded-full bg-gradient-to-r from-ciano to-roxo" style={{ width: `${v}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-white/[0.05] p-4">
              <p className="text-[0.75rem] font-semibold">Distribuição emocional</p>
              <div className="mt-3 flex items-center gap-4">
                <Rosca />
                <ul className="space-y-1.5 text-[0.68rem] text-white/65">
                  {DISTRIBUICAO.map(([n, v, c]) => (
                    <li key={n} className="flex items-center gap-2">
                      <span className="size-2 rounded-full" style={{ background: c }} />
                      {n} <span className="num text-white/40">{v}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-[0.75rem] font-semibold">Gatilhos de crise mais frequentes</p>
              <ul className="mt-2 space-y-1 text-[0.68rem] text-white/65">
                {GATILHOS.map(([n, v]) => (
                  <li key={n} className="flex justify-between">
                    {n} <span className="num text-rosa">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-right text-[0.62rem] text-white/30">Demonstração ilustrativa · dados fictícios</p>
        </div>
      </div>
    </div>
  )
}

export function Plataforma() {
  const ref = useRef<HTMLElement>(null)
  // As barras crescem e a rosca se desenha quando o painel entra na tela.
  useMotor(ref, ({ gsap }, raiz, calmo) => {
    if (calmo) return
    const gatilho = { trigger: raiz.querySelector('[data-quadro]'), start: 'top 75%' }
    gsap.from(raiz.querySelectorAll('[data-barra]'), { scaleX: 0, duration: 1.4, ease: 'expo.out', stagger: 0.08, scrollTrigger: gatilho })
    gsap.from(raiz.querySelectorAll('[data-rosca]'), { strokeDasharray: '0 100', duration: 1.6, ease: 'expo.out', stagger: 0.1, scrollTrigger: gatilho })
    gsap.from(raiz.querySelector('[data-quadro]'), {
      rotateX: 18,
      y: 80,
      scale: 0.94,
      transformPerspective: 1600,
      ease: 'none',
      scrollTrigger: { trigger: raiz.querySelector('[data-quadro]'), start: 'top bottom', end: 'top 30%', scrub: true },
    })
  })
  return (
    <section ref={ref} id="profissionais" data-opaco data-tema="escuro" className="relative z-10 overflow-hidden bg-breu px-5 py-24 text-white sm:px-8 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(3_160_215/0.22),transparent)]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="rotulo text-ciano-claro" data-revela>
              Para profissionais · Plataforma com IA
            </p>
            <h2 className="titulo mt-5 text-4xl sm:text-6xl" data-revela="1">
              O histórico do paciente, <em className="text-ciano-claro">pronto antes da consulta.</em>
            </h2>
          </div>
          <div data-revela="2">
            <p className="text-lg leading-relaxed text-white/70">
              Menos tempo coletando, mais tempo cuidando. Receba dados estruturados das famílias, identifique padrões com apoio de IA e
              decida com base em evidências.
            </p>
            <a href={LINKS.plataforma} target="_blank" rel="noopener noreferrer" className="btn btn-verde mt-7">
              Acessar a plataforma <IconeSeta className="size-4" />
            </a>
          </div>
        </div>
        <div data-quadro className="mt-16">
          <Painel />
        </div>
        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PONTOS.map((p, i) => (
            <li key={p.t} data-revela={i}>
              <span className="grid size-11 place-items-center rounded-2xl bg-white/[0.07] text-ciano-claro">
                <IconeFuncao nome={p.i} className="size-5" />
              </span>
              <p className="mt-4 font-semibold">{p.t}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">{p.p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
