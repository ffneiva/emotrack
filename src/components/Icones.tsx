type P = { className?: string }
const linha = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const IconeSeta = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...linha} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const IconeFechar = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...linha} aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
export const IconeMais = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...linha} aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const IconeCheck = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...linha} aria-hidden>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)
export const IconeRelogio = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...linha} aria-hidden>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2.5 1.5M9.5 2.5h5" />
  </svg>
)
export const IconeWhats = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.36A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.08.8.82-3-.2-.31a8.2 8.2 0 1 1 6.96 3.84Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25 0-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.3-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.47a.9.9 0 0 0-.66.3 2.76 2.76 0 0 0-.86 2.06c0 1.21.88 2.38 1 2.55.12.16 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.6.19 1.13.16 1.56.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.15-1.17-.06-.1-.22-.17-.47-.29Z" />
  </svg>
)
export const IconeInstagram = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...linha} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
)
export const IconeEmail = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...linha} aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
)
export const IconePlay = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M3.6 2.3a1 1 0 0 0-.4.8v17.8a1 1 0 0 0 .4.8l10-9.7-10-9.7Zm11.2 8.5 2.9-2.8L5.5 1.2l9.3 9.6Zm0 2.4-9.3 9.6 12.2-6.8-2.9-2.8Zm4.2-4-3.1 3 3.1 3 3.3-1.9a1.2 1.2 0 0 0 0-2.1L19 9.2Z" />
  </svg>
)
export const IconeApple = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7a4.5 4.5 0 0 0-3.5-1.9c-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8a4.7 4.7 0 0 0-4 2.4c-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4a10 10 0 0 0 1.4-2.8 4.3 4.3 0 0 1-2.6-3.9ZM14 5.4A4.3 4.3 0 0 0 15 2.2a4.4 4.4 0 0 0-2.9 1.5 4.1 4.1 0 0 0-1 3.1A3.6 3.6 0 0 0 14 5.4Z" />
  </svg>
)
export const IconeGithub =({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
)

/* Ícones das funcionalidades. */
const caminhos: Record<string, string> = {
  pulso: 'M3 12h4l3-8 4 16 3-8h4',
  coracao: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  relatorio: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4',
  pasta: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  equipe: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a6 6 0 0 1 12 0M17 11a2.5 2.5 0 1 0 0-5M21 20a5 5 0 0 0-4-4.9',
  escudo: 'M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z M9 12l2 2 4-4',
  ia: 'M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3M7 6h10v12H7zM10 10h4v4h-4z',
  rede: 'M6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM11 7.6 7 14.4M13 7.6l4 6.8M8 16h8',
  relogio: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  ciencia: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9',
  moeda: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2',
  mensagem: 'M4 5h16v11H8l-4 4z M8 10h8',
  alerta: 'M12 4 2.5 20h19L12 4ZM12 10v4M12 17h.01',
}

export function IconeFuncao({ nome, className }: P & { nome: keyof typeof caminhos | string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...linha} aria-hidden>
      <path d={caminhos[nome] ?? caminhos.pulso} />
    </svg>
  )
}
