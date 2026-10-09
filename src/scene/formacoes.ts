import { Color, Euler, Quaternion, Vector3 } from 'three'
import type { IdFormacao } from '@/lib/capitulos'
import { ARCO, EMOCOES, MARCA } from '@/lib/cores'
import { ALTURAS, DIAS } from '@/lib/semana'

/**
 * As formações: onde cada uma das N peças fica em cada capítulo.
 *
 * Toda formação define as N peças — as que não têm papel nela viram
 * "confete" (pequenas, longe, ao fundo), e assim a passagem de uma formação
 * para outra é sempre uma peça indo de um lugar a outro, nunca surgindo do
 * nada. As que se mexem sozinhas (a rede, o anel da Maia, o confete) têm uma
 * `dinamica`, chamada a cada quadro.
 *
 * Unidade: o lado de uma peça (1). O encaixe é exato: cada peça tem os
 * dentes à direita e em cima, e os vãos à esquerda e embaixo — então peças
 * iguais, lado a lado, se encaixam sem girar.
 */

export type Dinamica = (k: number, t: number, p: Vector3, q: Quaternion) => void

export type Formacao = {
  p: Float32Array
  q: Float32Array
  cor: Float32Array
  humor: Float32Array
  escala: Float32Array
  dinamica?: Dinamica
  /** Pontos com nome, para os rótulos da página (coordenadas locais). */
  ancoras: Record<string, readonly [number, number, number]>
}

export type Opcoes = { n: number; compacto: boolean }

/* ── utilitários ─────────────────────────────────────────────────────────── */

