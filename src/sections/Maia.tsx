import { useEffect, useRef, useState } from 'react'
import { IconeFuncao } from '@/components/Icones'
import { capitulo } from '@/lib/capitulos'

const FRENTES = [
  { i: 'alerta', t: 'Apoio em momentos de crise', p: 'Orientações e sugestões práticas para a família, quando mais precisam.' },
  { i: 'mensagem', t: 'Comunicação que acolhe', p: 'Coletas via WhatsApp no momento certo, com linguagem acessível.' },
  { i: 'relatorio', t: 'Dados que fortalecem decisões', p: 'O que a família compartilha vai direto para o histórico, com continuidade e clareza.' },
]

/** Uma conversa de exemplo, escrita aos poucos quando entra na tela. */
const CONVERSA = [
  { de: 'maia', texto: 'Oi! Como o Arthur passou a manhã de hoje?' },
  { de: 'familia', texto: 'Ficou bem agitado depois que mudamos a rotina da escola.' },
  { de: 'maia', texto: 'Obrigada por contar. Registrei no histórico como "mudança de rotina". A terapeuta vai ver isso antes da próxima sessão.' },
]

function Conversa() {
  const ref = useRef<HTMLDivElement>(null)
  const [vistas, setVistas] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timers: number[] = []
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        timers = CONVERSA.map((_, i) => window.setTimeout(() => setVistas(i + 1), 500 + i * 1500))
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])
  return (
    <div ref={ref} className="vidro-escuro rounded-[1.6rem] p-5" data-painel>
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <span className="relative grid size-10 place-items-center rounded-full bg-gradient-to-br from-ciano to-roxo">
          <span className="size-3 rounded-full bg-white/90" />
          <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-[#16133f] bg-[#3ddc84]" />
        </span>
        <span>
          <span className="block text-sm font-semibold">Maia, sua assistente inteligente</span>
          <span className="block text-[0.7rem] text-[#7be0b0]">Online</span>
        </span>
      </div>
      <ul className="mt-4 min-h-[214px] space-y-2.5">
        {CONVERSA.slice(0, vistas).map((m, i) => (
          <li
            key={i}
            className={
              m.de === 'maia'
                ? 'max-w-[86%] animate-[entra_.6s_var(--ease-sh)] rounded-2xl rounded-tl-md bg-white/10 px-4 py-2.5 text-sm'
                : 'ml-auto max-w-[80%] animate-[entra_.6s_var(--ease-sh)] rounded-2xl rounded-tr-md bg-rosa px-4 py-2.5 text-sm'
            }
          >
            {m.texto}
          </li>
        ))}
        {vistas < CONVERSA.length && vistas > 0 && (
          <li className="flex w-16 gap-1 rounded-2xl bg-white/10 px-4 py-3" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 animate-bounce rounded-full bg-white/60" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </li>
        )}
      </ul>
      <p className="mt-3 text-[0.62rem] text-white/35">Conversa ilustrativa</p>
    </div>
  )
}

/** O anel de peças girando em volta do núcleo de luz: a Maia. */
export function Maia() {
  return (
    <section id="maia" data-3d data-tema="escuro" className="relative z-10 min-h-[170svh] px-5 text-white sm:px-8">
      <div data-s={capitulo('maia')} className="pointer-events-none absolute inset-x-0 top-[42%] h-px" />
      <div className="mx-auto flex min-h-[170svh] max-w-6xl items-end pb-[10svh] lg:items-center lg:pb-0">
        <div className="w-full max-w-md max-lg:rounded-[2rem] max-lg:bg-noite/75 max-lg:p-6 max-lg:backdrop-blur-xl">
          <p className="rotulo text-ciano-claro" data-revela>
            Inteligência artificial
          </p>
          <h2 className="titulo legivel-escuro mt-5 text-4xl sm:text-[3.2rem]" data-revela="1">
            Conheça a Maia, <em className="texto-arco">sua aliada</em> para transformar o cuidado.
          </h2>
          <p className="legivel-escuro mt-5 leading-relaxed text-white/75" data-revela="2">
            Mais do que tecnologia: suporte real para você, sua equipe e as famílias, todos os dias, em tempo real. Inteligência
            artificial desenvolvida com o CEIA-UFG, o Centro de Excelência em IA da Universidade Federal de Goiás.
          </p>
          <div className="mt-8" data-revela="3">
            <Conversa />
          </div>
          <ul className="mt-8 space-y-5">
            {FRENTES.map((f, i) => (
              <li key={f.t} className="flex gap-4" data-revela={i}>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.08] text-ciano-claro">
                  <IconeFuncao nome={f.i} className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{f.t}</span>
                  <span className="block text-sm leading-relaxed text-white/60">{f.p}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
