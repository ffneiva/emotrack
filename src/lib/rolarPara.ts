import { prefersReducedMotion } from './utils'

/**
 * Rola até um id da página. A rolagem é a nativa do navegador, sem
 * suavização por script: é a que responde na hora, no mouse e no toque.
 */
export function scrollToSection(id: string) {
  const alvo = document.getElementById(id)
  if (!alvo) return
  alvo.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}