function aleatorio(semente: number) {
  let a = semente >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const cor = new Color()
const v = new Vector3()
const q = new Quaternion()
const e = new Euler()
const FRENTE = new Vector3(0, 0, 1)
const vd = new Vector3()
const CIMA = new Vector3(0, 1, 0)

function nova(n: number): Formacao {
  return {
    p: new Float32Array(n * 3),
    q: new Float32Array(n * 4),
    cor: new Float32Array(n * 3),
    humor: new Float32Array(n),
    escala: new Float32Array(n),
    ancoras: {},
  }
}

function por(f: Formacao, k: number, pos: Vector3, rot: Quaternion, hex: string, humor: number, escala = 1) {
  pos.toArray(f.p, k * 3)
  rot.toArray(f.q, k * 4)
  cor.set(hex).toArray(f.cor, k * 3)
  f.humor[k] = humor
  f.escala[k] = escala
}

/** Uma rotação que deixa a cara da peça olhando para `dir`. */
function olhando(dir: Vector3, giro = 0) {
  q.setFromUnitVectors(FRENTE, vd.copy(dir).normalize())
  if (giro) q.multiply(new Quaternion().setFromAxisAngle(FRENTE, giro))
  return q
}

const TODAS = [...EMOCOES.map((x) => x.cor), ...Object.values(MARCA)]

/* ── confete: as peças sem papel na formação ─────────────────────────────── */

const confeteP = new Map<number, Float32Array>()
function posConfete(n: number) {
  let arr = confeteP.get(n)
  if (arr) return arr
  arr = new Float32Array(n * 3)
  const r = aleatorio(91)
  for (let k = 0; k < n; k++) {
    // Uma casca larga atrás da cena, mais espalhada nos lados.
    const ang = r() * Math.PI * 2
    const raio = 14 + r() * 14
    arr[k * 3] = Math.cos(ang) * raio * 1.3
    arr[k * 3 + 1] = Math.sin(ang) * raio * 0.75
    arr[k * 3 + 2] = -10 - r() * 22
  }
  confeteP.set(n, arr)
  return arr
}

function confete(f: Formacao, k: number, n: number) {
  const arr = posConfete(n)
  const r = aleatorio(k * 13 + 5)
  v.set(arr[k * 3], arr[k * 3 + 1], arr[k * 3 + 2])
  e.set(r() * 6.28, r() * 6.28, r() * 6.28)
  q.setFromEuler(e)
  por(f, k, v, q, TODAS[Math.floor(r() * TODAS.length)], r() * 2 - 1, 0.45 + r() * 0.35)
}

/** Giro lento do confete em torno do centro — o fundo nunca fica parado. */
function giraConfete(t: number, p: Vector3, k: number, q2: Quaternion) {
  const a = t * 0.018
  const x = p.x
  p.x = x * Math.cos(a) - (p.z + 20) * Math.sin(a) * 0.15
  p.y += Math.sin(t * 0.3 + k) * 0.35
  q2.multiply(new Quaternion().setFromEuler(e.set(t * 0.1 + k, t * 0.07, 0)))
}

/* ── as formações ────────────────────────────────────────────────────────── */

/** Caos: todas soltas, girando, num volume que envolve a câmera. */
function caos({ n, compacto }: Opcoes): Formacao {
  const f = nova(n)
  const r = aleatorio(7)
  const larg = compacto ? 6.5 : 15
  const alt = compacto ? 11 : 8.5
  for (let k = 0; k < n; k++) {
    // Mais densas nas bordas: o centro (o título) fica respirando.
    let x = 0
    let y = 0
    let z = 0
    for (let tent = 0; tent < 6; tent++) {
      x = (r() * 2 - 1) * larg
      y = (r() * 2 - 1) * alt
      z = -14 + r() * 22
      const centro = Math.hypot(x / larg, y / alt)
      if (z < -9 || centro > 0.55) break
    }
    e.set(r() * 6.28, r() * 6.28, r() * 6.28)
    q.setFromEuler(e)
    const emo = EMOCOES[Math.floor(r() * EMOCOES.length)]
    const hex = r() < 0.7 ? emo.cor : TODAS[Math.floor(r() * TODAS.length)]
    por(f, k, v.set(x, y, z), q, hex, emo.humor, 0.8 + r() * 0.55)
  }
  return f
}

/** O quebra-cabeça montado — e, no meio dele, um coração. */
function encaixe({ n, compacto }: Opcoes): Formacao {
  const f = nova(n)
  const cols = compacto ? 12 : 20
  const lins = Math.ceil(n / cols)
  const passo = 1.02
  const r = aleatorio(3)
  q.identity()
  for (let k = 0; k < n; k++) {
    const c = k % cols
    const l = Math.floor(k / cols)
    const x = (c - (cols - 1) / 2) * passo
    const y = (l - (lins - 1) / 2) * passo
    // O coração: (x² + y² − 1)³ − x²y³ ≤ 0, na escala da grade.
    const s = compacto ? 4.6 : 4.9
    const hx = x / s
    const hy = y / s - (compacto ? 0.05 : 0.12)
    const dentro = (hx * hx + hy * hy - 1) ** 3 - hx * hx * hy ** 3 <= 0
    const hex = dentro ? (r() < 0.75 ? MARCA.rosa : MARCA.vermelho) : r() < 0.88 ? '#f4efe8' : '#e3dcf3'
    por(f, k, v.set(x, y, 0), q, hex, dentro ? 1 : 0.35)
  }
  return f
}

/** O arco do logotipo: a ponte entre a casa e a terapia. */
function arco(f: Formacao, { n, compacto }: Opcoes, raio: number, base: number): number {
  const linhas = compacto ? [raio - 1.04, raio] : [raio - 1.04, raio, raio + 1.04]
  const a0 = Math.PI * 1.1
  const a1 = -Math.PI * 0.02
  let k = 0
  for (let li = 0; li < linhas.length; li++) {
    const rr = linhas[li]
    const qtd = Math.round(((a0 - a1) * rr) / 1.06)
    for (let i = 0; i < qtd && k < n; i++, k++) {
      const u = qtd === 1 ? 0 : i / (qtd - 1)
      const a = a0 + (a1 - a0) * u
      v.set(Math.cos(a) * rr, Math.sin(a) * rr + base, 0)
      // A peça segue a curva: o lado de baixo dela aponta para o centro.
      q.setFromAxisAngle(FRENTE, a - Math.PI / 2)
      const seg = Math.min(ARCO.length - 1, Math.floor(u * ARCO.length))
      por(f, k, v, q, ARCO[seg], 1)
    }
  }
  return k
}

function ponte(o: Opcoes): Formacao {
  const f = nova(o.n)
  const raio = o.compacto ? 4.2 : 6.6
  const usados = arco(f, o, raio, 0)
  for (let k = usados; k < o.n; k++) confete(f, k, o.n)
  f.ancoras = o.compacto
    ? { casa: [-raio + 1.3, -2.7, 0], terapia: [raio - 1.3, -2.1, 0] }
    : { casa: [-raio - 2.9, 0.2, 0], terapia: [raio + 2.9, 0.6, 0] }
  f.dinamica = (k, t, p, q2) => {
    if (k >= usados) giraConfete(t, p, k, q2)
    // O arco respira: uma onda passa pelas peças, de uma ponta à outra.
    else p.z += Math.sin(t * 1.6 - k * 0.35) * 0.12
  }
  return f
}

export type Registro = { k: number; emocao: number; t0: number; altura: number }

function padroes(o: Opcoes, registros: Registro[]): Formacao {
  const f = nova(o.n)
  const passo = o.compacto ? 1.12 : 1.6
  const r = aleatorio(11)
  q.identity()
  let k = 0
  const x0 = -((DIAS.length - 1) / 2) * passo
  for (let d = 0; d < DIAS.length; d++) {
    for (let h = 0; h < ALTURAS[d]; h++, k++) {
      // Calmo e feliz mais embaixo, o resto por cima: dá para "ler" a coluna.
      const pesos = [0.3, 0.24, 0.16, 0.1, 0.12, 0.08]
      let x = r()
      let ei = 0
      while (ei < pesos.length - 1 && x > pesos[ei]) x -= pesos[ei++]
      por(f, k, v.set(x0 + d * passo, h * 1.02, 0), q, EMOCOES[ei].cor, EMOCOES[ei].humor)
    }
    f.ancoras[`dia-${d}`] = [x0 + d * passo, -0.95, 0]
  }
  const usados = k
  for (; k < o.n; k++) confete(f, k, o.n)
  // As peças que a pessoa registra saem do confete e caem na coluna "Agora".
  const xAgora = x0 + (DIAS.length - 1) * passo
  const alvo = new Vector3()
  const giro = new Quaternion()
  f.dinamica = (kk, t, p, q2) => {
    const reg = registros.find((x) => x.k === kk)
    if (reg) {
      const dt = Math.max(0, t - reg.t0)
      const u = Math.min(1, dt / 1.15)
      alvo.set(xAgora, reg.altura * 1.02, 0)
      // Vem de cima e da frente, quica e assenta.
      const queda = 1 - (1 - u) ** 3
      const quique = Math.sin(Math.min(1, dt / 1.5) * Math.PI * 3) * (1 - Math.min(1, dt / 1.5)) * 0.35
      p.set(alvo.x + (1 - queda) * -3, alvo.y + (1 - queda) * 9 + Math.max(0, quique), alvo.z + (1 - queda) * 6)
      giro.setFromEuler(e.set((1 - queda) * 5, (1 - queda) * 3, 0))
      q2.copy(giro)
      return
    }
    if (kk >= usados) giraConfete(t, p, kk, q2)
    else p.z += Math.sin(t * 1.3 + kk * 0.6) * 0.05
  }
  return f
}

/** A rede: família, escola e profissional, e o histórico correndo entre eles. */
function rede({ n, compacto }: Opcoes): Formacao {
  const f = nova(n)
  const nos = compacto
    ? [new Vector3(-2.3, -2.6, 0), new Vector3(0, 3.0, -0.5), new Vector3(2.3, -2.6, 0)]
    : [new Vector3(-5.6, -1.8, 0), new Vector3(0, 3.4, -1), new Vector3(5.6, -1.8, 0)]
  const cores = [
    [MARCA.rosa, '#DE8FB6', MARCA.vermelho],
    [MARCA.amarelo, '#EEC65A', '#F29A3A'],
    [MARCA.verde, MARCA.ciano, '#4FA9A6'],
  ]
  const porNo = compacto ? 22 : 32
  const raio = compacto ? 1.45 : 1.95
  const r = aleatorio(5)
  let k = 0
  const centro: number[] = []
  for (let ni = 0; ni < 3; ni++) {
    for (let i = 0; i < porNo; i++, k++) {
      // Esfera de Fibonacci: as peças bem distribuídas, de cara para fora.
      const y = 1 - (i / (porNo - 1)) * 2
      const rr = Math.sqrt(1 - y * y)
      const a = i * 2.39996
      const dir = new Vector3(Math.cos(a) * rr, y, Math.sin(a) * rr)
      v.copy(dir).multiplyScalar(raio).add(nos[ni])
      por(f, k, v, olhando(dir), cores[ni][Math.floor(r() * 3)], 0.8, compacto ? 0.62 : 0.72)
      centro[k] = ni
    }
  }
  const usadosNos = k
  // O fluxo: peças pequenas indo e vindo pelas três arestas.
  const arestas = [
    [0, 2],
    [0, 1],
    [1, 2],
  ]
  const porAresta = compacto ? 7 : 10
  const fluxo: { a: number; b: number; t0: number }[] = []
  for (let ai = 0; ai < 3; ai++) {
    for (let i = 0; i < porAresta && k < n; i++, k++) {
      const [a, b] = i % 2 ? [arestas[ai][1], arestas[ai][0]] : arestas[ai]
      fluxo[k] = { a, b, t0: i / porAresta }
      v.lerpVectors(nos[a], nos[b], i / porAresta)
      por(f, k, v, q.identity(), cores[a][0], 1, 0.42)
    }
  }
  const usados = k
  for (; k < n; k++) confete(f, k, n)
  f.ancoras = {
    familia: [nos[0].x, nos[0].y - raio - 0.7, 0],
    escola: [nos[1].x, nos[1].y + raio + 0.5, 0],
    profissional: [nos[2].x, nos[2].y - raio - 0.7, 0],
  }
  const giro = new Quaternion()
  f.dinamica = (kk, t, p, q2) => {
    if (kk < usadosNos) {
      // Cada esfera gira devagar em torno do próprio centro.
      const c = nos[centro[kk]]
      giro.setFromAxisAngle(CIMA, t * 0.35 * (centro[kk] === 1 ? -1 : 1))
      p.sub(c).applyQuaternion(giro).add(c)
      q2.premultiply(giro)
    } else if (kk < usados) {
      const fl = fluxo[kk]
      const u = (fl.t0 + t * 0.09) % 1
      p.lerpVectors(nos[fl.a], nos[fl.b], u)
      p.y += Math.sin(u * Math.PI) * 0.9
      p.z += 0.6
      q2.setFromEuler(e.set(0, 0, t * 1.5 + kk))
    } else giraConfete(t, p, kk, q2)
  }
  return f
}

/** A Maia: um anel de peças girando em volta de um núcleo de luz. */
function maia({ n, compacto }: Opcoes): Formacao {
  const f = nova(n)
  const raio = compacto ? 3.1 : 3.9
  const inclina = new Quaternion().setFromEuler(new Euler(1.12, 0, -0.32))
  const qtdA = compacto ? 26 : 38
  const qtdB = compacto ? 20 : 30
  const paleta = [MARCA.ciano, '#4FA9A6', MARCA.roxo, '#8B69A9', MARCA.rosa, '#A3A6D6']
  let k = 0
  const ang: number[] = []
  const anel: number[] = []
  for (const [ai, qtd, rr] of [
    [0, qtdA, raio],
    [1, qtdB, raio * 0.72],
  ] as const) {
    for (let i = 0; i < qtd && k < n; i++, k++) {
      ang[k] = (i / qtd) * Math.PI * 2 + ai * 0.2
      anel[k] = ai
      const u = i / qtd
      por(f, k, v.set(0, 0, 0), q.identity(), paleta[Math.floor(u * paleta.length)], 0.7, ai ? 0.62 : 0.8)
      v.set(Math.cos(ang[k]) * rr, 0, Math.sin(ang[k]) * rr).applyQuaternion(inclina)
      v.toArray(f.p, k * 3)
    }
  }
  const usados = k
  for (; k < n; k++) confete(f, k, n)
  f.ancoras = { maia: [0, -(raio + 1.2), 0] }
  f.dinamica = (kk, t, p, q2) => {
    if (kk >= usados) return giraConfete(t, p, kk, q2)
    const rr = anel[kk] ? raio * 0.72 : raio
    const a = ang[kk] + t * (anel[kk] ? -0.28 : 0.2)
    p.set(Math.cos(a) * rr, Math.sin(t * 1.2 + kk) * 0.12, Math.sin(a) * rr).applyQuaternion(inclina)
    // De cara para a câmera, girando ao longo da órbita.
    q2.setFromAxisAngle(FRENTE, a + Math.PI / 2)
  }
  return f
}

/** O fecho: o arco outra vez, maior, e o resto em festa ao fundo. */
function fecho(o: Opcoes): Formacao {
  const f = nova(o.n)
  const raio = o.compacto ? 4.4 : 7.2
  const usados = arco(f, o, raio, -1.4)
  for (let k = usados; k < o.n; k++) confete(f, k, o.n)
  f.dinamica = (k, t, p, q2) => {
    if (k >= usados) giraConfete(t, p, k, q2)
    else p.z += Math.sin(t * 1.2 - k * 0.25) * 0.14
  }
  return f
}

export function montarFormacoes(o: Opcoes, registros: Registro[]): Record<IdFormacao, Formacao> {
  const caosF = caos(o)
  caosF.dinamica = (k, t, p, q2) => {
    // A flutuação do caos: cada peça na própria órbita, girando no próprio eixo.
    p.x += Math.sin(t * 0.21 + k * 1.7) * 0.9
    p.y += Math.cos(t * 0.17 + k * 2.3) * 0.7
    p.z += Math.sin(t * 0.13 + k) * 0.6
    q2.multiply(new Quaternion().setFromEuler(e.set(t * 0.35 + k, t * 0.27 + k * 0.5, t * 0.12)))
  }
  return {
    caos: caosF,
    encaixe: encaixe(o),
    ponte: ponte(o),
    padroes: padroes(o, registros),
    rede: rede(o),
    maia: maia(o),
    fecho: fecho(o),
  }
}
