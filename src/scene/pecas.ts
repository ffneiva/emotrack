import {
  AdditiveBlending,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Fog,
  Group,
  HemisphereLight,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  Raycaster,
  Scene,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
  type WebGLProgramParametersWithUniforms,
} from 'three'
import { CAPITULOS, type Capitulo, capitulo, type IdFormacao } from '@/lib/capitulos'
import { EMOCOES } from '@/lib/cores'
import { MAX_REGISTROS } from '@/lib/semana'
import { clima, fantasma, type Formacao, montarFormacoes, type Registro } from './formacoes'

/**
 * A cena: N peças de quebra-cabeça — os mascotes das emoções do app, cada
 * uma com a sua cara — voando entre as formações conforme a página rola.
 *
 * Um InstancedMesh só (uma chamada de desenho para todas as peças). A cara
 * (olhos que piscam, boca, bochechas) é desenhada no shader, a partir da
 * posição no espaço da peça e de um "humor" por instância: nenhuma textura.
 */

export type Rotulo = { id: string; x: number; y: number; visivel: boolean }
export type Leitura = { rotulos: Rotulo[] }

type Opcoes = { compacto: boolean; calmo: boolean }

/* ── a peça ──────────────────────────────────────────────────────────────── */

/** O contorno de um lado, em (u ao longo, v para fora); simétrico em u = 0,5. */
const PERFIL: readonly (readonly [number, number])[] = [
  [0.36, 0], [0.42, 0], [0.4, 0.1], [0.37, 0.16], [0.32, 0.26], [0.4, 0.34], [0.5, 0.34],
  [0.6, 0.34], [0.68, 0.26], [0.63, 0.16], [0.6, 0.1], [0.58, 0], [0.64, 0],
]

function contornoDaPeca(): Shape {
  const s = new Shape()
  // Embaixo e à esquerda, vão (−1); à direita e em cima, dente (+1).
  const lados = [
    { a: [-0.5, -0.5], b: [0.5, -0.5], n: [0, -1], sinal: -1 },
    { a: [0.5, -0.5], b: [0.5, 0.5], n: [1, 0], sinal: 1 },
    { a: [0.5, 0.5], b: [-0.5, 0.5], n: [0, 1], sinal: 1 },
    { a: [-0.5, 0.5], b: [-0.5, -0.5], n: [-1, 0], sinal: -1 },
  ] as const
  const ALTURA = 0.8
  s.moveTo(-0.5, -0.5)
  for (const { a, b, n, sinal } of lados) {
    const p = (i: number): [number, number] => {
      const [u, vv] = PERFIL[i]
      return [a[0] + (b[0] - a[0]) * u + n[0] * vv * sinal * ALTURA, a[1] + (b[1] - a[1]) * u + n[1] * vv * sinal * ALTURA]
    }
    s.lineTo(...p(0))
    s.bezierCurveTo(...p(1), ...p(2), ...p(3))
    s.bezierCurveTo(...p(4), ...p(5), ...p(6))
    s.bezierCurveTo(...p(7), ...p(8), ...p(9))
    s.bezierCurveTo(...p(10), ...p(11), ...p(12))
    s.lineTo(b[0], b[1])
  }
  return s
}

const ESPESSURA = 0.22
const BISEL = 0.07

function geometriaDaPeca(compacto: boolean) {
  const g = new ExtrudeGeometry(contornoDaPeca(), {
    depth: ESPESSURA,
    bevelEnabled: true,
    bevelThickness: BISEL,
    bevelSize: 0.055,
    bevelOffset: -0.045,
    bevelSegments: compacto ? 1 : 2,
    curveSegments: compacto ? 4 : 7,
  })
  g.translate(0, 0, -ESPESSURA / 2)
  g.computeVertexNormals()
  return g
}

