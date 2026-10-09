import { type Motor, novo, perto } from './movimento'

/**
 * As cenas de rolagem da página (GSAP + ScrollTrigger), armadas uma vez para
 * o escopo inteiro. Cada uma lê um atributo:
 *
 *   h2.titulo            o título chega em caos — palavras espalhadas, giradas
 *                        e borradas — e se organiza enquanto a pessoa rola;
 *   [data-revela-foto]   a foto se abre de dentro para fora (clip-path) e a
 *                        imagem desinfla de 1,25 para 1;
 *   [data-faixa]         uma faixa de texto que corre de lado com a rolagem;
 *   [data-acende]        um parágrafo cujas palavras acendem uma a uma;
 *   [data-conta]         um número que conta até o valor quando aparece.
 *
 * Quase tudo com `scrub` (a animação é a rolagem); os títulos tocam uma vez
 * ao entrar, porque são muitas palavras. Antes de o motor
 * chegar — e para sempre, se ele falhar —, tudo já está no lugar final.
 */

/** Quebra o texto em palavras (spans), preservando os <em> e o que tiver `data-inteiro`. */
function emPalavras(raiz: HTMLElement): HTMLElement[] {
  const palavras: HTMLElement[] = []
  const andar = (no: Node) => {
    for (const filho of [...no.childNodes]) {
      if (filho.nodeType === Node.TEXT_NODE) {
        const partes = (filho.textContent ?? '').split(/(\s+)/)
        const frag = document.createDocumentFragment()
        for (const p of partes) {
          if (!p) continue
          if (/^\s+$/.test(p)) frag.append(p)
          else {
            const s = document.createElement('span')
            s.className = 'palavra'
            s.textContent = p
            frag.append(s)
            palavras.push(s)
          }
        }
        filho.replaceWith(frag)
      } else if (filho instanceof HTMLElement) {
        // Texto em degradê recortado não pode ser quebrado: anima inteiro.
        if (filho.classList.contains('texto-arco') || filho.dataset.inteiro !== undefined) {
          filho.classList.add('palavra')
          palavras.push(filho)
        } else andar(filho)
      }
    }
  }
  andar(raiz)
  return palavras
}

// Quebra uma vez só: o React (modo estrito) arma as cenas duas vezes.
const quebrados = new WeakMap<HTMLElement, HTMLElement[]>()
function palavrasDe(el: HTMLElement) {
  let p = quebrados.get(el)
  if (!p) {
    p = emPalavras(el)
    quebrados.set(el, p)
  }
  return p
}

function semente(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export function armarCenas({ gsap }: Motor, escopo: HTMLElement, compacto: boolean, ctx: gsap.Context) {
  // Títulos: do caos à clareza.
  for (const h of escopo.querySelectorAll<HTMLElement>('h2.titulo:not([data-sem-caos]), [data-caos]')) {
    if (!novo(h)) continue
    perto(ctx, h, () => {
    const palavras = palavrasDe(h)
    const forca = compacto ? 0.55 : 1
    gsap.fromTo(
      palavras,
      {
        x: (i: number) => (semente(i) - 0.5) * 140 * forca,
        y: (i: number) => (semente(i + 7) - 0.5) * 90 * forca,
        rotate: (i: number) => (semente(i + 3) - 0.5) * 50,
        opacity: 0.12,
        // 2D: com translate3d, cada palavra (centenas na página) vira uma
        // camada de composição — e montar camadas era o maior custo da rolagem.
        force3D: false,
      },
      {
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        // Toca uma vez ao entrar (não acompanha a rolagem quadro a quadro):
        // centenas de palavras recalculadas a cada evento de rolagem pesavam
        // no celular.
        duration: 1.3,
        ease: 'expo.out',
        force3D: false,
        clearProps: 'transform',
        stagger: { each: 0.035, from: 'random' },
        scrollTrigger: { trigger: h, start: 'top 85%', toggleActions: 'play none none none' },
      },
    )
    })
  }

  // Fotos que se abrem.
  for (const el of escopo.querySelectorAll<HTMLElement>('[data-revela-foto]')) {
    if (!novo(el)) continue
    perto(ctx, el, () => {
    const img = el.querySelector('img')
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 40%', scrub: 0.5 } })
    tl.fromTo(el, { clipPath: 'inset(14% 12% 14% 12% round 2rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 2rem)', ease: 'none' }, 0)
    if (img) tl.fromTo(img, { scale: 1.28 }, { scale: 1, ease: 'none' }, 0)
    })
  }

  // Faixas de texto que correm de lado.
  for (const el of escopo.querySelectorAll<HTMLElement>('[data-faixa]')) {
    if (!novo(el)) continue
    const sentido = Number(el.dataset.faixa) || 1
    perto(ctx, el, () => gsap.fromTo(
      el,
      { xPercent: sentido > 0 ? 0 : -30 },
      { xPercent: sentido > 0 ? -30 : 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
    ))
  }

  // Palavras que acendem uma a uma.
  for (const el of escopo.querySelectorAll<HTMLElement>('[data-acende]')) {
    if (!novo(el)) continue
    perto(ctx, el, () => gsap.fromTo(
      palavrasDe(el),
      { opacity: 0.14 },
      { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
    ))
  }

  // Números que contam.
  for (const el of escopo.querySelectorAll<HTMLElement>('[data-conta]')) {
    if (!novo(el)) continue
    const final = el.dataset.conta ?? el.textContent ?? ''
    const m = final.match(/^(\D*)([\d.,]+)(.*)$/)
    if (!m) continue
    const [, antes, num, depois] = m
    const decimais = num.includes(',') ? num.split(',')[1].length : 0
    const alvo = Number(num.replace(/\./g, '').replace(',', '.'))
    const obj = { v: 0 }
    perto(ctx, el, () => gsap.to(obj, {
      v: alvo,
      duration: 1.6,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      onUpdate: () => {
        el.textContent = `${antes}${obj.v.toFixed(decimais).replace('.', ',')}${depois}`
      },
    }))
  }
}
