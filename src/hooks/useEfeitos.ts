import { useEffect } from 'react'

/**
 * Os efeitos de ponteiro da página inteira, num lugar só e só com mouse:
 *
 *   · ímã      — botões (`.btn`, `[data-ima]`) puxados na direção do cursor
 *                quando ele chega perto, e soltos com uma mola ao afastar;
 *   · inclinar — cartões `[data-tilt]` giram um pouco em 3D e um brilho segue
 *                o cursor por dentro deles (--px/--py);
 *   · cursor   — uma pecinha que segue o ponteiro com atraso e cresce sobre
 *                o que é clicável.
 *
 * Um `pointermove` só, e um quadro de animação só: nada de ouvinte por
 * elemento. Com "reduzir movimento", nada disso liga.
 */
export function useEfeitos() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    /* ── ímã: só os botões na tela entram na conta ── */
    const visiveis = new Set<HTMLElement>()
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        const el = e.target as HTMLElement
        if (e.isIntersecting) visiveis.add(el)
        else {
          visiveis.delete(el)
          el.style.translate = ''
        }
      }
    })
    const vistos = new WeakSet<Element>()
    const varrer = () => {
      for (const el of document.querySelectorAll<HTMLElement>('.btn, [data-ima]')) {
        if (vistos.has(el)) continue
        vistos.add(el)
        io.observe(el)
      }
    }
    varrer()
    const mo = new MutationObserver(varrer)
    mo.observe(document.getElementById('conteudo') ?? document.body, { childList: true })
    window.addEventListener('emotrack:secoes', varrer)

    /* ── cursor ── */
    const cursor = document.createElement('div')
    cursor.className = 'cursor-peca'
    cursor.setAttribute('aria-hidden', 'true')
    cursor.innerHTML = '<span class="cursor-anel"></span><span class="cursor-ponto"></span>'
    document.body.appendChild(cursor)
    let cx = -100
    let cy = -100
    let x = -100
    let y = -100
    let sobre = false

    let raf = 0
    let ultimoEvento: PointerEvent | null = null
    const quadro = () => {
      raf = 0
      const e = ultimoEvento
      if (e) {
        ultimoEvento = null
        // Ímã: lê todas as caixas antes de escrever qualquer estilo (sem forçar layout no meio).
        const caixas = [...visiveis].map((el) => [el, el.getBoundingClientRect()] as const)
        for (const [el, r] of caixas) {
          const mx = r.left + r.width / 2
          const my = r.top + r.height / 2
          const dx = e.clientX - mx
          const dy = e.clientY - my
          const alcance = Math.max(r.width, r.height) * 0.75 + 40
          const d = Math.hypot(dx, dy)
          if (d < alcance) {
            const f = 1 - d / alcance
            el.style.translate = `${(dx * 0.32 * f).toFixed(1)}px ${(dy * 0.38 * f).toFixed(1)}px`
            el.dataset.puxado = '1'
          } else if (el.dataset.puxado) {
            el.style.translate = ''
            delete el.dataset.puxado
          }
        }
        // Inclinar: o cartão sob o cursor.
        const alvo = (e.target as Element | null)?.closest<HTMLElement>('[data-tilt]')
        if (alvo !== inclinado) {
          if (inclinado) inclinado.style.transform = ''
          inclinado = alvo ?? null
        }
        if (inclinado) {
          const r = inclinado.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width
          const py = (e.clientY - r.top) / r.height
          inclinado.style.setProperty('--px', `${(px * 100).toFixed(1)}%`)
          inclinado.style.setProperty('--py', `${(py * 100).toFixed(1)}%`)
          inclinado.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 7).toFixed(2)}deg) rotateY(${((px - 0.5) * 9).toFixed(2)}deg) translateY(-4px)`
        }
        x = e.clientX
        y = e.clientY
        const clicavel = !!(e.target as Element | null)?.closest('a, button, summary, label, [role="button"], input, select, textarea')
        if (clicavel !== sobre) {
          sobre = clicavel
          cursor.classList.toggle('sobre', clicavel)
        }
      }
      // O cursor persegue o ponteiro com atraso; para quando alcança.
      cx += (x - cx) * 0.22
      cy += (y - cy) * 0.22
      cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`
      if (Math.abs(x - cx) > 0.3 || Math.abs(y - cy) > 0.3) raf = requestAnimationFrame(quadro)
    }
    let inclinado: HTMLElement | null = null
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (cx < -50) {
        cx = e.clientX
        cy = e.clientY
      }
      cursor.classList.add('visivel')
      ultimoEvento = e
      if (!raf) raf = requestAnimationFrame(quadro)
    }
    const sair = () => cursor.classList.remove('visivel')
    const apertar = () => cursor.classList.add('apertado')
    const soltar = () => cursor.classList.remove('apertado')

    // O tom do cursor acompanha o fundo (as seções marcam `data-tema`).
    const temas = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) cursor.dataset.tema = (e.target as HTMLElement).dataset.tema
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    const observarTemas = () => {
      for (const el of document.querySelectorAll('[data-tema]')) temas.observe(el)
    }
    observarTemas()
    const moTemas = new MutationObserver(observarTemas)
    moTemas.observe(document.getElementById('conteudo') ?? document.body, { childList: true })
    window.addEventListener('emotrack:secoes', observarTemas)

    window.addEventListener('pointermove', mover, { passive: true })
    document.documentElement.addEventListener('pointerleave', sair)
    window.addEventListener('pointerdown', apertar)
    window.addEventListener('pointerup', soltar)
    return () => {
      io.disconnect()
      mo.disconnect()
      window.removeEventListener('emotrack:secoes', varrer)
      temas.disconnect()
      moTemas.disconnect()
      window.removeEventListener('emotrack:secoes', observarTemas)
      cancelAnimationFrame(raf)
      cursor.remove()
      window.removeEventListener('pointermove', mover)
      document.documentElement.removeEventListener('pointerleave', sair)
      window.removeEventListener('pointerdown', apertar)
      window.removeEventListener('pointerup', soltar)
    }
  }, [])
}
