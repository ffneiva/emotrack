import { useEffect, useState } from 'react'
import { LINKS, zap } from '@/lib/links'
import { cn } from '@/lib/utils'
import { IconeEmail, IconeGithub, IconeInstagram, IconePlay, IconeWhats } from './Icones'
import { Logo } from './Logo'
import { SECOES } from './Nav'

export function Rodape({ aoIr }: { aoIr: (id: string) => void }) {
  return (
    <footer data-tema="escuro" className="relative z-10 overflow-hidden bg-breu text-white/70">
      <div className="arco-gradiente h-1.5 w-full" />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-16 pb-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo className="h-11 w-auto text-white" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">
            Acompanhamento comportamental para crianças com autismo, TDAH e outras neurodivergências, do app da família à plataforma do
            profissional.
          </p>
          <div className="mt-6 flex gap-2">
            {[
              { href: LINKS.instagram, rotulo: 'Instagram @emotrackbr', Icone: IconeInstagram },
              { href: zap(), rotulo: 'WhatsApp', Icone: IconeWhats },
              { href: `mailto:${LINKS.email}`, rotulo: 'E-mail', Icone: IconeEmail },
            ].map(({ href, rotulo, Icone }) => (
              <a
                key={rotulo}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={rotulo}
                className="grid size-11 place-items-center rounded-full border border-white/15 transition-colors hover:border-white/50 hover:text-white"
              >
                <Icone className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>
        <nav aria-label="Rodapé">
          <p className="rotulo text-white/40">Navegue</p>
          <ul className="mt-5 space-y-3 text-sm">
            {SECOES.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    aoIr(s.id)
                  }}
                  className="hover:text-white"
                >
                  {s.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="rotulo text-white/40">Comece agora</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href={LINKS.googlePlay} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Baixar no Google Play
              </a>
            </li>
            <li>
              <a href={LINKS.plataforma} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Plataforma profissional
              </a>
            </li>
            <li>
              <a href={`mailto:${LINKS.email}`} className="hover:text-white">
                {LINKS.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-white/10 px-5 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© Emotrack. Todos os direitos reservados.</p>
        <a
          href="https://github.com/ffneiva"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 transition-colors hover:text-white"
        >
          <IconeGithub className="size-4" /> Desenvolvido por Felipe Neiva
        </a>
      </div>
    </footer>
  )
}

/** O botão "baixar o app" que acompanha a rolagem no celular. */
export function BotaoFlutuante() {
  const [ver, setVer] = useState(false)
  useEffect(() => {
    const aoRolar = () => setVer(window.scrollY > window.innerHeight * 0.9)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])
  return (
    <div
      className={cn(
        'fixed right-4 bottom-4 z-40 flex gap-2 transition-all duration-500 ease-[var(--ease-sh)] sm:right-6 sm:bottom-6',
        ver ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0',
      )}
    >
      <a
        href={zap()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale com a Emotrack no WhatsApp"
        className="grid size-13 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_-10px_rgb(37_211_102/0.7)] transition-transform hover:-translate-y-0.5"
      >
        <IconeWhats className="size-6" />
      </a>
      <a href={LINKS.googlePlay} target="_blank" rel="noopener noreferrer" className="btn btn-rosa !h-13 !py-0 sm:hidden">
        <IconePlay className="size-4" /> Baixar grátis
      </a>
    </div>
  )
}
