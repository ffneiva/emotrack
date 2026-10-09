import { useRef } from 'react'
import { IconeCheck, IconeRelogio } from '@/components/Icones'
import { Peca } from '@/components/Peca'
import { useMotor } from '@/hooks/useMotor'
import { EMOCOES } from '@/lib/cores'

/**
 * Do caos à clareza, em papel: a semana da família em bilhetes soltos — o
 * que a CEO da Emotrack descreve como a realidade antes da sessão, "de
 * memória ou com anotações espalhadas" — que voam, se alinham e viram as
 * linhas do relatório enquanto a pessoa rola. Ao mesmo tempo, as peças 3D do
 * fundo saem do caos e se encaixam no quebra-cabeça.
 *
 * Sem o motor (ou com "reduzir movimento"), a seção já é o estado final: o
 * relatório arrumado.
 */

const LINHAS = [
  { bilhete: 'ter: crise forte no mercado… foi o barulho?', emocao: 5, dia: 'Terça', tipo: 'Crise', detalhe: 'Gatilho: barulho · intensa', cor: '#fff3a8' },
  { bilhete: 'dormiu mal de novo (3ª noite!!)', emocao: 4, dia: 'Quarta', tipo: 'Sono', detalhe: 'Três noites seguidas', cor: '#ffd6e4' },
  { bilhete: 'escola ligou — não quis entrar na sala', emocao: 2, dia: 'Quinta', tipo: 'Escola', detalhe: 'Mudança de rotina', cor: '#d8f0ff' },
  { bilhete: 'remédio: mudou o horário dia 12', emocao: 0, dia: 'Quinta', tipo: 'Medicação', detalhe: 'Horário ajustado', cor: '#e5ffd8' },
  { bilhete: 'areia + música acalmou ♥', emocao: 1, dia: 'Sexta', tipo: 'Estratégia', detalhe: 'Funcionou em minutos', cor: '#fff3a8' },
  { bilhete: 'chorou na troca de roupa. de novo?', emocao: 3, dia: 'Sábado', tipo: 'Rotina', detalhe: 'Padrão: manhãs', cor: '#ffd6e4' },
  { bilhete: 'domingo: dia ótimo no parque :)', emocao: 1, dia: 'Domingo', tipo: 'Dia bom', detalhe: 'Registro diário', cor: '#d8f0ff' },
]

function semente(i: number) {
  const x = Math.sin(i * 78.233 + 1.7) * 43758.5453
  return x - Math.floor(x)
}

