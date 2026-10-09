/**
 * Os capítulos da cena ao longo da página — o contrato entre as seções (que
 * marcam a posição com `data-s`) e a cena (src/scene/pecas.ts).
 *
 * A história é "do caos à clareza": as peças começam soltas numa noite
 * índigo e, a cada capítulo, se organizam em algo que faz sentido — o
 * quebra-cabeça montado, o arco do logotipo, o gráfico, a rede, a Maia. O
 * fundo clareia junto.
 */

export type IdFormacao = 'caos' | 'encaixe' | 'ponte' | 'padroes' | 'rede' | 'maia' | 'fecho'

export type Capitulo = {
  id: string
  formacao: IdFormacao
  cam: readonly [number, number, number]
  alvo: readonly [number, number, number]
  fov: number
  /** Cor de fundo (e da névoa). */
  fundo: string
  /** Quanto as peças flutuam e giram sozinhas (0…1). */
  agitacao: number
  /** Deslocamento da formação no desktop (para abrir espaço ao texto). */
  lado: readonly [number, number]
  /** O mesmo no celular (a formação vai para cima, o texto fica embaixo). */
  ladoCompacto: readonly [number, number]
  /** O núcleo luminoso da Maia (0…1). */
  nucleo: number
}

const C = (c: Partial<Capitulo> & Pick<Capitulo, 'id' | 'formacao' | 'cam' | 'alvo' | 'fundo'>): Capitulo => ({
  fov: 42,
  agitacao: 0,
  lado: [0, 0],
  ladoCompacto: [0, 0],
  nucleo: 0,
  ...c,
})

export const CAPITULOS = [
  C({ id: 'heroi', formacao: 'caos', cam: [0, 0, 17], alvo: [0, 0, 0], fundo: '#100d2e', agitacao: 1, fov: 46 }),
  C({ id: 'motivo', formacao: 'encaixe', cam: [-2.5, -3, 19], alvo: [0, 0, 0], fundo: '#17143f', agitacao: 0.08, lado: [5, 0], ladoCompacto: [0, 2.2] }),
  C({ id: 'ponte', formacao: 'ponte', cam: [0, 2.2, 19], alvo: [0, 2.2, 0], fundo: '#f6f1ea', lado: [0, -0.6], ladoCompacto: [0, 2.6] }),
  C({ id: 'padroes', formacao: 'padroes', cam: [-3.5, 5, 15], alvo: [0, 3, 0], fundo: '#f2eefa', lado: [5, -0.4], ladoCompacto: [0, 3] }),
  C({ id: 'rede', formacao: 'rede', cam: [0, 0.6, 17], alvo: [0, 0.4, 0], fundo: '#ecf5f2', agitacao: 0.05, lado: [0, -0.8], ladoCompacto: [0, 1.4] }),
  C({ id: 'maia', formacao: 'maia', cam: [0, 2.4, 14], alvo: [0, 0, 0], fundo: '#0b0d29', agitacao: 0.05, lado: [4.4, 0], ladoCompacto: [0, 2.4], nucleo: 1 }),
  C({ id: 'fecho', formacao: 'fecho', cam: [0, 2.6, 21], alvo: [0, 2.6, 0], fundo: '#f6f1ea', agitacao: 0.05, lado: [0, 0.2], ladoCompacto: [0, 3.2] }),
] as const satisfies readonly Capitulo[]

export type IdCapitulo = (typeof CAPITULOS)[number]['id']

export function capitulo(id: IdCapitulo): number {
  return CAPITULOS.findIndex((c) => c.id === id)
}

/**
 * O capítulo contínuo a partir da rolagem: os marcadores `data-s` cujo centro
 * está acima e abaixo do meio da tela, interpolados.
 */
export function capituloDaRolagem(raiz: ParentNode, meio: number): number {
  const pontos = [...raiz.querySelectorAll<HTMLElement>('[data-s]')]
    .map((m) => {
      const r = m.getBoundingClientRect()
      return { s: Number(m.dataset.s), c: r.top + r.height / 2 }
    })
    .sort((a, b) => a.c - b.c)
  if (!pontos.length || meio <= pontos[0].c) return pontos[0]?.s ?? 0
  for (let i = 0; i < pontos.length - 1; i++) {
    const a = pontos[i]
    const b = pontos[i + 1]
    if (meio >= a.c && meio <= b.c) {
      if (b.c - a.c < 1) return b.s
      return a.s + ((meio - a.c) / (b.c - a.c)) * (b.s - a.s)
    }
  }
  return pontos[pontos.length - 1].s
}