/** A cara, no shader do material físico (olhos, boca e bochechas). */
function comRosto(mat: MeshStandardMaterial, uTempo: { value: number }) {
  mat.onBeforeCompile = (sh: WebGLProgramParametersWithUniforms) => {
    sh.uniforms.uTempo = uTempo
    sh.vertexShader = sh.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute float aHumor;
        attribute float aFase;
        varying vec3 vObj;
        varying float vNz;
        varying float vHumor;
        varying float vFase;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vObj = position;
        vNz = normal.z;
        vHumor = aHumor;
        vFase = aFase;`,
      )
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uTempo;
        varying vec3 vObj;
        varying float vNz;
        varying float vHumor;
        varying float vFase;`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        if (vNz > 0.55 && vObj.z > 0.0) {
          vec2 f = vObj.xy - vec2(-0.03, -0.02);
          float aberto = step(0.035, fract(uTempo * 0.21 + vFase));
          // Olhos: achatam numa linha quando piscam; "cansado" fica de olho meio fechado.
          float sono = smoothstep(-0.05, -0.25, vHumor) * smoothstep(-0.6, -0.3, vHumor);
          vec2 eo = vec2(abs(f.x) - 0.12, (f.y - 0.08) * mix(9.0, 1.0 + sono * 2.2, aberto));
          float olho = 1.0 - smoothstep(0.036, 0.05, length(eo));
          // Brilho no olho: a cara ganha vida.
          float brilho = 1.0 - smoothstep(0.008, 0.016, length(vec2(abs(f.x) - 0.105, f.y - 0.095)));
          // Boca: uma parábola; humor > 0 sorri, < 0 entorta para baixo.
          float mx = f.x / 0.115;
          float curva = -0.075 - 0.06 * vHumor * (1.0 - mx * mx);
          float boca = (1.0 - smoothstep(0.014, 0.026, abs(f.y - curva))) * (1.0 - smoothstep(0.92, 1.06, abs(mx)));
          float bochecha = (1.0 - smoothstep(0.02, 0.055, length(vec2(abs(f.x) - 0.2, f.y + 0.01)))) * max(vHumor, 0.0);
          float frente = smoothstep(0.55, 0.92, vNz);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.5, 0.55), bochecha * 0.38 * frente);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.09, 0.08, 0.17), max(olho, boca) * frente);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), brilho * olho * aberto * frente);
        }`,
      )
  }
  mat.customProgramCacheKey = () => 'peca-rosto'
}

/* ── o núcleo da Maia ────────────────────────────────────────────────────── */

function nucleoDaMaia() {
  const grupo = new Group()
  const esfera = new Mesh(
    new SphereGeometry(1.25, 48, 32),
    new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTempo: { value: 0 }, uForca: { value: 0 } },
      vertexShader: `
        varying vec3 vN; varying vec3 vV; varying vec3 vP;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vP = position;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform float uTempo; uniform float uForca;
        varying vec3 vN; varying vec3 vV; varying vec3 vP;
        void main(){
          float fr = pow(1.0 - max(dot(vN, vV), 0.0), 2.2);
          float onda = sin(vP.y * 6.0 + uTempo * 2.0) * sin(vP.x * 5.0 - uTempo * 1.4) * 0.5 + 0.5;
          vec3 a = vec3(0.01, 0.63, 0.84); vec3 b = vec3(0.41, 0.26, 0.9); vec3 c = vec3(0.9, 0.19, 0.36);
          vec3 cor = mix(mix(a, b, onda), c, fr * 0.6);
          float alfa = (0.55 + fr * 0.45) * uForca;
          gl_FragColor = vec4(cor * (1.1 + fr), alfa);
        }`,
    }),
  )
  const halo = new Mesh(
    new PlaneGeometry(9, 9),
    new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uForca: { value: 0 }, uTempo: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        uniform float uForca; uniform float uTempo; varying vec2 vUv;
        void main(){
          float d = length(vUv - 0.5) * 2.0;
          float g = pow(max(0.0, 1.0 - d), 2.6) * (0.85 + 0.15 * sin(uTempo * 1.7));
          gl_FragColor = vec4(vec3(0.25, 0.55, 1.0) * g, g) * uForca * 0.9;
        }`,
    }),
  )
  grupo.add(halo, esfera)
  return { grupo, esfera, halo }
}

/* ── o clima do diário ───────────────────────────────────────────────────── */

export type Clima = { emocao: number; intensidade: number; momento: number }

/** Manhã, tarde e noite: o fundo e o sol do gráfico mudam com o "Quando". */
const MOMENTOS = [
  { fundo: '#fff2dc', sol: '#fff1d6', forca: 2.3, ceu: 0.95 },
  { fundo: '#ffd8c4', sol: '#ffab70', forca: 2.1, ceu: 0.75 },
  { fundo: '#0c0a26', sol: '#8ea4ff', forca: 1.1, ceu: 0.4 },
] as const