export function Bilhetes() {
  const ref = useRef<HTMLElement>(null)
  const relogio = useRef<HTMLSpanElement>(null)

  useMotor(ref, ({ gsap }, raiz, calmo) => {
    if (calmo) return
    const linhas = [...raiz.querySelectorAll<HTMLElement>('[data-linha]')]
    const compacto = window.innerWidth < 1024
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: raiz,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        onUpdate: (st) => {
          // O relógio da sala de espera: 10 minutos correndo até o relatório ficar pronto.
          const el = relogio.current
          if (!el) return
          const p = st.progress
          if (p >= 0.62) el.textContent = 'Relatório pronto'
          else {
            const resta = Math.max(0, 600 - (p / 0.62) * 600)
            el.textContent = `${Math.floor(resta / 60)}:${String(Math.floor(resta % 60)).padStart(2, '0')} até a consulta`
          }
          raiz.dataset.fase = p >= 0.62 ? 'clareza' : 'caos'
        },
      },
    })
    // O caos: cada bilhete jogado num canto da tela, torto.
    tl.fromTo(
      linhas,
      {
        x: (i: number) => (semente(i) - 0.5) * window.innerWidth * (compacto ? 0.5 : 0.75),
        y: (i: number) => (semente(i + 11) - 0.5) * window.innerHeight * (compacto ? 0.55 : 0.75),
        rotate: (i: number) => (semente(i + 5) - 0.5) * 44,
        scale: 1.06,
      },
      { x: 0, y: 0, rotate: 0, scale: 1, duration: 0.55, stagger: { each: 0.04, from: 'random' }, ease: 'power2.inOut' },
      0.05,
    )
    // O papel vira linha do relatório.
    tl.fromTo(raiz.querySelectorAll('[data-bilhete]'), { opacity: 1 }, { opacity: 0, duration: 0.14, stagger: 0.02 }, 0.52)
    tl.fromTo(raiz.querySelectorAll('[data-limpa]'), { opacity: 0 }, { opacity: 1, duration: 0.14, stagger: 0.02 }, 0.54)
    tl.fromTo(raiz.querySelectorAll('[data-moldura]'), { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.18 }, 0.5)
    // Os dois títulos trocam de lugar.
    tl.fromTo(raiz.querySelector('[data-antes]'), { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: 0.1 }, 0.56)
    tl.fromTo(raiz.querySelector('[data-depois]'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12 }, 0.62)
    tl.to({}, { duration: 0.2 }, 0.8)
  })

  return (
    <section ref={ref} data-tema="escuro" data-fase="clareza" className="group/b relative z-10 h-[230svh] text-white">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden px-5 sm:px-8">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="relative">
            {/* Um halo escuro atrás do texto: as peças passam por trás sem atrapalhar a leitura. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-24 -inset-y-20 bg-[radial-gradient(closest-side,rgb(16_13_46/0.85),rgb(16_13_46/0.5)_60%,transparent)]"
            />
            <div className="relative grid">
            <div data-antes className="opacity-0 [grid-area:1/1]">
              <p className="rotulo text-amarelo">O caos</p>
              <h2 data-sem-caos className="titulo legivel-escuro mt-4 text-[2rem] sm:text-5xl">
                Toda semana, poucos minutos para <em className="text-amarelo">contar tudo.</em>
              </h2>
              <p className="legivel-escuro mt-4 max-w-md leading-relaxed text-white/75">
                Na sala de espera, a família tem uns 10 minutos para lembrar a semana inteira: de memória, ou com anotações soltas no papel
                e no celular.
              </p>
            </div>
            <div data-depois className="[grid-area:1/1]">
              <p className="rotulo text-ciano-claro">A clareza</p>
              <h2 data-sem-caos className="titulo legivel-escuro mt-4 text-[2rem] sm:text-5xl">
                Com a Emotrack, a semana <em className="text-ciano-claro">chega organizada.</em>
              </h2>
              <p className="legivel-escuro mt-4 max-w-md leading-relaxed text-white/75">
                Cada registro vira uma linha do histórico, e o relatório fica pronto antes da consulta, para terapeutas, escolas e médicos.
              </p>
            </div>
            </div>
            <p className="vidro-escuro relative mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
              <IconeRelogio className="size-4 text-amarelo group-data-[fase=clareza]/b:hidden" />
              <IconeCheck className="hidden size-4 text-[#7be0b0] group-data-[fase=clareza]/b:block" />
              <span ref={relogio} className="num">
                Relatório pronto
              </span>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div data-moldura className="absolute -inset-4 rounded-[2rem] bg-white shadow-[0_50px_100px_-40px_rgb(0_0_0/0.7)] sm:-inset-6" />
            <div className="relative">
              <div data-moldura className="mb-3 flex items-center justify-between text-tinta">
                <span>
                  <span className="block text-[0.65rem] font-semibold tracking-widest text-roxo uppercase">Relatório da semana</span>
                  <span className="block text-sm font-semibold">Arthur · segunda a domingo</span>
                </span>
                <span className="rounded-full bg-tinta px-3 py-1.5 text-[0.7rem] font-semibold text-white">PDF</span>
              </div>
              <ul className="space-y-1.5">
                {LINHAS.map((l, i) => {
                  const emo = EMOCOES[l.emocao]
                  return (
                    <li key={i} data-linha className="relative h-11 sm:h-12">
                      {/* O bilhete de papel (o caos). */}
                      <div
                        data-bilhete
                        className="absolute inset-0 flex items-center rounded-md px-4 font-serifa text-[0.95rem] text-tinta/85 italic opacity-0 shadow-[0_12px_24px_-12px_rgb(0_0_0/0.6)] sm:text-base"
                        style={{ background: l.cor }}
                      >
                        {l.bilhete}
                      </div>
                      {/* A linha do relatório (a clareza). */}
                      <div data-limpa className="absolute inset-0 flex items-center gap-3 rounded-xl bg-lavanda/70 px-3 text-tinta">
                        <Peca cor={emo.cor} humor={emo.humor} className="size-7 shrink-0" />
                        <span className="w-16 shrink-0 text-xs font-semibold sm:w-20 sm:text-sm">{l.dia}</span>
                        <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-semibold text-roxo">{l.tipo}</span>
                        <span className="truncate text-xs text-cinza sm:text-sm">{l.detalhe}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
