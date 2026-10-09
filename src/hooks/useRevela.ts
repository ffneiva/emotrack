import { useEffect } from 'react'

/**
 * Revela ao rolar: todo `[data-revela]` ganha a classe `in` quando entra na
 * tela (uma vez só). Observa também o que é montado depois (as seções
 * preguiçosas), com um MutationObserver.
 *
 * `data-revela="2"` atrasa a entrada em 2 × 90 ms — para escalonar listas.
 */
export function useRevela() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue
          const el = e.target as HTMLElement
          const passo = Number(el.dataset.revela) || 0
          el.style.transitionDelay = `${passo * 90}ms`
          el.classList.add('in')
          io.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    const vistos = new WeakSet<Element>()
    const varrer = () => {
      for (const el of document.querySelectorAll('[data-revela]')) {
        if (vistos.has(el)) continue
        vistos.add(el)
        io.observe(el)
      }
    }
    varrer()
    const mo = new MutationObserver(varrer)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}
