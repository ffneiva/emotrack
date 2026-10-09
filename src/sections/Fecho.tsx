import { type FormEvent, useState } from 'react'
import { IconeApple, IconePlay, IconeSeta, IconeWhats } from '@/components/Icones'
import { capitulo } from '@/lib/capitulos'
import { LINKS, zap } from '@/lib/links'

const PERFIS = ['Terapeuta / Clínico', 'Pesquisador', 'Mãe / Responsável', 'Escola / Instituição']

/** O fecho: o arco outra vez, a chamada para começar e o contato pela clínica. */
export function Fecho() {
  const [enviado, setEnviado] = useState(false)

  // Nada vai para servidor: o formulário só monta a mensagem e abre o WhatsApp.
  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const campo = (k: string) => String(d.get(k) ?? '').trim().slice(0, 600)
    const linhas = [
      'Contato pelo site Emotrack',
      `Nome: ${campo('nome')}`,
      `E-mail: ${campo('email')}`,
      `Perfil: ${campo('perfil')}`,
      campo('instituicao') && `Instituição: ${campo('instituicao')}`,
      campo('mensagem') && `Mensagem: ${campo('mensagem')}`,
    ].filter(Boolean)
    window.open(zap(linhas.join('\n')), '_blank', 'noopener,noreferrer')
    setEnviado(true)
  }

  return (
    <section id="contato" data-3d data-tema="claro" className="relative z-10 px-5 pt-[62svh] pb-24 text-tinta sm:px-8 sm:pt-[70svh]">
      <div data-s={capitulo('fecho')} className="pointer-events-none absolute inset-x-0 top-[36svh] h-px" />
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="titulo legivel-claro text-5xl sm:text-7xl" data-revela>
          Comece agora, <em className="texto-arco">gratuitamente.</em>
        </h2>
        <p className="legivel-claro mx-auto mt-6 max-w-xl text-lg text-cinza" data-revela="1">
          Organize o cuidado da sua criança com autismo, TDAH e outras neurodivergências e conecte toda a equipe.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" data-revela="2">
          <a href={LINKS.googlePlay} target="_blank" rel="noopener noreferrer" className="btn bg-tinta !py-3 text-white hover:bg-black">
            <IconePlay className="size-5" />
            <span className="text-left leading-tight">
              <span className="block text-[0.62rem] font-normal opacity-70">Disponível no</span>
              Google Play
            </span>
          </a>
          <span className="btn btn-linha cursor-default !py-3 text-tinta/60" title="Em breve">
            <IconeApple className="size-5" />
            <span className="text-left leading-tight">
              <span className="block text-[0.62rem] font-normal opacity-70">Em breve na</span>
              App Store
            </span>
          </span>
          <a href={LINKS.plataforma} target="_blank" rel="noopener noreferrer" className="btn btn-verde">
            Plataforma profissional <IconeSeta className="size-4" />
          </a>
        </div>
      </div>

      <div className="vidro-claro mx-auto mt-24 grid max-w-5xl gap-10 rounded-[2.2rem] p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr]" data-revela data-painel>
        <div>
          <p className="rotulo text-verde">Fale com a Emotrack</p>
          <h3 className="titulo mt-4 text-3xl sm:text-4xl">
            Leve a Emotrack para <em>sua clínica.</em>
          </h3>
          <p className="mt-4 leading-relaxed text-cinza">Preencha e a conversa abre no WhatsApp da equipe, já com os seus dados.</p>
        </div>
        <form onSubmit={enviar} className="grid gap-3 sm:grid-cols-2">
          <Campo nome="nome" rotulo="Nome" obrigatorio autoComplete="name" />
          <Campo nome="email" rotulo="E-mail" tipo="email" obrigatorio autoComplete="email" />
          <label className="grid gap-1.5 text-xs font-semibold text-tinta/60">
            Você é
            <select name="perfil" className="h-12 rounded-xl border border-black/10 bg-white px-3 text-sm font-normal text-tinta">
              {PERFIS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <Campo nome="instituicao" rotulo="Instituição (opcional)" autoComplete="organization" />
          <label className="grid gap-1.5 text-xs font-semibold text-tinta/60 sm:col-span-2">
            Mensagem
            <textarea name="mensagem" rows={3} maxLength={600} className="rounded-xl border border-black/10 bg-white p-3 text-sm font-normal text-tinta" />
          </label>
          <button type="submit" className="btn mt-1 bg-[#25D366] text-white hover:bg-[#1ebe5a] sm:col-span-2">
            <IconeWhats className="size-5" /> {enviado ? 'Abrindo o WhatsApp…' : 'Enviar pelo WhatsApp'}
          </button>
          <p className="text-[0.7rem] text-cinza sm:col-span-2">Seus dados são usados apenas para o retorno do contato.</p>
        </form>
      </div>
    </section>
  )
}

function Campo({
  nome,
  rotulo,
  tipo = 'text',
  obrigatorio,
  autoComplete,
}: {
  nome: string
  rotulo: string
  tipo?: string
  obrigatorio?: boolean
  autoComplete?: string
}) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold text-tinta/60">
      {rotulo}
      <input
        name={nome}
        type={tipo}
        required={obrigatorio}
        maxLength={160}
        autoComplete={autoComplete}
        className="h-12 rounded-xl border border-black/10 bg-white px-3 text-sm font-normal text-tinta"
      />
    </label>
  )
}
