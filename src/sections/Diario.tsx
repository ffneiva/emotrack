import { useEffect, useState } from 'react'
import { comCena } from '@/components/Palco'
import { Peca } from '@/components/Peca'
import { capitulo } from '@/lib/capitulos'
import { EMOCOES } from '@/lib/cores'
import { cn } from '@/lib/utils'

const INTENSIDADES = ['Leve', 'Moderada', 'Intensa'] as const
const MOMENTOS = ['Manhã', 'Tarde', 'Noite'] as const

type Reg = { emocao: number; intensidade: number; momento: number }

/** O "padrão" da demonstração: a emoção e o momento que mais aparecem. */
function padrao(regs: Reg[]) {
  if (regs.length < 2) return null
  const conta = <T extends number>(f: (r: Reg) => T, n: number) => {
    const c = Array<number>(n).fill(0)
    for (const r of regs) c[f(r)]++
    return c.indexOf(Math.max(...c))
  }
  const e = conta((r) => r.emocao, EMOCOES.length)
  const m = conta((r) => r.momento, MOMENTOS.length)
  const intensas = regs.filter((r) => r.intensidade === 2).length
  return { emocao: EMOCOES[e], momento: MOMENTOS[m], intensas }
}

/**
 * Experimente: a pessoa registra uma emoção e a peça dela cai no gráfico 3D
 * da semana, na coluna "Agora". Nada sai do navegador.
 */
export function Diario() {
  const [emocao, setEmocao] = useState(1)
  const [intensidade, setIntensidade] = useState(0)
  const [momento, setMomento] = useState(0)
  const [regs, setRegs] = useState<Reg[]>([])

  // O formulário mexe na cena antes do "Registrar": a emoção pinta o confete e
  // a peça fantasma, a intensidade faz tremer, o momento muda a luz do dia.
  useEffect(() => {
    comCena((c) => c.definirClima({ emocao, intensidade, momento }))
    document.documentElement.style.setProperty('--cor-dia', momento === 2 ? 'rgb(255 255 255 / 0.7)' : 'rgb(20 24 31 / 0.55)')
  }, [emocao, intensidade, momento])

  const registrar = () => {
    comCena((c) => c.registrar(emocao))
    setRegs((r) => [...r, { emocao, intensidade, momento }].slice(-9))
  }
  const achado = padrao(regs)

  return (
    <section data-3d data-tema="claro" className="relative z-10 min-h-[115svh] px-5 text-tinta sm:px-8">
      <div data-s={capitulo('padroes')} className="pointer-events-none absolute inset-x-0 top-[45%] h-px" />
      <div className="mx-auto flex min-h-[115svh] max-w-6xl items-end pb-[10svh] lg:items-center lg:pb-0">
        <div className="vidro-claro w-full max-w-md rounded-[2rem] p-6 sm:p-8" data-painel data-revela>
          <p className="rotulo text-roxo">Experimente agora</p>
          <h2 className="titulo mt-4 text-[1.9rem] sm:text-4xl">
            Registre como foi o momento. <em className="text-roxo">Veja a peça cair no lugar.</em>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-cinza">
            É assim no app: poucos toques e o registro entra no histórico. Mexa nas opções e veja o fundo mudar com você: a
            emoção pinta as peças, a intensidade agita, o momento muda a luz.
          </p>

          <fieldset className="mt-6">
            <legend className="text-xs font-semibold text-tinta/60">Como a criança está?</legend>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {EMOCOES.map((e, i) => (
                <button
                  key={e.id}
                  type="button"
                  aria-pressed={emocao === i}
                  onClick={() => setEmocao(i)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-2xl border px-2 pt-3 pb-2.5 text-xs font-medium transition-all duration-300',
                    emocao === i ? 'scale-[1.03] border-transparent bg-white shadow-[0_10px_30px_-12px_rgb(20_24_31/0.35)]' : 'border-black/5 bg-white/40 hover:bg-white/80',
                  )}
                  style={emocao === i ? { outline: `2px solid ${e.cor}`, outlineOffset: -2 } : undefined}
                >
                  <Peca cor={e.cor} humor={e.humor} className={cn('size-10 transition-transform duration-500', emocao === i && 'rotate-[-8deg] scale-110')} />
                  {e.nome}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Escolha rotulo="Intensidade" opcoes={INTENSIDADES} valor={intensidade} aoEscolher={setIntensidade} />
            <Escolha rotulo="Quando" opcoes={MOMENTOS} valor={momento} aoEscolher={setMomento} />
          </div>

          <button type="button" onClick={registrar} className="btn btn-rosa anima-pulsa mt-6 w-full">
            Registrar
          </button>

          <div aria-live="polite" className="mt-5 min-h-[4.5rem] rounded-2xl bg-lavanda/70 p-4 text-sm">
            {!regs.length && <p className="text-cinza">Faça alguns registros para a Emotrack encontrar um padrão.</p>}
            {regs.length === 1 && <p className="text-cinza">Primeira peça no lugar. Registre mais uma.</p>}
            {achado && (
              <p>
                <span className="block text-[0.7rem] font-semibold tracking-wide text-roxo uppercase">Padrão detectado</span>
                <span className="font-semibold">
                  {achado.emocao.nome} aparece mais {achado.momento === 'Noite' ? 'à noite' : `de ${achado.momento.toLowerCase()}`}
                </span>
                <span className="text-cinza">
                  {achado.intensas ? ` · ${achado.intensas} ${achado.intensas > 1 ? 'momentos intensos' : 'momento intenso'}` : ''}. No app,
                  isso vira relatório em PDF para terapeutas, escolas e médicos.
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Escolha<T extends string>({
  rotulo,
  opcoes,
  valor,
  aoEscolher,
}: {
  rotulo: string
  opcoes: readonly T[]
  valor: number
  aoEscolher: (i: number) => void
}) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold text-tinta/60">{rotulo}</legend>
      <div className="mt-2 flex rounded-full bg-white/60 p-1">
        {opcoes.map((o, i) => (
          <button
            key={o}
            type="button"
            aria-pressed={valor === i}
            onClick={() => aoEscolher(i)}
            className={cn(
              'flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-colors',
              valor === i ? 'bg-tinta text-white' : 'text-tinta/70 hover:text-tinta',
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