/* ── a cena ──────────────────────────────────────────────────────────────── */

const suave = (x: number) => x * x * (3 - 2 * x)
const lim = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const SOL_PADRAO = new Color('#fff4e6')

export class Pecas {
  private renderer: WebGLRenderer
  private cena = new Scene()
  private camera = new PerspectiveCamera(42, 1, 0.1, 140)
  private grupo = new Group()
  private malha: InstancedMesh
  private formacoes: Record<IdFormacao, Formacao>
  private registros = new Map<number, Registro>()
  private n: number
  private kFantasma: number
  private uTempo = { value: 0 }
  private nucleo = nucleoDaMaia()
  private fundo = new Color()
  private sol: DirectionalLight
  private ceu: HemisphereLight
  private aHumor: InstancedBufferAttribute
  private atraso: Float32Array
  private elevacao: Float32Array
  private empurrao: Float32Array
  private ancoras: Record<IdFormacao, { id: string; a: readonly [number, number, number] }[]>
  private leitura: Leitura = { rotulos: [] }

  // O clima: alvo (do formulário) e valor suavizado (o que a cena usa).
  private climaCor = new Color(EMOCOES[1].cor)
  private climaCorSuave = new Color(EMOCOES[1].cor)
  private climaFundo = new Color(MOMENTOS[0].fundo)
  private climaFundoSuave = new Color(MOMENTOS[0].fundo)
  private climaSol = new Color(MOMENTOS[0].sol)
  private climaSolSuave = new Color(MOMENTOS[0].sol)
  private climaForca: number = MOMENTOS[0].forca
  private climaCeu: number = MOMENTOS[0].ceu
  private intensidadeAlvo = 0
  private corSuja = 120

  private s = 0
  private sAlvo = 0
  private vel = 0
  private ponteiro = new Vector2()
  private ponteiroSuave = new Vector2()
  private temPonteiro = false
  private arrasteY = 0
  private arrasteX = 0
  private inercia = 0
  private segurando = false
  private relogio = 0
  private ultimo = 0
  private quadro = 0
  private rodando = false
  private compacto: boolean
  private calmo: boolean
  private raio = new Raycaster()

  // Resolução adaptativa: mede o ritmo real e baixa a resolução se o aparelho não acompanha.
  private dpr: number
  private dprMax: number
  private janelaT = 0
  private janelaN = 0
  private boas = 0
  private pular = false
  private dtGuardado = 0
  aoQuadro?: (l: Leitura) => void

