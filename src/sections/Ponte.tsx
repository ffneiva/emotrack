import { IconeCheck, IconePlay, IconeSeta } from '@/components/Icones'
import { capitulo } from '@/lib/capitulos'
import { LINKS } from '@/lib/links'

const LADOS = [
  {
    tag: 'Para famílias',
    cor: 'text-rosa',
    p: 'Por trás de cada comportamento existe um motivo. A Emotrack te ajuda a observar e registrar o dia a dia para entender o que sua criança está tentando comunicar.',
    itens: ['Registre emoções e crises em segundos.', 'Chegue à consulta com tudo organizado.', 'Acesso gratuito para famílias atípicas.'],
    cta: { href: LINKS.googlePlay, texto: 'Baixar grátis', classe: 'btn-rosa', play: true },
  },
  {
    tag: 'Para profissionais',
    cor: 'text-verde',
    p: 'Menos tempo coletando, mais tempo cuidando. A Emotrack reúne os registros da família e apresenta um panorama clínico claro da criança.',
    itens: [
      'Receba o histórico pronto antes da consulta.',
      'Identifique padrões com apoio de inteligência artificial.',
      'Decida mais rápido, com base em evidências.',
    ],
    cta: { href: LINKS.plataforma, texto: 'Acessar a plataforma', classe: 'btn-verde', play: false },
  },
]

/** O arco do logotipo vira a ponte: a casa de um lado, a terapia do outro. */
export function Ponte() {
  return (
    <section data-3d data-tema="claro" className="relative z-10 px-5 pt-[16svh] pb-[10svh] text-tinta sm:px-8">
      <div className="mx-auto max-w-3xl text-center" data-revela>
        <p className="rotulo text-rosa">Como funciona</p>
        <h2 className="titulo legivel-claro mt-5 text-[2.1rem] sm:text-5xl lg:text-6xl">
          A ponte entre o que acontece <em>em casa</em> e o que é discutido <em>na terapia.</em>
        </h2>
        <p className="legivel-claro mx-auto mt-6 max-w-xl text-cinza sm:text-lg">
          O que a família registra se transforma em dados clínicos para o profissional.
        </p>
      </div>
      <div data-s={capitulo('ponte')} className="h-[88svh]" />
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:gap-[22%]">
        {LADOS.map((l, i) => (
          <article key={l.tag} className="vidro-claro relative rounded-[2rem] p-7 sm:p-8" data-revela={i} data-tilt>
            <p className={`rotulo ${l.cor}`}>{l.tag}</p>
            <p className="mt-4 leading-relaxed text-cinza">{l.p}</p>
            <ul className="mt-6 space-y-3">
              {l.itens.map((it) => (
                <li key={it} className="flex gap-3 text-[0.95rem] font-medium">
                  <IconeCheck className={`mt-0.5 size-5 shrink-0 ${l.cor}`} />
                  {it}
                </li>
              ))}
            </ul>
            <a href={l.cta.href} target="_blank" rel="noopener noreferrer" className={`btn ${l.cta.classe} mt-7`}>
              {l.cta.play && <IconePlay className="size-4" />}
              {l.cta.texto}
              {!l.cta.play && <IconeSeta className="size-4" />}
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
