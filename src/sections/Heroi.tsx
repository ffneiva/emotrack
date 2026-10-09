import { IconePlay, IconeSeta } from '@/components/Icones'
import { capitulo } from '@/lib/capitulos'
import { LINKS } from '@/lib/links'
import { cn } from '@/lib/utils'

const PALAVRAS = ['Por', 'trás', 'de', 'todo', 'comportamento', 'existe']

/** Os avisos do app flutuando em volta do título (os mesmos do banner atual). */
const AVISOS = [
  { rotulo: 'Emotrack · 08:15', texto: 'Crise registrada', cor: '#E6315B', lugar: 'left-[5%] top-[24%]', forca: '22px' },
  { rotulo: 'Padrão detectado', texto: 'Manhãs: maior risco', cor: '#F5D054', lugar: 'right-[6%] top-[30%]', forca: '-18px' },
  { rotulo: 'Estratégia', texto: 'Brincadeira sensorial acalma', cor: '#4FA9A6', lugar: 'right-[12%] bottom-[16%]', forca: '14px' },
]

export function Heroi({ pronto, aoIr }: { pronto: boolean; aoIr: (id: string) => void }) {
  return (
    <section
      id="inicio"
      data-3d
      data-tema="escuro"
      data-s={capitulo('heroi')}
      className="relative z-10 flex min-h-svh flex-col items-center justify-center px-5 pt-28 pb-24 text-center text-white sm:px-8"
    >
      {/* Um halo escuro atrás do título: as peças passam por trás sem atrapalhar a leitura. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[80svh] w-[min(1100px,140vw)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(16_13_46/0.82),rgb(16_13_46/0.55)_55%,transparent)]"
      />
      <p
        className={cn(
          'vidro-escuro relative mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[0.72rem] font-medium tracking-wide text-white/85 transition-all duration-1000 ease-[var(--ease-sh)] sm:text-xs',
          pronto ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}
      >
        <span className="arco-gradiente size-2 rounded-full" />
        Autismo, TDAH e outras neurodivergências
      </p>
      <h1 className="titulo legivel-escuro relative max-w-5xl text-[2.7rem] sm:text-6xl lg:text-[5.6rem]">
        {PALAVRAS.map((p, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span
              className="inline-block transition-transform duration-[1200ms] ease-[var(--ease-sh)]"
              style={{ transform: pronto ? 'none' : 'translateY(110%)', transitionDelay: `${120 + i * 70}ms` }}
            >
              {p}&nbsp;
            </span>
          </span>
        ))}
        <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <em
            className="texto-arco inline-block pr-[0.08em] transition-transform duration-[1200ms] ease-[var(--ease-sh)]"
            style={{ transform: pronto ? 'none' : 'translateY(110%)', transitionDelay: `${120 + PALAVRAS.length * 70}ms` }}
          >
            um motivo.
          </em>
        </span>
      </h1>
      <p
        className={cn(
          'legivel-escuro relative mt-7 max-w-2xl text-base leading-relaxed text-white/80 transition-all delay-700 duration-1000 ease-[var(--ease-sh)] sm:text-lg',
          pronto ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
        )}
      >
        A Emotrack ajuda você a encontrá-lo: transforma os registros do dia a dia em um histórico organizado, que a família compartilha
        com toda a equipe de cuidado.
      </p>
      <div
        className={cn(
          'relative mt-10 flex flex-col gap-3 transition-all delay-[900ms] duration-1000 ease-[var(--ease-sh)] sm:flex-row',
          pronto ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
        )}
      >
        <a href={LINKS.googlePlay} target="_blank" rel="noopener noreferrer" className="btn btn-rosa">
          <IconePlay className="size-4" /> Baixar o app grátis
        </a>
        <a
          href="#profissionais"
          onClick={(e) => {
            e.preventDefault()
            aoIr('profissionais')
          }}
          className="btn btn-linha text-white"
        >
          Sou profissional <IconeSeta className="size-4" />
        </a>
      </div>

      {AVISOS.map((a, i) => (
        <div
          key={a.texto}
          aria-hidden
          data-mouse
          style={{ ['--forca' as string]: a.forca }}
          className={cn('pointer-events-none absolute hidden lg:block', a.lugar)}
        >
          <div
            className={cn(
              'vidro-escuro anima-flutua flex items-center gap-3 rounded-2xl py-3 pr-5 pl-3 text-left transition-all duration-1000 ease-[var(--ease-sh)]',
              pronto ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
            )}
            style={{ transitionDelay: `${1200 + i * 220}ms`, animationDelay: `${i * -2}s` }}
          >
            <span className="grid size-9 place-items-center rounded-xl" style={{ background: `${a.cor}33` }}>
              <span className="size-2.5 rounded-full" style={{ background: a.cor, boxShadow: `0 0 12px ${a.cor}` }} />
            </span>
            <span>
              <span className="block text-[0.65rem] font-medium tracking-wide text-white/55 uppercase">{a.rotulo}</span>
              <span className="block text-sm font-semibold text-white">{a.texto}</span>
            </span>
          </div>
        </div>
      ))}

      <div
        className={cn(
          'absolute inset-x-0 bottom-7 flex flex-col items-center gap-3 text-white/55 transition-opacity delay-[1600ms] duration-1000',
          pronto ? 'opacity-100' : 'opacity-0',
        )}
      >
        <span className="rotulo text-[0.62rem]">Role e veja as peças se encaixarem</span>
        <span className="h-10 w-px overflow-hidden bg-white/15">
          <span className="anima-desce block h-full w-full bg-white/70" />
        </span>
      </div>
    </section>
  )
}
