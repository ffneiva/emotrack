import { useRef } from 'react'
import { Foto } from '@/components/Foto'
import { IconeFuncao, IconePlay } from '@/components/Icones'
import { Peca } from '@/components/Peca'
import { Faixa } from './Manifesto'
import { EMOCOES } from '@/lib/cores'
import { LINKS } from '@/lib/links'

const PASSOS = [
  { t: 'Registre o dia', p: 'Marque emoções, comportamentos, comunicação e estratégias em poucos toques.', chips: ['Calma', 'Ansiedade', 'Irritação', 'Felicidade'] },
  { t: 'Anote uma crise', p: 'Em momentos difíceis, registre gatilho, reação, intensidade e o que acalmou.', chips: ['Leve', 'Moderada', 'Intensa'] },
  { t: 'Acompanhe padrões', p: 'Veja emoções, comportamentos e crises ao longo do tempo, por período.', chips: ['Diário', 'Crise', 'Análises'] },
  { t: 'Compartilhe', p: 'Exporte um relatório em PDF e leve para terapeutas, escolas e médicos.', chips: ['PDF', 'Terapeuta', 'Escola', 'Médico'] },
]

const RECURSOS = [
  { i: 'pulso', t: 'Registro diário', p: 'Emoções, comportamentos, comunicação e estratégias, guiados passo a passo, em poucos minutos.' },
  { i: 'coracao', t: 'Registro de crise', p: 'Anote o que aconteceu e o que acalmou, mesmo no meio do caos.' },
  { i: 'relatorio', t: 'Relatórios por período', p: 'Filtre por data e veja padrões em gráficos claros.' },
  { i: 'pasta', t: 'Pasta da criança', p: 'Laudos, exames, medicações e alergias no celular, no lugar da pasta de papel.' },
  { i: 'equipe', t: 'Vários filhos', p: 'Gerencie o perfil de cada criança da família em uma só conta.' },
  { i: 'escudo', t: 'Gratuito e privado', p: 'Sem custo para famílias, com seus dados protegidos.' },
]

/** Os dois celulares inclinam com o mouse, como objetos em cima da mesa. */
function Celulares() {
  const ref = useRef<HTMLDivElement>(null)
  const mover = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`)
  }
  const sair = () => {
    ref.current?.style.setProperty('--rx', '0deg')
    ref.current?.style.setProperty('--ry', '0deg')
  }
  return (
    <div ref={ref} onPointerMove={mover} onPointerLeave={sair} className="relative mx-auto h-[520px] w-full max-w-[460px] [perspective:1400px] sm:h-[600px]">
      <div
        className="relative h-full w-full transition-transform duration-700 ease-[var(--ease-sh)] [transform-style:preserve-3d]"
        style={{ transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))' }}
      >
        <div className="absolute top-[6%] left-0 w-[52%] rotate-[-7deg] drop-shadow-[0_40px_50px_rgb(45_54_144/0.35)] [transform:translateZ(30px)]">
          <Foto slug="tela-relatorios" alt="Tela de relatórios do app Emotrack: emoções por período" sizes="240px" recorte />
        </div>
        <div className="absolute top-0 right-0 w-[56%] rotate-[5deg] drop-shadow-[0_50px_60px_rgb(45_54_144/0.4)] [transform:translateZ(80px)]">
          <Foto slug="tela-inicio" alt="Tela inicial do app Emotrack: registro rápido e emoções da semana" sizes="260px" recorte />
        </div>
        {EMOCOES.slice(0, 4).map((e, i) => (
          <div
            key={e.id}
            className="anima-flutua absolute size-14 sm:size-16"
            style={{
              left: ['-4%', '86%', '6%', '78%'][i],
              top: ['70%', '64%', '-2%', '-6%'][i],
              transform: `translateZ(${120 + i * 20}px) rotate(${[-14, 12, 8, -10][i]}deg)`,
              animationDelay: `${i * -1.5}s`,
            }}
          >
            <Peca cor={e.cor} humor={e.humor} className="size-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function Familias() {
  return (
    <section id="familias" data-opaco data-tema="claro" className="relative z-10 overflow-hidden bg-creme pb-24 text-tinta sm:pb-32">
      <Faixa palavras={['registre', 'entenda', 'compartilhe', 'cuide']} sentido={-1} />
      <div className="mx-auto mt-10 grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="rotulo text-rosa" data-revela>
            Para famílias
          </p>
          <h2 className="titulo mt-5 text-4xl sm:text-6xl" data-revela="1">
            Entenda o que o comportamento do seu filho <em className="text-rosa">está dizendo.</em>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-cinza" data-revela="2">
            Registre o dia a dia, descubra padrões e entenda o que sua criança comunica, com método baseado em ciência (ABA e TCC).
            Simples quando o dia está corrido; completo quando a consulta chega.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4" data-revela="3">
            <a href={LINKS.googlePlay} target="_blank" rel="noopener noreferrer" className="btn btn-rosa">
              <IconePlay className="size-4" /> Baixar grátis no Google Play
            </a>
            <span className="text-sm text-cinza">Em breve no iOS</span>
          </div>
        </div>
        <div data-revela="2">
          <Celulares />
        </div>
      </div>

      <div className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h3 className="titulo max-w-xl text-3xl sm:text-4xl" data-revela>
            Quatro passos. Um histórico que <em>conta a história toda.</em>
          </h3>
          <p className="max-w-sm text-cinza" data-revela="1">
            Você registra o dia a dia. O app organiza tudo no tempo e transforma em relatório para a equipe de cuidado.
          </p>
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((p, i) => (
            <li key={p.t} className="cartao group relative overflow-hidden p-6" data-revela={i} data-tilt>
              <span className="num absolute -top-3 -right-1 text-[5.5rem] leading-none font-bold text-black/[0.04] transition-colors duration-500 group-hover:text-rosa/10">
                0{i + 1}
              </span>
              <Peca cor={EMOCOES[i].cor} humor={EMOCOES[i].humor} className="size-11 transition-transform duration-500 group-hover:rotate-[-10deg]" />
              <p className="mt-5 text-lg font-semibold">{p.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-cinza">{p.p}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.chips.map((c) => (
                  <span key={c} className="rounded-full bg-lavanda px-2.5 py-1 text-[0.7rem] font-medium text-roxo">
                    {c}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto mt-24 grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative" data-revela>
          <Foto slug="mae-filho" alt="Mãe e filho juntos, sorrindo" sizes="(min-width: 1024px) 480px, 100vw" className="aspect-[4/5] rounded-[2rem]" velocidade={0.06} revela />
          <div className="vidro-claro absolute -right-3 bottom-8 max-w-[220px] rounded-2xl p-4 sm:-right-8">
            <p className="text-[0.68rem] font-semibold tracking-wide text-roxo uppercase">Registro rápido</p>
            <p className="mt-1 text-sm font-semibold">Como ele está agora?</p>
            <div className="mt-3 flex gap-1.5">
              {EMOCOES.map((e) => (
                <Peca key={e.id} cor={e.cor} humor={e.humor} className="size-7" />
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="titulo text-3xl sm:text-4xl" data-revela>
            Feito para o dia a dia de <em>famílias atípicas.</em>
          </h3>
          <ul className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {RECURSOS.map((r, i) => (
              <li key={r.t} className="flex gap-4" data-revela={i % 2}>
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-rosa shadow-[0_6px_20px_-10px_rgb(230_49_91/0.5)]">
                  <IconeFuncao nome={r.i} className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold">{r.t}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-cinza">{r.p}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