  constructor(canvas: HTMLCanvasElement, { compacto, calmo }: Opcoes) {
    this.compacto = compacto
    this.calmo = calmo
    this.n = compacto ? 140 : 200
    this.kFantasma = fantasma(this.n)
    this.dprMax = Math.min(window.devicePixelRatio || 1, compacto ? 1.25 : 1.5)
    this.dpr = this.dprMax
    // MSAA só em tela comum; em tela densa a própria resolução já suaviza.
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: (window.devicePixelRatio || 1) < 1.5,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    })
    this.renderer.setPixelRatio(this.dpr)
    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.toneMapping = NeutralToneMapping
    this.renderer.toneMappingExposure = 1

    // Sem mapa de ambiente: gerá-lo (PMREM) travava a abertura no celular.
    // Céu + sol + contraluz dão o volume de "brinquedo de plástico".
    this.ceu = new HemisphereLight('#ffffff', '#6a5a9a', 1.5)
    this.cena.add(this.ceu)
    this.sol = new DirectionalLight('#fff4e6', 2.6)
    this.sol.position.set(6, 10, 12)
    this.cena.add(this.sol)
    const recorte = new DirectionalLight('#9fd8ff', 1.4)
    recorte.position.set(-10, -4, -6)
    this.cena.add(recorte)
    this.cena.fog = new Fog('#100d2e', 22, 60)

    const mat = new MeshStandardMaterial({ roughness: 0.5, metalness: 0 })
    comRosto(mat, this.uTempo)
    const geo = geometriaDaPeca(compacto)
    this.aHumor = new InstancedBufferAttribute(new Float32Array(this.n), 1)
    const fase = new Float32Array(this.n)
    for (let k = 0; k < this.n; k++) fase[k] = Math.random()
    geo.setAttribute('aHumor', this.aHumor)
    geo.setAttribute('aFase', new InstancedBufferAttribute(fase, 1))
    this.malha = new InstancedMesh(geo, mat, this.n)
    this.malha.frustumCulled = false
    this.grupo.add(this.malha)
    this.cena.add(this.grupo)

    this.nucleo.grupo.visible = false
    this.grupo.add(this.nucleo.grupo)

    this.formacoes = montarFormacoes({ n: this.n, compacto }, this.registros)
    this.ancoras = {} as typeof this.ancoras
    for (const [id, f] of Object.entries(this.formacoes) as [IdFormacao, Formacao][]) {
      this.ancoras[id] = Object.entries(f.ancoras).map(([nome, a]) => ({ id: nome, a }))
    }
    // Cada peça sai um pouco antes ou depois (a revoada) e com um arco próprio.
    this.atraso = new Float32Array(this.n)
    this.elevacao = new Float32Array(this.n)
    this.empurrao = new Float32Array(this.n * 3)
    for (let k = 0; k < this.n; k++) {
      this.atraso[k] = Math.random() * 0.38
      this.elevacao[k] = (Math.random() * 2 - 1) * 2.4
    }
    const c = new Color()
    for (let k = 0; k < this.n; k++) this.malha.setColorAt(k, c.setRGB(1, 1, 1))
    this.definirClima({ emocao: 1, intensidade: 0, momento: 0 })
    this.atualizar(0)
  }

  /** Compila o shader e sobe a geometria antes do primeiro quadro visível. */
  async preparar() {
    await this.renderer.compileAsync(this.cena, this.camera)
  }

  private largura = 1
  private altura = 1

  redimensionar(w: number, h: number) {
    this.largura = w
    this.altura = h
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    if (!this.rodando) this.desenharUmaVez()
  }

  definirProgresso(s: number) {
    this.sAlvo = lim(s, 0, CAPITULOS.length - 1)
    if (!this.rodando) this.desenharUmaVez()
  }

  definirPonteiro(x: number, y: number) {
    this.ponteiro.set(x, y)
    this.temPonteiro = true
  }

  sairPonteiro() {
    this.temPonteiro = false
  }

  arrastar(dx: number, dy: number, dt: number) {
    this.segurando = true
    const giro = dx * 0.006
    this.arrasteY += giro
    this.arrasteX = lim(this.arrasteX + dy * 0.004, -0.6, 0.6)
    this.inercia = dt > 0 ? lim(giro / Math.max(dt, 0.008), -6, 6) : 0
  }

  soltar() {
    this.segurando = false
  }

  /** O formulário do diário mudou: a emoção pinta o fundo, a intensidade agita, o momento muda a luz. */
  definirClima({ emocao, intensidade, momento }: Clima) {
    const emo = EMOCOES[emocao]
    this.climaCor.set(emo.cor)
    const m = MOMENTOS[momento]
    this.climaFundo.set(m.fundo)
    this.climaSol.set(m.sol)
    this.climaForca = m.forca
    this.climaCeu = m.ceu
    this.intensidadeAlvo = intensidade / 2
    // A peça fantasma, sobre a coluna "Agora", vira a emoção escolhida.
    const f = this.formacoes.padroes
    this.climaCor.toArray(f.cor, this.kFantasma * 3)
    f.humor[this.kFantasma] = emo.humor
    this.corSuja = 90
  }

  /** A pessoa registrou uma emoção: uma peça cai na coluna "Agora". */
  registrar(emocao: number): number {
    if (this.registros.size >= MAX_REGISTROS) this.registros.clear()
    const altura = this.registros.size
    const k = this.n - 1 - altura
    const f = this.formacoes.padroes
    const emo = EMOCOES[emocao]
    new Color(emo.cor).toArray(f.cor, k * 3)
    f.humor[k] = emo.humor
    f.escala[k] = 1
    this.registros.set(k, { k, emocao, t0: this.relogio, altura })
    this.corSuja = 90
    return this.registros.size
  }

  iniciar() {
    if (this.rodando) return
    this.rodando = true
    this.ultimo = performance.now()
    const laco = (agora: number) => {
      if (!this.rodando) return
      const real = (agora - this.ultimo) / 1000
      this.ultimo = agora
      this.medirRitmo(real)
      // No celular, parado (sem rolar nem tocar), meio quadro basta: a cena
      // continua viva e a bateria agradece.
      const parado = Math.abs(this.sAlvo - this.s) < 1e-3 && !this.segurando && Math.abs(this.inercia) < 0.01
      this.dtGuardado += real
      this.pular = this.compacto && parado ? !this.pular : false
      if (!this.pular) {
        this.atualizar(Math.min(0.05, this.dtGuardado))
        this.dtGuardado = 0
        this.renderer.render(this.cena, this.camera)
      }
      this.quadro = requestAnimationFrame(laco)
    }
    this.quadro = requestAnimationFrame(laco)
  }

  private medirRitmo(real: number) {
    if (real > 0.1) return // aba voltando, travada pontual: não é o ritmo do aparelho
    this.janelaT += real
    this.janelaN++
    if (this.janelaN < 45) return
    const med = (this.janelaT / this.janelaN) * 1000
    this.janelaT = 0
    this.janelaN = 0
    if (med > 21 && this.dpr > 0.75) {
      this.dpr = Math.max(0.75, this.dpr - 0.25)
      this.renderer.setPixelRatio(this.dpr)
      this.boas = 0
    } else if (med < 13.5 && this.dpr < this.dprMax) {
      if (++this.boas >= 4) {
        this.dpr = Math.min(this.dprMax, this.dpr + 0.25)
        this.renderer.setPixelRatio(this.dpr)
        this.boas = 0
      }
    } else this.boas = 0
  }

  pausar() {
    this.rodando = false
    cancelAnimationFrame(this.quadro)
  }

  desenharUmaVez() {
    this.atualizar(0)
    this.renderer.render(this.cena, this.camera)
  }

  destruir() {
    this.pausar()
    this.malha.geometry.dispose()
    ;(this.malha.material as MeshStandardMaterial).dispose()
    this.renderer.dispose()
  }

  /* ── o quadro ──────────────────────────────────────────────────────────── */

  private pA = new Vector3()
  private pB = new Vector3()
  private qA = new Quaternion()
  private qB = new Quaternion()
  private cA = new Color()
  private cB = new Color()
  private mat = new Matrix4()
  private esc = new Vector3()
  private alvo = new Vector3()
  private camPos = new Vector3()
  private plano = new Vector3()
  private toque = new Vector3()
  private onda = new Quaternion()
  private eixoX = new Vector3(1, 0, 0)
  private zero = new Vector2()

  private atualizar(dt: number) {
    // O relógio anda devagar no modo calmo: nada se mexe sozinho de verdade.
    this.relogio += dt * (this.calmo ? 0.15 : 1)
    const t = this.relogio
    this.uTempo.value = this.calmo ? 0.5 : t

    // A rolagem chega suavizada; a velocidade dela vira um "tranco" nas peças.
    const antes = this.s
    this.s += (this.sAlvo - this.s) * (dt ? 1 - Math.exp(-dt * 9) : 1)
    if (Math.abs(this.sAlvo - this.s) < 1e-4) this.s = this.sAlvo
    const dv = dt ? (this.s - antes) / dt : 0
    this.vel += (dv - this.vel) * Math.min(1, dt * 5)

    const i = Math.min(CAPITULOS.length - 2, Math.floor(this.s))
    const fr = lim(this.s - i)
    const ca: Capitulo = CAPITULOS[i]
    const cb: Capitulo = CAPITULOS[i + 1]
    const ef = suave(fr)
    const mix = (a: number, b: number) => a + (b - a) * ef

    // O clima do diário vale perto do capítulo do gráfico.
    const wP = suave(lim(1 - Math.abs(this.s - capitulo('padroes')) * 1.6))
    const kc = dt ? 1 - Math.exp(-dt * 4) : 1
    this.climaCorSuave.lerp(this.climaCor, kc)
    this.climaFundoSuave.lerp(this.climaFundo, kc)
    this.climaSolSuave.lerp(this.climaSol, kc)
    clima.intensidade += (this.intensidadeAlvo * wP - clima.intensidade) * kc

    // Câmera, fundo, luz, névoa e o núcleo da Maia.
    this.fundo.set(ca.fundo).lerp(this.cB.set(cb.fundo), ef)
    if (wP > 0) this.fundo.lerp(this.climaFundoSuave, wP)
    this.cena.background = this.fundo
    ;(this.cena.fog as Fog).color.copy(this.fundo)
    this.sol.color.copy(SOL_PADRAO).lerp(this.climaSolSuave, wP)
    this.sol.intensity += (2.6 + (this.climaForca + 0.5 - 2.6) * wP - this.sol.intensity) * kc
    this.ceu.intensity += (1.5 + (this.climaCeu * 1.6 - 1.5) * wP - this.ceu.intensity) * kc

    this.ponteiroSuave.lerp(this.temPonteiro ? this.ponteiro : this.zero, Math.min(1, dt * 2.5))
    const px = this.ponteiroSuave.x
    const py = this.ponteiroSuave.y
    this.camPos.set(mix(ca.cam[0], cb.cam[0]) + px * 0.9, mix(ca.cam[1], cb.cam[1]) - py * 0.6, mix(ca.cam[2], cb.cam[2]))
    this.alvo.set(mix(ca.alvo[0], cb.alvo[0]), mix(ca.alvo[1], cb.alvo[1]), mix(ca.alvo[2], cb.alvo[2]))
    // Intensa: a câmera também treme um pouco.
    if (clima.intensidade > 0.01) {
      this.camPos.x += Math.sin(t * 31) * 0.05 * clima.intensidade
      this.camPos.y += Math.cos(t * 27) * 0.04 * clima.intensidade
    }
    // Telas estreitas: a câmera recua para a formação caber na largura.
    const recuo = this.camera.aspect < 1 ? lim(1 / this.camera.aspect, 1, 2.2) * 0.62 + 0.38 : 1
    this.camPos.sub(this.alvo).multiplyScalar(recuo).add(this.alvo)
    this.camera.position.copy(this.camPos)
    this.camera.lookAt(this.alvo)
    const fov = mix(ca.fov, cb.fov)
    if (Math.abs(this.camera.fov - fov) > 0.01) {
      this.camera.fov = fov
      this.camera.updateProjectionMatrix()
    }

    const lado = this.compacto ? 'ladoCompacto' : 'lado'
    this.grupo.position.set(mix(ca[lado][0], cb[lado][0]), mix(ca[lado][1], cb[lado][1]), 0)

    // Arrastar gira; soltando, a inércia acaba e a formação volta de frente.
    if (!this.segurando) {
      this.arrasteY += this.inercia * dt
      this.inercia *= Math.exp(-dt * 3)
      this.arrasteY *= Math.exp(-dt * 0.6)
      this.arrasteX *= Math.exp(-dt * 1.2)
    }
    this.grupo.rotation.set(this.arrasteX + py * 0.05, this.arrasteY + px * 0.08, 0)

    const forca = mix(ca.nucleo, cb.nucleo)
    this.nucleo.grupo.visible = forca > 0.01
    if (this.nucleo.grupo.visible) {
      const ue = (this.nucleo.esfera.material as ShaderMaterial).uniforms
      const uh = (this.nucleo.halo.material as ShaderMaterial).uniforms
      ue.uForca.value = forca
      ue.uTempo.value = t
      uh.uForca.value = forca
      uh.uTempo.value = t
      this.nucleo.halo.quaternion.copy(this.camera.quaternion)
      this.nucleo.esfera.scale.setScalar(0.6 + forca * 0.4 + Math.sin(t * 1.8) * 0.03)
    }

    // O ponteiro no plano z = 0 da formação: as peças perto dele se afastam.
    let tocando = false
    if (this.temPonteiro && !this.compacto) {
      this.raio.setFromCamera(this.ponteiro, this.camera)
      const o = this.raio.ray.origin
      const d = this.raio.ray.direction
      if (Math.abs(d.z) > 1e-3) {
        this.toque.copy(o).addScaledVector(d, (this.grupo.position.z - o.z) / d.z)
        this.grupo.worldToLocal(this.toque)
        tocando = true
      }
    }

    const fa = this.formacoes[ca.formacao]
    const fb = this.formacoes[cb.formacao]
    const mesma = fa === fb
    const viajando = !mesma && fr > 0
    // Cor e humor só sobem para a GPU quando mudam: na viagem, perto do diário, ou logo depois de uma mudança.
    const cores = viajando || wP > 0.001 || this.corSuja > 0
    if (this.corSuja > 0) this.corSuja--
    const fP = this.formacoes.padroes
    const agit = mix(ca.agitacao, cb.agitacao)
    const tranco = lim(this.vel, -2, 2)
    const m = this.malha
    const cor = m.instanceColor!
    const amort = Math.min(1, dt * 6)
    const ep = this.empurrao
    for (let k = 0; k < this.n; k++) {
      // A revoada: cada peça faz a viagem dela num trecho do intervalo.
      const e = viajando ? suave(lim((fr - this.atraso[k]) / (1 - 0.38))) : 0
      this.pA.fromArray(fa.p, k * 3)
      this.qA.fromArray(fa.q, k * 4)
      fa.dinamica?.(k, t, this.pA, this.qA)
      if (e > 0) {
        this.pB.fromArray(fb.p, k * 3)
        this.qB.fromArray(fb.q, k * 4)
        fb.dinamica?.(k, t, this.pB, this.qB)
        this.pA.lerp(this.pB, e)
        // Viagem em arco, não em linha reta.
        const arcoV = Math.sin(e * Math.PI)
        this.pA.y += arcoV * this.elevacao[k]
        this.pA.z += arcoV * 1.6
        this.qA.slerp(this.qB, e)
      }
      // Fora do caos, um balanço leve (a agitação do capítulo); ao rolar, tremem.
      if (agit > 0.02 && agit < 0.5) this.pA.y += Math.sin(t * 0.8 + k) * agit * 1.5
      if (tranco > 0.01 || tranco < -0.01) this.qA.multiply(this.onda.setFromAxisAngle(this.eixoX, tranco * 0.35 * Math.sin(k * 1.3)))

      // Empurrão do ponteiro, suavizado por peça.
      let ex = 0
      let ey = 0
      let ez = 0
      if (tocando && this.pA.z > -4) {
        const dx = this.pA.x - this.toque.x
        const dy = this.pA.y - this.toque.y
        const d2 = dx * dx + dy * dy
        if (d2 < 6.76) {
          const dist = Math.sqrt(d2) || 1
          const f = (1 - dist / 2.6) ** 2
          ex = (dx / dist) * f * 1.4
          ey = (dy / dist) * f * 1.4
          ez = f * 1.8
        }
      }
      const k3 = k * 3
      ep[k3] += (ex - ep[k3]) * amort
      ep[k3 + 1] += (ey - ep[k3 + 1]) * amort
      ep[k3 + 2] += (ez - ep[k3 + 2]) * amort
      this.pA.x += ep[k3]
      this.pA.y += ep[k3 + 1]
      this.pA.z += ep[k3 + 2]

      const ea = fa.escala[k]
      this.esc.setScalar(e > 0 ? ea + (fb.escala[k] - ea) * e : ea)
      this.mat.compose(this.pA, this.qA, this.esc)
      m.setMatrixAt(k, this.mat)

      if (cores) {
        this.cA.fromArray(fa.cor, k3)
        if (e > 0) this.cA.lerp(this.cB.fromArray(fb.cor, k3), e)
        // Perto do diário, o confete do fundo toma a cor da emoção escolhida.
        if (wP > 0.001 && k >= fP.livres && k !== this.kFantasma && !this.registros.has(k)) this.cA.lerp(this.climaCorSuave, wP * 0.8)
        cor.setXYZ(k, this.cA.r, this.cA.g, this.cA.b)
        const ha = fa.humor[k]
        this.aHumor.setX(k, e > 0 ? ha + (fb.humor[k] - ha) * e : ha)
      }
    }
    m.instanceMatrix.needsUpdate = true
    if (cores) {
      cor.needsUpdate = true
      this.aHumor.needsUpdate = true
    }

    if (this.aoQuadro) this.aoQuadro(this.lerRotulos(ef < 0.5 ? ca.formacao : cb.formacao))

  }

  private lerRotulos(id: IdFormacao): Leitura {
    const rotulos = this.leitura.rotulos
    rotulos.length = 0
    const lista = this.ancoras[id]
    if (!lista.length) return this.leitura
    // Tamanho guardado no redimensionar: ler clientWidth a cada quadro força layout.
    const w = this.largura
    const h = this.altura
    for (const { id: nome, a } of lista) {
      this.plano.set(a[0], a[1], a[2])
      this.grupo.localToWorld(this.plano)
      this.plano.project(this.camera)
      rotulos.push({ id: nome, x: (this.plano.x * 0.5 + 0.5) * w, y: (-this.plano.y * 0.5 + 0.5) * h, visivel: this.plano.z < 1 })
    }
    return this.leitura
  }
}
